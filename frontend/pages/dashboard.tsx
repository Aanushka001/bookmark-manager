import { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import BookmarkForm from "../components/BookmarkForm";

// Define the expected Bookmark type
interface Bookmark {
  id: string;
  url: string;
  title: string;
}

export default function Dashboard() {
  const { user } = useUser();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]); // Add type here

  useEffect(() => {
    if (!user) return; // Only fetch bookmarks when user is logged in

    fetch(`/api/bookmarks/get?userId=${user.id}`)
      .then((res) => res.json())
      .then((data: Bookmark[]) => setBookmarks(data)); // Typecast API response
  }, [user]); // Refetch when user changes

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome, {user?.firstName}!</h1>
        <UserButton />
      </div>

      <BookmarkForm onAdd={() => window.location.reload()} />

      <ul className="w-full max-w-2xl mt-5">
        {bookmarks.map((bm) => (
          <li key={bm.id} className="border p-2 mt-2 flex justify-between">
            <a href={bm.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {bm.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
