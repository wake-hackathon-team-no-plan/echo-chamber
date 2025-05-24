export const generateResultsPrompt = `
## Input
Theme: {theme}
User's Values:
{viewpoints}

## Requirements for Generated Prompt
### keywords
Based on the user's selected questions, infer their core values and generate a list of 10 general Japanese keywords that reflect their worldview.
Requirements:
Output must be in Japanese
Each keyword must be 7 characters or fewer
Use widely understandable and searchable words (e.g., 思考力, 主体性, 教育観)
Avoid slang and overly casual language
Do NOT limit to only positive words — include emotionally complex, thought-provoking, or even slightly uncomfortable keywords if they reflect the user's perspective
Keywords should help expand the user's worldview through relevant articles, essays, or learning content
Output only the keyword list in numbered format (1–10)

### perspective
Based on the user's selected questions, infer their core personal values and write a short description of their worldview in Japanese.
Requirements:
- Output must be in Japanese
- Keep it around 100 characters
- Write in a casual, warm, and emotionally resonant tone
- Avoid quoting the questions directly
- Express what the user might believe or care about based on their selected statements
- Output only the final Japanese sentence

## Output Format and Rules
- The entire output must be a single JSON object.
- This JSON object must strictly adhere to the JSON Schema provided below to ensure it can be automatically processed by subsequent systems.
- All human-readable text content within the generated JSON object (specifically, values in the "keywords" array and the "perspective" field) must be in Japanese.

JSON Schema:
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "User Value Perspective",
  "description": "A JSON object containing keywords and a narrative perspective derived from the user's value-based responses.",
  "type": "object",
  "properties": {
    "keywords": {
      "description": "An array of keyword phrases representing the user's core perspective.",
      "type": "array",
      "items": {
        "type": "string",
        "description": "A single keyword phrase representing a facet of the user's perspective."
      },
      "minItems": 10,
      "maxItems": 15
    },
    "perspective": {
      "description": "A textual summary of the user's overall perspective.",
      "type": "string"
    }
  },
  "required": [
    "keywords",
    "perspective"
  ],
  "additionalProperties": false
}

The final response must only contain the JSON object starting with "{" and ending with "}", and no other characters outside the JSON.

JSON: 
` 