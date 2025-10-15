import { Link } from "react-router-dom";
import { FaBookOpen, FaUsers, FaSearch } from "react-icons/fa";
import boy from '../assets/boy.png';


export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col text-gray-800 overflow-x-hidden bg-white">

      {/* Hero Section */}
      <section className="w-full bg-[#fffdf8]">
        <div className="flex flex-col items-center justify-center text-center px-6 py-24 mx-auto max-w-7xl">
          <h1 className="text-5xl md:text-6xl font-serif font-bold leading-snug text-gray-900">
            Books that have{" "}
            <span className="relative inline-block">
              <span className="relative z-10">everyone</span>
              <span className="absolute left-0 bottom-1 w-full h-3 bg-lime-300/70 -z-10 rounded-full rotate-[-2deg]"></span>
            </span>
            <br />
            talking <span className="text-orange-400 italic">Dive in</span>
          </h1>

          <p className="text-gray-600 mt-6 max-w-xl text-lg">
            Read smarter. Connect deeper. Experience books like never before.
          </p>

          {/* Login/Register Buttons */}
          <div className="flex justify-center gap-6 mt-10 flex-wrap">
            <Link
              to="/auth"
              className="px-7 py-3 bg-orange-400 text-white font-semibold rounded-full shadow-md hover:scale-105 transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/auth?mode=register"
              className="px-7 py-3 bg-gray-900 text-white font-semibold rounded-full shadow-md hover:scale-105 transition duration-300"
            >
              Register
            </Link>
          </div>

          {/* Book Image */}
          
          <div className="relative mt-8 flex justify-start">
            
              <img
                src={boy}
                alt="Books Preview"
                
              />
            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-6 py-24 space-y-16 mx-auto max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          Why BookVerse?
        </h2>
        <div className="grid md:grid-cols-3 gap-10 mt-10">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center transition-transform hover:-translate-y-2 duration-300">
            <div className="flex justify-center mb-4 text-lime-600 text-5xl">
              <FaSearch />
            </div>
            <h3 className="font-semibold text-2xl mb-2">Search Books</h3>
            <p className="text-gray-600">
              Easily find any book by title, author, or genre and discover trending bestsellers.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center transition-transform hover:-translate-y-2 duration-300">
            <div className="flex justify-center mb-4 text-lime-600 text-5xl">
              <FaBookOpen />
            </div>
            <h3 className="font-semibold text-2xl mb-2">Manage Library</h3>
            <p className="text-gray-600">
              Add books to your personal library, mark as read or to-be-read, and track your progress.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center transition-transform hover:-translate-y-2 duration-300">
            <div className="flex justify-center mb-4 text-lime-600 text-5xl">
              <FaUsers />
            </div>
            <h3 className="font-semibold text-2xl mb-2">Connect with Friends</h3>
            <p className="text-gray-600">
              Share your favorite books, see what your friends are reading, and discover new recommendations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
