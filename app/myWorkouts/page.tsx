'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const appUrl = process.env.NEXT_PUBLIC_APP_API_URL;

interface Workouts {
    id: number
    title: string
    created_at: string
}

export default function MyWorkouts() {

    // States
    const [workouts, setWorkouts] = useState<Workouts[]>([])
    const [errors, setErrors] = useState<string[]>([])

    const router = useRouter();

    // Fetch workouts from the server
    useEffect(() => {
        async function fetchWorkouts() {
            try {
                const response = await fetch(`${appUrl}/workouts`, {
                    credentials: 'include'
                });
                const data = await response.json();
                console.log(data)
                if (!response.ok) {
                    if (response.status === 401) {
                        router.push("/login");
                        return;
                    }
                    throw new Error(data.message || 'Network response was not ok');
                }
                setWorkouts(data.workouts)

            } catch (error) {
                console.error("Error fetching workouts:", error);
                setErrors(["Failed to fetch workouts."]);
            }
        }
        fetchWorkouts();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center space-y-4 mt-32 text-white relative">
            <h1>My Workouts</h1>
            {errors.length > 0 && (
                <div className="alert alert-danger">
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}
            <ul>
                {workouts.map(workout => (
                    <li key={workout.id}>
                        <h2>{workout.title}</h2>
                        <p>{new Date(workout.created_at).toLocaleDateString('en-US')}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}