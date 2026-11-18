import {createUserService,loginUserService} from '../services/authService.js';
import bcrypt from 'bcrypt';

const register=async(req,res)=>
{
    try
    {   
        const {name,email,password,username,avataar}=req.body;
        const user=await createUserService({name,email,password,username,avataar});
        
        if(!user.status)
        {
            return res.status(400).json({status:false,message:'Error registering user'});
        }

        return res.status(201).json({status:true,message:'User registered successfully',data:user});
    }
    catch(error)
    {
        let errorMessage=error.message || 'Error registering user';
        console.error('Error registering user:', error);
        return res.status(500).json({status:false,message:errorMessage,actualError:error.message});
    }
}

const login=async(req,res)=>
{
    try
    {   
        const {email,password}=req.body;
        const user=await loginUserService(email,password);
        
        if(!user || !user.accessToken || !user.refreshToken || !user.user)
        {
            return res.status(401).json({status:false,message:'Something went wrong, please try again.'});
        }

        const refreshToken=user.refreshToken;
        const accessToken=user.accessToken;

        res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 8 * 60 * 60 * 1000,
        sameSite: "lax",
        path: "/auth/refresh"
        });

        return res.status(200).json({status:true,message:'User logged in successfully',accessToken:accessToken,data:user.user});
    }
    catch(error)
    {                       
      console.log('Error logging in user:', error.message);
      return res.status(500).json({status:false,message:'Error logging in user',actualError:error.message});
    }
}

const logout=async(req,res)=>
{
    try
    {
        res.clearCookie("refreshToken", { path: "/api/auth/refresh" }); 
        return res.status(200).json({status:true,message:'User logged out successfully'});
    }
    catch(error)
    {
        console.error('Error logging out user:', error);
        return res.status(500).json({status:false,message:'Error logging out user',actualError:error.message});
    }

}

const checkUniqueUsername=async(req,res)=>
{
    try
    {
        const {username}=req.params;
        const user=await User.findOne({username:username});         

    }
    catch(error)
    {
        console.error('Error checking unique username:', error);
        return res.status(500).json({status:false,message:'Error checking unique username',actualError:error.message}); 
    }
}

const me=async(req,res)=>{
   try
   {
   
    const userId=req.user?._id;
    return res.status(200).json({status:true,message:'User data fetched successfully',data:req.user});
    if(!userId)
    {
        return res.status(400).json({status:false,message:'User not authenticated'});
    }

    const user=await User.findById(userId).select('-password');
    if(!user)
    {
        return res.status(404).json({status:false,message:'User not found'});
    }
    return res.status(200).json({status:true,message:'User data fetched successfully',data:user});  
   }
   catch(error)
   {
    console.error('Error fetching user data:', error);
    return res.status(500).json({status:false,message:'Error fetching user data',actualError:error.message});
   }
}

const refreshToken=async(req,res)=>
{
  try
  {
    const refreshToken=req.cookies.refreshToken;
    return res.json({refreshToken});

  }
  catch(error)
  {
      console.log(error);
  }
}

export { register, login, logout,me ,refreshToken};