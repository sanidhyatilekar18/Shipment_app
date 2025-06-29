import React, { useState } from 'react'
import { auth , provider} from '../config/firebase'
import { createUserWithEmailAndPassword,signInWithPopup,signOut } from 'firebase/auth'
function Auth() {
   const[email,setEmail]= useState("")
   const[password,setPassword]= useState("")

    const signIn= async ()=>{
        try {
            await signInWithEmailAndPassword(auth,email,password)
        } catch (error) {
            console.log(error.message);
        }
    }

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.log(error.message);
        }
    }
    const logOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.log(error.message);
        }
    }
  return (
    <div>
        <input type="text" placeholder='Email' onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)} />
        <button className='cursor-pointer border-2'  onClick={signIn}>Sign in</button>
        <button className='cursor-pointer border-2'  onClick={signInWithGoogle}>Sign in with Google</button>
        <button className='cursor-pointer border-2'  onClick={logOut}>Log out</button>
    </div>
  )
}

export default Auth