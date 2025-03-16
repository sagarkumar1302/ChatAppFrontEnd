import React, { useState } from "react";
import { useChatStore } from "../store/useChatStore"; // Make sure to import useChatStore
import { IoArrowBack } from "react-icons/io5"; // For back button icon
import { BsCircleFill } from "react-icons/bs"; // For online status indicator
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  // Function to handle going back to user list
  const handleBack = () => {
    setSelectedUser(null);
  };

  // Function to toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Check if the selected user is online
  const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex items-center p-3 border-b border-gray-200  shadow-sm cursor-pointer" onClick={toggleModal}>
      {selectedUser && (
        <>
          <button
            onClick={handleBack}
            className="mr-2 p-1 rounded-full hover:bg-gray-100"
          >
            <IoArrowBack size={30} />
          </button>

          <div className="relative">
            {selectedUser.profilepic ? (
              <img
                src={selectedUser.profilepic}
                alt={`${selectedUser.fullname}'s avatar`}
                className="w-10 h-10 rounded-full object-cover "
              />
            ) : (
              <lord-icon
                src="https://cdn.lordicon.com/hhljfoaj.json"
                trigger="hover"
                className="w-10 h-10 rounded-full object-cover "
              ></lord-icon>
            )}

            {isOnline && (
              <div className="absolute bottom-0 right-0">
                <BsCircleFill size={10} className="text-green-500" />
              </div>
            )}
          </div>

          <div className="ml-3">
            <h3 className="font-medium">
              {selectedUser.fullname} ({selectedUser.username})
            </h3>
            <p className="text-xs text-gray-500">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white md:p-12 p-5 rounded-lg shadow-lg w-80">
            <button
              onClick={toggleModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              {selectedUser.profilepic ? (
                <img
                  src={selectedUser.profilepic}
                  alt={`${selectedUser.fullname}'s avatar`}
                  className="w-20 h-20 rounded-full object-cover mb-3"
                />
              ) : (
                <lord-icon
                  src="https://cdn.lordicon.com/hhljfoaj.json"
                  trigger="hover"
                  className="w-20 h-20 rounded-full object-cover mb-3"
                ></lord-icon>
              )}
              <h3 className="font-medium text-lg">{selectedUser.fullname}</h3>
              <p className="text-sm text-gray-500">@{selectedUser.username}</p>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
              <p className="text-sm text-gray-500 text-center font-semibold">
                Active since:<br></br> {new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }).format(new Date(selectedUser.createdAt))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
