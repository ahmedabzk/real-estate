import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const userState = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, []);


  return (
    <>
      <header className=" bg-slate-200 shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3 ">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Stunna</span>
            <span className="text-slate-700">Estate</span>
          </h1>
          <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center ">
            <input
              type="text"
              placeholder="search..."
              value={searchTerm}
              className="bg-transparent w-24 sm:w-64 focus:outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>
              <FaSearch className="text-slate-600" />
            </button>
          </form>
          <ul className="flex gap-2">
            <Link to="/">
              <li className="hidden sm:inline text-slate-700 hover:underline">
                Home
              </li>
            </Link>
            <Link to="/about">
              <li className="hidden sm:inline text-slate-700 hover:underline">
                About
              </li>
            </Link>

            <Link to="/profile">
              {userState.currentUser ? (
                <img
                  className="rounded-full h-9 w-9 object-cover"
                  src={userState.currentUser.avatar}
                  alt="profile"
                />
              ) : (
                <li className=" text-slate-700 hover:underline"> Sign in</li>
              )}
            </Link>
          </ul>
        </div>
      </header>
    </>
  );
}
