import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

export async function extractAssetsFromPID(
  base64: string,
  mimeType: string
) {
  const systemPrompt = `
You are an expert P&ID (Piping and Instrumentation Diagram) analyzer.

Return ONLY valid JSON in this format:
{
  "assets": [
    { "tag": "P-101", "type": "Pump", "coordinates": [0.2, 0.4] }
  ]
}
`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: mimeType, // application/pdf
              data: base64
            }
          },
          {
            type: 'text',
            text: 'Extract all assets from this P&ID diagram.'
          }
        ]
      }
    ]
  })

  const textBlock = message.content.find(c => c.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from Claude')
  }

  const clean = textBlock.text
    .replace(/```json|```/g, '')
    .trim()

  return JSON.parse(clean)
}
