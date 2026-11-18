import User from '../models/UserModel.js';
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";


const createUserService=async(userData)=>
{
    try
    {   
        let saltRounds=10;
        if(!userData.email || !userData.name || !userData.password)
        {
            throw new Error('Email, name, and password are required');
        }

        if(await User.findOne({email:userData.email}))
        {
            throw new Error('User with this email already exists');
        } 

        let checkUpdatedUsername=await User.findOne({username:userData.username});
        if(checkUpdatedUsername)
        {
            throw new Error('User with this username already exists');
        }

        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(userData.password, salt); 

        userData.password=hash;
        const user=await User.create(userData);
        return user;
    }
    catch(error)
    {
        console.log("ChatService Error,failed to create user",error);
        throw new Error(error.message || 'Error creating user');
    }
}

const getUser=async(email)=>
{
    try
    {
        const user=await User.findOne({email,isDeleted:false}).lean();
        if(!user)
        {
            return null;
        }
        return user;
    }
    catch(error)
    {
       console.error('Error fetching user:', error);
       return res.status(500).json({status:false,message:'Error fetching user',actualError:error.message});
    }
}

const loginUserService=async(email,password)=>
{
    try
    {
        if(!email || !password)
        {
            throw new Error('Email and password are required');
        }

        let user=await getUser(email);
        if(!user || user==="")
        {
            throw new Error('User not found');
        }

        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid)
        {  
            throw new Error('Invalid password');
        }
        
        const AccessTokenExpiration=process.env.ACCESS_TOKEN_EXPIRATION || '1h';
        const RefreshTokenExpiration=process.env.REFRESH_TOKEN_EXPIRATION || '8h';
        const accessToken=generateToken(user,AccessTokenExpiration);
        const refreshToken=generateToken(user,RefreshTokenExpiration);
        return {status:true,accessToken,refreshToken,user};
    }
    catch(error)
    {
       console.error('Error logging in user:', error);
       throw new Error(error.message || 'Error logging in user');
    }
}

const checkduplicateUsername=async(username)=>
{
    try
    {
        if(!username)
        {
            throw new Error('Username is required');
        }

        const user=await User.findOne({username:username,isDeleted:false}).lean();
        if(user)
        {
           return true;
        }
         
        return false;
    }
    catch(error)
    {
        console.error('Error checking duplicate username:', error);
        throw new Error(error.message || 'Error checking duplicate username');
    }
}

export { createUserService,getUser,loginUserService,checkduplicateUsername};
