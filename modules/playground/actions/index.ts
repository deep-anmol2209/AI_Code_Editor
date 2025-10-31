"use server";

import { db } from "@/lib/db";
import { TemplateFolder } from "../utils/playground-utils";
import { getCurrentUser } from "@/modules/auth/actions";





export const getPlaygroundById = async(id:string)=>{
    try {
        const playground = await db.playground.findUnique({
            where:{id},
            select:{
              id: true,
                title:true,
                template: true,
                templateFiles:{
                    select:{
                        content:true
                    }
                }
            }
        })
        return playground;
    } catch (error) {
        console.log(error)
    }
}

export const SaveUpdatedCode = async (playgroundId: string, data: TemplateFolder) => {
    const user = await getCurrentUser();
    if (!user) return null;
  
    try {
      const updatedPlayground = await db.templateFile.upsert({
        where: {
          playgroundId,
        },
        update: {
          content: JSON.stringify(data),
          updatedAt: new Date(), // optional, Prisma usually handles @updatedAt
        },
        create: {
          playgroundId,
          content: JSON.stringify(data),
          createdDate: new Date(), // must set explicitly for non-nullable
        },
      });
  
      return updatedPlayground;
    } catch (error) {
      console.log("SaveUpdatedCode error:", error);
      return null;
    }
  };
  