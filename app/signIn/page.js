import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const SignIn = () => {
    return (
        <div className="flex justify-center items-center pt-10 pb-5 min-h-screen bg-blue-100">
            <div className="bg-white max-w-md p-8 rounded-lg shadow-md ">
                <h1 className="text-3xl text-blue-500 mb-6 text-center">Sign In to Apedia</h1>
                <form>
                    <div className="mb-4">
                        <label htmlFor="email" className="text-gray-700">Email</label>
                        <div className="flex items-center border border-gray-300 rounded px-3">
                            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2 w-6 h-6" />
                            <input type="email" id="email" name="email" placeholder="Enter your email" className="w-full py-2 focus:outline-none " />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700">Password</label>
                        <div className="flex items-center border border-gray-300 rounded px-3">
                            <FontAwesomeIcon icon={faLock} className="text-gray-400 mr-2 w-6 h-6"  />
                            <input type="password" name="password" id="password" placeholder="Enter your password" className="w-full py-2 focus:outline-none" />
                        </div>
                    </div>
                    <button type="submit" className="bg-blue-500 text-white py-3 px-6 rounded-md text-lg font-semibold w-full">Sign In</button>
                </form>
                <div className="cta-buttons">
                    <Link href="/signup" className="cta-button">Sign Up</Link>
                    <span>|</span>
                    <Link href="/forgot-password" className="cta-button">Forgot Password</Link>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
