import { Routes, Route } from "react-router-dom";

import { Home, Signin, Signup, About, Profile, CreateListing, UpdateListing, Listings, Search } from "./pages";
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
        <Route path="/search" element={<Search/>} />
        <Route path="/listing/:listingId" element={<Listings/>}/>
        <Route element={<PrivateRoutes/>}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:listingId" element={<UpdateListing/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
