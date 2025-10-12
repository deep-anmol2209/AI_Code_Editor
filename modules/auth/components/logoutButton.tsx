import React, { JSX, ReactNode } from 'react'
import { signOut } from 'next-auth/react'
import {useRouter} from 'next/navigation';
type logoutButtonProps ={
  children: ReactNode
}

 function LogoutButton({children}: logoutButtonProps): JSX.Element {
  const router = useRouter()
  const handleLogout= async()=>{
   await signOut();
   router.refresh()
  }
  return (
    <span onClick={handleLogout} className='cursor-pointer'>
      {children}
    </span>
  )
}

export default LogoutButton