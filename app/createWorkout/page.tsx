'use client'

import { useState } from "react";
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
        name: string
        sets: Set[]
    }

    interface SearchResult {
        exerciseId: string
        name: string
        bodyParts: string[]
        equipments: string[]
    }


export default function CreateWorkout() {

    // States
    const [title, setTitle] = useState<string>('');
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [errors, setErrors] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const router = useRouter();

    // Function to search for exercises
    async function searchExercises() {
        // Variable to hold search input
        let searchInput = searchTerm.trim();

        // Fetch the search result from the API
        fetch(`${appUrl}/exercises/search?name=${searchInput}`, {
            credentials: 'include'
        })
        // Handle the response and update the searchResults state
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();
        })
        .then((data) => {
            console.log(data.data)
            setSearchResults(data.data);
        })
        .catch((error) => {
            console.error('Error searching exercises:', error)
            if (error instanceof Error) {
                setErrors([error.message])
            } else {
                setErrors(['An unknown error occurred'])
            }
        })
    }

    // Function to add exercise from search
    function addExerciseFromSearch(exercise: SearchResult) {
        // Add exercise from search to the exercises state with default sets
        const newExercise = {
            name: exercise.name,
            sets: []
        }

        // Add newExercise to the exercises state
        setExercises([...exercises, newExercise]); 
        setSearchResults([]); // Clear search results after adding exercise
        setSearchTerm(''); // Clear search term after adding exercise

        console.log('Added exercises:', newExercise)
    }

    // Function to remove exercise from exercises state
    function removeExercise(index: number) {
        const updateExercises = [...exercises]

        updateExercises.splice(index, 1)
        setExercises(updateExercises)
    }

    // Function to submit workout
    async function handleSubmit() {
        //Validate that title and exercises array are not empty before making the API call
        if(title.trim() !== '' && exercises.length > 0) {
            try {
                // Make an API call to create a new workout
                fetch(`${appUrl}/workouts/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        title: title,
                        exercises: exercises
                    })
                })
                .then((response) => {
                    if (!response.ok) {
                        return response.json().then(data => {
                            console.log('Backend error:', data)  
                            throw new Error(data.message || 'Network response was not ok')
                        })
                    }
                    return response.json()
                })
                .then((data) => {
                    router.push('/myWorkouts')
                })
            } catch (error) {
                console.error('Error creating workout:', error);
                if (error instanceof Error) {
                    setErrors([error.message])
                } else {
                    setErrors(['An unknown error occurred']);
                }
            }
        } else {
            setErrors(['Please fill in all fields and add at least one exercise']);
        }
    }

    // If the response is successful, redirect the user to the workout page
    // If the response is not successful, display the error message to the user


    return (
        <div className="flex flex-col justify-center items-center space-y-4 mt-32 text-white relative">
            {/* Display error messages */}
            {errors.length > 0 && (
                <div className="bg-red-500 text-white p-2 rounded">
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}
            <input
                type="text"
                placeholder="Workout Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white border border-black px-3 py-2 rounded text-center text-black w-80"/>

            <div className="flex flex-row justify-center items-center space-x-2">
                {/* Input Box for Search */}
                <input
                type="search"
                placeholder="Search for exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        searchExercises()
                    }
                }}
                className="bg-white border border-black px-3 py-2 rounded text-center text-black"/>
                {/* Search Button */}
                <button onClick={searchExercises} type="submit" className="border border-alloy-orange rounded-2xl px-4 py-2 hover:bg-alloy-orange">SEARCH</button>

                { searchResults.length > 0 && (
                    <div className="absolute top-28 bg-black border border-white rounded-lg p-2 w-80 max-h-60 overflow-y-auto z-10 cursor-pointer">
                        {searchResults.map((exercise, index) => (
                            <div key={index} className="flex flex-col justify-center space-y-2 hover:bg-gray-800 py-1 px-1" onClick={() => addExerciseFromSearch(exercise)}>{exercise.name}</div>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-center items-center space-y-2">
                { exercises.map((exercise, index) => (
                    <div key={index} className="flex flex-row justify-center items-center space-x-2">
                        <div className="flex flex-row justify-center items-center space-x-2 border border-white rounded-lg p-2 w-80">
                            <div>{index + 1}.</div>
                            <div>{exercise.name}</div>
                        </div>
                        <div className="cursor-pointer" onClick={() => removeExercise(index)}>x</div>
                    </div>
                ))  
                }
            </div>
            <button onClick={handleSubmit} className="border border-alloy-orange rounded-2xl px-4 py-2 hover:bg-alloy-orange">CREATE WORKOUT</button>
        </div>
    )
}