import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'
import './HomePage.responsive.css'

const HomePage = () => {

    const {selectedUser} = useContext(ChatContext)

  return (
    <div className='main-chat-container border w-full h-screen sm:px-[15%] sm:py-[5%]'>
      <div className={`main-chat-grid backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${selectedUser ? 'lg:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'lg:grid-cols-2'}`}>
        <Sidebar />
        <ChatContainer />
        <div className="hidden lg:block">
          {selectedUser && <RightSidebar/>}
        </div>
      </div>
    </div>
  )
}

export default HomePage
