'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const appUrl = process.env.NEXT_PUBLIC_APP_API_URL;

// Types
interface Set {
    setNumber: number
    reps: number
    weight: number
    isChecked: boolean
}

interface Exercise {
    _id: number
    name: string
    sets: Set[]
    personalRecord: number
}

interface Workouts {
    _id: number
    title: string
    createdAt: string,
    exercises: Exercise[]
    type: string
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
                if (!response.ok) {
                    if (response.status === 401) {
                        router.push("/login");
                        return;
                    }
                    throw new Error(data.message || 'Network response was not ok');
                }
                console.log('Server Data:', data);
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
            <div className="text-white py-5 text-4xl">
                my <span className="text-alloy-orange">workouts</span>
            </div>
            {errors.length > 0 && (
                <div className="alert alert-danger">
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}
            <ul className="w-full">
                {workouts.map(workout => (
                    <li key={workout._id} className="w-full flex justify-center items-center flex-col">
                        
                        {/* Workout Title */}
                        <h2>{workout.title}</h2>
                        <p>{new Date(workout.createdAt).toLocaleDateString('en-US')}</p>
                        <p>Type: {workout.type}</p>

                        {workout.exercises.map(exercise => (
                            <div key={exercise._id}>
                                <h3>{exercise.name}</h3>
                                <p>Personal Record: {exercise.personalRecord}</p>
                            </div>
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    );
}