import mongoose from "mongoose";
import { Farmer } from "../models/farmer.model.js";
import { Folder } from "../models/folder.model.js";
import { Submission } from "../models/submission.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiRes } from "../utils/ApiRes.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";



const generateAccessAndRefreshToken = function(user){

    try {
        const accessToken = jwt.sign({_id:user._id ,username: user.username, email: user.email},
             process.env.ACCESS_TOKEN_SECRET, {expiresIn: '60m'})
    
        const refreshToken = jwt.sign({_id:user._id, username: user.username},
            process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1d'})


        return {accessToken, refreshToken}  

    } catch (error) {
        throw new ApiError(400, `Cannot Generate Access and Refresh Tokens : ${error}`)

    }

}


const registerFarmer = asyncHandler(async (req, res) => {


    const data = req.body
    const {name, username, password, email, region}  = data;

    // Making sure no field is empty except lastname
    for (const key in data) {
        const val = data[key]

        if(!val){
            throw new ApiError(400, "None of the fields can be empty !")
        }
    }


    // Checking if user doesnt already exist

    const existingUser = await Farmer.findOne({
        $or: [{username}, {email}]
    })

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists")
    }else{
        console.log(`User is OKAY`);
    }


    // Checking length of passsword is greater than 

    if(password.length < 4){
        throw new ApiError(400, "Password cannot be shorter than 4 characters")
    }



    // making entry into the database

    const folder = await Folder.findOne({ name: region });

    if (!folder) {
        throw new ApiError(404, "Folder not found for the specified region");
    }

    console.log('Before Registering Farmer:', { name , username, email, password, region });

    const createdUser = new Farmer({
        folder_id: folder._id,
        name,
        email,
        username,
        password : password,
        region
    })

        // After creating the user instance
    console.log('After Registering Farmer:', createdUser);
    
    try {
        await createdUser.save();
      } catch (error) {
        console.error('Save operation failed:', error);
      }

    res.status(201).json( new ApiRes(201, createdUser, "Farmer Registered Successfully"))


})


const updateRefreshToken = async function(user, refreshToken){

    try {
        await Farmer.updateOne({_id: user._id}, {refreshToken: refreshToken})
    } catch (error) {
        throw new ApiError(409, "Couldn't Update User Refresh Token")
    }
}


const loginFarmer = asyncHandler(async (req, res) => {
    // General Steps
    // check and verify username and password
    // use the user property in req assigned by middleware verifyJWT
    // generate refresh and access token for the user
    // save the refresh token in the user document on mongodb
    // send the access token in the cookies back to the user
    
    const {username, password} = req.body

    // Fetching User from model query
    const loginUser = await Farmer.findOne({username: username})

    if(!loginUser){
        throw new ApiError(409, `User with username: ${username} does not exist !`)
    }

    // Checking if password matches the hash

    const matchingPasswords = await loginUser.checkPassword(password)



    if(!matchingPasswords){
        throw new ApiError(400, "Password Entered is not Correct")
    }

    const {accessToken, refreshToken} = generateAccessAndRefreshToken(loginUser)

    updateRefreshToken(loginUser, refreshToken)



    const loggedInUser = await Farmer.findById(loginUser._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(201).cookie('accessToken', accessToken ,options)
    .cookie('refreshToken', refreshToken, options )
    .json(
        new ApiRes(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )


})



const makeSubmission = asyncHandler(async (req, res) => {

    try {

        const {crop_type, region, images, additional_data, crop_cycle } = req.body;

        const newSubmission = new Submission({
            farmer_id : req.user._id,
            crop_type,
            region,
            images,
            additional_data,
            crop_cycle
        });

        await newSubmission.save();

        res.status(201).json({ message: 'Crop data submitted successfully', submission: newSubmission });
   
    } catch (error) {
        console.error('Error submitting crop data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


const getAllSubmissions =  asyncHandler(async (req, res) => {

    try {
        
        const farmerId = req.user._id;
        
        const submissions = await Submission.find({ farmer_id: farmerId });

        res.status(200).json({ submissions });

    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


const getSubmission = asyncHandler(async (req, res) => {

    try{

        const {submissionId} = req.params;
        
        const submission = await Submission.findById(submissionId);

        res.json({submission})


    }catch (error) {
        console.error('Error fetching submission:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

})


export {
    registerFarmer,
    updateRefreshToken,
    loginFarmer,
    makeSubmission,
    getAllSubmissions,
    getSubmission
}