import React from 'react'
import SigninForm from '@/modules/auth/components/SigninForm'
import Image from 'next/image'


export default function Page() {
  
  return (
    <>
     <Image src={"/login2.png"} alt='Login-Image' style={{height: "500px", width: "500px"}} height={500}  width={500} className='m-2 object-cover'/>
     <SigninForm/>
    </>
   
  )
}
