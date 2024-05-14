import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-400 to-purple-500 min-h-screen flex flex-col justify-center items-center">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to <span className="text-yellow-400">Apedia</span></h1>
        <p className="text-lg text-white">Connect with friends, share moments, and explore the world of social networking.</p>
      </header>

      <div className="flex flex-col items-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/5996/5996258.png"
          className="w-24 h-24 animate-bounce mb-8"
          alt="Social Media App Icon"
        />
        <div className="space-y-4">
          <Link href="/signIn" className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out mr-2">Sign In</Link>
          <Link href="/signUp" className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
