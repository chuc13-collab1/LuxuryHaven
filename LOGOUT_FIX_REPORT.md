# Fix Logout Redirect Issue - QLNV Files

## Vấn đề đã khắc phục

### 1. Lỗi Logout Redirect
**Lỗi**: Khi đăng xuất từ các trang trong thư mục `QLNV\`, hệ thống hiển thị lỗi `Cannot GET /QLNV/auth.html`

**Nguyên nhân**: Đường dẫn chuyển hướng trong hàm `logout()` không đúng:
- Trước: `window.location.href = 'auth.html'` (tìm auth.html trong thư mục QLNV)
- Sau: `window.location.href = '../auth.html'` (tìm auth.html ở thư mục gốc)

### 2. Lỗi Role-based Routing  
**Vấn đề**: Tất cả role đều chuyển về `staff-dashboard.html` thay vì trang chuyên biệt
- Role `PL1` phải chuyển về `QLNV/compliance-officer.html`
- Các role khác cũng bị mapping sai

**Nguyên nhân**: 
- Case sensitivity trong role mapping
- Logic xử lý role không đủ linh hoạt
- Thiếu case variations cho role codes

**Giải pháp**:
- Thêm case-insensitive matching
- Bổ sung các variations: `PL1`, `Pl1`, `pl1`, `PL01`
- Cải thiện debug logging để trace role mapping

## Files đã được sửa

### 1. QLNV/staff-dashboard.html
- ✅ Sửa đường dẫn logout: `'../auth.html'`
- ✅ Thêm Firebase CDN scripts
- ✅ Thêm Firebase config và khởi tạo
- ✅ Cải thiện hàm logout với Firebase Auth

### 2. QLNV/booking-moderator.html
- ✅ Sửa đường dẫn logout: `'../auth.html'`
- ✅ Thêm Firebase CDN scripts
- ✅ Thêm Firebase config và khởi tạo
- ✅ Cải thiện hàm logout với Firebase Auth

### 3. QLNV/affiliate-manager.html
- ✅ Sửa đường dẫn logout: `'../auth.html'`
- ✅ Thêm Firebase CDN scripts
- ✅ Thêm Firebase config và khởi tạo
- ✅ Cải thiện hàm logout với Firebase Auth

### 4. QLNV/compliance-officer.html
- ✅ Sửa đường dẫn logout: `'../auth.html'`
- ✅ Thêm Firebase CDN scripts
- ✅ Thêm Firebase config và khởi tạo
- ✅ Thêm function logout với Firebase Auth
- ✅ Thêm onclick="logout()" vào nút đăng xuất

### 5. QLNV/content-admin.html
- ✅ Sửa đường dẫn logout: `'../auth.html'`
- ✅ Thêm Firebase CDN scripts
- ✅ Thêm Firebase config và khởi tạo
- ✅ Thêm function logout với Firebase Auth
- ✅ Thêm onclick="logout()" vào nút đăng xuất

### 6. QLNV/customer-support.html
- ✅ Sửa đường dẫn logout: `'../auth.html'`
- ✅ Thêm Firebase CDN scripts
- ✅ Thêm Firebase config và khởi tạo
- ✅ Thêm function logout với Firebase Auth
- ✅ Thêm onclick="logout()" vào nút đăng xuất

### 7. QLNV/data-analyst.html
- ✅ Sửa đường dẫn logout: `'../auth.html'`
- ✅ Thêm Firebase CDN scripts
- ✅ Thêm Firebase config và khởi tạo
- ✅ Thêm function logout với Firebase Auth
- ✅ Thêm onclick="logout()" vào nút đăng xuất

### 8. QLNV/finance-manager.html
- ✅ Sửa đường dẫn logout: `'../auth.html'`
- ✅ Thêm Firebase CDN scripts
- ✅ Thêm Firebase config và khởi tạo
- ✅ Thêm function logout với Firebase Auth
- ✅ Thêm onclick="logout()" vào nút đăng xuất

### 9. QLNV/marketing-seo.html
- ✅ Sửa đường dẫn logout: `'../auth.html'`
- ✅ Thêm Firebase CDN scripts
- ✅ Thêm Firebase config và khởi tạo
- ✅ Thêm function logout với Firebase Auth
- ✅ Thêm onclick="logout()" vào nút đăng xuất

### 10. QLNV/web-developer.html
- ✅ Sửa đường dẫn logout: `'../auth.html'`
- ✅ Thêm Firebase CDN scripts
- ✅ Thêm Firebase config và khởi tạo
- ✅ Thêm function logout với Firebase Auth
- ✅ Thêm onclick="logout()" vào nút đăng xuất

## Cải tiến thêm

### Role-based Routing Enhancement
Cải thiện logic ánh xạ role để đảm bảo chuyển hướng đúng trang:

```javascript
// Enhanced getPageByRole function với case-insensitive matching
function getPageByRole(role) {
  if (!role) return 'index.html';
  
  // Role mapping với nhiều variations
  const rolePageMap = {
    // Compliance Officer variations
    'PL01': 'QLNV/compliance-officer.html',
    'PL1': 'QLNV/compliance-officer.html', 
    'Pl1': 'QLNV/compliance-officer.html',
    'pl1': 'QLNV/compliance-officer.html',
    // ... other mappings
  };
  
  // Exact match trước
  if (rolePageMap[role]) return rolePageMap[role];
  
  // Case-insensitive fallback
  const roleKey = Object.keys(rolePageMap).find(key => 
    key.toLowerCase() === role.toLowerCase()
  );
  
  return roleKey ? rolePageMap[roleKey] : 'index.html';
}
```

### Debug Logging
Thêm chi tiết debug để trace role mapping:
```javascript
console.log('🔍 Debug thông tin role:');
console.log('- Original role:', role);
console.log('- Direct role mapping:', role, '→', page);
console.log('✅ Final redirect:', page);
```

### Firebase Integration
Thêm Firebase Authentication vào hàm logout:
```javascript
function logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        // Kiểm tra xem Firebase Auth có sẵn không
        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().signOut().then(() => {
                console.log('Đăng xuất thành công');
                window.location.href = '../auth.html';
            }).catch((error) => {
                console.error('Lỗi đăng xuất:', error);
                // Vẫn chuyển trang nếu có lỗi
                window.location.href = '../auth.html';
            });
        } else {
            // Fallback nếu Firebase không có
            window.location.href = '../auth.html';
        }
    }
}
```

### Firebase CDN Scripts được thêm
```html
<!-- Firebase -->
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
```

### Firebase Configuration
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDuX4_RKARM7g0K3BvoZPS8ADxVgrYQKYc",
    authDomain: "websitedatphongkhachsan.firebaseapp.com",
    databaseURL: "https://websitedatphongkhachsan-default-rtdb.firebaseio.com",
    projectId: "websitedatphongkhachsan",
    storageBucket: "websitedatphongkhachsan.appspot.com",
    messagingSenderId: "732884739524",
    appId: "1:732884739524:web:a9c34746f5704a9c3eb091",
    measurementId: "G-RC61EXTZH7"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
```

