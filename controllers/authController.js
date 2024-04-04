const UserModel = require("../models/userSchema");
const emailValidator=require("email-validator")
const bcrypt=require('bcrypt')


const signup = (req, res, next) => {
    
    
    
    const { name, email, password, confirmPassword } = req.body;

    console.log(name, email, password, confirmPassword);

    if(!name || !email || !password || !confirmPassword){
        return res.status(400).json({
            success: false,
            message:"Every field is required"
        });

    }

    const validEmail=emailValidator.validate(email)
    if(!validEmail){

        return res.status(400).json({
            success: false,
            message:"please provide a valid email id"
        });

    }
    if(password != confirmPassword){
        return res.status(400).json({
            success: false,
            message:"please enter a valid passwords"
        });
    }

    try{
        const userInfo= UserModel(req.body);
        const result=userInfo.save();

        return res.status(200).json({
            success: true,
            data: {}
        });

    }
    catch(e){
        if(e.code===11000){
            return res.status(400).json({
                success: false,
                message:"this user is already exists"
            });
        }
        return res.status(400).json({
            success: false,
            message:e.message
        });

    }
    
   
};


const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Both email and password are required"
        });
    }
    

    try {
        const user = await UserModel.findOne({ email }).select("+password");

        if(!user ||!(await bcrypt.compare(password, user.password))){
            return res.status(400).json({
                success: false,
                message: "invalid ceredentails"
            });

        }

        // Generate JWT token
        const token = user.jwtToken();
        
        // Clear password from response
        user.password = undefined;

        // Set cookie with token
        const cookieOption = {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            httpOnly: true
        };
        res.cookie("token", token, cookieOption);

        // Send successful response
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        });
    }
};


const getuser=async(req, res,next)=>{
    const userId=req.user.id;

    try{
        const user=await UserModel.findById(userId);
        return res.status(200).json({
            success:true,
            data:user
        })

    }catch(e){
        return res.status(400).json({
            success:false,
            message:e.message
        })

    }

}   

const logout=(req, res)=>{
         try{
            const cookieOption={
                expires:new Date(),
                httpOnly:true
            };

            res.cookie("token", null, cookieOption);
            res.status(200).json({
                sucess:true,
                message:"Logged Out"
            })

         }catch(e){

            res.status(400).json({
                sucess:false,
                message:e.message
            })

         }
}
    


module.exports = {
    signup,
    signin,
     getuser,
     logout
};
