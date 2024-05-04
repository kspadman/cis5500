const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/api/user', (req, res) => {
  res.json({ name: 'John Doe' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));