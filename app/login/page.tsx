'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'

const appUrl = process.env.NEXT_PUBLIC_APP_API_URL

console.log(appUrl)

export default function Login() {

  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    let temp: string[] = [];

    if(email === '' || password === '') {
      temp.push('Please fill in all fields')
      
      setErrors(temp)
      return
    } 

    fetch(`${appUrl}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
        email,
        password
    }),
    headers: {
        'Content-type': 'application/json',
    },
    credentials: 'include' // Ensures cookies are sent with the request 
    })
        .then(res => {
        if(res.ok) {
            router.push('/profile')
        } else {
            res.json().then(data => {
                throw new Error(data.message || 'Login failed')
                setErrors([...temp])
            })
        }
        })
        .catch(err => {
        console.error(err)
        temp.push(err.message || 'Login failed')
        })
  }

  return (
    <div className='h-full flex justify-center items-center'>
      {errors.map((err, i) => {
          return <span key='{i}' className='text-red-600'>{err}</span>
        })}
      <form className="mt-4 border border-black rounded-lg p-4 md:w-[400px] w-full text-white bg-black shadow-lg shadow-dun">
        <div className='text-2xl font-semibold pb-5'>Sign In</div>
        <div className="mb-3 flex flex-col">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input
              type="email"
              className="form-control rounded p-1 text-black border border-black bg-white"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              name="email"
              onChange={handleEmail}
          ></input>
        </div>
        <div className="mb-3 flex flex-col">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input
              type="password"
              className="form-control rounded p-1 text-black border border-black bg-white"
              id="exampleInputPassword1"
              name="password"
              onChange={handlePassword}
          ></input>
        </div>
        <div className='flex flex-col items-start'>
          <button onClick={handleSubmit} type="submit" className="border border-alloy-orange rounded-2xl px-4 py-2 hover:bg-alloy-orange">SUBMIT</button>
          <Link href="/register" className="text-sm hover:text-alloy-orange pt-2">Dont have an account? Register</Link>
        </div>

      </form>
    </div>
      
  );
};
