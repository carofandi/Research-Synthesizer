require('dotenv').config(require('dotenv').config({ path: '.env' });
  );
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
    const [ytResults, hnResults, pmResults, webResults] = await Promise.allSettled([
      fetchYouTube(query),
      fetchHN(query),
      fetchPolymarket(query),
      fetchWeb(query)
    ]);

    const allResults = [ytResults, hnResults, pmResults, webResults]
      .filter(r => r.status === 'fulfilled')
      .flatMap(r => r.value);

    const summary = await synthesize(query, allResults);
    res.json({ summary, rawResults: allResults });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Research synthesizer running on http://localhost:${process.env.PORT}`)
);
