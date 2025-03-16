import React from "react";
import { useAuthStore } from "../store/useAuthStore";

const UserInfoModal = ({ isOpen, onClose }) => {
    const {user }=useAuthStore()
  if (!isOpen || !user) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2">
          Close
        </button>
        <div className="flex items-center">
          <img
            src={user.profilepic}
            alt={`${user.fullname}'s avatar`}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="ml-4">
            <h2 className="text-lg font-bold">{user.fullname}</h2>
            <p className="text-sm text-gray-500">@{user.username}</p>
            <p className="text-sm text-gray-500">Active since: {user.activeSince}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoModal;