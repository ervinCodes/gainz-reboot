'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getToken } from '@/lib/auth'

const appUrl = process.env.NEXT_PUBLIC_APP_API_URL

interface HistoryEntry {
    date: string
    maxWeight: number
}

interface ExerciseProgress {
    exerciseName: string
    topSet: number
    dateAchieved: string
    history: HistoryEntry[]
}

interface ProgressData {
    [category: string]: ExerciseProgress[]
}

export default function Progress() {
    const [progress, setProgress] = useState<ProgressData>({})
    const [selectedExercise, setSelectedExercise] = useState<ExerciseProgress | null>(null)
    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState<string[]>([])
    const router = useRouter()

    useEffect(() => {
        async function fetchProgress() {
            try {
                const token = getToken()
                const response = await fetch(`${appUrl}/workouts/progress`, {
                    credentials: 'include',
                    headers: {
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    }
                })

                if (!response.ok) {
                    if (response.status === 401) {
                        router.push('/login')
                        return
                    }
                    throw new Error('Failed to fetch progress')
                }

                const data = await response.json()
                setProgress(data.progress)

                // Auto select first exercise
                const firstCategory = Object.keys(data.progress)[0]
                if (firstCategory && data.progress[firstCategory].length > 0) {
                    setSelectedExercise(data.progress[firstCategory][0])
                }

            } catch (error) {
                console.error('Error fetching progress:', error)
                setErrors(['Failed to load progress data.'])
            } finally {
                setLoading(false)
            }
        }
        fetchProgress()
    }, [])

    // Format date for chart x axis
    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }

    // Format chart data
    const chartData = selectedExercise?.history.map(entry => ({
        date: formatDate(entry.date),
        weight: entry.maxWeight
    })) || []

    // Calculate progress from first to last session
    const progressDiff = selectedExercise && selectedExercise.history.length > 1
        ? selectedExercise.history[selectedExercise.history.length - 1].maxWeight - selectedExercise.history[0].maxWeight
        : 0

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading...
            </div>
        )
    }

    return (
        <div className="min-h-screen text-white px-6 pt-28 pb-16 max-w-6xl mx-auto">

            {/* Header */}
            <div className="mb-8">
                <p className="text-xs tracking-widest text-gray-500 mb-1 uppercase">Performance</p>
                <h1 className="text-4xl font-bold">Progress</h1>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
                <div className="bg-red-900 border border-red-600 text-red-200 p-3 rounded-lg mb-6 text-sm">
                    {errors.map((error, index) => <p key={index}>{error}</p>)}
                </div>
            )}

            {Object.keys(progress).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <p className="text-gray-500 text-lg mb-4">No progress data yet.</p>
                    <p className="text-gray-600 text-sm">Complete some workouts to see your progress here.</p>
                </div>
            ) : (
                <div className="flex gap-6">

                    {/* Sidebar */}
                    <div className="w-64 shrink-0">
                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden sticky top-28">
                            <div className="px-4 py-3 border-b border-white/10">
                                <p className="text-xs tracking-widest text-gray-500 uppercase">Exercises</p>
                            </div>
                            <div className="max-h-[70vh] overflow-y-auto">
                                {Object.keys(progress).sort().map(category => (
                                    <div key={category}>
                                        {/* Category Header */}
                                        <div className="px-4 py-2 bg-white/5">
                                            <p className="text-xs tracking-widest text-gray-500 uppercase">{category}</p>
                                        </div>
                                        {/* Exercises in category */}
                                        {progress[category].map(exercise => (
                                            <div
                                                key={exercise.exerciseName}
                                                onClick={() => setSelectedExercise(exercise)}
                                                className={`px-4 py-3 cursor-pointer border-b border-white/5 last:border-0 transition-colors ${
                                                    selectedExercise?.exerciseName === exercise.exerciseName
                                                        ? 'bg-alloy-orange/10 border-l-2 border-l-alloy-orange'
                                                        : 'hover:bg-white/5'
                                                }`}
                                            >
                                                <p className={`text-sm ${selectedExercise?.exerciseName === exercise.exerciseName ? 'text-alloy-orange' : 'text-white'}`}>
                                                    {exercise.exerciseName}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    PR: {exercise.topSet} lbs
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    {selectedExercise && (
                        <div className="flex-1">

                            {/* Exercise Header */}
                            <div className="border border-white/10 rounded-2xl p-6 mb-4">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold">{selectedExercise.exerciseName}</h2>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {selectedExercise.history.length} session{selectedExercise.history.length !== 1 ? 's' : ''} logged
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Current PR</p>
                                        <p className="text-3xl font-bold text-alloy-orange">{selectedExercise.topSet} lbs</p>
                                    </div>
                                </div>

                                {/* Chart */}
                                {chartData.length > 1 ? (
                                    <ResponsiveContainer width="100%" height={220}>
                                        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fill: '#6b7280', fontSize: 11 }}
                                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fill: '#6b7280', fontSize: 11 }}
                                                axisLine={false}
                                                tickLine={false}
                                                domain={['auto', 'auto']}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1a1a1a',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '8px',
                                                    color: '#fff',
                                                    fontSize: '12px'
                                                }}
                                                formatter={(value) => [`${value} lbs`, 'Weight']}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="weight"
                                                stroke="#fca311"
                                                strokeWidth={2}
                                                dot={{ fill: '#fca311', r: 4 }}
                                                activeDot={{ r: 6 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[220px] flex items-center justify-center">
                                        <p className="text-gray-600 text-sm">Log this exercise at least twice to see your progress chart</p>
                                    </div>
                                )}
                            </div>

                            {/* Stat Cards */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="border border-white/10 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">Best session</p>
                                    <p className="text-2xl font-bold">{selectedExercise.topSet} lbs</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(selectedExercise.dateAchieved).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="border border-white/10 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">Total sessions</p>
                                    <p className="text-2xl font-bold">{selectedExercise.history.length}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        since {new Date(selectedExercise.history[0].date).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="border border-white/10 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">Progress</p>
                                    <p className={`text-2xl font-bold ${progressDiff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {progressDiff >= 0 ? '+' : ''}{progressDiff} lbs
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">from first session</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}