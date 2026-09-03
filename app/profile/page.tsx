'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link'

const appUrl = process.env.NEXT_PUBLIC_APP_API_URL;

export default function Profile() {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${appUrl}/auth/profile`, {
            credentials: "include",
        })
        .then((res) => {
            if (!res.ok) throw new Error("Unauthorized");
            return res.json();
        })
        .then((data) => {
            setUserName(data.user.userName);
            setEmail(data.user.email);
            setLoading(false);
            console.log("Profile data fetched successfully:", data.user.userName, data.user.email);
        })
        .catch((error) => {
            setError(error.message);
            router.push("/login");
        });
    }, [router]);

    useEffect(() => {
        if (!loading && (email === "" || userName === "")) {
            router.push("/login");
        }
    }, [loading, email, userName, router]);

    async function handleLogout() {
        await fetch(`${appUrl}/auth/logout`, {
            credentials: "include",
        })
        router.push("/");
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white px-6 pt-28 pb-16 max-w-3xl mx-auto">

            {/* Header */}
            <div className="mb-10">
                <p className="text-xs tracking-widest text-gray-500 mb-1 uppercase">Account</p>
                <h1 className="text-4xl font-bold">{userName}</h1>
                <p className="text-gray-500 mt-1 text-sm">{email}</p>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-900 border border-red-600 text-red-200 p-3 rounded-lg mb-6 text-sm">
                    {error}
                </div>
            )}

            {/* Quick Actions */}
            <div className="mb-10">
                <p className="text-xs tracking-widest text-gray-500 mb-4 uppercase">Quick Actions</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Create Workout */}
                    <Link href='/createWorkout'>
                        <div className="border border-white/10 rounded-2xl p-6 hover:border-alloy-orange transition-colors cursor-pointer group">
                            <div className="text-2xl mb-3">💪</div>
                            <h2 className="text-lg font-semibold group-hover:text-alloy-orange transition-colors">
                                Create Workout
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Plan and log a new training session
                            </p>
                        </div>
                    </Link>

                    {/* My Workouts */}
                    <Link href='/myWorkouts'>
                        <div className="border border-white/10 rounded-2xl p-6 hover:border-alloy-orange transition-colors cursor-pointer group">
                            <div className="text-2xl mb-3">📋</div>
                            <h2 className="text-lg font-semibold group-hover:text-alloy-orange transition-colors">
                                My Workouts
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                View your training history and PRs
                            </p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 mb-8" />

            {/* Account Info */}
            <div className="mb-10">
                <p className="text-xs tracking-widest text-gray-500 mb-4 uppercase">Account Info</p>
                <div className="border border-white/10 rounded-2xl divide-y divide-white/10">
                    <div className="flex justify-between items-center px-5 py-4">
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="text-sm text-white">{userName}</p>
                    </div>
                    <div className="flex justify-between items-center px-5 py-4">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-sm text-white">{email}</p>
                    </div>
                </div>
            </div>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="w-full border border-red-600 text-red-400 py-3 rounded-full text-sm font-medium hover:bg-red-600 hover:text-white transition-colors"
            >
                Log Out
            </button>
        </div>
    );
}