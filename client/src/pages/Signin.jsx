import { Link, useNavigate } from "react-router-dom";
import Input from "../components/InputComponent.jsx";
import { useState } from "react";
import { signInStart, signInSuccess, signInFailure } from "../store/auth.js";
import { useDispatch, useSelector } from "react-redux";
import Oauth from "../components/Oauth.jsx";

export default function Signin() {
  const [loginData, setLoginData] = useState({});
  const userState = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart);
      const res = await fetch("http://localhost:3000/api/auth/sign-in", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });

      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (e) {
      dispatch(signInFailure(e.error));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="font-semibold text-center my-8">Sign in</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="email"
          name="email"
          placeholder="email"
          id="email"
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
        <button
          disabled={userState.loading}
          className="bg-slate-700 text-white rounded-lg p-2 uppercase hover:opacity-95 "
        >
          {userState.loading ? "Loading..." : "Sign in"}
        </button>
        <Oauth>sign with google</Oauth>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have no account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {userState.error && (
        <p className="text-red-600 mt-5">{userState.error}</p>
      )}
    </div>
  );
}
