// import React from 'react'
// import { deleteProjectById, duplicateProjectByid, editProjectById } from '@/modules/dashboard/actions'
// import AddRepo from '@/modules/dashboard/components/add-repo'
// import AddNewButton from '@/modules/dashboard/components/add-new'
// import { getAllPlaygroundsForUser } from '@/modules/dashboard/actions'
// import EmptyState from '@/modules/dashboard/components/empty-state'
// import ProjectTable from '@/modules/dashboard/components/project-table'
// const Page = async () => {
//   const playgrounds = await getAllPlaygroundsForUser();
//   return (
//     <div className='flex flex-col flex-wrap justify-start items-center min-h-screen mx-auto max-w-7xl px-4 py-10'>
//       <div className='grid grid-cols-1 xl:grid-cols-2 gap-6 '>
//         <AddNewButton/>
//         <AddRepo/>
//       </div>

//       <div className='mt-10 flex flex-col justify-center items-center overflow-x-scroll lg:overflow-visible'>
//         {
//           playgrounds && playgrounds?.length === 0 ?(
//             <EmptyState/>
//           ): (
//             <ProjectTable
//             projects= {playgrounds || []}
//             onDeleteProject={deleteProjectById}
//             onUpdateProject={editProjectById}
//             onDuplicateProject={duplicateProjectByid}
//             />
//           )
        
//         }
//       </div>
//     </div>
//   )
// }

// export default Page



import React from "react";
import {
  deleteProjectById,
  duplicateProjectByid,
  editProjectById,
  getAllPlaygroundsForUser,
} from "@/modules/dashboard/actions";
import AddRepo from "@/modules/dashboard/components/add-repo";
import AddNewButton from "@/modules/dashboard/components/add-new";
import EmptyState from "@/modules/dashboard/components/empty-state";
import ProjectTable from "@/modules/dashboard/components/project-table";

const Page = async () => {
  const playgrounds  = await getAllPlaygroundsForUser();

  return (
    <div
      className="
        relative flex flex-col items-center justify-start 
        min-h-screen mx-auto max-w-7xl px-6 py-12
        bg-gradient-to-br from-white via-violet-50 to-fuchsia-100
        dark:from-black dark:via-zinc-900 dark:to-fuchsia-950
        transition-all duration-500
      "
    >
      {/* Soft glowing background accent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.1),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(244,114,182,0.08),transparent_60%)] blur-3xl" />

      {/* Top Action Buttons */}
      <div
        className="
          grid grid-cols-1 xl:grid-cols-2 gap-6 z-10
          w-full backdrop-blur-md bg-white/50 dark:bg-zinc-900/40
          rounded-2xl shadow-xl p-6
          border border-white/20 dark:border-zinc-700/50
        "
      >
        <AddNewButton />
        <AddRepo />
      </div>

      {/* Project Table */}
      <div className="mt-10 flex flex-col justify-center items-center w-full z-10">
        {playgrounds && playgrounds.length === 0 ? (
          <EmptyState />
        ) : (
          <div
            className="
              w-full rounded-2xl shadow-2xl bg-white/70 dark:bg-zinc-900/60
              backdrop-blur-xl border border-white/20 dark:border-zinc-700/40
              p-4 overflow-x-auto lg:overflow-visible
              transition-all duration-500
            "
          >
            <ProjectTable
              projects={playgrounds || []}
              onDeleteProject={deleteProjectById}
              onUpdateProject={editProjectById}
              onDuplicateProject={async(id: string)=>{
                await duplicateProjectByid(id)}}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
