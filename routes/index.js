import express from "express";
const router = express.Router();
//import nodemailer from 'nodemailer';

let players = [] // { name:player, score:0, voted:false }

let currentRound = -1;

let rounds = [
  {prev:"Number of Leonardo UK sites (9)", current:"Funding MOD budgeted for Tempest for the next 10 years, in billions", ans:"higher"},
  {prev:"Funding MOD budgeted for Tempest for the next 10 years, in billions (12)", current:"Number of sections on Leonardo parachute logo", ans:"lower"},
  {prev:"Number of sections on Leonardo parachute logo (8)", current:"Percentage of women working in engineering in 2023 workforce", ans:"higher"},
  {prev:"Percentage of women working in engineering in 2023 workforce (15.7)", current:"Number of Leonardo helicopter solutions currently in use", ans:"higher"},
  {prev:"Number of Leonardo helicopter solutions currently in use (17)", current:"Leonardo’s 2024 revenues, in billions", ans:"higher"},
  {prev:"Leonardo’s 2024 revenues, in billions (17.8)", current:"The number of years until GCAP will enter service", ans:"lower"},
  {prev:"The number of years until GCAP will enter service (10)", current:"Overall percentage of apprentices in the workforce", ans:"lower"},
  {prev:"Overall percentage of apprentices in the workforce (5.2)", current:"Number of airports with Leonardo air traffic control systems", ans:"higher"},
  {prev:"Number of airports with Leonardo air traffic control systems (600)", current:"Number of apprentices recruited by Team Tempest Partners since 2018", ans:"higher"},
  {prev:"Number of apprentices recruited by Team Tempest Partners since 2018 (1100)", current:"Leonardo’s investment into R&D, in 2024, in millions", ans:"higher"},
  {prev:"Leonardo’s investment into R&D, in 2024, in millions (2500)", current:"How many people are working on Tempest across the UK", ans:"higher"},
  {prev:"How many people are working on Tempest across the UK (3500)", current:"Number of countries using Leonardo radar systems", ans:"higher"},
  {prev:"Number of countries using Leonardo radar systems (150)", current:"Number of years Leonardo’s heritage in EW spans", ans:"lower"},
  {prev:"Number of years Leonardo’s heritage in EW spans (122)", current:"Number of Leonardo sites worldwide", ans:"higher"},
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
      res.json({
        success: true,
        payload: player
      })
    } else {
      res.json({
      success: false,
      payload: "Player name already used"
      });
    }
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
    payload: {roundNum:currentRound, nextRound:rounds[currentRound]}
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