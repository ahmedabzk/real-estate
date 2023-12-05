import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../store/auth.js";

export default function Oauth({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);


      const res = await fetch("http://localhost:3000/api/auth/google", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      if (!res.ok) {
        throw new Error("Couldn't connect to google")
      }
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (e) {
       console.log("could not sign in with google", e);
    }
  };
  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white rounded-lg p-2 uppercase hover:opacity-95 "
    >
      {children}
    </button>
  );
}
