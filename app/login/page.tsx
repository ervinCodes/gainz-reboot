'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const appUrl = process.env.NEXT_PUBLIC_APP_API_URL

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<string[]>([])
    const [submitting, setSubmitting] = useState(false)
    const router = useRouter()

    function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()

        if (email === '' || password === '') {
            setErrors(['Please fill in all fields'])
            return
        }

        setSubmitting(true)
        setErrors([])

        fetch(`${appUrl}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(res => {
            if (res.ok) {
                router.push('/profile')
            } else {
                return res.json().then(data => {
                    throw new Error(data.message || 'Login failed')
                })
            }
        })
        .catch(err => {
            setErrors([err.message || 'Login failed'])
        })
        .finally(() => {
            setSubmitting(false)
        })
    }

    return (
        <div className="min-h-screen text-white flex items-center justify-center px-6">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">Welcome back</p>
                    <h1 className="text-4xl font-bold">Log In</h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Don't have an account?{' '}
                        <Link href='/register' className="text-alloy-orange hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>

                {/* Errors */}
                {errors.length > 0 && (
                    <div className="bg-red-900 border border-red-600 text-red-200 p-3 rounded-lg mb-6 text-sm">
                        {errors.map((err, i) => <p key={i}>{err}</p>)}
                    </div>
                )}

                {/* Form */}
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-alloy-orange transition-colors"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Your password"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-alloy-orange transition-colors"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full bg-alloy-orange text-black font-bold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 mt-2 cursor-pointer"
                    >
                        {submitting ? 'Logging in...' : 'Log In'}
                    </button>
                </div>
            </div>
        </div>
    )
}