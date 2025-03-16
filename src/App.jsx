import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/useAuthStore";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Setting from "./components/Setting";
import ProfilePage from "./components/ProfilePage";
import toast,{Toaster} from "react-hot-toast";
function App() {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  useEffect(() => {
    [checkAuth()];
  }, [checkAuth]);
  // console.log({ authUser });
  console.log({onlineUsers});
  
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-800">
        <span className="loading loading-bars loading-xl"></span>
      </div>
    );
  }
  const toashow = () => {
    toast.success('Successfully toasted!')
  }
  
  return (
    <div >
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route path="/setting" element={<Setting />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      
      <Toaster position="bottom-center" reverseOrder={false} />
      
    </div>
  );
}

export default App;
