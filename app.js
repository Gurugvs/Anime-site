// ======================
// HANIME APP.JS
// ======================

const USERS = {
admin: { password: "admin123", role: "admin" },
user: { password: "user123", role: "user" }
};

const ADMIN_ACCOUNT = { username: "admin", password: "admin123", role: "admin" };
const storedUsers = JSON.parse(localStorage.getItem("hanimeUsers")) || [];
const currentSession = JSON.parse(localStorage.getItem("hanimeSession")) || null;
let currentRole = currentSession ? currentSession.role : null;
let currentAuthPanel = "user-login";
let editingAnimeIndex = null;

// Load Anime Data
let animeList = JSON.parse(localStorage.getItem("animeList")) || [
{
title:"Attack on Titan",
genre:"Action",
rating:9.8,
status:"Completed",
episodes:89,
description:"Humanity fights Titans behind giant walls.",
poster:"https://cdn.myanimelist.net/images/anime/10/47347.jpg",
watchUrl:"https://example.com"
},
{
title:"Frieren",
genre:"Fantasy",
rating:9.5,
status:"Watching",
episodes:28,
description:"An elf mage begins a new journey.",
poster:"https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
watchUrl:"https://example.com"
},
{
title:"Beastars",
genre:"Drama",
rating:8.8,
status:"Watching",
episodes:24,
description:"A world of civilized animals.",
poster:"https://cdn.myanimelist.net/images/anime/1714/103115.jpg",
watchUrl:"https://example.com"
},
{
title:"A Silent Voice",
genre:"Drama",
rating:9.3,
status:"Completed",
episodes:1,
description:"A touching redemption story.",
poster:"https://cdn.myanimelist.net/images/anime/1122/96435.jpg",
watchUrl:"https://example.com"
},
{
title:"Solo Leveling",
genre:"Action",
rating:9.4,
status:"Watching",
episodes:12,
description:"Weak hunter becomes strongest.",
poster:"https://cdn.myanimelist.net/images/anime/1800/142390.jpg",
watchUrl:"https://example.com"
},
{
title:"Demon Slayer",
genre:"Action",
rating:9.2,
status:"Watching",
episodes:55,
description:"Tanjiro hunts demons.",
poster:"https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
watchUrl:"https://example.com"
},
{
title:"Jujutsu Kaisen",
genre:"Action",
rating:9.1,
status:"Watching",
episodes:47,
description:"Curses and sorcerers collide.",
poster:"https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
watchUrl:"https://example.com"
}
];

saveLocal();

// ======================
// SAVE LOCAL STORAGE
// ======================

function saveLocal(){
localStorage.setItem(
"animeList",
JSON.stringify(animeList)
);
}

// ======================
// RENDER ANIME LIBRARY
// ======================

function renderAnime(data = animeList){

const animeGrid =
document.getElementById("animeGrid");

if(!animeGrid) return;

animeGrid.innerHTML = "";

data.forEach((anime,index)=>{

const actionButtons = currentRole === "admin"
? `
<button onclick="editAnime(${index})">
✏ Edit
</button>

<button onclick="deleteAnime(${index})">
🗑 Delete
</button>
`
: `
<button onclick="window.open('${anime.watchUrl}','_blank')">
▶ Watch
</button>
`;

animeGrid.innerHTML += `

<div class="anime-card">

<img src="${anime.poster}" alt="${anime.title}">

<div class="anime-content">

<h3>${anime.title}</h3>

<p><strong>Genre:</strong> ${anime.genre}</p>

<p><strong>⭐ Rating:</strong> ${anime.rating}</p>

<p><strong>Episodes:</strong> ${anime.episodes}</p>

<p><strong>Status:</strong> ${anime.status}</p>

<p>${anime.description}</p>

<div class="btn-group">

${actionButtons}

</div>

</div>

</div>

`;

});

updateStats();
createCharts();

}

// ======================
// DELETE
// ======================

