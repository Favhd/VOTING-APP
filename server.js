const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

// Middleware to parse JSON from forms
app.use(express.urlencoded({ extended: true }));

// Path to votes.json
const votesFile = path.join(__dirname, "votes.json");

// Ensure votes.json exists
if (!fs.existsSync(votesFile)) {
  fs.writeFileSync(votesFile, JSON.stringify({ yes: 0, no: 0 }, null, 2));
}

// Serve the voting page
app.get("/", (req, res) => {
  res.send(`
    <h2>Do you like Pringles?</h2>
    <form method="POST" action="/vote">
      <button name="vote" value="yes">Yes</button>
      <button name="vote" value="no"> No</button>
    </form>
  `);
});

// Handle voting
app.post("/vote", (req, res) => {
  const { vote } = req.body;
  let votes = JSON.parse(fs.readFileSync(votesFile));

  if (vote === "yes") votes.yes++;
  if (vote === "no") votes.no++;

  fs.writeFileSync(votesFile, JSON.stringify(votes, null, 2));

  // Calculate percentages
  const total = votes.yes + votes.no;
  const yesPercent = ((votes.yes / total) * 100).toFixed(1);
  const noPercent = ((votes.no / total) * 100).toFixed(1);

  res.send(`
    <h2>Thanks for voting!</h2>
    <p> Yes: ${yesPercent}% (${votes.yes})</p>
    <p> No: ${noPercent}% (${votes.no})</p>
    <a href="/">Vote Again</a>
  `);
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));