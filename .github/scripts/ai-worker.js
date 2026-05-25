import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const nvidiaApiKey = process.env.NVIDIA_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !nvidiaApiKey) {
  console.error("Missing environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const openai = new OpenAI({
  apiKey: nvidiaApiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

async function fetchTopNews() {
  try {
    const res = await fetch('https://news.google.com/rss/search?q=india+finance+stocks&hl=en-IN&gl=IN&ceid=IN:en');
    const text = await res.text();
    // Super basic extraction of titles for context
    const matches = [...text.matchAll(/<title>(.*?)<\/title>/g)].slice(1, 10);
    return matches.map(m => m[1].replace(' - Google News', '')).join('\n');
  } catch (e) {
    return "Market is experiencing standard volatility.";
  }
}

async function main() {
  console.log("Fetching news context...");
  const newsContext = await fetchTopNews();
  
  console.log("Generating AI insights with Nemotron...");
  const prompt = `You are an expert AI financial analyst for the Indian Market.
Based on the following recent news headlines, provide 3 stock recommendations or sector insights.

Recent News:
${newsContext}

Output MUST be valid JSON in this exact format:
{
  "title": "A catchy title for this report",
  "summary": "A 2-3 sentence summary of the market sentiment",
  "category": "Stocks",
  "recommended_assets": [
    {
      "symbol": "RELIANCE.NS",
      "name": "Reliance Industries",
      "reasoning": "Why this is recommended..."
    }
  ]
}`;

  const completion = await openai.chat.completions.create({
    model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
    messages: [{"role":"user","content":prompt}],
    temperature: 0.6,
    top_p: 0.95,
    max_tokens: 4096,
  });

  let rawOutput = completion.choices[0]?.message?.content || '{}';
  
  // Clean potential markdown blocks
  rawOutput = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
  
  let parsed;
  try {
    parsed = JSON.parse(rawOutput);
  } catch (e) {
    console.error("Failed to parse AI output as JSON:", rawOutput);
    process.exit(1);
  }

  console.log("Saving to Supabase...");
  const { error } = await supabase
    .from('ai_insights')
    .insert([
      {
        title: parsed.title,
        summary: parsed.summary,
        category: parsed.category || 'Stocks',
        recommended_assets: parsed.recommended_assets || [],
        raw_reasoning: completion.choices[0]?.message?.reasoning_content || ''
      }
    ]);

  if (error) {
    console.error("Supabase insert error:", error);
    process.exit(1);
  }

  console.log("Successfully generated and saved AI insights!");
}

main();
