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
    var player_id = req.params.player_id;
    player_id = 1628369;
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

module.exports = {
  player,
  team,
  teams,
  search_players
}



