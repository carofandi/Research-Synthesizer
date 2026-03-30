const axios = require('axios');

async function fetchYouTube(query) {
  const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: { q: query, part: 'snippet', maxResults: 5, type: 'video', key: process.env.YOUTUBE_API_KEY }
  });
  return res.data.items.map(v => ({
    source: 'YouTube', title: v.snippet.title,
    channel: v.snippet.channelTitle, description: v.snippet.description.slice(0, 200)
  }));
}

async function fetchHN(query) {
  const res = await axios.get('https://hn.algolia.com/api/v1/search', {
    params: { query, tags: 'story', hitsPerPage: 8 }
  });
  return res.data.hits.map(h => ({
    source: 'HackerNews', title: h.title, points: h.points,
    comments: h.num_comments, url: h.url
  }));
}

async function fetchPolymarket(query) {
  const res = await axios.get('https://gamma-api.polymarket.com/markets', {
    params: { q: query, limit: 5, active: true }
  });
  return (res.data || []).map(m => ({
    source: 'Polymarket', question: m.question,
    probability: m.outcomePrices, volume: m.volume
  }));
}

async function fetchWeb(query) {
  const res = await axios.post('https://google.serper.dev/search',
    { q: query, num: 8 },
    { headers: { 'X-API-KEY': process.env.SERPER_API_KEY } }
  );
  return (res.data.organic || []).map(r => ({
    source: 'Web', title: r.title, snippet: r.snippet, link: r.link
  }));
}

module.exports = { fetchYouTube, fetchHN, fetchPolymarket, fetchWeb };
