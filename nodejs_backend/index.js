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

app.get('/players/:player_id', routes.player);
//app.get('/team/:team_id', routes.team);
//app.get('/top_players', routes.top_players);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;