import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { useMobileNavigation } from '../hooks/useMobileNavigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const Sidebar = () => {

    const {getUsers, users, selectedUser, setSelectedUser,
        unseenMessages, setUnseenMessages } = useContext(ChatContext);

    const {logout, onlineUsers} = useContext(AuthContext)

    const [input, setInput] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false);
    
    // New states for friend system
    const [activeTab, setActiveTab] = useState('chats'); // 'chats', 'search', 'requests'
    const [searchUsername, setSearchUsername] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [friendRequests, setFriendRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState(new Set());

    const navigate = useNavigate();
    
    // Mobile navigation hook
    const { navigateToChat, navigateToProfile, isMobile } = useMobileNavigation(selectedUser, setSelectedUser);

    const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    useEffect(()=>{
        getUsers();
        if (activeTab === 'requests') {
            fetchFriendRequests();
        }
    },[onlineUsers, activeTab])

    const fetchFriendRequests = async () => {
        try {
            const { data } = await axios.get('/api/auth/requests');
            if (data.success) {
                setFriendRequests(data.requests);
            }
        } catch (error) {
            console.error("Error fetching requests", error);
        }
    };

    const handleSearchUser = async (e) => {
        e.preventDefault();
        if (!searchUsername.trim()) return;
        try {
            const { data } = await axios.get(`/api/auth/search/${searchUsername}`);
            if (data.success) {
                setSearchResult(data.user);
                if (!data.user) toast.error("User not found");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Search failed");
        }
    };

    const sendFriendRequest = async (targetUserId) => {
        try {
            const { data } = await axios.post('/api/auth/request/send', { targetUserId });
            if (data.success) {
                toast.success("Request sent!");
                setSentRequests(prev => new Set(prev).add(targetUserId));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to send request");
        }
    };

    const handleFriendRequest = async (targetUserId, action) => {
        try {
            const endpoint = action === 'accept' ? '/api/auth/request/accept' : '/api/auth/request/reject';
            const { data } = await axios.post(endpoint, { targetUserId });
            if (data.success) {
                toast.success(`Request ${action}ed`);
                fetchFriendRequests();
                getUsers(); // Refresh friends list
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(`Failed to ${action} request`);
        }
    };

    useEffect(()=>{
        getUsers();
    },[onlineUsers])

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMenu && !event.target.closest('.menu-container')) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    const handleUserClick = (user) => {
        if (loadingChat) return;
        setLoadingChat(true);
        setTimeout(() => {
            if (isMobile) {
                navigateToChat(user);
            } else {
                setSelectedUser(user);
            }
            setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }));
            setLoadingChat(false);
        }, 200); // 200ms delay for smoothness
    };

    const handleProfileClick = () => {
        setShowMenu(false);
        if (isMobile) {
            navigateToProfile();
        } else {
            navigate('/profile');
        }
    };

    const handleLogoutClick = () => {
        setShowMenu(false);
        logout();
    };

  return (
    <div className={`bg-[#8185B2]/10 h-full p-3 sm:p-5 rounded-r-xl overflow-auto will-change-transform text-white tablet-sidebar ${selectedUser ? "max-md:hidden" : ''}`}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
            <img src={assets.logo} alt="logo" className='max-w-32 sm:max-w-40 tablet-logo' />
            <div className="relative py-2 menu-container">
                <img 
                    src={assets.menu_icon} 
                    alt="Menu" 
                    className='max-h-5 cursor-pointer tablet-menu-icon' 
                    onClick={() => setShowMenu(!showMenu)}
                />
                {showMenu && (
                    <div className='absolute top-full right-0 z-20 w-32 p-3 rounded-md bg-[#282142] border border-gray-600 text-gray-100 shadow-lg tablet-menu'>
                        <p 
                            onClick={handleProfileClick} 
                            className='cursor-pointer text-sm hover:text-white transition-colors tablet-menu-item'
                        >
                            Edit Profile
                        </p>
                        <hr className="my-2 border-t border-gray-500" />
                        <p 
                            onClick={handleLogoutClick} 
                            className='cursor-pointer text-sm hover:text-white transition-colors tablet-menu-item'
                        >
                            Logout
                        </p>
                    </div>
                )}
            </div>
        </div>

        <div className='flex gap-2 mt-4 px-1 text-xs sm:text-sm font-medium'>
            <button onClick={()=>setActiveTab('chats')} className={`flex-1 py-1 rounded-md transition-colors ${activeTab === 'chats' ? 'bg-[#282142] text-white' : 'text-gray-400 hover:text-white'}`}>Chats</button>
            <button onClick={()=>setActiveTab('search')} className={`flex-1 py-1 rounded-md transition-colors ${activeTab === 'search' ? 'bg-[#282142] text-white' : 'text-gray-400 hover:text-white'}`}>Find</button>
            <button onClick={()=>setActiveTab('requests')} className={`flex-1 py-1 rounded-md transition-colors relative ${activeTab === 'requests' ? 'bg-[#282142] text-white' : 'text-gray-400 hover:text-white'}`}>
                Requests
                {friendRequests.length > 0 && <span className='absolute -top-1 -right-1 bg-violet-500 w-3 h-3 rounded-full'></span>}
            </button>
        </div>

        {activeTab === 'chats' && (
            <div className='bg-[#282142] rounded-full flex items-center gap-2 py-2 sm:py-3 px-3 sm:px-4 mt-3 tablet-search'>
                <img src={assets.search_icon} alt="Search" className='w-3 tablet-search-icon'/>
                <input 
                    onChange={(e)=>setInput(e.target.value)} 
                    type="text" 
                    className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1 tablet-search-input' 
                    placeholder='Search Friends...'
                />
            </div>
        )}
      </div>

    {loadingChat ? (
        <div className="flex flex-1 items-center justify-center h-full">
            <svg className="animate-spin h-10 w-10 text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
        </div>
    ) : (
        <>
        {activeTab === 'chats' && (
            <div className='flex flex-col tablet-users-list'>
                {filteredUsers.length === 0 ? (
                    <p className='text-center text-gray-400 text-sm mt-4'>No friends found.</p>
                ) : (
                    filteredUsers.map((user, index) => (
                        <div
                            onClick={() => handleUserClick(user)}
                            key={index}
                            className={`relative flex items-center gap-2 p-2 pl-3 sm:pl-4 rounded cursor-pointer text-sm sm:text-base hover:bg-[#282142]/30 transition-colors tablet-user-item ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}
                            style={{ pointerEvents: loadingChat ? 'none' : 'auto', opacity: loadingChat ? 0.6 : 1 }}
                        >
                            <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[30px] sm:w-[35px] aspect-[1/1] rounded-full tablet-user-avatar' />
                            <div className='flex flex-col leading-4 sm:leading-5 min-w-0 flex-1 tablet-user-info'>
                                <p className='truncate tablet-user-name'>{user.fullName}</p>
                                {onlineUsers.includes(user._id)
                                    ? <span className='text-green-400 text-xs tablet-user-status'>Online</span>
                                    : <span className='text-neutral-400 text-xs tablet-user-status'>Offline</span>
                                }
                            </div>
                            {unseenMessages[user._id] > 0 && (
                                <p className='absolute top-2 right-2 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50 tablet-unread-badge'>
                                    {unseenMessages[user._id]}
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        )}

        {activeTab === 'search' && (
            <div className='flex flex-col gap-4'>
                <form onSubmit={handleSearchUser} className='flex items-center gap-2'>
                    <input 
                        type="text" 
                        value={searchUsername}
                        onChange={(e)=>setSearchUsername(e.target.value)}
                        placeholder="Enter exactly username or email..."
                        className='bg-[#282142] p-2 rounded-md outline-none text-sm w-full text-white placeholder-gray-400'
                    />
                    <button type="submit" className='bg-violet-600 hover:bg-violet-500 text-white p-2 rounded-md text-sm font-medium'>Search</button>
                </form>
                {searchResult && (
                    <div className='flex items-center justify-between p-3 bg-[#282142]/50 rounded-lg'>
                        <div className='flex items-center gap-3'>
                            <img src={searchResult.profilePic || assets.avatar_icon} alt="" className='w-10 h-10 rounded-full' />
                            <div>
                                <p className='text-sm font-semibold'>{searchResult.fullName}</p>
                                <p className='text-xs text-gray-400'>@{searchResult.username}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => sendFriendRequest(searchResult._id)} 
                            disabled={sentRequests.has(searchResult._id)}
                            className={`text-xs px-3 py-1.5 rounded-md text-white transition-colors ${
                                sentRequests.has(searchResult._id) 
                                ? 'bg-gray-500 cursor-not-allowed' 
                                : 'bg-violet-600 hover:bg-violet-500'
                            }`}
                        >
                            {sentRequests.has(searchResult._id) ? 'Sent' : 'Add'}
                        </button>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'requests' && (
            <div className='flex flex-col gap-2'>
                {friendRequests.length === 0 ? (
                    <p className='text-center text-gray-400 text-sm mt-4'>No pending requests</p>
                ) : (
                    friendRequests.map((reqUser) => (
                        <div key={reqUser._id} className='flex items-center justify-between p-3 bg-[#282142]/50 rounded-lg'>
                            <div className='flex items-center gap-2'>
                                <img src={reqUser.profilePic || assets.avatar_icon} alt="" className='w-8 h-8 rounded-full' />
                                <div className='leading-tight'>
                                    <p className='text-sm font-semibold'>{reqUser.fullName}</p>
                                    <p className='text-xs text-gray-400'>@{reqUser.username}</p>
                                </div>
                            </div>
                            <div className='flex gap-1'>
                                <button onClick={() => handleFriendRequest(reqUser._id, 'accept')} className='text-xs bg-green-600 hover:bg-green-500 px-2 py-1 rounded-md text-white'>Accept</button>
                                <button onClick={() => handleFriendRequest(reqUser._id, 'reject')} className='text-xs bg-red-600 hover:bg-red-500 px-2 py-1 rounded-md text-white'>Reject</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}
        </>
    )}

    </div>
  )
}

export default Sidebar
