import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'
import './HomePage.responsive.css'

const HomePage = () => {
    const {selectedUser} = useContext(ChatContext)
    const [showMobileProfile, setShowMobileProfile] = useState(false);

    // Reset profile view when selected user changes
    React.useEffect(() => {
        setShowMobileProfile(false);
    }, [selectedUser]);

  return (
    <div className='main-chat-container border w-full h-screen sm:px-[15%] sm:py-[5%] min-h-[100dvh] h-[100dvh] max-sm:min-h-[100dvh] max-sm:h-[100dvh]'>
      <div className={`main-chat-grid backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${selectedUser ? 'lg:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'lg:grid-cols-2'} max-sm:h-[100dvh] max-sm:min-h-[100dvh]` }>
        <Sidebar />
        <ChatContainer onProfileClick={() => setShowMobileProfile(true)} />
        <div className={`hidden lg:block ${showMobileProfile ? 'max-lg:block max-lg:absolute max-lg:inset-0 max-lg:z-50 max-lg:bg-[#18162a]' : ''}`}>
          {selectedUser && <RightSidebar onClose={() => setShowMobileProfile(false)} />}
        </div>
      </div>
    </div>
  )
}

export default HomePage
