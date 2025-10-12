"use client";

import React from 'react'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
function UserButton() {

    const session = useSession();
    const user = session?.data?.user;
  return (
    <> 
    <Avatar>
        {
            user?.image ?(<AvatarImage src={user.image}/>) :(
               < AvatarFallback>{user?.name?.charAt(0).toLocaleUpperCase()} </AvatarFallback>
            )
        }
    </Avatar>
    </>
  )
}

export default UserButton