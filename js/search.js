// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDuX4_RKARM7g0K3BvoZPS8ADxVgrYQKYc",
    authDomain: "websitedatphongkhachsan.firebaseapp.com",
    databaseURL: "https://websitedatphongkhachsan-default-rtdb.firebaseio.com",
    projectId: "websitedatphongkhachsan",
    storageBucket: "websitedatphachsan.firebasestorage.app",
    messagingSenderId: "732884739524",
    appId: "1:732884739524:web:a9c34746f5704a9c3eb091",
    measurementId: "G-RC61EXTZH7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Các categories để tìm kiếm
const searchCategories = {
    hotels: ['name', 'location', 'description'],
    tours: ['name', 'destination', 'description'],
    destinations: ['name', 'region', 'description']
};

// Hàm tìm kiếm
async function searchAll(query) {
    if (!query || query.trim().length === 0) {
        return {
            hotels: [],
            tours: [],
            destinations: []
        };
    }

    query = query.toLowerCase().trim();
    const results = {
        hotels: [],
        tours: [],
        destinations: []
    };

    try {
        // Tìm trong khách sạn
        const hotelsSnapshot = await get(ref(database, 'hotels'));
        if (hotelsSnapshot.exists()) {
            const hotels = hotelsSnapshot.val();
            results.hotels = Object.entries(hotels).map(([id, hotel]) => ({ ...hotel, id }))
                .filter(hotel =>
                    searchCategories.hotels.some(field =>
                        hotel[field] && hotel[field].toLowerCase().includes(query)
                    )
                );
        }

        // Tìm trong tours
        const toursSnapshot = await get(ref(database, 'tours'));
        if (toursSnapshot.exists()) {
            const tours = toursSnapshot.val();
            results.tours = Object.entries(tours).map(([id, tour]) => ({ ...tour, id }))
                .filter(tour =>
                    searchCategories.tours.some(field =>
                        tour[field] && tour[field].toLowerCase().includes(query)
                    )
                );
        }

        // Tìm trong điểm đến
        const destinationsSnapshot = await get(ref(database, 'destinations'));
        if (destinationsSnapshot.exists()) {
            const destinations = destinationsSnapshot.val();
            results.destinations = Object.entries(destinations).map(([id, destination]) => ({ ...destination, id }))
                .filter(destination =>
                    searchCategories.destinations.some(field =>
                        destination[field] && destination[field].toLowerCase().includes(query)
                    )
                );
        }

        return results;
    } catch (error) {
        console.error("Error searching:", error);
        return {
            hotels: [],
            tours: [],
            destinations: []
        };
    }
}

// Hiển thị kết quả tìm kiếm
function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    if (!searchResultsContainer) return;

    searchResultsContainer.innerHTML = '';

    if (!results.hotels.length && !results.tours.length && !results.destinations.length) {
        searchResultsContainer.innerHTML = '<p class="no-results">Không tìm thấy kết quả nào</p>';
        return;
    }

    // Hiển thị kết quả khách sạn
    if (results.hotels.length) {
        const hotelsSection = document.createElement('div');
        hotelsSection.className = 'search-section';
        hotelsSection.innerHTML = `
            <h3>Khách sạn (${results.hotels.length})</h3>
            <div class="search-items">
                ${results.hotels.map(hotel => `
                    <div class="search-item">
                        <img src="${hotel.image || 'images/default-hotel.jpg'}" alt="${hotel.name}">
                        <div class="search-item-content">
                            <h4>${hotel.name}</h4>
                            <p>${hotel.location}</p>
                            <a href="hotel-detail.html?id=${hotel.id}" class="btn-view">Xem chi tiết</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        searchResultsContainer.appendChild(hotelsSection);
    }

    // Hiển thị kết quả tours
    if (results.tours.length) {
        const toursSection = document.createElement('div');
        toursSection.className = 'search-section';
        toursSection.innerHTML = `
            <h3>Tours (${results.tours.length})</h3>
            <div class="search-items">
                ${results.tours.map(tour => `
                    <div class="search-item">
                        <img src="${tour.image || 'images/default-tour.jpg'}" alt="${tour.name}">
                        <div class="search-item-content">
                            <h4>${tour.name}</h4>
                            <p>${tour.destination}</p>
                            <a href="tour-list.html?id=${tour.id}" class="btn-view">Xem chi tiết</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        searchResultsContainer.appendChild(toursSection);
    }

    // Hiển thị kết quả điểm đến
    if (results.destinations.length) {
        const destinationsSection = document.createElement('div');
        destinationsSection.className = 'search-section';
        destinationsSection.innerHTML = `
            <h3>Điểm đến (${results.destinations.length})</h3>
            <div class="search-items">
                ${results.destinations.map(destination => `
                    <div class="search-item">
                        <img src="${destination.image || 'images/default-destination.jpg'}" alt="${destination.name}">
                        <div class="search-item-content">
                            <h4>${destination.name}</h4>
                            <p>${destination.region}</p>
                            <a href="destination_detail.html?id=${destination.id}" class="btn-view">Xem chi tiết</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        searchResultsContainer.appendChild(destinationsSection);
    }
}

