const API_KEY = '33442826-55a6433583b780248b981f3e0';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 10;

let currentPage = 1;
let totalPages = 1;
let currentSearchTerm = '';
let currentColor = 'any';

const searchInput = document.getElementById('search-input');
const colorInput = document.getElementById('color-input');
const searchButton = document.getElementById('search-button');
const imageContainer = document.getElementById('image-container');
const prevButton = document.getElementById('prev-button');
const pageInfo = document.getElementById('page-info');
const nextButton = document.getElementById('next-button');

function searchImages() {
    currentPage = 1;
    currentSearchTerm = searchInput.value.trim();
    currentColor = colorInput.value || 'any';
    if (!currentSearchTerm) {
        imageContainer.innerHTML = '<p>Search for photo</p>';
        pageInfo.innerHTML = '';
        prevButton.disabled = true;
        nextButton.disabled = true;
        return;
    }
    const url = `${BASE_URL}?key=${API_KEY}&q=${currentSearchTerm}&colors=${currentColor}&per_page=${PER_PAGE}&page=${currentPage}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            totalPages = Math.ceil(data.totalHits / PER_PAGE);
            if (totalPages === 0) {
                imageContainer.innerHTML = '<p>No photos found/p>';
                pageInfo.innerHTML = '';
                prevButton.disabled = true;
                nextButton.disabled = true;
                return;
            }
            displayImages(data.hits);
            pageInfo.innerHTML = `Page ${currentPage} of ${totalPages}`;
            prevButton.disabled = currentPage === 1;
            nextButton.disabled = currentPage === totalPages;
        })
        .catch(error => {
            console.log(error);
            imageContainer.innerHTML = '<p>Error. Try again later.</p>';
            pageInfo.innerHTML = '';
            prevButton.disabled = true;
            nextButton.disabled = true;
        });
}

function displayImages(images) {
    const html = images.map(image => {
        const tags = image.tags.split(',').join(', ');
        return `<div class="image"> <img src="${image.webformatURL}" alt="${tags}"> <p>${tags}</p> <p>photographer: ${image.user}</p> </div>`;
    }).join('');
    imageContainer.innerHTML = html;
}

searchButton.addEventListener('click', searchImages);
prevButton.addEventListener('click', () => {
    currentPage--;
    searchImages();
});
nextButton.addEventListener('click', () => {
    currentPage++;
    searchImages();
});
searchInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        searchImages();
    }
});
colorInput.addEventListener('change', searchImages);
