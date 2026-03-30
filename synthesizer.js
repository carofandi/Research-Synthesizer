const Anthropic = require('@anthropic-ai/sdk');

async function synthesize(query, results) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const sourceDump = JSON.stringify(results, null, 2);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: 'You are a research synthesizer. You receive raw data from multiple sources and produce a grounded, well-structured summary. Only make claims supported by the data. Cite sources. Note contradictions. Be concise, around 400-600 words.',
    messages: [{
      role: 'user',
      content: 'Research topic: "' + query + '"\n\nSource data:\n' + sourceDump + '\n\nPlease synthesize this into a grounded summary.'
    }]
  });

  return response.content[0].text;
}

module.exports = { synthesize };
