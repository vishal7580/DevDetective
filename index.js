const apiUrl = "https://api.github.com/users/";

const searchInput = document.querySelector("[data-searchInput]");
const searchBtn = document.querySelector(".search-btn");

const searchContainer = document.querySelector(".search-container");

const profilePhoto = document.querySelector(".profile-photo");
const profileName = document.querySelector(".profile-name");
const profileLink = document.querySelector(".profile-link");
const joinDate = document.querySelector(".join-date");
const bio = document.querySelector(".bio");
const repo = document.querySelector("[data-repo]");
const followers = document.querySelector("[data-followers]");
const following = document.querySelector("[data-following]");
const cityLocation = document.querySelector("[data-location]");
const twitterLink = document.querySelector("[data-twitter]");
const portfolioLink = document.querySelector("[data-portfolio]");
const companyWorking = document.querySelector("[data-company]");
const darkBtn = document.querySelector(".dark");
const lightBtn = document.querySelector(".light");
const crossIcon = document.querySelector('.cross-icon')

function init() {
  checkModeSet();
  getUserData("vishal7580").then((data) => renderOnUI(data));
}
init();

function checkModeSet() {
  const isModeSet = localStorage.getItem("mode");

  if (isModeSet == "dark") {
    setDarkMode();
    darkBtn.classList.remove("activeBtn");
    lightBtn.classList.add("activeBtn");
  } else if (isModeSet == "light") {
    setLightMode();
    lightBtn.classList.remove("activeBtn");
    darkBtn.classList.add("activeBtn");
  } else {
    localStorage.setItem("mode", "light");
    setLightMode();
    lightBtn.classList.remove("activeBtn");
    darkBtn.classList.add("activeBtn");
  }
}
darkBtn.addEventListener("click", () => {
  localStorage.setItem("mode", "dark");
  setDarkMode();
  darkBtn.classList.remove("activeBtn");
  lightBtn.classList.add("activeBtn");
});
lightBtn.addEventListener("click", () => {
  localStorage.setItem("mode", "light");
  setLightMode();
  lightBtn.classList.remove("activeBtn");
  darkBtn.classList.add("activeBtn");
});

function setDarkMode() {
  const mainDoc = document.documentElement;
  mainDoc.style.setProperty("--lm-bg", "#141D2F");
  mainDoc.style.setProperty("--lm-bg-content", "#1E2A47");
  mainDoc.style.setProperty("--lm-text", "white");
  mainDoc.style.setProperty("--lm-text-alt", "white");
  mainDoc.style.setProperty("--lm-shadow-xl", "rgba(70, 88, 109, 0.15)");
  mainDoc.style.setProperty("--opacityHalf", ".5");
}
function setLightMode() {
  const mainDoc = document.documentElement;
  mainDoc.style.setProperty("--lm-bg", "#f6f8ff");
  mainDoc.style.setProperty("--lm-bg-content", "#fefefe");
  mainDoc.style.setProperty("--lm-text", "#4b6a9b");
  mainDoc.style.setProperty("--lm-text-alt", "#2b3442");
  mainDoc.style.setProperty("--opacityHalf", "1");

  // mainDoc.style.setProperty('--lm-shadow', "0px 16px 30px -10px rgba(70, 96, 187, 0.2)")
}

searchBtn.addEventListener("click", () => {
  if (searchInput.value != "") {
    getUserData(searchInput.value).then((data) => renderOnUI(data));
  }
});
searchInput.addEventListener("keypress", (event) => {
  if (event.key == "Enter" && searchInput.value != "") {
    getUserData(searchInput.value).then((data) => renderOnUI(data));
  }
});
searchInput.addEventListener('input',()=>{
  errorInput.classList.remove('active')
  crossIcon.classList.add('active')
})
searchContainer.addEventListener('mouseover',()=>{
  if(searchInput.value != '')
  crossIcon.classList.add('active')
})
searchContainer.addEventListener('mouseleave',()=>{
  crossIcon.classList.remove('active')
})
crossIcon.addEventListener('click',()=> searchInput.value = '')
// GET USER DATA
async function getUserData(username) {

  try {
    const response = await fetch(`${apiUrl}${username}`);
    return await response.json();
  } catch (error) {
    console.log("No user found:", error);
  }
}

function checkIfNull(value) {
  return value == null || value == "" ? "Not Available" : value;
}
function checkLinkEmpty(address) {
  return address == "" || address == null ? "#" : address;
}

let arr = [cityLocation, portfolioLink, twitterLink, companyWorking];
function activeNotAvailable(arr) {
  arr.forEach((element) => {
    if (element.innerText == "Not Available" || element.innerText == "")
      element.parentElement.classList.add("not-available");
  });
}
function removeNotAvailable(arr) {
  arr.forEach((element) => {
    if (element.innerText == "Not Available" || element.innerText == "")
      element.parentElement.classList.remove("not-available");
  });
}

const errorInput = document.querySelector(".error-txt");
// RENDER ON UI
function renderOnUI(data) {
  console.log("data ", data);
  if (data.status == "404") {
    errorInput.classList.add("active");
    return;
  }

  // REMOVING ACTIVE NOT-AVAILABLE CLASS
  removeNotAvailable(arr);
  errorInput.classList.remove("active");

  profilePhoto.src = data.avatar_url;
  profileName.innerText =
    data.name == "" || data.name == null ? data.login : data.name;
  profileLink.href = data.html_url;
  profileLink.innerText = data.login;
  bio.innerText =
    data.bio == "" || data.bio == null ? "This Profile has no bio" : data.bio;

  const accCreatedAt = new Date(data.created_at).toDateString().split(" ");
  joinDate.innerText = `Joined ${accCreatedAt[2]} ${accCreatedAt[1]} ${accCreatedAt[3]}`;

  repo.innerText = data.public_repos;
  followers.innerText = data.followers;
  following.innerText = data.following;

  cityLocation.innerText = checkIfNull(data.location);
  portfolioLink.href = checkLinkEmpty(data.blog);
  portfolioLink.innerText = checkIfNull(data.blog);

  twitterLink.href = `https://twitter.com/${checkLinkEmpty(
    data.twitter_username
  )}`;
  twitterLink.innerText = checkIfNull(data.twitter_username);

  companyWorking.innerText = checkIfNull(data.company);

  // ADDING ACTIVE NOT-AVAILABLE CLASS
  activeNotAvailable(arr);
}
