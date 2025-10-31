"use server";

import { db } from "@/lib/db";
import { Playground } from "@/lib/generated/prisma";
import { getCurrentUser } from "@/modules/auth/actions";
import { revalidatePath } from "next/cache";

export const getAllPlaygroundsForUser = async () => {
    const user = await getCurrentUser();
  
    try {
      const playgrounds = await db.playground.findMany({
        where: { userId: user?.id },
        include: {
          user: true,
          Starmark: {
            where: { userId: user?.id },
            select: { isMarked: true },
          },
        },
      });
      return playgrounds;
    } catch (error) {
      console.error(error);
      return []; // ✅ ensures return type is always Playground[]
    }
  };

export const createPlayground=async(data:{
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR" | "GITHUB" ;
    description: string;
    repoUrl: string;
})=>{
   const user = await getCurrentUser();
   if (!user?.id) throw new Error("User not authenticated");
  console.log(user);
  
   const {template, title, description, repoUrl}= data;
   try{
    const playground= await db.playground.create({
        data:{
            title: title ?? "",
            description: description ?? "",
            template: template,
            repoUrl: repoUrl,
            userId: user.id
        }
    })
    console.log("playy: ",playground);
    
    return playground
   }catch(error){
    console.log(error);
    
   }

}

export const deleteProjectById = async(id:string)=>{
try{

    await db.playground.delete({
        where:{
            id
        }
    })

    revalidatePath("/dashboard")
}catch(error){
    console.log(error);
    
}
}

export const editProjectById = async(id:string, data:{title:string, description:string})=>{
    try {
        await db.playground.update({
            where:{
                id
            },
            data:data
        })
        revalidatePath("/dashboard")
    } catch (error) {
        console.log(error);
        
    }
}

export const duplicateProjectByid = async (id: string): Promise<Playground> => {
    try {
      const originalPlaygroundData = await db.playground.findUnique({
        where: { id },
      });
  
      if (!originalPlaygroundData) {
        throw new Error("Original playground not found");
      }
  
      const duplicatedPlayground = await db.playground.create({
        data: {
          title: `${originalPlaygroundData.title} (copy)`,
          description: originalPlaygroundData.description ?? "",
          template: originalPlaygroundData.template,
          userId: originalPlaygroundData.userId,
        },
      });
  
      revalidatePath("/dashboard");
      return duplicatedPlayground; // ✅ returning the new project
    } catch (error) {
      console.error(error);
      throw error; // ✅ rethrow so the client can handle it
    }
  };
  

export const toggleStarMarked = async(playgroundId:string, isChecked:boolean)=>{
    const user = await getCurrentUser()
    const userId= user?.id;
    if(!userId){
        throw new Error("userId is required")
    }
    try{
        if(isChecked){
            await db.starMark.create({
                data:{
                    userId:userId!,
                    playgroundId,
                    isMarked: isChecked
                },
            })
        }else{
   await db.starMark.delete({
    where: {
        userId_playgroundId:{
            userId,
            playgroundId
        }
    }
   })
        }
        revalidatePath("/dashboard")
        return {success: true, isMarked: isChecked}
    }catch(error){
        console.log(error);
        
    }
}