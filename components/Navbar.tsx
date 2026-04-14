'use client'

import Link from 'next/Link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const appUrl = process.env.NEXT_PUBLIC_APP_API_URL

export default function Navbar() {
    const [toggler, setToggler] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch(`${appUrl}/profile`, {
                    credentials: 'include'
                })
                if (response.ok) {
                    setIsLoggedIn(true)
                } else {
                    setIsLoggedIn(false)
                }
            } catch (error) {
                console.error('Error checking auth status:', error)
                setIsLoggedIn(false)
            }
        }
        checkAuthStatus()
    }, [])

    return (
        <nav className='fixed w-full z-50'>
        <div className='flex flex-row w-full bg-black justify-between items-start py-4 px-2 text-white font-oxygen'>
            <div className={`flex ${toggler ? 'flex-col' : 'flex-row'} justify-start gap-5`}>
            <div className='text-3xl font-bold hover:text-alloy-orange'>
                <Link href='/'>Gainz</Link>
            </div>
            <div className={`list-none ${toggler ? 'flex' : 'hidden'} md:flex md:flex-row flex-col gap-4 justify-center items-center`}>
                <Link href={isLoggedIn ? '/profile' : '/'}>Home</Link>
                <Link href='/about'>About</Link>
            </div>
            </div>
            <div onClick={() => setToggler(!toggler)} className='md:hidden flex'>
            <i className="fa-solid fa-bars fa-2x hover:border hover:border-white p-1 rounded-xl hover:cursor-pointer"></i>
            </div>
        </div>
        </nav>
    )
}