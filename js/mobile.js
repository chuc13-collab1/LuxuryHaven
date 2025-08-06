// Mobile Navigation Handler
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking on a link
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !navLinks.contains(event.target)) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Mobile search toggle
    const searchToggle = document.createElement('button');
    searchToggle.innerHTML = '<i class="fas fa-search"></i>';
    searchToggle.className = 'mobile-search-toggle';
    searchToggle.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: #1a237e;
        font-size: 1.2rem;
        padding: 8px;
        cursor: pointer;
    `;

    // Add search toggle to mobile menu
    const navRight = document.querySelector('.nav-right');
    if (navRight && window.innerWidth <= 768) {
        navRight.insertBefore(searchToggle, navRight.firstChild);
        searchToggle.style.display = 'block';
    }

    // Mobile search functionality
    searchToggle.addEventListener('click', function() {
        const mobileSearchContainer = document.createElement('div');
        mobileSearchContainer.className = 'mobile-search-container';
        mobileSearchContainer.innerHTML = `
            <div class="mobile-search-overlay"></div>
            <div class="mobile-search-content">
                <div class="mobile-search-header">
                    <h3>Tìm kiếm</h3>
                    <button class="mobile-search-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="search-input-group">
                    <input type="text" placeholder="Tìm kiếm..." id="mobile-search-input" autocomplete="off">
                    <button type="button" id="mobile-search-btn">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(mobileSearchContainer);
        document.body.style.overflow = 'hidden';

        // Focus on search input
        setTimeout(() => {
            document.getElementById('mobile-search-input').focus();
        }, 100);

        // Close mobile search
        const closeBtn = mobileSearchContainer.querySelector('.mobile-search-close');
        const overlay = mobileSearchContainer.querySelector('.mobile-search-overlay');
        
        [closeBtn, overlay].forEach(element => {
            element.addEventListener('click', function() {
                document.body.removeChild(mobileSearchContainer);
                document.body.style.overflow = '';
            });
        });

        // Mobile search button functionality
        const mobileSearchBtn = mobileSearchContainer.querySelector('#mobile-search-btn');
        const mobileSearchInput = mobileSearchContainer.querySelector('#mobile-search-input');
        
        mobileSearchBtn.addEventListener('click', function() {
            const query = mobileSearchInput.value.trim();
            if (query) {
                // Implement search functionality here
                console.log('Searching for:', query);
                document.body.removeChild(mobileSearchContainer);
                document.body.style.overflow = '';
            }
        });

        // Search on Enter key
        mobileSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                mobileSearchBtn.click();
            }
        });
    });

    // Touch events for better mobile interaction
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - could hide header
                console.log('Swipe up detected');
            } else {
                // Swipe down - could show header
                console.log('Swipe down detected');
            }
        }
    }

    // Optimize images for mobile
    function optimizeImagesForMobile() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.getAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add error handling for images
            img.addEventListener('error', function() {
                this.style.display = 'none';
            });
        });
    }

    optimizeImagesForMobile();

    // Mobile scroll optimization
    let ticking = false;
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    function updateNavbar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            if (navbar && !navLinks.classList.contains('active')) {
                navbar.style.transform = 'translateY(-100%)';
            }
        } else {
            // Scrolling up
            if (navbar) {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }

    if (window.innerWidth <= 768) {
        window.addEventListener('scroll', requestTick);
    }

    // Add mobile-specific CSS
    const mobileStyles = document.createElement('style');
    mobileStyles.textContent = `
        @media (max-width: 768px) {
            .mobile-search-toggle {
                display: block !important;
            }
            
            .mobile-search-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 9999;
            }
            
            .mobile-search-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
            }
            
            .mobile-search-content {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: white;
                padding: 20px;
                animation: slideInFromTop 0.3s ease;
            }
            
            .mobile-search-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
            }
            
            .mobile-search-header h3 {
                margin: 0;
                color: #1a237e;
            }
            
            .mobile-search-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #666;
                cursor: pointer;
            }
            
            @keyframes slideInFromTop {
                from {
                    transform: translateY(-100%);
                }
                to {
                    transform: translateY(0);
                }
            }
            
            .navbar {
                transition: transform 0.3s ease;
            }
        }
    `;
    
    document.head.appendChild(mobileStyles);
});
