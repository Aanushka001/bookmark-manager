import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.body;
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookmarks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${req.headers.authorization}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.message || "Failed to delete bookmark" });
    }

    return res.status(200).json({ message: "Bookmark deleted" });
  } catch (error: unknown) {
    console.error("Error deleting bookmark:", error);
    return res.status(500).json({ error: "Failed to delete bookmark" });
  }
}
