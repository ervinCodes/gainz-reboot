'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

const appUrl = process.env.NEXT_PUBLIC_APP_API_URL

export default function Navbar() {
    const [toggler, setToggler] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch(`${appUrl}/auth/profile`, {
                    credentials: 'include'
                })
                setIsLoggedIn(response.ok)
            } catch (error) {
                setIsLoggedIn(false)
            }
        }
        checkAuthStatus()
    }, [pathname])

    async function handleLogout() {
        try {
            await fetch(`${appUrl}/auth/logout`, {
                credentials: 'include'
            })
            setIsLoggedIn(false)
            router.push('/')
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }

    return (
        <nav className='fixed w-full z-50 bg-black/80 backdrop-blur border-b border-white/10'>
            <div className='max-w-6xl mx-auto flex flex-row justify-between items-center py-4 px-6 text-white'>

                {/* Logo */}
                <Link href={isLoggedIn ? '/profile' : '/'} className='text-2xl font-bold hover:text-alloy-orange transition-colors'>
                    Gainz
                </Link>

                {/* Desktop Links */}
                <div className='hidden md:flex flex-row items-center gap-6 text-sm'>
                    {isLoggedIn ? (
                        <>
                            <Link href='/myworkouts' className='text-gray-300 hover:text-white transition-colors'>
                                My Workouts
                            </Link>
                            <Link href='/createWorkout' className='text-gray-300 hover:text-white transition-colors'>
                                Create Workout
                            </Link>
                            <Link href='/profile' className='text-gray-300 hover:text-white transition-colors'>
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className='border border-red-600 text-red-400 px-4 py-1.5 rounded-full text-sm hover:bg-red-600 hover:text-white transition-colors'
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href='/login' className='text-gray-300 hover:text-white transition-colors'>
                                Login
                            </Link>
                            <Link href='/register' className='border border-alloy-orange text-alloy-orange px-4 py-1.5 rounded-full hover:bg-alloy-orange hover:text-black transition-colors'>
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setToggler(!toggler)}
                    className='md:hidden flex flex-col gap-1.5 p-2'
                >
                    <span className={`block w-6 h-0.5 bg-white transition-transform ${toggler ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-white transition-opacity ${toggler ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-white transition-transform ${toggler ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
            </div>

            {/* Mobile Menu */}
            {toggler && (
                <div className='md:hidden bg-black/95 border-t border-white/10 px-6 py-4 flex flex-col gap-4 text-sm'>
                    {isLoggedIn ? (
                        <>
                            <Link href='/myworkouts' onClick={() => setToggler(false)} className='text-gray-300 hover:text-white transition-colors'>
                                My Workouts
                            </Link>
                            <Link href='/createWorkout' onClick={() => setToggler(false)} className='text-gray-300 hover:text-white transition-colors'>
                                Create Workout
                            </Link>
                            <Link href='/profile' onClick={() => setToggler(false)} className='text-gray-300 hover:text-white transition-colors'>
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className='text-left text-red-400 hover:text-red-300 transition-colors'
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href='/login' onClick={() => setToggler(false)} className='text-gray-300 hover:text-white transition-colors'>
                                Login
                            </Link>
                            <Link href='/register' onClick={() => setToggler(false)} className='text-alloy-orange'>
                                Register
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    )
}