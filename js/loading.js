
        // Loading Overlay Management
        window.addEventListener('load', function() {
            // Đảm bảo loading hiển thị ít nhất 2 giây
            setTimeout(function() {
                const loadingOverlay = document.getElementById('loading-overlay');
                if (loadingOverlay) {
                    loadingOverlay.classList.add('hidden');
                    // Xóa element sau khi animation hoàn tất
                    setTimeout(function() {
                        loadingOverlay.remove();
                    }, 500);
                }
            }, 2000);
        });

        // Hiển thị loading khi chuyển trang
        document.addEventListener('DOMContentLoaded', function() {
            // Thêm loading cho các link navigation
            const navLinks = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="javascript:"]):not([target="_blank"])');
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    // Chỉ hiển thị loading nếu không phải là link trong trang hiện tại
                    if (this.hostname === window.location.hostname && this.pathname !== window.location.pathname) {
                        showPageLoading();
                    }
                });
            });
        });

        function showPageLoading() {
            // Tạo loading overlay mới cho chuyển trang
            const loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'page-loading-overlay';
            loadingOverlay.innerHTML = `
                <dotlottie-wc 
                    src="https://lottie.host/22866d75-292a-42dc-ae8a-72f6f903386d/dwhv5hvZ72.lottie" 
                    style="width: 200px; height: 200px" 
                    speed="1.5" 
                    autoplay 
                    loop>
                </dotlottie-wc>
                <div class="loading-text" style="font-size: 1.5rem;">Đang chuyển trang...</div>
            `;
            loadingOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.7s ease;
            `;
            document.body.appendChild(loadingOverlay);
            
            // Hiển thị loading
            setTimeout(() => {
                loadingOverlay.style.opacity = '1';
            }, 10);
        }