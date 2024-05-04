const mysql = require('mysql')
const config = require('./config.json');
const { json } = require('express');

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});

const player = async function(req, res) {
    const player_id = req.params.player_id;
    connection.query(`
        SELECT *
        FROM Players
        WHERE PlayerID = '${player_id}'
    `, (err, data) => {
        if (err || data.length === 0) {
        console.log(err);
        res.json({});
        } else {
        res.json(data[0]);
        }
    });
}

const team = async function(req, res) {
  connection.query(`
    SELECT *
    FROM Teams
    WHERE TeamID = '${req.params.team_id}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

const teams = async function(req, res) {
  connection.query(`
    SELECT *
    FROM Teams
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const search_players = async function(req, res) {
  connection.query(`
    SELECT *
    FROM Players
    WHERE Name LIKE '%${req.query.name}%'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// COMPLEX #1
const top_scorers = async function(req, res) {
  connection.query(`
  SELECT 
  team.Name AS TeamName,
  player.Name,
  pp.MaxPPG
  FROM Teams team
  JOIN (
    SELECT 
        ppg.TEAM_ID, 
        MAX(ppg.PPG) AS MaxPPG
    FROM (
        SELECT 
            ps.PlayerID,
            game.TEAM_ID,
            AVG(ps.Points) AS PPG
        FROM PlayerStats ps
        JOIN Games game ON ps.GameID = game.GAME_ID
        GROUP BY ps.PlayerID, game.TEAM_ID
    ) ppg
    GROUP BY ppg.TEAM_ID
  ) pp ON team.TeamID = pp.TEAM_ID
  JOIN (
    SELECT 
        ps.PlayerID,
        game.TEAM_ID,
        AVG(ps.Points) AS PPG
    FROM PlayerStats ps
    JOIN Games game ON ps.GameID = game.GAME_ID
    GROUP BY ps.PlayerID, game.TEAM_ID
  ) ppg ON team.TeamID = ppg.TEAM_ID AND pp.MaxPPG = ppg.PPG
  JOIN Players player ON ppg.PlayerID = player.PlayerID
  ORDER BY team.Name;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

module.exports = {
  player,
  team,
  teams,
  search_players,
  top_scorers
}



