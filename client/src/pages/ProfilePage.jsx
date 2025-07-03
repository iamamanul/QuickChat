import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {

  const {authUser, updateProfile} = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!selectedImg){
      await updateProfile({fullName: name, bio});
      navigate('/');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async ()=>{
      const base64Image = reader.result;
      await updateProfile({profilePic: base64Image, fullName: name, bio});
      navigate('/');
    }
    
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center p-4 sm:p-8'>
      <div className='w-full max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5 p-6 sm:p-10 flex-1">
          <h3 className="text-lg sm:text-xl">Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity'>
            <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`}/>
            <span className='text-sm sm:text-base'>upload profile image</span>
          </label>
          <input 
            onChange={(e)=>setName(e.target.value)} 
            value={name}
            type="text" 
            required 
            placeholder='Your name' 
            className='p-3 sm:p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-white bg-transparent'
          />
          <textarea 
            onChange={(e)=>setBio(e.target.value)} 
            value={bio} 
            placeholder="Write profile bio" 
            required 
            className="p-3 sm:p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-white bg-transparent" 
            rows={4}
          ></textarea>

          <button 
            type="submit" 
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-3 sm:p-2 rounded-full text-lg cursor-pointer hover:opacity-90 transition-opacity min-h-[44px]"
          >
            Save
          </button>
        </form>
        <img 
          className={`max-w-20 sm:max-w-44 aspect-square rounded-full mx-4 sm:mx-10 max-sm:mt-6 ${selectedImg && 'rounded-full'}`} 
          src={authUser?.profilePic || assets.logo_icon} 
          alt="" 
        />
      </div>
     
    </div>
  )
}

export default ProfilePage