function deleteAnime(index){

if(currentRole !== "admin") return;

const confirmDelete =
confirm("Delete this anime?");

if(confirmDelete){

animeList.splice(index,1);

saveLocal();

renderAnime();

}

function getAnimeForm(){
return document.getElementById("animeForm");
}

function setAnimeFormMode(mode){
const submitBtn = document.getElementById("animeSubmitBtn");

if(submitBtn){
submitBtn.textContent = mode === "edit" ? "Update Anime" : "Add Anime";
}
}

function resetAnimeForm(){
const form = getAnimeForm();

if(form){
form.reset();
}

editingAnimeIndex = null;
setAnimeFormMode("add");
}

function editAnime(index){
if(currentRole !== "admin") return;

const anime = animeList[index];
if(!anime) return;

editingAnimeIndex = index;

document.getElementById("animeTitle").value = anime.title || "";
document.getElementById("animeGenre").value = anime.genre || "";
document.getElementById("animeRating").value = anime.rating ?? "";
document.getElementById("animeStatus").value = anime.status || "";
document.getElementById("animeEpisodes").value = anime.episodes ?? "";
document.getElementById("animePoster").value = anime.poster || "";
document.getElementById("animeWatchUrl").value = anime.watchUrl || "";
document.getElementById("animeDescription").value = anime.description || "";

setAnimeFormMode("edit");

const adminPanel = document.getElementById("adminPanel");
if(adminPanel){
adminPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}
}

function upsertAnimeFromForm(event){
event.preventDefault();

if(currentRole !== "admin") return;

const title = document.getElementById("animeTitle").value.trim();
const genre = document.getElementById("animeGenre").value.trim();
const rating = Number(document.getElementById("animeRating").value);
const status = document.getElementById("animeStatus").value.trim();
const episodes = Number(document.getElementById("animeEpisodes").value);
const poster = document.getElementById("animePoster").value.trim();
const watchUrl = document.getElementById("animeWatchUrl").value.trim();
const description = document.getElementById("animeDescription").value.trim();

const anime = { title, genre, rating, status, episodes, poster, watchUrl, description };

if(editingAnimeIndex === null){
animeList.unshift(anime);
} else {
animeList[editingAnimeIndex] = anime;
}

saveLocal();
resetAnimeForm();
renderAnime();
}

}

function scrollToLibrary(){

const librarySection = document.getElementById("library");

if(librarySection){

librarySection.scrollIntoView({
behavior: "smooth",
block: "start"
});

}

}

const browseBtn =
document.getElementById("browseBtn");

if(browseBtn){

browseBtn.onclick = scrollToLibrary;

}

const logoutBtn = document.getElementById("logoutBtn");
if(logoutBtn){
logoutBtn.onclick = () => {
currentRole = null;
localStorage.removeItem("hanimeSession");
updateAuthVisibility();
renderAnime();
};
}

function saveUserList(){
localStorage.setItem("hanimeUsers", JSON.stringify(storedUsers));
}

function setAuthPanel(panelName){
currentAuthPanel = panelName;

const panelToFormId = {
"user-login": "userLoginForm",
signup: "signupForm",
"admin-login": "adminLoginForm"
};

document.querySelectorAll(".auth-tab").forEach(tab => {
tab.classList.toggle("is-active", tab.id === `${panelName}Tab`);
});

document.querySelectorAll(".auth-panel").forEach(panel => {
panel.classList.toggle("is-active", panel.id === panelToFormId[panelName]);
});

const loginError = document.getElementById("loginError");
if(loginError) loginError.textContent = "";
}

const userLoginTab = document.getElementById("userLoginTab");
if(userLoginTab){
userLoginTab.onclick = () => setAuthPanel("user-login");
}

const signupTab = document.getElementById("signupTab");
if(signupTab){
signupTab.onclick = () => setAuthPanel("signup");
}

const adminLoginTab = document.getElementById("adminLoginTab");
if(adminLoginTab){
adminLoginTab.onclick = () => setAuthPanel("admin-login");
}

const userLoginForm = document.getElementById("userLoginForm");
if(userLoginForm){
userLoginForm.addEventListener("submit", (event) => {
event.preventDefault();

const email = document.getElementById("userLoginEmail").value.trim().toLowerCase();
const password = document.getElementById("userLoginPassword").value;
const loginError = document.getElementById("loginError");
const account = storedUsers.find(user => user.email === email && user.password === password);

if(account){
localStorage.setItem("hanimeSession", JSON.stringify({ identifier: email, role: "user" }));
currentRole = "user";
if(loginError) loginError.textContent = "";
updateAuthVisibility();
renderAnime();
return;
}

if(loginError) loginError.textContent = "Invalid email or password.";
});
}

