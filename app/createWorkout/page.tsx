'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

const appUrl = process.env.NEXT_PUBLIC_APP_API_URL


export default function CreateWorkoutPage() {

    // States
    const [title, setTitle] = useState('');
    const [exercises, setExercises] = useState<any[]>([])
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [errors, setErrors] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()


    return (
        <h1>Create Workout</h1>
    )
}