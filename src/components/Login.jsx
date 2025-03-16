import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Login = () => {
  const { login, isLoggingIn } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-[87vh] grid sm:grid-cols-2 gap-4 bg-gray-50">
      {/* Form Section */}
      <div className="flex items-center flex-col justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl space-y-6 p-8 bg-white rounded-xl shadow-lg"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Welcome Back
          </h2>

          {/* Username or Email Input */}
          <div>
            <label className="text-gray-700 font-medium">
              Username or Email
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your username or email"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="text-gray-700 font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
              minLength="4"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-3 text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            <p className="text-sm text-gray-600 mt-1">
              
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? <span className="loading loading-bars loading-xl"></span> : "Sign In"}
          </button>
        </form>
        <p className="mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
      <div className="w-full bg-gradient-to-br from-blue-500 to-purple-600 p-8 flex items-center justify-center">
        <div className="cube-wrapper">
          <style jsx>{`
            .cube-wrapper {
              perspective: 1000px;
            }
            .cube {
              width: 300px;
              height: 300px;
              position: relative;
              transform-style: preserve-3d;
              animation: rotate 20s infinite linear;
            }
            .cube-face {
              position: absolute;
              width: 300px;
              height: 300px;
              border: 2px solid rgba(255, 255, 255, 0.5);
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(5px);
            }
            @keyframes rotate {
              from {
                transform: rotateX(0) rotateY(0) rotateZ(0);
              }
              to {
                transform: rotateX(360deg) rotateY(720deg) rotateZ(360deg);
              }
            }
            .front {
              transform: translateZ(100px);
            }
            .back {
              transform: translateZ(-100px) rotateY(180deg);
            }
            .right {
              transform: translateX(100px) rotateY(90deg);
            }
            .left {
              transform: translateX(-100px) rotateY(-90deg);
            }
            .top {
              transform: translateY(-100px) rotateX(90deg);
            }
            .bottom {
              transform: translateY(100px) rotateX(-90deg);
            }
          `}</style>
          <div className="cube">
            <div className="cube-face front"></div>
            <div className="cube-face back"></div>
            <div className="cube-face right"></div>
            <div className="cube-face left"></div>
            <div className="cube-face top"></div>
            <div className="cube-face bottom"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
