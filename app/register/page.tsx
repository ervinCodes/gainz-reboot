'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const appUrl = process.env.NEXT_PUBLIC_APP_API_URL

export default function Signup() {
    const [email, setEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [errors, setErrors] = useState<string[]>([])
    const [submitting, setSubmitting] = useState(false)
    const router = useRouter()

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        let temp: string[] = []

        if (email === '' || userName === '' || password === '' || confirm === '') {
            temp.push('Please fill in all fields')
            setErrors(temp)
            return
        }

        if (password !== confirm) {
            temp.push('Passwords do not match')
            setErrors(temp)
            return
        }

        setSubmitting(true)
        setErrors([])

        fetch(`${appUrl}/auth/signup`, {
            method: 'POST',
            body: JSON.stringify({ email, userName, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(res => {
            if (res.ok) {
                router.push('/profile')
            } else {
                return res.json().then(data => {
                    throw new Error(data.message || 'Signup failed')
                })
            }
        })
        .catch(err => {
            setErrors([err.message || 'Signup failed'])
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
                    <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">Welcome</p>
                    <h1 className="text-4xl font-bold">Create Account</h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Already have an account?{' '}
                        <Link href='/login' className="text-alloy-orange hover:underline">
                            Log in
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
                            Username
                        </label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="e.g. ironlifter"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-alloy-orange transition-colors"
                        />
                    </div>

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
                            placeholder="Min. 8 characters"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-alloy-orange transition-colors"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="Repeat your password"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-alloy-orange transition-colors"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full bg-alloy-orange text-black font-bold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
                    >
                        {submitting ? 'Creating account...' : 'Create Account'}
                    </button>
                </div>
            </div>
        </div>
    )
}