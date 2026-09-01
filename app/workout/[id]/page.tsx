'use client'

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const appUrl = process.env.NEXT_PUBLIC_APP_API_URL;

// Types
interface Set {
    _id?: string
    setNumber: number
    reps: number
    weight: number
    isChecked: boolean
}

interface LastWorkout {
    sets: { reps: number, weight: number }[]
    date: string
}

interface Exercise {
    _id: string
    name: string
    sets: Set[]
    personalRecord: number
    topSet: number
    lastWorkout: LastWorkout | null
}

interface Workout {
    _id: string
    title: string
    type: string
    exercises: Exercise[]
    createAt: string
}

export default function WorkoutPage() {
    const { id } = useParams();
    const router = useRouter();

    const [workout, setWorkout] = useState<Workout | null>(null)
    const [exercises, setExercises] = useState<Exercise[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [errors, setErrors] = useState<string[]>([])
    const [submitting, setSubmitting] = useState<boolean>(false)

    // Fetch workout
    useEffect(() => {
        async function fetchWorkout() {
            try {
                const response = await fetch(`${appUrl}/workouts/${id}`, {
                    credentials: 'include'
                });
                const data = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        router.push('/login')
                        return
                    }
                    throw new Error(data.message || 'Failed to fetch workout')
                }

                // Add default set if exercise has no sets
                const workoutWithSets = {
                    ...data.workout,
                    exercises: data.workout.exercises.map((exercise: Exercise) => ({
                        ...exercise,
                        sets: exercise.sets.length > 0 ? exercise.sets : [
                            { setNumber: 1, reps: 0, weight: 0, isChecked: false }
                        ]
                    }))
                }

                setWorkout(workoutWithSets)
                setExercises(workoutWithSets.exercises)

            } catch (error) {
                console.error('Error fetching workout:', error)
                setErrors(['Failed to load workout.'])
            } finally {
                setLoading(false)
            }
        }
        fetchWorkout()
    }, [])

    // Update a specific set field
    function updateSet(exerciseIndex: number, setIndex: number, field: keyof Set, value: number | boolean) {
        const updated = [...exercises]
        updated[exerciseIndex].sets[setIndex] = {
            ...updated[exerciseIndex].sets[setIndex],
            [field]: value
        }
        setExercises(updated)
    }

    // Add a new set to an exercise
    function addSet(exerciseIndex: number) {
        const updated = [...exercises]
        const currentSets = updated[exerciseIndex].sets
        updated[exerciseIndex].sets = [
            ...currentSets,
            {
                setNumber: currentSets.length + 1,
                reps: 0,
                weight: 0,
                isChecked: false
            }
        ]
        setExercises(updated)
    }

    // Remove a set from an exercise
    function removeSet(exerciseIndex: number, setIndex: number) {
        const updated = [...exercises]
        updated[exerciseIndex].sets.splice(setIndex, 1)
        // Renumber sets
        updated[exerciseIndex].sets = updated[exerciseIndex].sets.map((set, i) => ({
            ...set,
            setNumber: i + 1
        }))
        setExercises(updated)
    }

    // Submit workout
    async function handleSubmit() {
        setSubmitting(true)
        try {
            const response = await fetch(`${appUrl}/workouts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    exercises,
                    type: workout?.type
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || 'Failed to update workout')
            }

            router.push('/myworkouts')

        } catch (error) {
            console.error('Error submitting workout:', error)
            if (error instanceof Error) {
                setErrors([error.message])
            }
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <p className="text-gray-400">Loading workout...</p>
            </div>
        )
    }

    if (!workout) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <p className="text-gray-400">Workout not found.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen text-white px-6 pt-28 pb-32 max-w-3xl mx-auto">

            {/* Header */}
            <div className="mb-8">
                <p className="text-xs tracking-widest text-gray-500 mb-1 uppercase">
                    {new Date(workout.createAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                    })}
                </p>
                <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-bold">{workout.title}</h1>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        workout.type === 'strength'
                            ? 'bg-blue-900 text-blue-300 border border-blue-700'
                            : 'bg-emerald-900 text-emerald-300 border border-emerald-700'
                    }`}>
                        {workout.type}
                    </span>
                </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
                <div className="bg-red-900 border border-red-600 text-red-200 p-3 rounded-lg mb-6 text-sm">
                    {errors.map((error, index) => <p key={index}>{error}</p>)}
                </div>
            )}

            {/* Exercise Cards */}
            <div className="space-y-6">
                {exercises.map((exercise, exerciseIndex) => (
                    <div key={exercise._id} className="border border-white/10 rounded-2xl p-5">

                        {/* Exercise Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-lg font-semibold">{exercise.name}</h2>
                                <p className="text-xs text-alloy-orange mt-1">
                                    PR: {exercise.topSet ?? exercise.personalRecord} lbs
                                </p>
                            </div>
                            {exercise.lastWorkout && (
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 mb-1">Last session</p>
                                    {exercise.lastWorkout.sets.map((s, i) => (
                                        <p key={i} className="text-xs text-gray-400">
                                            {s.reps} reps @ {s.weight} lbs
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Set Headers */}
                        <div className="grid grid-cols-5 gap-2 mb-2 text-xs text-gray-500 px-1">
                            <span>Set</span>
                            <span>Previous</span>
                            <span>Reps</span>
                            <span>Weight</span>
                            <span className="text-center">Done</span>
                        </div>

                        {/* Sets */}
                        <div className="space-y-2">
                            {exercise.sets.map((set, setIndex) => {
                                const lastSet = exercise.lastWorkout?.sets[setIndex]
                                return (
                                    <div key={setIndex} className={`grid grid-cols-5 gap-2 items-center px-1 py-1 rounded-lg transition-colors ${set.isChecked ? 'bg-white/5' : ''}`}>
                                        {/* Set Number */}
                                        <span className="text-sm text-gray-400">{set.setNumber}</span>

                                        {/* Previous */}
                                        <span className="text-xs text-gray-600">
                                            {lastSet ? `${lastSet.reps}x${lastSet.weight}` : '—'}
                                        </span>

                                        {/* Reps Input */}
                                        <input
                                            type="number"
                                            value={set.reps || ''}
                                            onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', Number(e.target.value))}
                                            placeholder="0"
                                            className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-sm text-center w-full focus:outline-none focus:border-alloy-orange"
                                        />

                                        {/* Weight Input */}
                                        <input
                                            type="number"
                                            value={set.weight || ''}
                                            onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', Number(e.target.value))}
                                            placeholder="0"
                                            className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-sm text-center w-full focus:outline-none focus:border-alloy-orange"
                                        />

                                        {/* Checkbox */}
                                        <div className="flex justify-center items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={set.isChecked}
                                                onChange={(e) => updateSet(exerciseIndex, setIndex, 'isChecked', e.target.checked)}
                                                className="accent-alloy-orange w-4 h-4 cursor-pointer"
                                            />
                                            {exercise.sets.length > 1 && (
                                                <button
                                                    onClick={() => removeSet(exerciseIndex, setIndex)}
                                                    className="text-gray-600 hover:text-red-400 text-xs transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Add Set */}
                        <button
                            onClick={() => addSet(exerciseIndex)}
                            className="mt-4 w-full text-sm text-gray-500 hover:text-alloy-orange border border-dashed border-white/10 hover:border-alloy-orange rounded-lg py-2 transition-colors"
                        >
                            + Add Set
                        </button>
                    </div>
                ))}
            </div>

            {/* Finish Workout — fixed at bottom */}
            <div className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-black/80 backdrop-blur border-t border-white/10">
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full bg-alloy-orange text-black font-bold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {submitting ? 'Saving...' : 'Finish Workout'}
                    </button>
                </div>
            </div>
        </div>
    )
}