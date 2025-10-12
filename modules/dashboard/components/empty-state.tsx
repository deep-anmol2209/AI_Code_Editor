import React from 'react'
import Image from 'next/image'
function EmptyState() {
  return (
   <div className='flex flex-col items-center justify-center py-16'>
    <Image src="/empty-state.png" width={"20"} height={"20"} alt="No Projects" className='w-10 h-10 mb-4' />
    <h2 className='text-xl font-semibold text-gray-500 '>No projects found</h2>
    <p className='text-gray-400'> create a new project to get started</p>
   </div>
  )
}

export default EmptyState