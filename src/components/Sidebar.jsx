import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./Skeletons/SidebarSkeleton";
import { Search, Users, Filter } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Sidebar = () => {
  const { getUsers, setSelectedUser, isUserLoading, selectedUser, users } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  // This would be replaced with actual online users from a socket connection
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  const onlineFilter = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;
  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside className={`h-full w-full md:w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 bg-base-100 ${selectedUser?"hidden md:flex":""}`}>
      {/* Header */}
      <div className="border-b border-base-300 w-full p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            <span className="font-medium lg:block text-base-content">
              Contacts
            </span>
          </div>
          <div className="lg:block text-xs font-medium text-primary">
            {onlineUsers.length > 0 ? `${onlineUsers.length -1} online` : ""}
          </div>
        </div>
      </div>

      {/* Online Users Toggle Button */}
      <div className="p-3 border-b border-base-300 flex rounded-lg bg-primary justify-between items-center">
        <button
          onClick={() => setShowOnlineOnly(!showOnlineOnly)}
          className="flex items-center gap-2 text-sm text-white"
        >
          <Filter className="size-4" />
          <span className=" lg:block">
            {showOnlineOnly ? "Show All" : "Show Online"}
          </span>
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-base-300">
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-8 pr-4 text-sm rounded-lg bg-base-200 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Search className="absolute left-2 top-2.5 size-4 text-base-content/50" />
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full flex-1 scrollbar-thin">
        {onlineFilter.length > 0 ? (
          onlineFilter.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-200 transition-colors
                ${
                  selectedUser?._id === user._id
                    ? "bg-base-200 border-l-4 border-primary"
                    : ""
                }
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                {user.profilepic ? (
                  <img
                    src={user.profilepic}
                    alt={user.fullname}
                    className="size-10 rounded-full object-cover border-2 border-base-300"
                  />
                ) : (
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <lord-icon
                      src="https://cdn.lordicon.com/hhljfoaj.json"
                      trigger="hover"
                      colors="primary:#3b82f6"
                      style={{ width: "30px", height: "30px" }}
                    ></lord-icon>
                  </div>
                )}
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-base-100"
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="lg:block text-left min-w-0 flex-1">
                <div className="font-medium truncate text-base-content">
                  {user.fullname}
                </div>
                <div className="text-xs flex items-center gap-1">
                  <span className="text-base-content/70 font-medium">
                    {user.username}
                  </span>
                  <span
                    className={`size-1.5 rounded-full ${
                      onlineUsers.includes(user._id)
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  ></span>
                  <span className="text-base-content/70">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-base-content/50 py-8 px-4">
            {searchTerm
              ? "No contacts match your search"
              : "No contacts available"}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-base-300 lg:block">
        <div className="text-xs text-center text-base-content/50">
          {users.length} Total Contacts
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
