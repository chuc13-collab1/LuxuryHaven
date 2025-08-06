// VNPay Refund Integration
class VNPayRefund {
    constructor() {
        this.apiUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'; // Sandbox URL
        this.merchantId = 'YOUR_MERCHANT_ID'; // Thay bằng Merchant ID thật
        this.secretKey = 'YOUR_SECRET_KEY'; // Thay bằng Secret Key thật
        this.version = '2.1.0';
    }

    // Tạo yêu cầu hoàn tiền
    async createRefundRequest(bookingData) {
        try {
            const refundData = {
                vnp_Version: this.version,
                vnp_Command: 'refund',
                vnp_TmnCode: this.merchantId,
                vnp_TxnRef: bookingData.transactionId || `REFUND_${Date.now()}`,
                vnp_OrderInfo: `Hoàn tiền booking ${bookingData.id}`,
                vnp_Amount: bookingData.refundAmount * 100, // VNPay yêu cầu số tiền nhân 100
                vnp_CurrCode: 'VND',
                vnp_IpAddr: '127.0.0.1',
                vnp_Locale: 'vn',
                vnp_ReturnUrl: window.location.origin + '/vnpay-refund-return.html',
                vnp_OrderType: 'other',
                vnp_TransactionType: 'refund',
                vnp_TransactionNo: bookingData.transactionId, // Số giao dịch gốc
                vnp_TransactionDate: this.formatTransactionDate(bookingData.createdAt),
                vnp_Amount: bookingData.refundAmount * 100
            };

            // Tạo chữ ký
            const signature = this.createSignature(refundData);
            refundData.vnp_SecureHash = signature;

            // Gọi API VNPay
            const response = await this.callVNPayAPI(refundData);
            return response;

        } catch (error) {
            console.error('Lỗi khi tạo yêu cầu hoàn tiền:', error);
            throw error;
        }
    }

    // Tạo chữ ký cho VNPay
    createSignature(data) {
        const sortedKeys = Object.keys(data).sort();
        let signData = '';
        
        sortedKeys.forEach(key => {
            if (data[key] !== '' && data[key] !== null && data[key] !== undefined) {
                signData += key + '=' + data[key] + '&';
            }
        });
        
        signData = signData.slice(0, -1); // Bỏ dấu & cuối cùng
        
        // Tạo HMAC SHA256
        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha256', this.secretKey);
        hmac.update(signData);
        
        return hmac.digest('hex');
    }

    // Gọi API VNPay
    async callVNPayAPI(data) {
        try {
            const response = await fetch('/api/vnpay/refund', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Lỗi khi gọi API VNPay:', error);
            throw error;
        }
    }

    // Format ngày giao dịch cho VNPay
    formatTransactionDate(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }

    // Kiểm tra trạng thái hoàn tiền
    async checkRefundStatus(transactionRef) {
        try {
            const response = await fetch(`/api/vnpay/refund-status?txnRef=${transactionRef}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Lỗi khi kiểm tra trạng thái hoàn tiền:', error);
            throw error;
        }
    }
}

// Hàm xử lý hoàn tiền tự động
async function processAutomaticRefund(bookingId) {
    try {
        // Lấy thông tin booking
        const bookingRef = firebase.database().ref('bookings/' + bookingId);
        const snapshot = await bookingRef.once('value');
        const booking = snapshot.val();

        if (!booking) {
            throw new Error('Không tìm thấy thông tin booking');
        }

        if (booking.status !== 'cancelled') {
            throw new Error('Booking chưa được hủy');
        }

        if (booking.refundStatus === 'completed') {
            throw new Error('Đã hoàn tiền rồi');
        }

        // Cập nhật trạng thái thành processing
        await bookingRef.update({
            refundStatus: 'processing',
            refundProcessingAt: Date.now()
        });

        // Tạo yêu cầu hoàn tiền VNPay
        const vnpayRefund = new VNPayRefund();
        const refundResult = await vnpayRefund.createRefundRequest(booking);

        if (refundResult.vnp_ResponseCode === '00') {
            // Hoàn tiền thành công
            await bookingRef.update({
                refundStatus: 'completed',
                refundCompletedAt: Date.now(),
                refundTransactionId: refundResult.vnp_TransactionNo,
                refundResponseCode: refundResult.vnp_ResponseCode
            });

            // Gửi thông báo cho khách hàng
            await sendRefundNotification(booking);

            return {
                success: true,
                message: 'Hoàn tiền thành công',
                transactionId: refundResult.vnp_TransactionNo
            };
        } else {
            // Hoàn tiền thất bại
            await bookingRef.update({
                refundStatus: 'failed',
                refundFailedAt: Date.now(),
                refundErrorCode: refundResult.vnp_ResponseCode,
                refundErrorMessage: refundResult.vnp_Message || 'Hoàn tiền thất bại'
            });

            return {
                success: false,
                message: 'Hoàn tiền thất bại',
                errorCode: refundResult.vnp_ResponseCode
            };
        }

    } catch (error) {
        console.error('Lỗi khi xử lý hoàn tiền tự động:', error);
        
        // Cập nhật trạng thái thất bại
        await firebase.database().ref('bookings/' + bookingId).update({
            refundStatus: 'failed',
            refundFailedAt: Date.now(),
            refundErrorMessage: error.message
        });

        throw error;
    }
}

// Gửi thông báo hoàn tiền cho khách hàng
async function sendRefundNotification(booking) {
    try {
        const notificationData = {
            userId: booking.userId,
            type: 'refund_completed',
            title: 'Hoàn tiền thành công',
            message: `Đã hoàn tiền ${booking.refundAmount?.toLocaleString()} VNĐ cho booking ${booking.id}`,
            timestamp: Date.now(),
            read: false,
            bookingId: booking.id,
            refundAmount: booking.refundAmount
        };

        await firebase.database().ref('notifications').push(notificationData);
    } catch (error) {
        console.error('Lỗi khi gửi thông báo hoàn tiền:', error);
    }
}

// Hàm xử lý hoàn tiền thủ công (cho admin)
async function processManualRefund(bookingId) {
    try {
        const bookingRef = firebase.database().ref('bookings/' + bookingId);
        const snapshot = await bookingRef.once('value');
        const booking = snapshot.val();

        if (!booking) {
            throw new Error('Không tìm thấy thông tin booking');
        }

        // Cập nhật trạng thái thành completed (admin xác nhận đã hoàn tiền thủ công)
        await bookingRef.update({
            refundStatus: 'completed',
            refundCompletedAt: Date.now(),
            refundMethod: 'manual_bank_transfer',
            refundNote: 'Admin xác nhận đã hoàn tiền thủ công'
        });

        // Gửi thông báo
        await sendRefundNotification(booking);

        return {
            success: true,
            message: 'Đã xác nhận hoàn tiền thủ công'
        };

    } catch (error) {
        console.error('Lỗi khi xử lý hoàn tiền thủ công:', error);
        throw error;
    }
}

// Export các hàm để sử dụng trong các file khác
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        VNPayRefund,
        processAutomaticRefund,
        processManualRefund,
        sendRefundNotification
    };
} 