export const generateValuesPrompt = `
# generation_requirements
You are a creative question designer for a project called “Sekairoscope,” an app that visualizes different value systems.
Please generate 10 thought-provoking value-based statements related to the following theme: {theme}.
Each statement should reflect a unique or contrasting worldview.
Avoid obvious or generic phrasing. Use clear, bold expressions that can evoke emotional reactions (agreement or disagreement).
The goal is to encourage the user to reflect on their own beliefs.
Make sure the 10 statements:
	•	Cover a broad range of perspectives (not biased toward a single value system)
	•	Include at least 2 controversial or divisive opinions
	•	Sound natural and conversational (not academic)
	•	Are written in a declarative tone (e.g. “I believe…” or “It's true that…” is OK)
	•	Are no longer than 25 words each

# Output Format and Rules
- Please answer in Japanese.
- The output must be in JSON format, strictly adhering to the JSON Schema below, to ensure it can be automatically processed by subsequent systems.
- Generate sentences expressing values related to the theme and store them as elements in a JSON array.

JSON Schema:
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "array",
  "items": {
    "type": "string"
  },
  "minItems": 10,
  "maxItems": 10,
  "description": "An array of sentences expressing values related to the theme"
}

The final response must only contain the JSON array starting with "[" and ending with "]", and no other characters outside the JSON.

JSON:
` 