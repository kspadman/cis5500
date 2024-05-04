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

app.get('/player/:player_id', routes.player);
app.get('/team/:team_id', routes.team);
app.get('/teams', routes.teams);
app.get('search_players', routes.search_players);
app.get('/top_scorers', routes.top_scorers);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;