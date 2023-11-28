
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/InputComponent.jsx';
import { useState } from 'react';

export default function Signin() {

  const [loginData, setLoginData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.id]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
     e.preventDefault();
    try {
      setIsLoading(true);
       const res = await fetch("http://localhost:3000/auth/sign-in", {
         method: "POST",
         headers: {
           "content-type": "application/json",
         },
         body: JSON.stringify(loginData),
       });

      const data = await res.json();
      if (data.status === "success") {
        setIsLoading(false);
        setIsError(null);
        navigate("/");
      }
      setIsLoading(false);
      setIsError(data.error);
    } catch (e) {
      setIsError({message: e.message || "failed to fetch login data"})
    }
  }

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="font-semibold text-center my-8">Sign in</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="text"
          name="username"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg "
          onChange={handleOnChange}
        />
        <Input
          type="password"
          name="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg "
          onChange={handleOnChange}
        />
        <button disabled={isLoading} className="bg-slate-700 text-white rounded-lg p-2 uppercase hover:opacity-95 ">
          {isLoading ? "Loading..." : "Sign in"}
        </button>
        <button className="bg-red-700 text-white rounded-lg p-2 uppercase hover:opacity-95 ">
          Sign in with Google
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have no account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {isError && <p className="text-red-600 mt-5">{isError}</p>}
    </div>
  );
}
