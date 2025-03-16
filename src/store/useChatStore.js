import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
export const useChatStore = create((set, get)=>({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    onlineUsers: [],
    isTyping: false,
    getUsers: async () => {
        set({isUserLoading: true})
        try {
            const res = await axiosInstance.get("/message/users")
            set({users: res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally{
            set({isUserLoading:false})
        }
    },
    getMessages: async (userId) => {
        set({isMessagesLoading: true})
        try {
            const res = await axiosInstance.get(`/message/${userId}`)
            set({messages: res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally{
            set({isMessagesLoading:false})
        }
    },
    setSelectedUser : async (userSelected) => {
        set({selectedUser: userSelected})
    },
    sendMessage: async (data)=>{
        const {selectedUser, messages}= get()
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, data)
            set({messages: [...messages, res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }

    },
    emitTyping: () => {
        const { selectedUser } = get();
        const socket = useAuthStore.getState().socket;
        if (selectedUser && socket) {
            socket.emit("typing", { to: selectedUser._id });
        }
    },
    emitStopTyping: () => {
        const { selectedUser } = get();
        const socket = useAuthStore.getState().socket;
        if (selectedUser && socket) {
            socket.emit("stopTyping", { to: selectedUser._id });
        }
    },
    subscribeToMessages: ()=>{
        const {selectedUser} = get()
        if(!selectedUser)return
        const socket = useAuthStore.getState().socket
        socket.on("newMessage", (newMessage)=>{
            if(newMessage.senderId!= selectedUser._id)return
            set({messages: [...get().messages, newMessage],})
        })
        socket.on("typing", () => {
            set({ isTyping: true });
        });
        socket.on("stopTyping", () => {
            set({ isTyping: false });
        });
    },
    unSubscribeFromMessages: ()=>{
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")
    }
}))