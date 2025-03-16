import React from "react";
import Setting from "./Setting";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, User, UserPen } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
const Navbar = () => {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();
  return (
    <div className="flex justify-center py-4 px-4 md:px-0 shadow-md shadow-slate-100">
      <div className="container flex justify-between">
        <div className="text-3xl gap-2 flex justify-center items-center cursor-pointer" onClick={()=>{navigate("/")}}>
          <lord-icon
            src="https://cdn.lordicon.com/xvmmqwjv.json"
            trigger="hover"
            className="w-14 h-14"
          ></lord-icon>
          <div className="hidden md:flex font-bold">
            <span className="text-green-600">&lt;</span>
            <p>ChatApps</p>
            <span className="text-green-600">/&gt;</span>
          </div>
        </div>
        <div className="text-3xl flex gap-4   cursor-pointer">
          <div className="flex justify-center items-center gap-2">
            <Setting/>
          </div>
          {authUser ? (
            <>
              <div
                className="flex justify-center items-center gap-2"
                onClick={() => navigate("/profile")}
              >
                <User />
                <span className="hidden text-sm md:flex">Profile</span>
              </div>
              <div
                className="flex justify-center items-center gap-2 p-4 rounded-lg bg-red-600"
                onClick={logout}
              >
                <LogOut style={{ color: "white" }} />
                <span className="hidden text-sm md:flex text-white">
                  Logout
                </span>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
