const express = require('express');
const cors = require('cors');
const config = require("./config");
const routes = require("./routes");


const app = express();
app.use(cors({
    origin: '*',
  })); //Change later, this is potentially a security issue
  
const PORT = config.server_port;

app.get('/api/user', (req, res) => {
  res.json({ name: 'John Doe' });
});

app.get('/players', routes.players);
app.get('/players/:player_id', routes.player);
app.get('/players/:player_id/games', routes.player_games);
app.get('/teams/:team_id', routes.team);
app.get('/teams', routes.teams);
app.get('/search_players', routes.search_players);
app.get('/top_scorers', routes.top_scorers);
app.get('/team_win_rates', routes.team_win_rates);
app.get('/top_players_variance', routes.top_players_variance);
app.get('/top_player_pairs', routes.top_player_pairs);
app.get('/top_location_variance', routes.top_location_variance);
app.get('/top_divisions', routes.top_divisions);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;