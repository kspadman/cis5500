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
    SELECT
      Teams.Name AS TeamName,
      Teams.City AS TeamCity,
      Teams.Conference AS TeamConference,
      Teams.Division AS TeamDivision,
      Players.*,
      PlayerAggregates.AveragePointsPerGame,
      PlayerAggregates.AverageReboundsPerGame,
      PlayerAggregates.AverageAssistsPerGame
    FROM
        Players
    INNER JOIN (
        SELECT
            PlayerID,
            AVG(Points) AS AveragePointsPerGame,
            AVG(Rebounds) AS AverageReboundsPerGame,
            AVG(Assists) AS AverageAssistsPerGame
        FROM
            PlayerStats
        WHERE
            PlayerID = '${player_id}'
        GROUP BY
            PlayerID
    ) AS PlayerAggregates ON Players.PlayerID = PlayerAggregates.PlayerID
    JOIN Teams ON Players.TeamID = Teams.TeamID
    WHERE
    Players.PlayerID = '${player_id}';
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
    Teams.Name AS TeamName,
    Teams.City AS TeamCity,
    Teams.Conference AS TeamConference,
    Teams.Division AS TeamDivision,
    Players.*,
    AVG(PlayerStats.Points) AS AveragePointsPerGame,
    AVG(PlayerStats.Rebounds) AS AverageReboundsPerGame,
    AVG(PlayerStats.Assists) AS AverageAssistsPerGame
  FROM
    Players
  INNER JOIN
    PlayerStats ON Players.PlayerID = PlayerStats.PlayerID
  JOIN Teams ON Players.TeamID = Teams.TeamID
  WHERE
    Players.TeamID = '${req.params.team_id}'
  GROUP BY
    Players.PlayerID, Players.Name
  ORDER BY
    AveragePointsPerGame DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const player_games = async function(req, res) {
  connection.query(`
  SELECT
    Games.*,
    PlayerStats.Points,
    PlayerStats.Assists,
    PlayerStats.Rebounds,
    PlayerStats.Steals,
    PlayerStats.Blocks,
    PlayerStats.Turnovers,
    PlayerStats.MinutesPlayed,
    PlayerStats.ClutchPoints,
    PlayerStats.FGPercentage,
    PlayerStats.ThreePTPercentage,
    PlayerStats.FTPercentage,
    PlayerStats.PlayerID
  FROM
      PlayerStats
  INNER JOIN
      Games ON PlayerStats.GameID = Games.GAME_ID
  WHERE
      PlayerStats.PlayerID = '${req.params.player_id}'
  ORDER BY
      Games.GAME_DATE DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
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
  SELECT
    Players.*,
    PlayerAggregates.AveragePointsPerGame,
    PlayerAggregates.AverageReboundsPerGame,
    PlayerAggregates.AverageAssistsPerGame
  FROM
    Players
  INNER JOIN (
    SELECT
        PlayerID,
        AVG(Points) AS AveragePointsPerGame,
        AVG(Rebounds) AS AverageReboundsPerGame,
        AVG(Assists) AS AverageAssistsPerGame
    FROM
        PlayerStats
    GROUP BY
        PlayerID
  ) AS PlayerAggregates ON Players.PlayerID = PlayerAggregates.PlayerID
  ORDER BY PlayerAggregates.AveragePointsPerGame DESC;
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
  ORDER BY pp.MaxPPG DESC;
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
      FROM PlayerGames
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
      playervariance.Variance
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

// COMPLEX #4
const top_player_pairs = async function(req, res) {
  connection.query(`
  With GameStats AS (
    SELECT
        pp.Player1ID,
        pp.Player2ID,
        pp.Player1Name,
        pp.Player2Name,
        pgs1.GameID,
        (pgs1.Points + pgs2.Points) AS TotalPoints,
        (pgs1.Rebounds + pgs2.Rebounds) AS TotalRebounds,
        (pgs1.Assists + pgs2.Assists) AS TotalAssists
    FROM PlayerPairs pp
    JOIN PlayerStats pgs1 ON pgs1.Points > 30 AND pgs1.Rebounds < 10 AND pgs1.PlayerID = pp.Player1ID
    JOIN PlayerStats pgs2 ON pgs1.GameID = pgs2.GameID AND pgs2.Points > 30 AND pgs2.PlayerID = pp.Player2ID
  ),
  CombinedStats AS (
      SELECT
          Player1Name,
          Player2Name,
          GameID,
          SUM(TotalPoints) AS SumPoints,
          SUM(TotalRebounds) AS SumRebounds,
          SUM(TotalAssists) AS SumAssists,
          SUM(TotalPoints + TotalRebounds + TotalAssists) AS CombinedPerformance
      FROM GameStats g
      GROUP BY Player1Name, Player2Name, GameID
  )
  SELECT
      Player1Name,
      Player2Name,
      CombinedPerformance
  FROM CombinedStats
  ORDER BY CombinedPerformance DESC
  LIMIT 10;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// COMPLEX #5
const top_location_variance = async function(req, res) {
  connection.query(`
  WITH LocationPoints AS (
    SELECT
        g.LOCATION,
        t.Name AS TeamName,
        pgs.Points
    FROM Games g
    JOIN PlayerStats pgs ON g.GAME_ID = pgs.GameID
    JOIN Teams t ON g.TEAM_ID = t.TeamID
    WHERE g.LOCATION IN (SELECT LOCATION FROM Games GROUP BY LOCATION ORDER BY LOCATION) -- Leveraging the index
  ),
  VarianceCalc AS (
      SELECT
          LOCATION,
          TeamName,
          AVG(Points * Points) - POWER(AVG(Points), 2) AS Variance -- Formula for variance
      FROM LocationPoints
      GROUP BY LOCATION, TeamName
  )
  SELECT
      LOCATION,
      TeamName,
      Variance
  FROM VarianceCalc
  ORDER BY Variance DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const top_divisions = async function(req, res) {
  connection.query(`
  With DivisionWins AS (
    FROM DivisionTuples f
    JOIN Games g ON (g.TEAM_ID IN (f.Team1, f.Team2, f.Team3, f.Team4, f.Team5) AND
                     g.OTHER_TEAM_ID NOT IN (f.Team1, f.Team2, f.Team3, f.Team4, f.Team5))
    JOIN Teams other ON g.OTHER_TEAM_ID = other.TeamID AND other.Division NOT IN (f.Division1, f.Division2, f.Division3, f.Division4, f.Division5)
    WHERE g.WL = 'W'
 ),
 SELECT Division1, Division2, Division3, Division4, Division5, MAX(Wins) as MostWins
 FROM DivisionWins
 GROUP BY Division1, Division2, Division3, Division4, Division5
 ORDER BY MostWins DESC
 LIMIT 10;
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
  top_players_variance,
  top_player_pairs,
  player_games,
  top_location_variance,
  top_divisions
}