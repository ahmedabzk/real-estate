import { Link,useNavigate } from "react-router-dom";
import Input from "../components/InputComponent.jsx";
import { useState } from "react";

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
       const res = await fetch("http://localhost:3000/auth/sign-up", {
         method: "POST",
         headers: {
           "content-type": "application/json",
         },
         body: JSON.stringify(formData),
       });
      const data = await res.json();
      if (data.status === "success") { 
        setIsLoading(false);
        setIsError(null);
         navigate("/sign-in");
      }
      setIsLoading(false);
      setIsError(data.error);
    } catch (error) {
      setIsError({ message: error.message || "failed to register user" })
    }
   
    
  };

  return (
    <div className="p-3 max-w-lg  mx-auto">
      <h1 className="text-xl text-center font-semibold my-8 ">Signup</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="text"
          name="username"
          placeholder="Username"
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={isLoading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </button>
        <button className="bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95">
          Continue With Google
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account? </p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {isError && <p className="text-red-600 mt-5">{isError}</p>}
    </div>
  );
}
