import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    
    // Validate input
    if (!text || text.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: 'Article text is required and must be at least 50 characters long' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured. Please add GEMINI_API_KEY to your secrets.' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Calculate word count and reading time
    const wordCount = text.trim().split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(wordCount / 200); // Average reading speed

    // Extract title (first line or first sentence)
    const lines = text.trim().split('\n');
    const firstLine = lines[0]?.trim() || '';
    const extractedTitle = firstLine.length > 5 && firstLine.length < 200 
      ? firstLine 
      : text.split('.')[0]?.substring(0, 100) || 'Untitled Article';

    // Craft a detailed prompt for Gemini
    const prompt = `Analyze the following news article and return ONLY a valid JSON object (no markdown, no code blocks, just raw JSON) with this exact structure:

{
  "title": "A clear, concise title for the article (max 100 chars)",
  "summaryPoints": ["bullet point 1", "bullet point 2", "bullet point 3", "bullet point 4", "bullet point 5"],
  "sentiment": "positive or negative or neutral",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7"]
}

Requirements:
- summaryPoints: Exactly 3-5 concise bullet points (each 10-25 words) capturing the most important information
- sentiment: Analyze the overall tone and classify as "positive", "negative", or "neutral"
- keywords: Extract 5-7 relevant keywords or short phrases that best represent the article's main topics
- Return ONLY valid JSON, no additional text or formatting

Article:
${text}`;

    // Call Google Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate summary. Please check your API key and try again.' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini response:', JSON.stringify(geminiData));
    
    const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!generatedText) {
      throw new Error('No text generated from Gemini');
    }

    // Parse the JSON response from Gemini
    let parsedResponse;
    try {
      // Remove markdown code blocks if present
      const cleanedText = generatedText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      parsedResponse = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', generatedText);
      // Fallback response
      parsedResponse = {
        title: extractedTitle,
        summaryPoints: [
          'Unable to parse AI response',
          'Please try again with a different article'
        ],
        sentiment: 'neutral',
        keywords: ['error', 'parsing']
      };
    }

    // Build the final response with all required fields
    const response = {
      title: parsedResponse.title || extractedTitle,
      summaryPoints: Array.isArray(parsedResponse.summaryPoints) 
        ? parsedResponse.summaryPoints 
        : ['Summary generation failed'],
      sentiment: parsedResponse.sentiment || 'neutral',
      keywords: Array.isArray(parsedResponse.keywords) 
        ? parsedResponse.keywords 
        : [],
      wordCount,
      readingTimeMinutes
    };

    console.log('Final response:', JSON.stringify(response));

    return new Response(
      JSON.stringify(response),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in summarize function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});