import { NavLink } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export default function Header() {
  return (
    <>
      <header className=" bg-slate-200 shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3 ">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Stunna</span>
            <span className="text-slate-700">Estate</span>
          </h1>
          <form className="bg-slate-100 p-3 rounded-lg flex items-center ">
            <input
              type="text"
              placeholder="search..."
              className="bg-transparent w-24 sm:w-64 focus:outline-none"
            />
            <FaSearch className="text-slate-600" />
          </form>
          <div className="flex gap-2">
            <NavLink to="/" className="hidden sm:inline text-slate-700 hover:underline">Home</NavLink> 
            <NavLink to="/about" className="hidden sm:inline text-slate-700 hover:underline">About</NavLink>
            <NavLink to="/sign-in" className="text-slate-700 hover:underline">Signin</NavLink>
          </div>
        </div>
      </header>
    </>
  );
}
