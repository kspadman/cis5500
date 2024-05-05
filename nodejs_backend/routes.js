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
  SELECT
    Players.*,
    AVG(PlayerStats.Points) AS AveragePointsPerGame,
    AVG(PlayerStats.Rebounds) AS AverageReboundsPerGame,
    AVG(PlayerStats.Assists) AS AverageAssistsPerGame
  FROM
    Players
  INNER JOIN
    PlayerStats ON Players.PlayerID = PlayerStats.PlayerID
  WHERE
    Players.TeamID = '${req.params.team_id}'
  GROUP BY
    Players.PlayerID, Players.Name;
  ORDER BY
    AveragePointsPerGame DESC;
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

const players = async function(req, res) {
  connection.query(`
    SELECT *
    FROM Players
    ORDER BY Name ASC
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
    WHERE Name LIKE '${req.query.name}%'
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

// COMPLEX #2
const team_win_rates = async function(req, res) {
  connection.query(`
  WITH TeamWinRates AS (
    SELECT
        t.TeamID,
        SUM(CASE WHEN g.WL = 'W' THEN 1 ELSE 0 END) AS Wins,
        COUNT(*) AS TotalGames,
        AVG(CASE WHEN g.WL = 'W' THEN 1 ELSE 0 END) AS WinPercentage
    FROM Teams t
    JOIN Games g ON t.TeamID = g.TEAM_ID
    JOIN (
        SELECT
            TEAM_ID,
            AVG(CASE WHEN g.WL = 'W' THEN 1 ELSE 0 END) AS OpponentWinRate
        FROM Games g
        JOIN Teams t ON g.OTHER_TEAM_ID = t.TeamID
        GROUP BY TEAM_ID
    ) ow ON t.TeamID = ow.TEAM_ID
    GROUP BY t.TeamID
  )
  SELECT
      t.Name AS TeamName,
      twr.Wins,
      twr.TotalGames,
      twr.WinPercentage
  FROM Teams t
  JOIN TeamWinRates twr ON t.TeamID = twr.TeamID
  ORDER BY WinPercentage DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// COMPLEX #3
const top_players_variance = async function(req, res) {
  connection.query(`
  WITH PlayerGames AS (
    SELECT
        stats.PlayerID,
        stats.GameID,
        stats.Points
    FROM PlayerStats stats
  ), PlayerAvgPoints AS (
      SELECT
          PlayerID,
          AVG(Points) AS AvgPoints
      FROM PlayerGamePoints
      GROUP BY PlayerID
  ), PlayerVariance AS (
      SELECT
          p.PlayerID,
          SUM(POWER(pgp.Points - p.AvgPoints, 2)) / COUNT(pgp.GameID) AS Variance
      FROM PlayerGames pgp
      INNER JOIN PlayerAvgPoints p ON pgp.PlayerID = p.PlayerID
      GROUP BY p.PlayerID
  )
  SELECT
      player .Name,
      pv.Variance
  FROM PlayerVariance playervariance
  JOIN Players player ON playervariance.PlayerID = player .PlayerID
  ORDER BY playervariance.Variance DESC
  LIMIT 10
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
  players,
  search_players,
  top_scorers,
  team_win_rates,
  top_players_variance
}



