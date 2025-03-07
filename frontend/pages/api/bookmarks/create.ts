import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, url, tags } = req.body;
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookmarks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.headers.authorization}`,
      },
      body: JSON.stringify({ title, url, tags, userId }),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error: unknown) {
    console.error("Error creating bookmark:", error); // Now using 'error' to avoid ESLint warning
    return res.status(500).json({ error: "Something went wrong" });
  }
}
