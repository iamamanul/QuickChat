import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {

  // Default to Login
  const [currState, setCurrState] = useState("Login")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {login} = useContext(AuthContext)

  const onSubmitHandler = async (event)=>{
    event.preventDefault();
    setErrorMsg("");

    if(currState === 'Sign up' && !isDataSubmitted){
      setIsDataSubmitted(true)
      return;
    }
    setLoading(true);
    try {
      await login(currState=== "Sign up" ? 'signup' : 'login', {fullName, email, password, bio});
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMsg("⚡ Oops! Just try again. The Render free server may need a moment to wake up. 🌈");
    }
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-4 sm:gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl p-4 sm:p-8'>

      {/* -------- left -------- */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw,200px)] sm:w-[min(30vw,250px)]'/>

      {/* -------- right -------- */}

      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 rounded-lg shadow-lg w-full max-w-md'>
        <h2 className='font-medium text-xl sm:text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && currState === 'Sign up' && <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer'/>
          }
        </h2>

        {errorMsg && (
          <div className="rounded-md p-3 mb-2 text-center font-semibold bg-gradient-to-r from-pink-400 via-yellow-300 to-green-400 text-gray-900 animate-pulse shadow-lg">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        {currState === "Login" && (
          <>
            <input 
              onChange={(e)=>setEmail(e.target.value)} 
              value={email}
              type="email" 
              placeholder='Email Address' 
              required 
              className='p-3 sm:p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-white bg-transparent'
            />
            <input 
              onChange={(e)=>setPassword(e.target.value)} 
              value={password}
              type="password" 
              placeholder='Password' 
              required 
              className='p-3 sm:p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-white bg-transparent'
            />
            <button type='submit' className='py-3 sm:py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer hover:opacity-90 transition-opacity min-h-[44px] flex items-center justify-center' disabled={loading}>
              {loading ? (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : (
                "Login Now"
              )}
            </button>
            <div className='flex flex-col gap-2'>
              <p className='text-sm text-gray-600'>Create an account <span onClick={()=> {setCurrState("Sign up"); setIsDataSubmitted(false);}} className='font-medium text-violet-500 cursor-pointer hover:underline'>Click here</span></p>
            </div>
          </>
        )}

        {/* Signup Form */}
        {currState === "Sign up" && (
          <>
            {!isDataSubmitted && (
              <input 
                onChange={(e)=>setFullName(e.target.value)} 
                value={fullName}
                type="text" 
                className='p-3 sm:p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-white bg-transparent' 
                placeholder="Full Name" 
                required
              />
            )}
            {!isDataSubmitted && (
              <>
                <input 
                  onChange={(e)=>setEmail(e.target.value)} 
                  value={email}
                  type="email" 
                  placeholder='Email Address' 
                  required 
                  className='p-3 sm:p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-white bg-transparent'
                />
                <input 
                  onChange={(e)=>setPassword(e.target.value)} 
                  value={password}
                  type="password" 
                  placeholder='Password' 
                  required 
                  className='p-3 sm:p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-white bg-transparent'
                />
              </>
            )}
            {isDataSubmitted && (
              <textarea 
                onChange={(e)=>setBio(e.target.value)} 
                value={bio}
                rows={4} 
                className='p-3 sm:p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-white bg-transparent' 
                placeholder='provide a short bio...' 
                required
              ></textarea>
            )}
            <button type='submit' className='py-3 sm:py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer hover:opacity-90 transition-opacity min-h-[44px] flex items-center justify-center' disabled={loading}>
              {loading ? (
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : (
                "Create Account"
              )}
            </button>
            <div className='flex flex-col gap-2'>
              <p className='text-sm text-gray-600'>Already have an account? <span onClick={()=> {setCurrState("Login"); setIsDataSubmitted(false);}} className='font-medium text-violet-500 cursor-pointer hover:underline'>Login here</span></p>
            </div>
          </>
        )}
      </form>
    </div>
  )
}

export default LoginPage