// Gợi ý từ khóa phổ biến (không dùng trực tiếp cho showSuggestions mới)
const SUGGESTIONS = [
    'Khách sạn', 'Tour', 'Ưu đãi', 'Cần Thơ', 'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Nha Trang', 'Phú Quốc', 'Vũng Tàu',
    'Combo', 'Resort', 'Biển', 'Núi', 'Ẩm thực', 'Trải nghiệm', 'Flash Sale', 'Hot', 'Chỉ hôm nay', 'Độc quyền', 'Genius'
];

// Hàm chuẩn hóa chuỗi
function normalizeString(str) {
    return str
        .toLowerCase()
        .normalize('NFD').replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// Danh sách gợi ý tĩnh
const cityList = [
    'Hà Nội', 'Đà Nẵng', 'Đà Lạt', 'Phú Quốc', 'Buôn Ma Thuột', 'Nha Trang', 'Vũng Tàu', 'Cần Thơ',
    'Kiên Giang', 'Phan Thiết', 'Huế', 'Quy Nhơn', 'Sapa', 'Tp. Hồ Chí Minh', 'Hạ Long', 'Hội An'
];

// Danh sách gợi ý tĩnh cho tours (có thể mở rộng thêm)
const tourList = [
    'Tour Hà Nội - Hạ Long',
    'Tour Sapa',
    'Tour Đà Nẵng - Hội An',
    'Tour Phú Quốc',
    'Tour Nha Trang',
    'Tour Cần Thơ',
    'Tour Đà Lạt',
    'Tour Vũng Tàu',
    'Tour Miền Tây',
    'Tour Biển Đảo'
];

let hotelList = [];

// Lấy danh sách khách sạn từ Firebase (cho autocomplete)
// Lưu ý: Phần này sử dụng import động, có thể gây ra lỗi nếu không được xử lý đúng cách trong môi trường module.
// Tuy nhiên, theo cấu trúc ban đầu của bạn, nó được giữ nguyên.
import('https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js').then(({ getDatabase, ref, get }) => {
    const db = getDatabase();
    get(ref(db, 'location')).then(snapshot => {
        if (snapshot.exists()) {
            let allHotels = [];
            const data = snapshot.val();
            Object.keys(data).forEach(cityKey => {
                const hotels = data[cityKey]?.hotels;
                if (hotels) {
                    if (Array.isArray(hotels)) {
                        hotels.forEach(hotel => {
                            if (hotel.tenKhachSan) allHotels.push(hotel.tenKhachSan);
                        });
                    } else {
                        Object.values(hotels).forEach(hotel => {
                            if (hotel.tenKhachSan) allHotels.push(hotel.tenKhachSan);
                        });
                    }
                }
            });
            hotelList = allHotels;
        }
    }).catch(error => {
        console.error('Error fetching hotels from Firebase:', error);
    });
});

// Hàm hiển thị gợi ý (cho autocomplete trên navbar)
async function showSuggestions(value) {
    const suggestionBox = document.getElementById('search-suggestions');
    if (!suggestionBox) return;

    if (!value.trim()) {
        suggestionBox.style.display = 'none';
        suggestionBox.innerHTML = '';
        return;
    }

    const normValue = normalizeString(value);

    // Gợi ý thành phố từ cityList tĩnh
    const citySuggestions = cityList.filter(city => normalizeString(city).includes(normValue));

    // Gợi ý khách sạn từ hotelList (được lấy từ Firebase location)
    const hotelStaticSuggestions = hotelList.filter(hotel => normalizeString(hotel).includes(normValue));

    // Gợi ý tours từ tourList tĩnh
    const tourStaticSuggestions = tourList.filter(tour => normalizeString(tour).includes(normValue));

    // Gợi ý từ Firebase (hotels, tours, destinations)
    const firebaseResults = await searchAll(value);

    // Gợi ý địa chỉ (region) động từ Firebase destinations
    let regionSuggestions = [];
    if (firebaseResults.destinations && firebaseResults.destinations.length) {
        regionSuggestions = firebaseResults.destinations
            .map(dest => dest.region)
            .filter(region => region && normalizeString(region).includes(normValue))
            .map(region => ({
                type: 'Địa chỉ',
                value: region,
                url: `destination_detail.html?region=${encodeURIComponent(region)}`
            }));
    }

    // Kết hợp tất cả các loại gợi ý
    let suggestions = [
        // Gợi ý từ danh sách thành phố tĩnh
        ...citySuggestions.map(city => ({ type: 'Thành phố', value: city, url: `hotel.html?city=${encodeURIComponent(city)}` })),

        // Gợi ý từ danh sách tour tĩnh
        ...tourStaticSuggestions.map(tour => ({ type: 'Tour', value: tour, url: `tour-list.html?name=${encodeURIComponent(tour)}` })),

        // Gợi ý địa chỉ (region) từ Firebase destinations
        ...regionSuggestions,

        // Gợi ý khách sạn từ Firebase (kết quả tìm kiếm)
        // Giới hạn 5 kết quả để không làm quá tải danh sách gợi ý
        ...(firebaseResults.hotels || []).slice(0, 5).map(hotel => ({
            type: 'Khách sạn',
            value: hotel.name,
            url: `hotel-detail.html?id=${hotel.id}`
        })),

        // Gợi ý tour từ Firebase (kết quả tìm kiếm)
        // Giới hạn 5 kết quả
        ...(firebaseResults.tours || []).slice(0, 5).map(tour => ({
            type: 'Tour',
            value: tour.name,
            url: `tour-list.html?id=${tour.id}`
        })),

        // Gợi ý điểm đến từ Firebase (kết quả tìm kiếm)
        // Giới hạn 3 kết quả
        ...(firebaseResults.destinations || []).slice(0, 3).map(dest => ({
            type: 'Điểm đến',
            value: dest.name,
            url: `destination_detail.html?id=${dest.id}`
        }))
    ].slice(0, 10); // Giới hạn tổng số gợi ý hiển thị tối đa 10 mục

    if (!suggestions.length) {
        suggestionBox.style.display = 'none';
        suggestionBox.innerHTML = '';
        return;
    }

    suggestionBox.innerHTML = suggestions.map(s => `
        <div class="suggestion-item" tabindex="0" data-url="${s.url}">
            <span class="suggestion-type">${s.type}:</span> <span class="suggestion-name">${s.value}</span>
        </div>
    `).join('');
    suggestionBox.style.display = 'block';

    // Gắn sự kiện click cho từng gợi ý
    suggestionBox.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('mousedown', function(e) {
            // Ngăn chặn sự kiện mousedown mặc định để tránh blur input ngay lập tức
            e.preventDefault();
            window.location.href = this.dataset.url;
        });
    });
}


