import Image from "next/image";
import styles from "./page.module.css";
import React from 'react';
import Link from 'next/link';


export default function Home() {
    return (

        <div className='w-full h-full flex flex-col justify-around text-white items-center md:py-16 sm:py-28 xs:py-16'>
            <div className='flex flex-col items-center gap-6'>
                <div className='lg:text-5xl text-4xl font-semibold text-center'>
                    Simplify your fitness goals
                </div>
                <div>
                    <Link href='/signup' className='pr-3 hover:text-alloy-orange'>
                        REGISTER
                    </Link>
                    <Link href='/login' className='border border-alloy-orange rounded-2xl px-4 py-2 hover:text-alloy-orange'>
                        LOGIN 
                    </Link>
                </div>
            </div>

            <div className='flex md:flex-row flex-col md:gap-32 sm:gap-20 gap-10 text-center px-10 py-16 md:py-0'>
                    <div className="flex flex-col items-center">
                        <i className="fa-regular fa-circle-check fa-4x text-white"></i>
                        <div className='text-xl'>Keep <span className='text-alloy-orange font-bold'>track</span> of your personal bests</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <i className="fa-regular fa-rectangle-list fa-4x"></i>
                        <div className='text-xl'>Keep <span className='text-alloy-orange font-bold'>inventory</span> of all your workouts</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <i className="fa-regular fa-comment fa-4x"></i>
                        <div className='text-xl'>Share wins with the <span className='text-alloy-orange font-bold'>community</span></div>
                    </div>
                </div>
            
        </div>

    )
}