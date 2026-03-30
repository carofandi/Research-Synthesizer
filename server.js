require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { fetchYouTube, fetchHN, fetchPolymarket, fetchWeb } = require('./fetchers');
const { synthesize } = require('./synthesizer');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/research', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query required' });
  try {
    const [a, b, c, d] = await Promise.allSettled([
      fetchYouTube(query),
      fetchHN(query),
      fetchPolymarket(query),
      fetchWeb(query)
    ]);
    const allResults = [a, b, c, d]
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value);
    console.log('Results count:', allResults.length);
    const summary = await synthesize(query, allResults);
    res.json({ summary, rawResults: allResults });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
