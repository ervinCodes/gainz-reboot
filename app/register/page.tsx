'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation';

const appUrl = process.env.NEXT_PUBLIC_APP_API_URL // variable created from the .env file

const Signup = () => {
    // States for registration
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    // Error states
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    // Navigation
    let router = useRouter()

    // Handlers for input changes
    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handleUserName = (e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value);
    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
    const handleConfirm = (e: React.ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value);

    // Form submit
    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        let temp: string[] = []

        if(email === '' || userName === '' || password === '' || confirm === '') {
            temp.push('Please fill in all fields')
        }else if(password !== confirm){
            temp.push('Password fields do not match')
        } else {
            setSubmitted(true);
            setErrors([]);

            fetch(`${appUrl}/auth/signup`, {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    userName: userName,
                    password: password
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include' // Ensures cookies are sent with the request
            })
                .then(res => {
                    if(res.ok) {
                        router.push('/profile')
                    } else {
                        return res.json().then(data => {
                            throw new Error(data.message || 'Signup failed')
                        })
                    }
                })
                .catch(err => {
                    console.error(err);
                    temp.push(err.message || 'Signup failed');
                    setErrors(temp);
                })

        }
        setErrors(temp)
    }

    return (
        <main className="h-full w-full md:m-auto text-white flex justify-center">
            <div className="h-full w-full flex justify-center items-center">
                <section className="mt-5 md:w-[600px] w-full px-2 md:px-0">
                    {errors.map((err,i) => {
                        return <span key="{i}" className="text-red-600">{err}</span>
                    })}
                    <form className="mt-4 rounded-lg p-4 bg-black shadow-lg shadow-dun">
                        <div className='text-2xl font-semibold pb-5'>Signup</div>
                        <div className="mb-3 flex flex-col">
                            <label htmlFor="userName" className="form-label">User Name</label>
                            <input onChange={handleUserName} type="text" className="form-control rounded p-1 border bg-white text-black ring ring-gray-200 focus:ring-gray-500" id="userName" name="userName"></input>
                        </div>
                        <div className="mb-3 flex flex-col">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email Address</label>
                            <input onChange={handleEmail} type="email" className="text-black bg-white form-control rounded p-1 border " id="exampleInputEmail1" aria-describedby="emailHelp" name="email"></input>
                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div className="mb-3 flex flex-col">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input onChange={handlePassword} type="password" className="form-control bg-white rounded p-1 border  text-black" id="password" name="password"></input>
                        </div>
                        <div className="mb-3 flex flex-col">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input type="password" className="form-control rounded p-1 border bg-white text-black" onChange={handleConfirm} id="confirmPassword" name="confirmPassword"></input>
                        </div>
                        <button type="submit" className="border border-alloy-orange rounded-2xl px-4 py-2 hover:bg-alloy-orange" onClick={handleSubmit}>SUBMIT</button>
                    </form>
                    
                </section>
            </div>
        </main>
    )
}

export default Signup