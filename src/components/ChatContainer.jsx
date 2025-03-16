import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./Skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unSubscribeFromMessages, isTyping } =
    useChatStore();
  const { authUser } = useAuthStore();
  const chatEndRef = useRef(null);
  
  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages()
    return ()=>[
      unSubscribeFromMessages()
    ]
  }, [getMessages, selectedUser._id, subscribeToMessages, unSubscribeFromMessages]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Function to format dates for the date separators
  const formatMessageDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    // Reset hours to compare just the dates
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    messageDate.setHours(0, 0, 0, 0);
    
    if (messageDate.getTime() === today.getTime()) {
      return "Today";
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt);
      date.setHours(0, 0, 0, 0);
      const dateKey = date.toISOString();
      
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: message.createdAt,
          messages: []
        };
      }
      
      groups[dateKey].messages.push(message);
    });
    
    // Convert to array and sort by date (newest last)
    return Object.values(groups).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  };

  if (isMessagesLoading)
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
      </div>
    );

  const messageGroups = messages.length > 0 ? groupMessagesByDate() : [];

  return (
    <div className={`flex-1 flex flex-col overflow-auto bg-base-100`}>
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <lord-icon
              src="https://cdn.lordicon.com/puvaffet.json"
              trigger="loop"
              colors="primary:#121331,secondary:#3080e8"
              style={{ width: '150px', height: '150px' }}
            ></lord-icon>
            <p className="mt-4 text-lg font-medium">No messages yet</p>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        ) : (
          messageGroups.map((group) => (
            <div key={new Date(group.date).toISOString()} className="space-y-4">
              {/* Date separator */}
              <div className="flex justify-center">
                <div className="bg-base-200 text-base-content text-xs px-3 py-1 rounded-full font-medium">
                  {formatMessageDate(group.date)}
                </div>
              </div>
              
              {/* Messages for this date */}
              {group.messages.map((message) => (
                <div
                  key={uuidv4()}
                  className={`chat ${
                    message.senderId === authUser._id ? "chat-end" : "chat-start"
                  }`}
                >
                  <div className="chat-image avatar md:flex hidden">
                    <div className="size-10 rounded-full border">
                      {message.senderId === authUser._id ? (
                        // Current user's profile picture
                        authUser.profilepic ? (
                          <img
                            src={authUser.profilepic}
                            alt={`${authUser.fullname}'s avatar`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <lord-icon
                            src="https://cdn.lordicon.com/hhljfoaj.json"
                            trigger="hover"
                            className="w-10 h-10 rounded-full object-cover"
                          ></lord-icon>
                        )
                      ) : (
                        // Selected user's profile picture
                        selectedUser.profilepic ? (
                          <img
                            src={selectedUser.profilepic}
                            alt={`${selectedUser.fullname}'s avatar`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <lord-icon
                            src="https://cdn.lordicon.com/hhljfoaj.json"
                            trigger="hover"
                            className="w-10 h-10 rounded-full object-cover"
                          ></lord-icon>
                        )
                      )}
                    </div>
                  </div>
                  <div className="chat-header mb-1">
                    <span className="font-bold mr-2 md:flex hidden">
                      {message.senderId === authUser._id ? authUser.fullname : selectedUser.fullname}
                    </span>
                    <time className="text-xs opacity-50">
                      {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </time>
                  </div>
                  <div className={`chat-bubble flex flex-col ${message.senderId === authUser._id ? "bg-primary text-primary-content" : "bg-neutral-200 text-neutral-800"}`}>
                    {message.img && (
                      <div className="mb-2">
                        <img
                          src={message.img}
                          alt="Shared image"
                          className="rounded-md md:max-w-xs hover:opacity-90 transition-opacity cursor-pointer"
                          onClick={() => window.open(message.img, '_blank')}
                        />
                      </div>
                    )}
                    {message.text && <p className="whitespace-pre-wrap break-words">{message.text}</p>}
                  </div>
                  <div className="chat-footer opacity-50 text-xs">
                    {message.senderId === authUser._id && message.read ? "Seen" : ""}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={chatEndRef} />
        {isTyping && <div className="typing-indicator">User is typing...</div>}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
