'use client'

import { useEffect, useState } from "react";
import { useRouter} from "next/navigation";
import Link from 'next/link'

const appUrl = process.env.NEXT_PUBLIC_APP_API_URL;

export default function Profile() {
  const router = useRouter();

  // States for username and email
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null >(null);
  const [loading, setLoading] = useState(true);

  // fetches data from the server with credentials and retrieves username and email
  useEffect(() => {
    fetch(`${appUrl}/auth/profile`, {
      credentials: "include", // Ensures cookies are sent with the request
    })
      .then((res) => {
        if (res.redirected) {
          throw new Error("Redirected");
        }
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setUserName(data.userName);
        setEmail(data.email);
        setLoading(false); // fetching data completed
      })
      .catch((error) => {
        setError(error.message);
        console.error("Error fetching profile data:", error);
        router.push("/login");
      });
  }, [router]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && (email === "" || userName === "")) {
      router.push("/login");
    }
  }, [loading, email, userName, router]);

  // Logout
  async function handleLogout() {
    await fetch(`${appUrl}/auth/logout`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        router.push("/"); // Redirect to home after successful logout
      })
      .catch((err) => console.error(err));
  }

  // Loading message
  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center h-full gap-5">
      {/* Error message */}
      {error && <div className="text-red-600 font-bold">{error}</div>}

      <div className="text-white">Welcome {userName}!</div>

      <Link href='/createWorkout' className="text-white border border-alloy-orange rounded-2xl px-4 py-2 hover:text-alloy-orange">Create a Workout</Link>
      <Link href='/myWorkouts' className="text-white border border-alloy-orange rounded-2xl px-4 py-2 hover:text-alloy-orange">My Workouts</Link>
      {/* <div className="text-white">Diary</div> */}

      {/* Logout */}
      <div className="mt-2">
        <a
          onClick={handleLogout}
          className="p-3 rounded-2xl bg-red-600 hover:cursor-pointer"
        >
          Logout
        </a>
      </div>
    </div>
  );
}