const signupForm = document.getElementById("signupForm");
if(signupForm){
signupForm.addEventListener("submit", (event) => {
event.preventDefault();

const email = document.getElementById("signupEmail").value.trim().toLowerCase();
const password = document.getElementById("signupPassword").value;
const loginError = document.getElementById("loginError");

if(storedUsers.some(user => user.email === email)){
if(loginError) loginError.textContent = "This email is already registered.";
return;
}

storedUsers.push({ email, password, role: "user" });
saveUserList();
localStorage.setItem("hanimeSession", JSON.stringify({ identifier: email, role: "user" }));
currentRole = "user";
if(loginError) loginError.textContent = "";
updateAuthVisibility();
renderAnime();
});
}

const adminLoginForm = document.getElementById("adminLoginForm");
if(adminLoginForm){
adminLoginForm.addEventListener("submit", (event) => {
event.preventDefault();

const username = document.getElementById("adminUsername").value.trim().toLowerCase();
const password = document.getElementById("adminPassword").value;
const loginError = document.getElementById("loginError");

if(username === ADMIN_ACCOUNT.username && password === ADMIN_ACCOUNT.password){
localStorage.setItem("hanimeSession", JSON.stringify({ identifier: username, role: "admin" }));
currentRole = "admin";
if(loginError) loginError.textContent = "";
updateAuthVisibility();
renderAnime();
return;
}

if(loginError) loginError.textContent = "Invalid admin credentials.";
});
}

const exportBtn = document.getElementById("exportBtn");
if(exportBtn){
exportBtn.onclick = () => {
if(currentRole !== "user") return;

const exportData = animeList.map(a => ({
Title: a.title,
Genre: a.genre,
Rating: a.rating,
Status: a.status,
Episodes: a.episodes
}));

const worksheet = XLSX.utils.json_to_sheet(exportData);
const workbook = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(workbook, worksheet, "Anime List");
XLSX.writeFile(workbook, "anime-list.xlsx");
};
}

// ======================
// STATS
// ======================

function updateStats(){

const totalAnime =
document.getElementById("totalAnime");

const watchingCount =
document.getElementById("watchingCount");

const completedCount =
document.getElementById("completedCount");

const episodesCount =
document.getElementById("episodesCount");

if(totalAnime)
totalAnime.textContent =
animeList.length;

if(watchingCount)
watchingCount.textContent =
animeList.filter(
a=>a.status==="Watching"
).length;

if(completedCount)
completedCount.textContent =
animeList.filter(
a=>a.status==="Completed"
).length;



if(episodesCount)
episodesCount.textContent =
animeList.reduce(
(sum,a)=>
sum + Number(a.episodes || 0),
0
);

}

// ======================
// CHARTS
// ======================

function createCharts(){

if(typeof Chart === "undefined")
return;

// Genre Chart
const genreData = {};
animeList.forEach(anime => {
genreData[anime.genre] = (genreData[anime.genre] || 0) + 1;
});

const genreCtx = document.getElementById("genreChart");
if(genreCtx && window.genreChartInstance) {
window.genreChartInstance.destroy();
}
if(genreCtx) {
window.genreChartInstance = new Chart(genreCtx, {
type: "pie",
data: {
labels: Object.keys(genreData),
datasets: [{
data: Object.values(genreData),
backgroundColor: ["#FF6600", "#FF8C42", "#FFB84D", "#FFD700", "#FFA500", "#FF7F50", "#FF69B4"]
}]
},
options: {
responsive: true,
plugins: {
title: { display: true, text: "Anime by Genre" }
}
}
});
}

// Status Chart
const statusData = {};
animeList.forEach(anime => {
statusData[anime.status] = (statusData[anime.status] || 0) + 1;
});

const statusCtx = document.getElementById("statusChart");
if(statusCtx && window.statusChartInstance) {
window.statusChartInstance.destroy();
}
if(statusCtx) {
window.statusChartInstance = new Chart(statusCtx, {
type: "doughnut",
data: {
labels: Object.keys(statusData),
datasets: [{
data: Object.values(statusData),
backgroundColor: ["#4CAF50", "#2196F3", "#FF9800"]
}]
},
options: {
responsive: true,
plugins: {
title: { display: true, text: "Anime by Status" }
}
}
});
}

// Rating Chart
const ratingCtx = document.getElementById("ratingChart");
if(ratingCtx && window.ratingChartInstance) {
window.ratingChartInstance.destroy();
}
if(ratingCtx) {
window.ratingChartInstance = new Chart(ratingCtx, {
type: "bar",
data: {
labels: animeList.map(a => a.title),
datasets: [{
label: "Rating",
data: animeList.map(a => a.rating),
backgroundColor: "#FF6600"
}]
},
options: {
responsive: true,
plugins: {
title: { display: true, text: "Anime Ratings" }
}
},
scales: {
y: {
beginAtZero: true,
max: 10
}
}
});
}

}

