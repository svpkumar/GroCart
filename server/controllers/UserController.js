import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


//RegisterUser : /api/user/register
export const register = async( req, res ) =>{
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.json({success:false, message:'Missing Details'}); 
        }
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.json({success:false, message:'User already exists!!'}); 
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password:hashedPassword,
        });

        const token =  jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});

        res.cookie('token', token, {
            httpOnly:true, //Prevent Js from accessing the cookie
            secure:process.env.NODE_ENV === 'production', //Use secure cookie in production
            sameSite:process.env.NODE_ENV === 'production' ? 'none' :'strict',//Prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days we add in ms
        });

        return res.json({success:true, user:{email:user.email, name:user.name}});
    } catch (error) {
        console.log(error.message);
        return res.json({success:false, message:error.message});
    }
}

//LoginUser : /api/user/login
export const login = async(req,res) =>{
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.json({success:false, message:'Email and password required!'}); 
        }
        const user = await User.findOne({email});

        if(!user){
            return res.json({success:false, message:'Invalid Credentials'}); 
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.json({success:false, message:'Invalid Credentials'}); 
        }

        const token =  jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});

        res.cookie('token', token, {
            httpOnly:true, //Prevent Js from accessing the cookie
            secure:process.env.NODE_ENV === 'production', //Use secure cookie in production
            sameSite:process.env.NODE_ENV === 'production' ? 'none' :'strict',//Prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days we add in ms
        });

        return res.json({success:true, user:{name:user.name, email:user.email}});

    } catch (error) {
        console.log(error.message);
        return res.json({success:false, message:error.message});
    }
}

//checkAuth : /api/user/is-auth
export const isAuth = async(req,res) =>{
    try {
        const { userId } = req.body;
        const user = await User.findById(userId).select('-password');
        return res.json({success:true, user});
    } catch (error) {
        console.log(error.message);
        return res.json({success:false, message:error.message});
    }
}

//LogoutUser : /api/user/logout
export const logout = async(req,res) =>{
    try {
        res.clearCookie('token',{
            httpOnly:true, 
            secure:process.env.NODE_ENV === 'production', 
            sameSite:process.env.NODE_ENV === 'production' ? 'none' :'strict',
        });
        return res.json({success:true, message:'Logged out successfully'});
    } catch (error) {
        console.log(error.message);
        return res.json({success:false, message:error.message});   
    }
}

