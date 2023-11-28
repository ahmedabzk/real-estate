import { Routes, Route } from "react-router-dom";

import { Home, Signin, Signup, About } from "./pages";
import Header from "./components/header";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
