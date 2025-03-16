import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const { authUser, updateprofile, isUpdatingProfile } = useAuthStore();

  // State initialized from authUser
  const [profilePic, setProfilePic] = useState(authUser.profilepic || "");
  const [fullname, setFullname] = useState(authUser.fullname);
  const [username, setUsername] = useState(authUser.username);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Active"); // Dummy data
  const [activeSince, setActiveSince] = useState("2024-01-01"); // Dummy data

  // Sync state when authUser updates
  useEffect(() => {
    setProfilePic(authUser.profilepic || "");
    setFullname(authUser.fullname);
    setUsername(authUser.username);
  }, [authUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        setProfilePic(reader.result);
        await updateprofile({ profilepic: reader.result });
      };
    }
  };

  const handleUpdate = async () => {
    const updatedData = {
      fullname,
      username,
      password: password || undefined, // Only send password if changed
      profilepic: profilePic,
    };

    await updateprofile(updatedData); // Call store function to update backend
  };

  return (
    <div className=" min-h-screen flex justify-center items-center p-5">
      <div className="w-full max-w-lg shadow-md p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Profile</h2>

        <div className="flex flex-col items-center">
          <label htmlFor="profile-pic">
            <div className="h-32 w-32 bg-gray-200 rounded-full flex justify-center items-center overflow-hidden cursor-pointer">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <lord-icon
                  src="https://cdn.lordicon.com/hhljfoaj.json"
                  trigger="hover"
                  style={{ width: "100px", height: "100px" }}
                ></lord-icon>
              )}
            </div>
          </label>
          <input
            type="file"
            id="profile-pic"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring focus:ring-blue-200"
            placeholder="Enter new password"
          />
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600 flex justify-between"><span className="text-lg">Active Since:</span> <span className="text-lg font-bold">{authUser.createdAt?.split("T")[0]}</span></p>
          <p
            className={`mt-2 text-lg font-semibold flex justify-between ${
              status === "Active" ? "text-green-600" : "text-red-600"
            }`}
          >
           <span> Status:</span> <span>{status}</span>
          </p>
        </div>

        <button
          onClick={handleUpdate}
          disabled={isUpdatingProfile}
          className="w-full bg-blue-600 text-white py-2 mt-4 rounded-md hover:bg-blue-700 flex justify-center items-center"
        >
          {isUpdatingProfile ? (
            <span className="loading loading-bars loading-xl"></span>
          ) : (
            "Update Profile"
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
