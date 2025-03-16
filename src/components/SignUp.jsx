import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import ThreeScene from "./ThreeScene";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    username: "",
    password: "",
    profilePicture: null,
  });
  const { signup, isSigningUp } = useAuthStore();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePicture: file });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {};
  const submitForm = (e) => {
    e.preventDefault();
    console.log(formData);
    signup(formData)
  };

  return (
    <div className="min-h-[87vh] grid sm:grid-cols-2 gap-4 bg-gray-50">
      {/* Form Section */}
      <div className="flex items-center flex-col justify-center">
        <form
          onSubmit={submitForm}
          className="w-full max-w-xl space-y-6 p-8 bg-white rounded-xl shadow-lg"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Create Account
          </h2>

          {/* Full Name Input */}
          <div>
            <label className="text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
              required
            />
          </div>

          {/* Username Input */}
          <div>
            <label className="text-gray-700 font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="johndoe"
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
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-3 text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Profile Picture Input */}
          <div>
            <label className="text-gray-700 font-medium">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isSigningUp ? <span className="loading loading-bars loading-xl"></span> : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-gray-600">
          If you already have an account, please{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Login
          </Link>
        </p>
      </div>

      {/* 3D Animation Section */}
      <div className="hidden sm:flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
        <div className="w-full h-[600px] flex items-center justify-center transform transition-transform">
          <div className="w-full h-4/5 flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl shadow-2xl">
            <ThreeScene />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