// ======================
// INIT APP
// ======================

// Filters
const genreFilter = document.getElementById("genreFilter");
const statusFilter = document.getElementById("statusFilter");
const sortFilter = document.getElementById("sortFilter");

function applyFilters(){
let filtered = [...animeList];

if(genreFilter && genreFilter.value !== "All Genres") {
filtered = filtered.filter(a => a.genre === genreFilter.value);
}

if(statusFilter && statusFilter.value !== "All Status") {
filtered = filtered.filter(a => a.status === statusFilter.value);
}

if(sortFilter) {
switch(sortFilter.value) {
case "Z-A":
filtered.sort((a,b) => b.title.localeCompare(a.title));
break;
case "Highest Rating":
filtered.sort((a,b) => b.rating - a.rating);
break;
case "Lowest Rating":
filtered.sort((a,b) => a.rating - b.rating);
break;
case "Newest":
filtered.sort((a,b) => b.episodes - a.episodes);
break;
case "Oldest":
filtered.sort((a,b) => a.episodes - b.episodes);
break;
default:
filtered.sort((a,b) => a.title.localeCompare(b.title));
}
}

renderAnime(filtered);
}

if(genreFilter) genreFilter.addEventListener("change", applyFilters);
if(statusFilter) statusFilter.addEventListener("change", applyFilters);
if(sortFilter) sortFilter.addEventListener("change", applyFilters);

renderAnime();
updateStats();

function updateAuthVisibility(){
const loginOverlay = document.getElementById("loginOverlay");
const appContent = document.getElementById("appContent");
const exportBtn = document.getElementById("exportBtn");
const adminPanel = document.getElementById("adminPanel");

if(loginOverlay && appContent){
if(currentRole){
loginOverlay.style.display = "none";
appContent.style.display = "block";
} else {
loginOverlay.style.display = "flex";
appContent.style.display = "none";
}
}

if(exportBtn){
exportBtn.style.display = currentRole === "user" ? "inline-flex" : "none";
}

if(adminPanel){
adminPanel.style.display = currentRole === "admin" ? "block" : "none";
}
}

updateAuthVisibility();

const genreCanvas =
document.getElementById("genreChart");

if(genreCanvas){

const genres = {};

animeList.forEach(a=>{

genres[a.genre] =
(genres[a.genre] || 0)+1;

});

new Chart(genreCanvas,{
type:"bar",
data:{
labels:Object.keys(genres),
datasets:[{
label:"Anime by Genre",
data:Object.values(genres)
}]
}
});

}

// ======================
// CLEAR DATA
// ======================

const clearBtn =
document.getElementById("clearDataBtn");

if(clearBtn){

clearBtn.onclick=()=>{

if(confirm("Clear all anime data?")){

localStorage.removeItem(
"animeList"
);

location.reload();

}

};

}

// ======================
// HANIME LOGO
// ======================

const homeBtn =
document.getElementById("homeBtn");

if(homeBtn){

homeBtn.onclick=()=>{

window.scrollTo({
top:0,
behavior:"smooth"
});

};

}

// ======================
// START APP
// ======================

renderAnime();
updateStats();

const animeForm = document.getElementById("animeForm");
if(animeForm){
animeForm.addEventListener("submit", upsertAnimeFromForm);
}

const animeCancelBtn = document.getElementById("animeCancelBtn");
if(animeCancelBtn){
animeCancelBtn.onclick = resetAnimeForm;
}