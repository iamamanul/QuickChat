import React, { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const RightSidebar = ({ onClose }) => {

    const {selectedUser, messages, setSelectedUser, getUsers} = useContext(ChatContext)
    const {logout, onlineUsers} = useContext(AuthContext)
    const [msgImages, setMsgImages] = useState([])
    const [showConfirm, setShowConfirm] = useState(false);

    // Get all the images from the messages and set them to state
    useEffect(()=>{
        setMsgImages(
            messages.filter(msg => msg.image).map(msg=>msg.image)
        )
    },[messages])

    const handleUnfriend = async () => {
        try {
            const { data } = await axios.post('/api/auth/unfriend', { targetUserId: selectedUser._id });
            if (data.success) {
                toast.success(data.message);
                setShowConfirm(false);
                setSelectedUser(null);
                getUsers(); // Refresh the friend list
                if (onClose) onClose();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to unfriend. Is the backend updated?");
        }
    };

  return (
    <div className='bg-gradient-to-b from-[#23213a] to-[#18162a] text-white w-full relative overflow-y-scroll animate-in slide-in-from-right duration-300 ease-out flex flex-col h-full'>
        {onClose && (
            <button onClick={onClose} className="lg:hidden absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-[#282142] rounded-full hover:bg-white/10 transition-colors z-10 shadow-lg border border-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        )}
        <div className='flex flex-col items-center gap-2 text-xs font-light mx-auto px-4 pt-12 pb-4'>
            <img src={selectedUser?.profilePic || assets.avatar_icon} alt=""
            className='w-20 h-20 rounded-full border-4 border-[#282142] shadow-lg mb-2' />
            <h1 className='text-xl font-semibold mx-auto flex items-center gap-2 text-center'>
                {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500 inline-block'></span>}
                {selectedUser.fullName}
            </h1>
            <p className='mx-auto text-center text-sm text-gray-300'>{selectedUser.bio}</p>
        </div>

        <hr className="border-[#ffffff30] my-2 mx-4"/>

        <div className="px-4 text-xs flex-1">
            <p className="text-base font-semibold mb-2">Media</p>
            <div className='mt-1 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-3 opacity-90'>
                {msgImages.map((url, index)=>(
                    <div key={index} onClick={()=> window.open(url)} className='cursor-pointer rounded'>
                        <img src={url} alt="" className='h-full w-full object-cover rounded-md'/>
                    </div>
                ))}
            </div>
        </div>

        <div className='flex gap-2 mx-4 mb-4 mt-6'>
            {showConfirm ? (
                <div className='flex flex-col flex-1 gap-2 p-3 bg-[#282142] rounded-xl border border-red-900/50 shadow-lg text-center'>
                    <p className='text-sm text-gray-300'>Remove {selectedUser.fullName}?</p>
                    <div className='flex gap-2'>
                        <button onClick={handleUnfriend} className='flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-medium py-2 rounded-md transition-colors'>
                            Yes
                        </button>
                        <button onClick={() => setShowConfirm(false)} className='flex-1 bg-gray-600 hover:bg-gray-500 text-white text-xs font-medium py-2 rounded-md transition-colors'>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setShowConfirm(true)} className='flex-1 bg-[#282142] hover:bg-red-900/40 text-red-400 border border-red-900/50 text-sm font-medium py-3 rounded-full cursor-pointer transition-colors shadow-lg'>
                    Unfriend
                </button>
            )}
            {!showConfirm && (
                <button onClick={()=> logout()} className='flex-1 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-medium py-3 rounded-full cursor-pointer hover:opacity-90 transition-opacity shadow-lg'>
                    Logout
                </button>
            )}
        </div>
    </div>
  )
}

export default RightSidebar
