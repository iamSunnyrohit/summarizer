const openai = require('../config/openai');

// Summarize text with bullet points
exports.summarizeText = async (text, options = {}) => {
  try {
    const { bulletPoints = 5, style = 'concise' } = options;
    
    const systemPrompt = `You are an expert summarizer. Summarize the following text into exactly ${bulletPoints} clear and concise bullet points. Each bullet point should capture a key idea or important detail. Format: return only the bullet points, one per line, starting with a dash (-).`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: 0.5,
      max_tokens: 500
    });

    const summaryText = completion.content[0].text.trim();
    
    // Parse bullet points
    const bullets = summaryText
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[-*•]\s*/, '').trim());

    return {
      summary: summaryText,
      bulletPoints: bullets,
      tokensUsed: completion.usage.total_tokens
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate summary');
  }
};

// Analyze sentiment
exports.analyzeSentiment = async (text) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Analyze the sentiment of the following text. Respond with a JSON object containing: {"score": , "label": ""}'
        },
        { role: 'user', content: text }
      ],
      temperature: 0.3,
      max_tokens: 50
    });

    const result = JSON.parse(completion.content[0].text);
    return result;
  } catch (error) {
    console.error('Sentiment Analysis Error:', error);
    return { score: 0, label: 'neutral' };
  }
};