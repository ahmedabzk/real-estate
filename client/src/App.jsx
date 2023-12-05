import { Routes, Route } from "react-router-dom";

import { Home, Signin, Signup, About, Profile, CreateListing } from "./pages";
import Header from "./components/header";
import PrivateRoutes from "./components/privateRoute.jsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoutes/>}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
