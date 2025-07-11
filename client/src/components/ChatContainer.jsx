import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {

    const { messages, selectedUser, setSelectedUser, sendMessage, 
        getMessages} = useContext(ChatContext)

    const { authUser, onlineUsers } = useContext(AuthContext)

    const scrollEnd = useRef()

    const [input, setInput] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

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

    useEffect(()=>{
        if(selectedUser){
            getMessages(selectedUser._id)
        }
    },[selectedUser])

    useEffect(()=>{
        if(scrollEnd.current && messages){
            scrollEnd.current.scrollIntoView({ behavior: "smooth"})
        }
    },[messages])

  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      {/* ------- header ------- */}
      <div className='flex items-center gap-2 sm:gap-3 py-2 sm:py-3 mx-2 sm:mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-6 sm:w-8 rounded-full"/>
        <p className='flex-1 text-base sm:text-lg text-white flex items-center gap-2'>
            {selectedUser.fullName}
            {onlineUsers.includes(selectedUser._id) && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
        </p>
        <img onClick={()=> setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-6 sm:max-w-7 cursor-pointer'/>
      </div>
      {/* ------- chat area ------- */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-2 sm:p-3 pb-6'>
        {messages.map((msg, index)=>(
            <div key={index} className={`flex items-end gap-1 sm:gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
                {msg.image ? (
                    <img src={msg.image} alt="" className='max-w-[200px] sm:max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-6 sm:mb-8'/>
                ):(
                    <p className={`p-2 sm:p-3 max-w-[180px] sm:max-w-[200px] text-sm sm:text-base font-light rounded-lg mb-6 sm:mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
                )}
                <div className="text-center text-xs">
                    <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-6 sm:w-7 rounded-full' />
                    <p className='text-gray-500 text-xs'>{formatMessageTime(msg.createdAt)}</p>
                </div>
            </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

{/* ------- bottom area ------- */}
    <div className='absolute bottom-0 left-0 right-0 flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-[#18162a]/90' style={{backdropFilter: 'blur(6px)'}}>
        <div className='flex-1 flex items-center bg-[#23213a] px-3 py-2 sm:px-3 sm:py-3 rounded-full border border-violet-500 gap-2'>
            <input 
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
