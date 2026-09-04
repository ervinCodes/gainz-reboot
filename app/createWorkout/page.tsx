'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

const appUrl = process.env.NEXT_PUBLIC_APP_API_URL;

interface Set {
    setNumber: number
    reps: number
    weight: number
    isChecked: boolean
}

interface Exercise {
    name: string
    type: string
    sets: Set[]
}

interface SearchResult {
    exerciseId: string
    name: string
    bodyParts: string[]
    equipments: string[]
    isCustom?: boolean
}

export default function CreateWorkout() {

    const [title, setTitle] = useState<string>('');
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [errors, setErrors] = useState<string[]>([])
    const [addingCustom, setAddingCustom] = useState<boolean>(false)
    const router = useRouter();

    async function searchExercises() {
        const searchInput = searchTerm.trim();
        if (!searchInput) return

        fetch(`${appUrl}/exercises/search?name=${searchInput}`, {
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            setSearchResults(data.data || []);
        })
        .catch(error => {
            if (error instanceof Error) {
                setErrors([error.message])
            } else {
                setErrors(['An unknown error occurred'])
            }
        })
    }

    async function addCustomExercise() {
        if (!searchTerm.trim()) return

        setAddingCustom(true)
        try {
            const response = await fetch(`${appUrl}/exercises/custom`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: searchTerm.trim() })
            })

            const data = await response.json()

            if (response.status === 409) {
                // Already exists — just add it to the workout
                addExerciseFromSearch({
                    exerciseId: 'custom',
                    name: searchTerm.trim(),
                    bodyParts: ['Custom'],
                    equipments: [],
                    isCustom: true
                })
                return
            }

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add custom exercise')
            }

            // Add to workout
            addExerciseFromSearch({
                exerciseId: data.exercise._id,
                name: data.exercise.name,
                bodyParts: [data.exercise.category],
                equipments: [],
                isCustom: true
            })

        } catch (error) {
            if (error instanceof Error) {
                setErrors([error.message])
            }
        } finally {
            setAddingCustom(false)
        }
    }

    function addExerciseFromSearch(exercise: SearchResult) {
        const newExercise: Exercise = {
            name: exercise.name,
            type: 'strength',
            sets: []
        }
        setExercises([...exercises, newExercise]);
        setSearchResults([]);
        setSearchTerm('');
    }

    function toggleExerciseType(index: number) {
        const updated = [...exercises]
        updated[index].type = updated[index].type === 'strength' ? 'hypertrophy' : 'strength'
        setExercises(updated)
    }

    function removeExercise(index: number) {
        const updated = [...exercises]
        updated.splice(index, 1)
        setExercises(updated)
    }

    async function handleSubmit() {
        if (title.trim() === '' || exercises.length === 0) {
            setErrors(['Please add a title and at least one exercise']);
            return
        }

        try {
            fetch(`${appUrl}/workouts/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ title, exercises })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Failed to create workout')
                    })
                }
                return response.json()
            })
            .then(() => {
                router.push('/myworkouts')
            })
        } catch (error) {
            if (error instanceof Error) {
                setErrors([error.message])
            } else {
                setErrors(['An unknown error occurred'])
            }
        }
    }

    return (
        <div className="min-h-screen text-white px-6 pt-28 pb-32 max-w-3xl mx-auto">

            {/* Header */}
            <div className="mb-10">
                <p className="text-xs tracking-widest text-gray-500 mb-1 uppercase">New Session</p>
                <h1 className="text-4xl font-bold">Create Workout</h1>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
                <div className="bg-red-900 border border-red-600 text-red-200 p-3 rounded-lg mb-6 text-sm">
                    {errors.map((error, index) => <p key={index}>{error}</p>)}
                </div>
            )}

            {/* Title Input */}
            <div className="mb-6">
                <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">Workout Title</label>
                <input
                    type="text"
                    placeholder="e.g. Push Day, Upper Body..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-alloy-orange transition-colors"
                />
            </div>

            {/* Search */}
            <div className="mb-8 relative">
                <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">Add Exercises</label>
                <div className="flex gap-2">
                    <input
                        type="search"
                        placeholder="Search exercises..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') searchExercises() }}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-alloy-orange transition-colors"
                    />
                    <button
                        onClick={searchExercises}
                        className="border border-alloy-orange text-alloy-orange px-5 py-3 rounded-xl hover:bg-alloy-orange hover:text-black transition-colors text-sm font-medium"
                    >
                        Search
                    </button>
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                    <div className="absolute top-full mt-2 left-0 right-0 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden z-10 shadow-xl">
                        <div className="max-h-60 overflow-y-auto">
                            {searchResults.map((exercise, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 text-sm transition-colors flex justify-between items-center"
                                    onClick={() => addExerciseFromSearch(exercise)}
                                >
                                    <div>
                                        <p className="text-white">{exercise.name}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {exercise.bodyParts?.join(', ')}
                                        </p>
                                    </div>
                                    {exercise.isCustom && (
                                        <span className="text-xs text-alloy-orange border border-alloy-orange px-2 py-0.5 rounded-full">
                                            custom
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add custom exercise option */}
                        {searchTerm.trim() && (
                            <div
                                onClick={addingCustom ? undefined : addCustomExercise}
                                className="px-4 py-3 border-t border-white/10 flex items-center gap-2 cursor-pointer hover:bg-white/5 transition-colors"
                            >
                                <span className="text-alloy-orange text-lg">+</span>
                                <div>
                                    <p className="text-sm text-alloy-orange">
                                        {addingCustom ? 'Adding...' : `Add "${searchTerm.trim()}" as custom exercise`}
                                    </p>
                                    <p className="text-xs text-gray-500">Saved for future workouts</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Show add custom option even when no results */}
                {searchResults.length === 0 && searchTerm.trim() && (
                    <div className="absolute top-full mt-2 left-0 right-0 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden z-10 shadow-xl">
                        <div
                            onClick={addingCustom ? undefined : addCustomExercise}
                            className="px-4 py-3 flex items-center gap-2 cursor-pointer hover:bg-white/5 transition-colors"
                        >
                            <span className="text-alloy-orange text-lg">+</span>
                            <div>
                                <p className="text-sm text-alloy-orange">
                                    {addingCustom ? 'Adding...' : `Add "${searchTerm.trim()}" as custom exercise`}
                                </p>
                                <p className="text-xs text-gray-500">Not in database? Save it for future workouts</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Exercise List */}
            {exercises.length > 0 && (
                <div className="mb-8">
                    <label className="text-xs text-gray-500 uppercase tracking-widest mb-3 block">
                        Exercises — {exercises.length} added
                    </label>
                    <div className="space-y-3">
                        {exercises.map((exercise, index) => (
                            <div key={index} className="border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-600 text-sm w-5">{index + 1}.</span>
                                    <span className="text-sm text-white">{exercise.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => toggleExerciseType(index)}
                                        className={`text-xs px-3 py-1 rounded-full font-medium border transition-colors ${
                                            exercise.type === 'strength'
                                                ? 'bg-blue-900 text-blue-300 border-blue-700'
                                                : 'bg-emerald-900 text-emerald-300 border-emerald-700'
                                        }`}
                                    >
                                        {exercise.type}
                                    </button>
                                    <button
                                        onClick={() => removeExercise(index)}
                                        className="text-gray-600 hover:text-red-400 transition-colors text-lg"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {exercises.length === 0 && (
                <div className="border border-dashed border-white/10 rounded-xl py-12 text-center mb-8">
                    <p className="text-gray-600 text-sm">Search for exercises to add them here</p>
                </div>
            )}

            {/* Submit — fixed at bottom */}
            <div className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-black/80 backdrop-blur border-t border-white/10">
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-alloy-orange text-black font-bold py-3 rounded-full hover:opacity-90 transition-opacity"
                    >
                        Create Workout
                    </button>
                </div>
            </div>
        </div>
    )
}