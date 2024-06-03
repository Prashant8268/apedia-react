"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignUp = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const[name, setName] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('api/signin', { email, password,name });
        console.log(response,'response');
        if(response){
            router.push('/signIn');
        }


      } catch (error) {
        // setMessage(error.response.data.message);
        console.log(error,'error')
      }
    };
  
    return (
        <div className="flex justify-center items-center pt-10 pb-5 min-h-screen bg-gradient-to-br from-blue-400 to-purple-500">
            <div className="bg-white max-w-md p-8 rounded-lg shadow-md">
                <h1 className="text-3xl text-blue-500 mb-6 text-center">Sign Up to <span className="text-yellow-400">Apedia</span></h1>
                <form>
                    <div className="mb-4">
                        <label htmlFor="email" className="text-gray-700">Email</label>
                        <div className="flex items-center border border-gray-300 rounded px-3">
                            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2 w-6 h-6" />
                            <input type="email" id="email"
                            name="email" placeholder="Enter your email"
                            className="w-full py-2 focus:outline-none"
                            value={email} onChange={(e)=>setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700">Name</label>
                        <div className="flex items-center border border-gray-300 rounded px-3">
                            <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2 w-6 h-6" />
                            <input type="text" name="name" id="name"
                            placeholder="Enter your name" className="w-full py-2 focus:outline-none"
                            value={name} onChange={(e)=>setName(e.target.value)}/>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700">Password</label>
                        <div className="flex items-center border border-gray-300 rounded px-3">
                            <FontAwesomeIcon icon={faLock} className="text-gray-400 mr-2 w-6 h-6" />
                            <input type="password" name="password" id="password" placeholder="Enter your password"
                            className="w-full py-2 focus:outline-none" value={password} onChange={(e)=>setPassword(e.target.value)} />
                        </div>
                    </div>
                    <button 
                    onClick={(e)=>handleSubmit(e)}
                    className="w-full mb-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Sign Up</button>
                    <button  className="w-full bg-red-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out hover:bg-red-600 focus:outline-none focus:bg-red-600">Sign Up with Google</button>
                </form>
                <div className="flex justify-center items-center mt-4">
                    <Link href="/signIn" className="mr-2 text-blue-500 font-semibold" >Sign In</Link>
                    <span className="text-gray-400">|</span>
                    <Link href="/forgotPassword" className="ml-2 text-blue-500 font-semibold">Forgot Password</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
