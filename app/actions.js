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
            "After scanning the QR code, automatically redirect the user to LinkedIn with the following message pre-filled in the post box: Excited to be attending the 4th #ITSalesCommunity event in Indore at #MicroMitti! Looking forward to insightful discussions on Upsells and Upskills and networking with industry leaders"
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
