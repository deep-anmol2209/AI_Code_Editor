import {db} from "../../../lib/db"
import {auth} from "../../../auth"
export const getUserById = async(id: string)=>{
try{
    const user = db.user.findUnique({
        where: {id},
        include: {
            accounts: true
        }
    })

    return user
}catch(err){
    console.log(err);
    return null
    
}

}

export const getAccountByUserId = async(userId: string)=>{

    try{
        const account = db.account.findFirst({
            where:{
                userId
            }
        })
    
        return account
    }catch(err){
        console.log(err);
        return null
        
    }
}

export const getCurrentUser = async()=>{
    const user = await auth();
    return user?.user;
}