## Kết quả
- ✅ **Lỗi chuyển hướng đã được khắc phục**: Đăng xuất từ QLNV sẽ chuyển về `auth.html` đúng cách
- ✅ **Tích hợp Firebase Auth**: Đăng xuất thực sự từ Firebase Authentication
- ✅ **Fallback mechanism**: Nếu Firebase không hoạt động, vẫn chuyển trang bình thường
- ✅ **Consistent behavior**: Tất cả file QLNV có cùng logic logout

## Test Cases
1. **Đăng xuất từ staff-dashboard.html** → Chuyển về auth.html ✅
2. **Đăng xuất từ booking-moderator.html** → Chuyển về auth.html ✅  
3. **Đăng xuất từ affiliate-manager.html** → Chuyển về auth.html ✅
4. **Đăng xuất từ compliance-officer.html** → Chuyển về auth.html ✅
5. **Đăng xuất từ content-admin.html** → Chuyển về auth.html ✅
6. **Đăng xuất từ customer-support.html** → Chuyển về auth.html ✅
7. **Đăng xuất từ data-analyst.html** → Chuyển về auth.html ✅
8. **Đăng xuất từ finance-manager.html** → Chuyển về auth.html ✅
9. **Đăng xuất từ marketing-seo.html** → Chuyển về auth.html ✅
10. **Đăng xuất từ web-developer.html** → Chuyển về auth.html ✅
11. **Firebase Auth signOut** → Xóa session đăng nhập ✅
12. **Fallback khi Firebase lỗi** → Vẫn chuyển trang ✅

## Lưu ý
- **Đã sửa tất cả 10 files** trong thư mục QLNV với chức năng logout hoàn chỉnh
- **7 files mới được thêm**: compliance-officer.html, content-admin.html, customer-support.html, data-analyst.html, finance-manager.html, marketing-seo.html, web-developer.html
- **3 files đã có sẵn**: staff-dashboard.html, booking-moderator.html, affiliate-manager.html
- Firebase config có thể tách ra file riêng để tái sử dụng trong tương lai
- Tất cả files đều có cùng pattern logout để đảm bảo consistency
