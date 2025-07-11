import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import './ChatContainer.mobile.css'
import { useMobileNavigation } from '../hooks/useMobileNavigation'

const ChatContainer = () => {

    const { messages, selectedUser, setSelectedUser, sendMessage, 
        getMessages} = useContext(ChatContext)

    const { authUser, onlineUsers } = useContext(AuthContext)

    const scrollEnd = useRef()
    const inputRef = useRef();

    const [input, setInput] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [loadingChat, setLoadingChat] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    // Mobile navigation hook
    const { navigateToUsers, isMobile } = useMobileNavigation(selectedUser, setSelectedUser);

    // Handle sending a message
    const handleSendMessage = async (e)=>{
        e.preventDefault();
        if(input.trim() === "") return null;
        await sendMessage({text: input.trim()});
        setInput("")
    }

    // Handle sending an image
    const handleSendImage = async (e) =>{
        const file = e.target.files[0];
        setUploadError("");
        if(!file || !file.type.startsWith("image/")){
            toast.error("Select an image file");
            return;
        }
        if(file.size > 5 * 1024 * 1024) { // 5MB limit
            setUploadError("Image too large! Please select an image under 5MB.");
            toast.error("Image too large! Please select an image under 5MB.");
            return;
        }
        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = async ()=>{
            try {
                await sendMessage({image: reader.result});
            } catch (err) {
                setUploadError("Failed to upload image. Please try again.");
                toast.error("Failed to upload image. Please try again.");
            }
            setUploading(false);
            e.target.value = "";
        }
        reader.readAsDataURL(file);
    }

    // When selectedUser changes, show a loader for a short time to smooth out perceived lag
    useEffect(() => {
      if (selectedUser) {
        setLoadingChat(true);
        // Simulate a short loading delay for smoother UI
        const timeout = setTimeout(() => {
          getMessages(selectedUser._id).finally(() => setLoadingChat(false));
        }, 200); // 200ms delay
        return () => clearTimeout(timeout);
      }
    }, [selectedUser]);

    useEffect(()=>{
        if(scrollEnd.current && messages){
            scrollEnd.current.scrollIntoView({ behavior: "smooth"})
        }
    },[messages])

    // Mobile keyboard detection and handling
    useEffect(() => {
      const handleResize = () => {
        const isMobile = window.innerWidth <= 639;
        if (isMobile) {
          const viewportHeight = window.innerHeight;
          const windowHeight = window.outerHeight;
          const keyboardHeight = windowHeight - viewportHeight;
          
          if (keyboardHeight > 150) {
            setIsKeyboardOpen(true);
            document.body.classList.add('keyboard-open');
          } else {
            setIsKeyboardOpen(false);
            document.body.classList.remove('keyboard-open');
          }
        }
      };

      const handleFocus = () => {
        if (window.innerWidth <= 639) {
          setIsKeyboardOpen(true);
          document.body.classList.add('keyboard-open');
        }
      };

      const handleBlur = () => {
        if (window.innerWidth <= 639) {
          // Small delay to allow for keyboard animation
          setTimeout(() => {
            setIsKeyboardOpen(false);
            document.body.classList.remove('keyboard-open');
          }, 300);
        }
      };

      const input = inputRef.current;
      if (input) {
        input.addEventListener('focus', handleFocus);
        input.addEventListener('blur', handleBlur);
      }

      window.addEventListener('resize', handleResize);
      
      return () => {
        if (input) {
          input.removeEventListener('focus', handleFocus);
          input.removeEventListener('blur', handleBlur);
        }
        window.removeEventListener('resize', handleResize);
        document.body.classList.remove('keyboard-open');
      };
    }, []);

    // Scroll to bottom when input is focused (for mobile keyboard)
    useEffect(() => {
      const handleFocus = () => {
        if (scrollEnd.current) {
          scrollEnd.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      };
      const input = inputRef.current;
      if (input) {
        input.addEventListener('focus', handleFocus);
        input.addEventListener('touchstart', handleFocus);
      }
      return () => {
        if (input) {
          input.removeEventListener('focus', handleFocus);
          input.removeEventListener('touchstart', handleFocus);
        }
      };
    }, []);

    // Handle back button click in header
    const handleBackClick = () => {
      if (isMobile) {
        navigateToUsers();
      } else {
        setSelectedUser(null);
      }
    };

  return selectedUser ? (
    <div className={`h-full overflow-hidden relative backdrop-blur-lg flex flex-col mobile-chat-container ${isKeyboardOpen ? 'keyboard-open' : ''}`}>
      {/* ------- header ------- */}
      <div className='flex items-center gap-2 sm:gap-3 py-2 sm:py-3 mx-2 sm:mx-4 border-b border-stone-500 flex-shrink-0 mobile-chat-header'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-6 sm:w-8 rounded-full"/>
        <p className='flex-1 text-base sm:text-lg text-white flex items-center gap-2'>
            {selectedUser.fullName}
            {onlineUsers.includes(selectedUser._id) && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
        </p>
        <img onClick={handleBackClick} src={assets.arrow_icon} alt="" className='md:hidden max-w-6 sm:max-w-7 cursor-pointer back-button'/>
      </div>
      {/* ------- chat area ------- */}
      <div className='flex flex-col flex-1 overflow-auto p-2 sm:p-3 will-change-transform scroll-smooth mobile-chat-area' style={{ WebkitOverflowScrolling: 'touch' }}>
        {loadingChat ? (
          <div className="flex flex-1 items-center justify-center h-full">
            <svg className="animate-spin h-10 w-10 text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-end gap-1 sm:gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
                {msg.image ? (
                  <img src={msg.image} alt="" className='max-w-[200px] sm:max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-6 sm:mb-8'/>
                ) : (
                  <p className={`p-2 sm:p-3 max-w-[180px] sm:max-w-[200px] text-sm sm:text-base font-light rounded-lg mb-6 sm:mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
                )}
                <div className="text-center text-xs">
                  <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-6 sm:w-7 rounded-full' />
                  <p className='text-gray-500 text-xs'>{formatMessageTime(msg.createdAt)}</p>
                </div>
              </div>
            ))}
            <div ref={scrollEnd}></div>
          </>
        )}
      </div>

{/* ------- bottom area ------- */}
    <div className='flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-[#18162a]/90 flex-shrink-0 mobile-chat-input' style={{backdropFilter: 'blur(6px)', zIndex: 10}}>
        <div className='flex-1 flex items-center bg-[#23213a] px-3 py-2 sm:px-3 sm:py-3 rounded-full border border-violet-500 gap-2'>
            <input 
                ref={inputRef}
                onChange={(e)=> setInput(e.target.value)} 
                value={input} 
                onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null} 
                type="text" 
                placeholder="Send a message" 
                className='flex-1 text-sm p-2 sm:p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent min-w-0'
                style={{minWidth:0}}
            />
            {uploadError && (
              <div className="rounded-md p-2 mb-2 text-center font-semibold bg-gradient-to-r from-pink-400 via-yellow-300 to-green-400 text-gray-900 animate-pulse shadow-lg">
                {uploadError}
              </div>
            )}
            <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden/>
            <label htmlFor="image" className="flex items-center justify-center cursor-pointer">
              {uploading ? (
                <svg className="animate-spin h-6 w-6 text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : (
                <img src={assets.gallery_icon} alt="" className="w-6 h-6 sm:w-5 sm:h-5 mr-1 sm:mr-2"/>
              )}
            </label>
        </div>
        <button onClick={handleSendMessage} className="flex items-center justify-center w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-700 shadow-md ml-2 border-none p-0">
            <img src={assets.send_button} alt="Send" className="w-6 sm:w-7" />
        </button>
    </div>

    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
        <img src={assets.logo_icon} className='max-w-16' alt="" />
        <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer
