const API_KEY = '33442826-55a6433583b780248b981f3e0';

let appliedColor;
let myUrl;
let pageCount;
const perPage = 10;
let pages;


let color = document.querySelector("#myDropdown");

color.onclick = event => {
  event.preventDefault();
  appliedColor = color.value;
  console.log("Color = " + appliedColor)
}

document.addEventListener("submit", (event) => {
  event.preventDefault();
  search();
});

function search() {
    try {
      if (input.value != '') {
        console.log('Input log: ' + input.value);

        let url = new URL('https://pixabay.com/api/?key=' + API_KEY + '&image_type=photo&per_page=' + perPage + '');
        let search_params = url.searchParams;
        search_params.set('q', input.value);
        search_params.set('colors', appliedColor);
        search_params.set('page', '1')
        myUrl = url.toString();
        pageCount = 1;
        console.log(myUrl)

        fetchURL(myUrl);
      }
      else {
        console.log('Empty input');
        document.querySelector("#img-show").textContent = '⚠️ Invalid text. Please try again!'
        document.getElementsByName("active")[0].setAttribute('class', 'inactive');
        document.getElementsByName("inactive")[0].setAttribute('class', 'inactive');
      }
    } catch (error) {
      console.log(error);
    }
}

let data;

const fetchURL = async (new_url) => {
  try {
    const res = await fetch(new_url);
    data = await res.json();
    loadImages(data);
  }
  catch (error) {
    console.log(error);
  }
}


const loadImages = async (data) => {
  document.querySelector("#img-show").textContent = ''

  for (let i = 0; i < data.hits.length; i++) {

    let container = document.createElement("div")
    let image = document.createElement("img");
    let userTag = document.createElement("h4");

    container.className = "content-wrapper"
    image.className = "load-Img";
    userTag.className = "load-User-Tag";

    image.style.backgroundImage = "url(" + data.hits[i].largeImageURL + ")";
    image.addEventListener("click", function () {
      window.open(data.hits[i].pageURL, '_blank');
    })
    userTag.setAttribute('style', 'white-space: pre;');
    userTag.textContent = "Photographer: " + data.hits[i].user + "\r\nTags: " + data.hits[i].tags;

    document.querySelector("#img-show").appendChild(container);
    container.append(image);
    container.append(userTag);
  }

  if (data.hits.length == 0) {
    document.querySelector("#img-show").textContent = '⚠️ Invalid text. Please try again!'
  }

  pages = data.totalHits / perPage

  if (pages >= 1) {
    if (pageCount < pages) {
      document.getElementsByName("active")[0].setAttribute('class', 'active');
    }

    if (pageCount == 1) {
      document.getElementsByName("inactive")[0].setAttribute('class', 'inactive');
    }
  }

  else {
    document.getElementsByName("active")[0].setAttribute('class', 'inactive');
    document.getElementsByName("inactive")[0].setAttribute('class', 'inactive');
  }

}
function nextBtn() {

  pages = data.totalHits / perPage

  if (pageCount < pages) {
    document.getElementsByName("inactive")[0].setAttribute('class', 'active');
    pageCount++

    let url = new URL(myUrl);
    let search_params = url.searchParams;
    search_params.set('page', pageCount)
    myUrl = url.toString();

    fetchURL(myUrl)
    console.log(myUrl)

    if (pageCount >= pages) {
      document.getElementsByName("active")[0].setAttribute('class', 'inactive');
    }
  }
}

function prevBtn() {

  pageCount--;
  let url = new URL(myUrl);
  let search_params = url.searchParams;
  search_params.set('page', pageCount)
  myUrl = url.toString();

  fetchURL(myUrl)
  console.log(myUrl)
}