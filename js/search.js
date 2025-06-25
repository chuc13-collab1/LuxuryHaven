// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDuX4_RKARM7g0K3BvoZPS8ADxVgrYQKYc",
    authDomain: "websitedatphongkhachsan.firebaseapp.com",
    databaseURL: "https://websitedatphongkhachsan-default-rtdb.firebaseio.com",
    projectId: "websitedatphongkhachsan",
    storageBucket: "websitedatphongkhachsan.firebasestorage.app",
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
            results.hotels = Object.values(hotels).filter(hotel => 
                searchCategories.hotels.some(field => 
                    hotel[field] && hotel[field].toLowerCase().includes(query)
                )
            );
        }

        // Tìm trong tours
        const toursSnapshot = await get(ref(database, 'tours'));
        if (toursSnapshot.exists()) {
            const tours = toursSnapshot.val();
            results.tours = Object.values(tours).filter(tour => 
                searchCategories.tours.some(field => 
                    tour[field] && tour[field].toLowerCase().includes(query)
                )
            );
        }

        // Tìm trong điểm đến
        const destinationsSnapshot = await get(ref(database, 'destinations'));
        if (destinationsSnapshot.exists()) {
            const destinations = destinationsSnapshot.val();
            results.destinations = Object.values(destinations).filter(destination => 
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
                            <a href="tour-detail.html?id=${tour.id}" class="btn-view">Xem chi tiết</a>
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

// Gợi ý từ khóa phổ biến
const SUGGESTIONS = [
    'Khách sạn', 'Tour', 'Ưu đãi', 'Cần Thơ', 'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Nha Trang', 'Phú Quốc', 'Vũng Tàu',
    'Combo', 'Resort', 'Biển', 'Núi', 'Ẩm thực', 'Trải nghiệm', 'Flash Sale', 'Hot', 'Chỉ hôm nay', 'Độc quyền', 'Genius'
];

function showSuggestions(value) {
    // Không hiển thị gợi ý trên giao diện nữa
    const suggestionBox = document.getElementById('search-suggestions');
    if (suggestionBox) {
        suggestionBox.style.display = 'none';
        suggestionBox.innerHTML = '';
    }
}

function handleSuggestionSelect(keyword) {
    // Chuyển hướng theo từ khóa
    const kw = keyword.trim().toLowerCase();
    if (kw === 'khách sạn') {
        window.location.href = 'hotel.html';
    } else if (kw === 'tour') {
        window.location.href = 'tours.html';
    } else if (kw === 'ưu đãi') {
        window.location.href = 'prioritize.html';
    } else if ({
        'cần thơ': 1,
        'hà nội': 1,
        'hồ chí minh': 1,
        'đà nẵng': 1,
        'nha trang': 1,
        'phú quốc': 1,
        'vũng tàu': 1
    }[kw]) {
        // Ưu tiên chuyển sang trang khách sạn với tham số thành phố
        window.location.href = `hotel.html?city=${encodeURIComponent(keyword)}`;
    } else if (kw === 'combo') {
        window.location.href = 'prioritize.html';
    } else {
        // Nếu là từ khóa khác, thực hiện tìm kiếm toàn cục
        window.location.href = `tours.html?search=${encodeURIComponent(keyword)}`;
    }
}

// Thêm sự kiện tìm kiếm
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input-group input');
    const searchButton = document.querySelector('.search-input-group button');
    let searchTimeout;

    if (searchInput && searchButton) {
        // Tìm kiếm khi nhấn nút
        searchButton.addEventListener('click', async () => {
            const query = searchInput.value;
            const results = await searchAll(query);
            displaySearchResults(results);
        });

        // Tìm kiếm khi gõ (debounce)
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(async () => {
                const query = searchInput.value;
                const results = await searchAll(query);
                displaySearchResults(results);
            }, 300);
        });

        // Tìm kiếm khi nhấn Enter
        searchInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value;
                const results = await searchAll(query);
                displaySearchResults(results);
            }
        });
    }

    // Gắn autocomplete cho ô tìm kiếm chính trên navbar
    const input = document.getElementById('main-search-input');
    const btn = document.getElementById('main-search-btn');
    const suggestionBox = document.getElementById('search-suggestions');
    if (!input) return;
    input.addEventListener('input', (e) => {
        showSuggestions(e.target.value);
    });
    input.addEventListener('focus', (e) => {
        showSuggestions(e.target.value);
    });
    input.addEventListener('blur', () => {
        setTimeout(() => {
            if (suggestionBox) suggestionBox.style.display = 'none';
        }, 200);
    });
    // Nhấn Enter để tìm kiếm hoặc chuyển hướng
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (suggestionBox && suggestionBox.style.display === 'block') {
                // Nếu có gợi ý, chọn gợi ý đầu tiên
                const first = suggestionBox.querySelector('.suggestion-item');
                if (first) {
                    first.click();
                    e.preventDefault();
                    return;
                }
            }
            handleSuggestionSelect(input.value);
        }
    });
    // Nhấn nút tìm kiếm
    if (btn) {
        btn.addEventListener('click', () => {
            handleSuggestionSelect(input.value);
        });
    }
});