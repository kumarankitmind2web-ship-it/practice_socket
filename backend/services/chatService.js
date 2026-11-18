import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const getUser=async(req,res)=>
{
    try
    {
        const user=await User.find({isDeleted:false}).select('-password').lean();
        return res.status(200).json({status:true,message:'User fetched successfully',data:user});
    }
    catch(error)
    {
        console.log("ChatService Error,failed to fetch user",error);
        throw new Error(error.message || 'Error fetching user');
    }
}

export { getUser };
