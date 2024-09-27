"use server";

import { revalidateTag } from "next/cache";

export async function generatePost(answers) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Use environment variable for API key
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Generate a social media post announcing excitement for attending an upcoming IT Sales Community event in Indore at MicroMitti. The post should include an enthusiastic tone, mention the event being the 4th of its kind, highlight anticipation for discussions on Upsells and Upskills, and express eagerness to network with industry leaders. Use hashtags #ITSalesCommunity and #MicroMitti, and include a relevant emoji to enhance engagement"
        },
        {
          role: "user",
          content: answers,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate post");
  }

  const data = await response.json();

  revalidateTag("posts"); // Optional: revalidate cache if needed
  return data.choices[0].message.content; // Adjust based on your API response structure
}
