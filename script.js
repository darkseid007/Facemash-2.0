const defaultPeople = [
  { id: 1, name: "Disha patani", imageUrl: "disha.jpeg", rating: 1400 },
  { id: 2, name: "Kiara advani", imageUrl: "kiara .jpeg", rating: 1400 },
  { id: 3, name: "Katrina kaif", imageUrl: "katrina.jpeg", rating: 1400 },
  { id: 4, name: "Shraddha kapoor", imageUrl: "shraddha.jpeg", rating: 1400 },
  { id: 5, name: "Mouni roy", imageUrl: "mouni.jpg", rating: 1400 },
  { id: 6, name: "Tripti dimri", imageUrl: "tripti.jpg", rating: 1400 },
  { id: 7, name: "Jacqueline", imageUrl: "jacqueline.avif", rating: 1400 },
  { id: 8, name: "Nora fatehi", imageUrl: "nora.avif", rating: 1400 },
  { id: 9, name: "Mrunal thakur", imageUrl: "mrunal.avif", rating: 1400 },
  { id: 10, name: "Alexandra", imageUrl: "alexandra.jpeg", rating: 1400 },
  { id: 11, name: "Jahnvi kapoor", imageUrl: "jahnvi.avif", rating: 1400 },
  { id: 12, name: "Sydney", imageUrl: "sydney.webp", rating: 1400 },
  { id: 13, name: "Pooja hegde", imageUrl: "pooja.jpg", rating: 1400 }
];

const STORAGE_KEY = "facemashPeople_v1";
const K = 32;

let people = [];
let currentPair = [0, 1];

function loadPeople() {
  const stored = localStorage.getItem(STORAGE_KEY);
  people = stored ? JSON.parse(stored) : defaultPeople;
}

function savePeople() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
}

function updateElo(winner, loser) {
  const Ra = winner.rating, Rb = loser.rating;
  const Ea = 1 / (1 + Math.pow(10, (Rb - Ra) / 400));
  winner.rating = Math.round(Ra + K * (1 - Ea));
  loser.rating = Math.round(Rb - K * Ea);
}

// UI
const img1 = document.getElementById("img1");
const img2 = document.getElementById("img2");
const name1 = document.getElementById("name1");
const name2 = document.getElementById("name2");
const rating1 = document.getElementById("rating1");
const rating2 = document.getElementById("rating2");
const eloValue = document.getElementById("eloValue");
const leaderboardBody = document.getElementById("leaderboardBody");

function pickRandomPair() {
  let i = Math.floor(Math.random() * people.length);
  let j;
  do { j = Math.floor(Math.random() * people.length); }
  while (i === j);
  currentPair = [i, j];
  renderPair();
}

function renderPair() {
  const left = people[currentPair[0]];
  const right = people[currentPair[1]];
  img1.src = left.imageUrl;
  img2.src = right.imageUrl;
  name1.textContent = left.name;
  name2.textContent = right.name;
  rating1.textContent = "Rating: " + left.rating;
  rating2.textContent = "Rating: " + right.rating;
  eloValue.textContent = `${left.name}: ${left.rating} | ${right.name}: ${right.rating}`;
}

function handleVote(side) {
  const left = people[currentPair[0]];
  const right = people[currentPair[1]];
  side === "left" ? updateElo(left, right) : updateElo(right, left);
  savePeople();
  updateLeaderboard();
  pickRandomPair();
}

function updateLeaderboard() {
  const sorted = [...people].sort((a, b) => b.rating - a.rating);
  leaderboardBody.innerHTML = sorted.map((p, i) =>
    `<tr><td>${i + 1}</td><td>${p.name}</td><td>${p.rating}</td></tr>`
  ).join('');
}

// Navigation
document.getElementById("tab-vote").addEventListener("click", () => {
  sectionVote.classList.remove("hidden");
  sectionLeaderboard.classList.add("hidden");
});

document.getElementById("tab-leaderboard").addEventListener("click", () => {
  sectionLeaderboard.classList.remove("hidden");
  sectionVote.classList.add("hidden");
  updateLeaderboard();
});

// Events
document.getElementById("card-left").addEventListener("click", () => handleVote("left"));
document.getElementById("card-right").addEventListener("click", () => handleVote("right"));
document.getElementById("submitBtn").addEventListener("click", pickRandomPair);

// Init
loadPeople();
pickRandomPair();
updateLeaderboard();
