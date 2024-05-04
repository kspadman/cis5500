const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: '*',
  })); //Change later, this is potentially a security issue
  
const PORT = process.env.PORT || 3001;

app.get('/api/user', (req, res) => {
  res.json({ name: 'John Doe' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));