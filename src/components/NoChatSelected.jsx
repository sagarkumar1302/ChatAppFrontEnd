import React from 'react'
import {MessageSquare} from "lucide-react"
import { useChatStore } from '../store/useChatStore'
const NoChatSelected = () => {
    const {selectedUser} =useChatStore()
    console.log(selectedUser);
    
  return (
    <div className={`w-full md:flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50 hidden`}>
        <div className='max-w-md text-center space-y-6'>
            <div className='flex justify-center gap-4 mb-4'>
                <div className="relative">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center animate-bounce">
                        <MessageSquare className="w-8 h-8 text-primary"/>
                    </div>
                </div>
            </div>
            <h2 className="text-xl font-bold">Welcome to ChatApp</h2>
            <p className='text-base-content/60'>Select a Conservation from the sidebar to start the chatting.</p>
        </div>
    </div>
  )
}

export default NoChatSelected
