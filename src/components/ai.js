// import Anthropic from "@anthropic-ai/sdk";
import { HfInference } from "@huggingface/inference";
const SYSTEM_PROMPT = `
You are a smart cooking assistant.

Your task:
- The user will provide a list of ingredients they currently have.
- Suggest one clear, practical recipe that can be made using some or all of those ingredients.
- You do NOT need to use every ingredient.
- You may include a few additional common household ingredients if necessary (such as salt, oil, water, sugar, basic spices), but do not add too many extra items.

Rules:
1. If the given ingredients are sufficient, suggest a complete recipe using mostly those ingredients.
2. If the ingredients are insufficient, suggest a recipe that uses the given ingredients plus a small number of common pantry items.
3. If the user provides non-food items (e.g., electronics, tools, random objects), politely respond that a recipe cannot be created using those items. Do NOT suggest any recipe in that case.
4. Format the response in clean Markdown for web rendering.

Response Format:
- Recipe Title (as H2)
- Short Description (1–2 lines)
- Ingredients (bullet list)
- Instructions (numbered steps)
- Optional Tips (if helpful)

Keep the recipe practical, realistic, and easy to follow.
Avoid unnecessary storytelling.
`;

// 🚨👉 ALERT: Read message below! You've been warned! 👈🚨
// If you're following along on your local machine instead of
// here on Scrimba, make sure you don't commit your API keys
// to any repositories and don't deploy your project anywhere
// live online. Otherwise, anyone could inspect your source
// and find your API keys/tokens. If you want to deploy
// this project, you'll need to create a backend of some kind,
// either your own or using some serverless architecture where
// your API calls can be made. Doing so will keep your
// API keys private.



/*
const anthropic = new Anthropic({
  // Make sure you set an environment variable in Scrimba
  // for ANTHROPIC_API_KEY
  apiKey: process.env.ANTHROPIC_API_KEY,

  dangerouslyAllowBrowser: true,
});

export async function getRecipeFromChefClaude(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ");

  const msg = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
      },
    ],
  });
  return msg.content[0].text;
}
*/


// Make sure you set an environment variable in Scrimba
// for HF_ACCESS_TOKEN

const hf = new HfInference(import.meta.env.VITE_HF_API_KEY);

export async function getRecipeFromMistral(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ");
  try {
    const response = await hf.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
        },
      ],
      max_tokens: 1024,
    });
    return response.choices[0].message.content;
  } catch (err) {
    console.error(err.message);
  }
}
