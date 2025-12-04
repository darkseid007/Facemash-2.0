const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const DATA_FILE = path.join(__dirname, "data", "items.json");

// Load items from file
let items = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

// ----- Elo helpers -----
function expectedScore(ratingA, ratingB) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

function updateRatings(winner, loser, k = 32) {
  const expectedWinner = expectedScore(winner.rating, loser.rating);
  const expectedLoser = expectedScore(loser.rating, winner.rating);

  winner.rating = winner.rating + k * (1 - expectedWinner);
  loser.rating = loser.rating + k * (0 - expectedLoser);
}

// Save to file
function saveItems() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
}

// ----- API Routes -----

// Get all items
app.get("/api/items", (req, res) => {
  res.json(items);
});

// Vote route
app.post("/api/vote", (req, res) => {
  const { winnerId, loserId } = req.body;

  const winner = items.find((i) => i.id === winnerId);
  const loser = items.find((i) => i.id === loserId);

  if (!winner || !loser) {
    return res.status(400).json({ error: "Invalid winnerId or loserId" });
  }

  updateRatings(winner, loser);
  saveItems();

  // send updated items
  res.json(items);
});

app.listen(PORT, () => {
  console.log(`FaceMash server running at http://localhost:${PORT}`);
});
