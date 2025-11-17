import { NightAnalysis } from '../types'

// Type definition for the sleep data (optional, for future use)
export interface SleepData {
  totalSleepHours?: number
  wakeCount?: number
  avgHeartRate?: number
  // Add more fields as needed
}

/**
 * Analyzes a user's dream reflection using an AI model
 * 
 * @param reflection - The user's free-text description of their sleep and dreams
 * @param sleepData - Optional sleep metrics (not used yet, but ready for future)
 * @returns Promise that resolves to the AI's analysis of the night
 */
export async function analyzeNight(
  reflection: string,
  sleepData?: SleepData
): Promise<NightAnalysis> {
  // Get the API key from environment variables
  // IMPORTANT: Create a .env file in the root directory and add: VITE_OPENAI_API_KEY=your_key_here
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error(
      'API key not found. Please create a .env file with VITE_OPENAI_API_KEY=your_key_here'
    )
  }

  // System prompt that instructs the AI how to behave
  const systemPrompt = `You are an empathetic dream interpreter and visual artist.

Your job:
- Take the user's free-text description of their sleep and dreams.
- Optionally, take simple sleep metrics (total sleep, awake times, HR, etc.).
- Infer their emotional tone, key themes and intensity.
- Turn that into a colour palette and a short, gentle reflection.
- Return ONLY JSON, no extra text.

Rules:
- Be non-judgemental, supportive and non-clinical.
- Do NOT give medical advice or diagnoses.
- Think like an artist and storyteller, not a therapist.

Given:
- 'reflection': the user's description of how they slept and what they dreamed.
- 'sleepData': optional object with fields like totalSleepHours, wakeCount, avgHeartRate, etc.

Return JSON with this exact shape:

{
  "title": string,
  "emotions": string[],
  "themes": string[],
  "intensity": number,
  "colors": string[],
  "summary": string,
  "gentleNote": string
}

Make sure:
- Colors reflect the emotional tone.
- 'summary' feels like a mirror, not a judgement.
- 'gentleNote' feels human and warm.

Only output valid JSON with double quotes.`

  // Build the user message with the reflection and optional sleep data
  let userMessage = `reflection: ${reflection}`
  if (sleepData && Object.keys(sleepData).length > 0) {
    userMessage += `\n\nsleepData: ${JSON.stringify(sleepData)}`
  }

  try {
    // Call OpenAI's API (using the chat completions endpoint)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using a cost-effective model, you can change to 'gpt-4' or 'gpt-3.5-turbo' if preferred
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: 0.7, // Controls randomness (0 = deterministic, 1 = creative)
        response_format: { type: 'json_object' }, // Forces JSON output
      }),
    })

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`
      )
    }

    // Parse the response
    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content received from API')
    }

    // Parse the JSON response from the AI
    const analysis: NightAnalysis = JSON.parse(content)

    // Validate that we got the expected structure
    if (!analysis.title || !analysis.colors || !analysis.summary) {
      throw new Error('Invalid response format from AI')
    }

    return analysis
  } catch (error) {
    // Re-throw with a more user-friendly message if it's our own error
    if (error instanceof Error) {
      throw error
    }
    // Otherwise, wrap unknown errors
    throw new Error('Failed to analyze your night. Please try again.')
  }
}

