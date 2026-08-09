import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';
import { useMobileNavigation } from '../hooks/useMobileNavigation';

const ProfilePage = () => {

  const {authUser, updateProfile} = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)

  // Mobile navigation hook
  const { isMobile } = useMobileNavigation(null, null);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!selectedImg){
      await updateProfile({fullName: name, bio});
      if (isMobile) {
        navigate('/');
      } else {
        navigate('/');
      }
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async ()=>{
      const base64Image = reader.result;
      await updateProfile({profilePic: base64Image, fullName: name, bio});
      if (isMobile) {
        navigate('/');
      } else {
        navigate('/');
      }
    }
    
  }

  // Handle back button for mobile
  useEffect(() => {
    if (isMobile) {
      const handlePopState = (event) => {
        // If user tries to go back from profile, navigate to home
        event.preventDefault();
        navigate('/');
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isMobile, navigate]);

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center p-4 sm:p-8'>
      <div className='w-full max-w-2xl bg-[#18162a]/90 backdrop-blur-2xl text-gray-300 border border-gray-600 flex flex-col-reverse sm:flex-row items-center sm:items-stretch justify-between rounded-2xl overflow-hidden shadow-2xl'>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5 p-6 sm:p-10 w-full sm:flex-1">
          <h3 className="text-lg sm:text-xl font-semibold border-b border-gray-600 pb-2">Edit Profile</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors border border-dashed border-gray-500'>
            <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" className={`w-12 h-12 object-cover ${selectedImg && 'rounded-full'}`}/>
            <span className='text-sm sm:text-base'>Upload new avatar</span>
          </label>
          <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Full Name</label>
              <input 
                onChange={(e)=>setName(e.target.value)} 
                value={name}
                type="text" 
                required 
                placeholder='Your name' 
                className='p-3 sm:p-3 bg-[#23213a] border border-gray-600 rounded-lg focus:outline-none focus:border-violet-500 text-white placeholder-gray-500 transition-colors'
              />
          </div>
          <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Bio</label>
              <textarea 
                onChange={(e)=>setBio(e.target.value)} 
                value={bio} 
                placeholder="Write profile bio" 
                required 
                className="p-3 sm:p-3 bg-[#23213a] border border-gray-600 rounded-lg focus:outline-none focus:border-violet-500 text-white placeholder-gray-500 transition-colors resize-none" 
                rows={3}
              ></textarea>
          </div>

          <button 
            type="submit" 
            className="mt-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white p-3 sm:p-3 rounded-xl text-base font-medium cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
          >
            Save Changes
          </button>
        </form>

        <div className='flex flex-col items-center justify-center gap-3 p-6 sm:p-10 w-full sm:w-1/3 bg-black/20 border-b sm:border-b-0 sm:border-l border-gray-600'>
          <img src={authUser.profilePic || assets.avatar_icon} alt="" className='w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-violet-500/30 object-cover shadow-lg' />
          <h1 className='text-xl sm:text-2xl font-semibold text-center text-white'>{authUser.fullName}</h1>
          <p className='text-center text-xs sm:text-sm text-gray-400 px-2 line-clamp-3'>{authUser.bio}</p>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
