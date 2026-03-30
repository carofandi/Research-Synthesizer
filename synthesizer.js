const Anthropic = require('@anthropic-ai/sdk');

async function synthesize(query, results) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const sourceDump = JSON.stringify(results, null, 2);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: `You are a research synthesizer. You receive raw data from multiple sources 
(YouTube, Hacker News, Polymarket, and web search) and produce a grounded, well-structured summary.

Rules:
- Only make claims directly supported by the provided data
- Cite which source each key claim comes from
- Note if sources contradict each other
- For Polymarket data, explain what the prediction market odds imply
- Distinguish between expert opinion, public sentiment, and prediction market signals
- Flag if data seems sparse or one-sided
- Be concise but complete, aim for 400-600 words`,

    messages: [{
      role: 'user',
      content: `Research topic: "${query}"\n\nSource data:\n${sourceDump}\n\nPlease synthesize this into a grounded summary.`
    }]
  });

  return response.content[0].text;
}

module.exports = { synthesize };