// Hàm xử lý khi chọn gợi ý hoặc nhấn nút tìm kiếm chính
function handleMainSearchAction(query) {
    const kw = query.trim().toLowerCase();
    if (kw === 'khách sạn') {
        window.location.href = 'hotel.html';
    } else if (kw === 'tour') {
        window.location.href = 'tours.html';
    } else if (kw === 'ưu đãi') {
        window.location.href = 'prioritize.html';
    } else if (cityList.map(c => normalizeString(c)).includes(kw)) { // Kiểm tra nếu là tên thành phố
        window.location.href = `hotel.html?city=${encodeURIComponent(query)}`;
    } else if (tourList.map(t => normalizeString(t)).includes(kw)) { // Kiểm tra nếu là tên tour tĩnh
        window.location.href = `tour-list.html?name=${encodeURIComponent(query)}`;
    } else if (kw === 'combo') {
        window.location.href = 'prioritize.html';
    } else {
        // Nếu là từ khóa khác, ưu tiên tìm kiếm khách sạn theo tên hoặc chuyển sang trang tour với tham số tìm kiếm
        window.location.href = `hotel.html?search=${encodeURIComponent(query)}`; // Có thể điều chỉnh để tìm kiếm toàn cục nếu cần
    }
}


// === DOM CONTENT LOADED - HỢP NHẤT CÁC SỰ KIỆN ===
document.addEventListener('DOMContentLoaded', () => {
    // --- Xử lý tìm kiếm trên trang search.html (nếu có) ---
    const searchInputPage = document.querySelector('.search-input-group input');
    const searchButtonPage = document.querySelector('.search-input-group button');
    let searchTimeoutPage;

    if (searchInputPage && searchButtonPage) {
        // Tìm kiếm khi nhấn nút
        searchButtonPage.addEventListener('click', async () => {
            const query = searchInputPage.value;
            const results = await searchAll(query);
            displaySearchResults(results);
        });

        // Tìm kiếm khi gõ (debounce)
        searchInputPage.addEventListener('input', () => {
            clearTimeout(searchTimeoutPage);
            searchTimeoutPage = setTimeout(async () => {
                const query = searchInputPage.value;
                const results = await searchAll(query);
                displaySearchResults(results);
            }, 300);
        });

        // Tìm kiếm khi nhấn Enter
        searchInputPage.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                const query = searchInputPage.value;
                const results = await searchAll(query);
                displaySearchResults(results);
            }
        });
    }

    // --- Xử lý Autocomplete và tìm kiếm trên Navbar ---
    let suggestionBox = document.getElementById('search-suggestions');
    // Tạo suggestionBox nếu chưa tồn tại
    if (!suggestionBox) {
        suggestionBox = document.createElement('div');
        suggestionBox.id = 'search-suggestions';
        suggestionBox.style.position = 'absolute';
        suggestionBox.style.background = '#fff';
        suggestionBox.style.zIndex = '9999';
        suggestionBox.style.width = '100%';
        suggestionBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
        suggestionBox.style.display = 'none';
        suggestionBox.className = 'autocomplete-suggestions';
        const navInputGroup = document.querySelector('.nav-search .search-input-group');
        if (navInputGroup) navInputGroup.appendChild(suggestionBox);
    }

    const input = document.getElementById('main-search-input') || document.querySelector('.nav-search input');
    const btn = document.getElementById('main-search-btn');
    let suggestTimeout;

    if (!input) return;

    // Xử lý input (debounce cho gợi ý)
    input.addEventListener('input', (e) => {
        clearTimeout(suggestTimeout);
        suggestTimeout = setTimeout(() => {
            showSuggestions(e.target.value);
        }, 200);
    });

    // Hiển thị gợi ý khi focus
    input.addEventListener('focus', () => {
        if (input.value.trim()) {
            showSuggestions(input.value);
        }
    });

    // SỬA ĐỔI: Xử lý sự kiện blur trên input
    input.addEventListener('blur', () => {
        // Sử dụng setTimeout để cho phép sự kiện click trên suggestion-item hoặc nút tìm kiếm được xử lý trước
        setTimeout(() => {
            // Kiểm tra nếu focus không nằm trong input và cũng không nằm trong suggestionBox
            // và không nằm trong nút tìm kiếm
            if (!input.contains(document.activeElement) &&
                !suggestionBox.contains(document.activeElement) &&
                (!btn || !btn.contains(document.activeElement))) {
                suggestionBox.style.display = 'none';
            }
        }, 100); // Một khoảng thời gian ngắn để các sự kiện click/mousedown khác có thể kích hoạt
    });

    // Giữ suggestionBox khi di chuột vào
    suggestionBox.addEventListener('mouseenter', () => {
        suggestionBox.style.display = 'block';
    });

    // Ẩn suggestionBox khi rời chuột và input không có focus
    suggestionBox.addEventListener('mouseleave', () => {
        if (!input.contains(document.activeElement)) {
            suggestionBox.style.display = 'none';
        }
    });

    // SỬA ĐỔI: Ẩn suggestionBox khi nhấp ra ngoài (trừ input, suggestionBox, và nút tìm kiếm)
    document.addEventListener('mousedown', function (e) {
        if (!input.contains(e.target) && !suggestionBox.contains(e.target) && (!btn || !btn.contains(e.target))) {
            suggestionBox.style.display = 'none';
        }
    });

    // Xử lý nút tìm kiếm chính
    if (btn) {
        btn.addEventListener('click', () => {
            const query = input.value.trim();
            if (query) {
                handleMainSearchAction(query);
            }
        });
    }

    // Xử lý nhấn Enter trên input chính
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = input.value.trim();
            if (suggestionBox.style.display === 'block') {
                const first = suggestionBox.querySelector('.suggestion-item');
                if (first) {
                    first.click(); // Kích hoạt click trên gợi ý đầu tiên
                    e.preventDefault(); // Ngăn chặn hành vi mặc định của Enter (ví dụ: submit form)
                    return;
                }
            }
            if (query) {
                handleMainSearchAction(query);
            }
        }
    });
});
