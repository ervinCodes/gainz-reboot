'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const appUrl = process.env.NEXT_PUBLIC_APP_API_URL;

interface Set {
    setNumber: number
    reps: number
    weight: number
    isChecked: boolean
}

interface Exercise {
    _id: string
    name: string
    sets: Set[]
    personalRecord: number
    topSet: number
}

interface Workouts {
    _id: string
    title: string
    createAt: string
    exercises: Exercise[]
    type: string
}

export default function MyWorkouts() {
    const [workouts, setWorkouts] = useState<Workouts[]>([])
    const [errors, setErrors] = useState<string[]>([])
    const router = useRouter();

    async function deleteWorkout(id: string) {
        try {
            const response = await fetch(`${appUrl}/workouts/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (response.ok) {
                setWorkouts(workouts.filter(w => w._id !== id))
            }
        } catch (error) {
            console.error('Error deleting workout:', error)
        }
    }

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
                setWorkouts(data.workouts)
            } catch (error) {
                console.error("Error fetching workouts:", error);
                setErrors(["Failed to fetch workouts."]);
            }
        }
        fetchWorkouts();
    }, []);

    return (
        <div className="min-h-screen text-white px-6 pt-28 pb-16 max-w-3xl mx-auto">

            {/* Page Header */}
            <div className="mb-10">
                <p className="text-xs tracking-widest text-gray-500 mb-1 uppercase">Training Log</p>
                <h1 className="text-4xl font-bold">My Workouts</h1>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
                <div className="bg-red-900 border border-red-600 text-red-200 p-3 rounded-lg mb-6 text-sm">
                    {errors.map((error, index) => <p key={index}>{error}</p>)}
                </div>
            )}

            {/* Empty state */}
            {workouts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <p className="text-gray-500 text-lg mb-4">No workouts yet.</p>
                    <Link href="/createWorkout" className="border border-alloy-orange text-alloy-orange px-5 py-2 rounded-full text-sm hover:bg-alloy-orange hover:text-black transition-colors">
                        Create your first workout
                    </Link>
                </div>
            )}

            {/* Workout List */}
            <ul className="space-y-4">
                {workouts.map(workout => (
                    <li key={workout._id}>
                        <Link href={`/workout/${workout._id}`}>
                            <div className="border border-white/10 rounded-2xl p-5 hover:border-alloy-orange transition-colors cursor-pointer group">

                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-xl font-semibold group-hover:text-alloy-orange transition-colors">
                                            {workout.title}
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            {new Date(workout.createAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                            workout.type === 'strength'
                                                ? 'bg-blue-900 text-blue-300 border border-blue-700'
                                                : 'bg-emerald-900 text-emerald-300 border border-emerald-700'
                                        }`}>
                                            {workout.type}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                deleteWorkout(workout._id)
                                            }}
                                            className="text-gray-600 hover:text-red-400 transition-colors text-lg"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-white/10 mb-4" />

                                {/* Exercise List */}
                                <div className="space-y-2">
                                    {workout.exercises.map(exercise => (
                                        <div key={exercise._id} className="flex justify-between items-center">
                                            <p className="text-sm text-gray-300">{exercise.name}</p>
                                            <p className="text-sm text-alloy-orange font-medium">
                                                {exercise.topSet ?? exercise.personalRecord} lbs
                                            </p>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Add workout button */}
            {workouts.length > 0 && (
                <div className="mt-8 flex justify-center">
                    <Link href="/createWorkout" className="border border-alloy-orange text-alloy-orange px-6 py-2 rounded-full text-sm hover:bg-alloy-orange hover:text-black transition-colors">
                        + New Workout
                    </Link>
                </div>
            )}
        </div>
    );
}