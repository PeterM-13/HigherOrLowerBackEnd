import express from "express";
const router = express.Router();
//import nodemailer from 'nodemailer';

let players = [] // { name:player, score:0, voted:false }

let currentRound = -1;

let rounds = [
  { prev: "Number of Leonardo UK sites (9)", current: "Funding MOD budgeted for Tempest for the next 10 years, in billions", ans: "lower" }, // 9 < 12
  { prev: "Funding MOD budgeted for Tempest for the next 10 years, in billions (12)", current: "Number of sections on Leonardo parachute logo", ans: "higher" }, // 12 > 8
  { prev: "Number of sections on Leonardo parachute logo (8)", current: "Percentage of women working in engineering in 2023 workforce", ans: "lower" }, // 8 < 15.7
  { prev: "Percentage of women working in engineering in 2023 workforce (15.7)", current: "Leonardo’s 2024 revenues, in billions", ans: "lower" }, // 15.7 < 17.8
  { prev: "Leonardo’s 2024 revenues, in billions (17.8)", current: "Number of Leonardo helicopter solutions currently in use", ans: "higher" }, // 17.8 > 17
  { prev: "Number of Leonardo helicopter solutions currently in use (17)", current: "The number of years until GCAP will enter service", ans: "higher" }, // 17 > 10
  { prev: "The number of years until GCAP will enter service (10)", current: "Overall percentage of apprentices in the workforce", ans: "higher" }, // 10 > 5.2
  { prev: "Overall percentage of apprentices in the workforce (5.2)", current: "Number of British jobs supported by Leonardo, in thousands", ans: "lower" }, // 5.2 < 31.7
  { prev: "Number of British jobs supported by Leonardo, in thousands (31.7)", current: "Number of airports with Leonardo air traffic control systems", ans: "lower" }, // 31.7 < 600
  { prev: "Number of airports with Leonardo air traffic control systems (600)", current: "Number of apprentices recruited by Team Tempest Partners since 2018", ans: "lower" }, // 600 < 1100
  { prev: "Number of apprentices recruited by Team Tempest Partners since 2018 (1100)", current: "Leonardo’s investment into R&D, in 2024, in millions", ans: "lower" }, // 1100 < 2500
  { prev: "Leonardo’s investment into R&D, in 2024, in millions (2500)", current: "How many people are working on Tempest across the UK", ans: "lower" }, // 2500 < 3500
  { prev: "How many people are working on Tempest across the UK (3500)", current: "Number of countries using Leonardo radar systems", ans: "higher" }, // 3500 > 150
  { prev: "Number of countries using Leonardo radar systems (150)", current: "Number of years Leonardo’s heritage in EW spans", ans: "higher" }, // 150 > 122
  { prev: "Number of years Leonardo’s heritage in EW spans (122)", current: "Number of Leonardo sites worldwide", ans: "lower" }, // 122 < 129
  { prev: "Number of Leonardo sites worldwide (129)", current: "The exports Leonardo generates towards the UK economy annually, in millions", ans: "lower" }, // 129 < 930
  { prev: "The exports Leonardo generates towards the UK economy annually, in millions (930)", current: "The Commute time from London to Luton by train, in minutes", ans: "higher" }, // 930 > 25
  { prev: "The Commute time from London to Luton by train, in minutes (25)", current: "The number of Leonardo employees worldwide, in thousands", ans: "lower" }, // 25 < 53
  { prev: "The number of Leonardo employees worldwide, in thousands (53)", current: "Percentage of Leonardo’s workforce made up of highly-skilled engineers", ans: "higher" }, // 53 > 50
  { prev: "Percentage of Leonardo’s workforce made up of highly-skilled engineers (50)", current: "Number of Future Leaders offered an apprenticeship from our first cohort", ans: "higher" }, // 50 > 3
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