import express from "express";
const router = express.Router();
//import nodemailer from 'nodemailer';

let players = [] // { name:player, score:0, voted:false }

let currentRound = -1;

let rounds = [
  {prev:"Number of Leonardo sites world wide (111)", current:"Number of airports with Leonardo air traffic control systems", ans:"lower"},
  {prev:"Number of airports with Leonardo air traffic control systems (200)", current:"Number of uncrewed drones", ans:"lower"},
  {prev:"Number of uncrewed drones (825)", current:"Number of jets in service", ans:"lower"},
  {prev:"Number of jets in service (7000)", current:"Number of helicopters in service", ans:"higher"},
  {prev:"Number of helicopters in service (4300)", current:"Distance in Km betweel Luton and Yeovil sites", ans:"higher"},
  {prev:"Distance in Km betweel Luton and Yeovil sites (232)", current:"Diameter of BriteCloud in mm", ans:"higher"},
  {prev:"Diameter of BriteCloud in mm (55)", current:"Number of stairs from ground floor to level 3 at Luton", ans:"lower"},
  {prev:"Number of stairs from ground floor to level 3 at Luton (66)", current:"Number of helicopter solutions currently in use", ans:"higher"},
  {prev:"Number of helicopter solutions currently in use (17)", current:"New orders brought in during 2023, in billions", ans:"higher"},
  {prev:"New orders brought in during 2023, in billions (5.3)", current:"Number of exhibitions attended by Leonardo in May 2024", ans:"lower"}
]

// Get round
router.get("/round", async (req, res) => {
  if(currentRound === -1){
    res.json({
      success: false,
      payload: "Game hasn't started yet"
    })
  }else if(currentRound >= rounds.length){
    res.json({
      success: false,
      payload: "End of Game"
    })
  }else{
    res.json({
      success: true,
      payload: rounds[currentRound]
    })
  }
});

// Get all players
router.get("/players", async (req, res) => {
  res.json({
    success: true,
    payload: players})
});

// Clear all players
router.get("/reset", async (req, res) => {
  players = [];
  currentRound = -1;
  res.json({
    success: true,
    payload: players})
});

// Getl all players and round
router.get("/playersRound", async (req, res) => {
  if(currentRound >= rounds.length){
    res.json({
      success: false,
      payload: "End of Game"
    })
  }else{
    res.json({
      success: true,
      payload: {round:rounds[currentRound], players:players}
    })
  }
});

// Add Player
router.post("/addPlayer/:name", async (req, res) => {
  if(!currentRound === -1) {
    res.json({
      success: false,
      payload: "Game already started"
    });
    return;
  } 
  if(req.params.name !== undefined){
    let player = req.params.name;
    if (!players.some(p => p.name === player)) {
      players.push({name:player, score:0, voted:false});
    } else {
      res.json({
      success: false,
      payload: "Player name already used"
      });
    }
    res.json({
      success: true,
      payload: player
    })
  }else{
    res.json({
      success: false,
      payload: "Invalid player name"
    })
  }
});

// Next Round (+Start Game)
router.post("/admin/nextRound", async (req, res) => {
  currentRound += 1;
  for (let player of players)
  { 
    player.voted = false; 
  }
  if(currentRound >= rounds.length){
    res.json({
      success: false,
      payload: "End of Game"
    })
  }else{
  res.json({
    success: true,
    payload: {round:currentRound}
  })
}
})


// Submit answer
router.post("/submitAnswer/:playerName/:ans", async (req, res) => {
  let ans = req.params.ans;
  let playerName = req.params.playerName;
  let respText = ""
  const playerIndex = players.findIndex(player => player.name === playerName);
  if(playerIndex !== -1){
    if(ans == rounds[currentRound].ans){
      players[playerIndex].score += 1;
      respText = "Correct Answer"
    }else{
      respText = "Incorrect Answer"
    }
    players[playerIndex].voted = true;
  }else{
    respText = "Player not found"
  }
  res.json({
    success: true,
    payload: respText,
  })
})

// Get player position
router.get("/position/:playerName", async (req, res) => {
  let playerName = req.params.playerName;
  let playerIndex = players.findIndex(player => player.name === playerName);
  if(playerIndex !== -1){
    let position = players.map(e => e.score).indexOf(players[playerIndex].score) + 1;
    let sortedPlayers = players.sort((a, b) => b.score - a.score);
    let topThree = sortedPlayers.slice(0, 3).map(player => ({ name: player.name, score: player.score }));
    res.json({
      success: true,
      payload: {
        position,
        topThree
      }
    })
  }else{
    res.json({
      success: false,
      payload: "Player not found"
    })
  }
})

console.log("Server Started")

export default router;