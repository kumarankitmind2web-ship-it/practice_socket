import User from '../models/UserModel.js';
import Conversation from '../models/ConversationModel.js';
import Message from '../models/Message.js';
import mongoose from 'mongoose';



const getUser=async(req,res)=>{
    const {id}=req.user;
    try
    {
        if(!id)
        {
           return res.status(401).json({status:false,message:"User not found!"});
        }

        const user = await Conversation.aggregate([
        {
            $match: {
            // _id: new mongoose.Types.ObjectId(id),
            isDeleted: false
            }
        },
        {
            $lookup: {
            from: "conversations",
            localField: "_id",
            foreignField: "members.userId",
            as: "conversations"
            }
        },
        {
            $addFields: {
            conversations: {
                $sortArray: {
                input: "$conversations",
                sortBy: { createdAt: -1 }
                }
            }
            }
        }
        ]);

        if(!user)
        {
            return res.status(404).json({status:false,message:'User not found'});
        }
        return res.status(200).json({status:true,message:'User fetched successfully',data:user});
    }
    catch(error)
    {
       console.error('Error fetching user:', error);
       return res.status(500).json({status:false,message:'Error fetching user',actualError:error.message});
    }
}



export {getUser};