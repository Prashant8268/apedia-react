import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const ForgotPassword = () => {
    return (
        <div className="flex justify-center items-center pt-10 pb-5 min-h-screen bg-gradient-to-br from-blue-400 to-purple-500">
            <div className="bg-white max-w-md p-8 rounded-lg shadow-md">
                <h1 className="text-3xl text-blue-500 mb-6 text-center">Forgot Password</h1>
                <form>
                    <div className="mb-4">
                        <label htmlFor="email" className="text-gray-700">Email</label>
                        <div className="flex items-center border border-gray-300 rounded px-3">
                            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2 w-6 h-6" />
                            <input type="email" id="email" name="email" placeholder="Enter your email" className="w-full py-2 focus:outline-none" />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Submit</button>
                </form>
                <div className="flex justify-center items-center mt-4">
                    <Link href="/signIn" className="text-blue-500 font-semibold">Sign In</Link>
                    <span className="text-gray-400 mx-2">|</span>
                    <Link href="/signUp" className="text-blue-500 font-semibold">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
