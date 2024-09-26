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
            "Create a highly engaging LinkedIn post summarizing the 4th IT Sales Community event held at Micro Mitti in Indore, focused on the theme 'Upsales and Upscales.' Highlight the specific strategies shared by speakers Arpit Jaiswal and Meetesh Shah around these topics, and emphasize the key takeaways from their sessions. The post should begin with a compelling hook, use clear spacing and formatting with short paragraphs or bullet points, express gratitude to the speakers, and tag IT Sales Community and Micro Mitti. Conclude with a strong call to action, such as inviting readers to share their thoughts or look forward to the next event on October 26th. The tone should be polished, professional, and crafted to encourage maximum engagement, ensuring each post is unique in phrasing and structure to attract millions of likes",
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
