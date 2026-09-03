'use client'

import Link from 'next/link';


export default function Home() {
    return (
        <div className="min-h-screen text-white flex flex-col">

            {/* Hero Section */}
            <section className="flex-1 flex flex-col justify-center items-center text-center px-6 pt-32 pb-20">
                <p className="text-xs tracking-widest text-gray-500 uppercase mb-4">
                    Built for athletes
                </p>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 max-w-3xl">
                    Train smarter.<br />
                    <span className="text-alloy-orange">Track everything.</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-md mb-10">
                    Log your workouts, track personal records, and see exactly how far you've come.
                </p>
                <div className="flex flex-row gap-4">
                    <Link
                        href='/register'
                        className="bg-alloy-orange text-black font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
                    >
                        Get Started
                    </Link>
                    <Link
                        href='/login'
                        className="border border-white/20 text-white px-8 py-3 rounded-full hover:border-white transition-colors"
                    >
                        Log In
                    </Link>
                </div>
            </section>

            {/* Divider */}
            <div className="border-t border-white/10 mx-6" />

            {/* Features Section */}
            <section className="px-6 py-20 max-w-5xl mx-auto w-full">
                <p className="text-xs tracking-widest text-gray-500 uppercase mb-12 text-center">
                    What you get
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Feature 1 */}
                    <div className="border border-white/10 rounded-2xl p-6 hover:border-alloy-orange transition-colors group">
                        <div className="text-3xl mb-4">🏆</div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-alloy-orange transition-colors">
                            Personal Records
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Every top set is tracked automatically. Know your best for every exercise, every time you train.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="border border-white/10 rounded-2xl p-6 hover:border-alloy-orange transition-colors group">
                        <div className="text-3xl mb-4">📋</div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-alloy-orange transition-colors">
                            Workout History
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Every session logged and organized. See what you lifted last time and beat it this time.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="border border-white/10 rounded-2xl p-6 hover:border-alloy-orange transition-colors group">
                        <div className="text-3xl mb-4">⚡</div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-alloy-orange transition-colors">
                            Strength & Hypertrophy
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Tag each exercise as strength or hypertrophy. Track your last session per training style.
                        </p>
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="border-t border-white/10 mx-6" />

            {/* Bottom CTA */}
            <section className="px-6 py-20 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to start tracking?
                </h2>
                <p className="text-gray-500 text-sm mb-8">
                    Free to use. No credit card required.
                </p>
                <Link
                    href='/register'
                    className="bg-alloy-orange text-black font-bold px-10 py-3 rounded-full hover:opacity-90 transition-opacity"
                >
                    Create Your Account
                </Link>
            </section>

        </div>
    )
}