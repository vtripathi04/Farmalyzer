import { Admin } from "../models/admin.model.js";
import { Farmer } from "../models/farmer.model.js";
import { Folder } from "../models/folder.model.js";
import { Submission } from "../models/submission.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiRes } from "../utils/ApiRes.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";



const generateAccessAndRefreshToken = function(user){

    try {
        const accessToken = jwt.sign({_id:user._id ,username: user.username, email: user.email},
             process.env.ACCESS_TOKEN_SECRET_ADMIN, {expiresIn: '60m'})
    
        const refreshToken = jwt.sign({_id:user._id, username: user.username},
            process.env.REFRESH_TOKEN_SECRET_ADMIN, {expiresIn: '1d'})


        return {accessToken, refreshToken}  

    } catch (error) {
        throw new ApiError(400, `Cannot Generate Access and Refresh Tokens : ${error}`)

    }

}


const registerAdmin = asyncHandler( async (req, res) => {

    const data = req.body
    const {name, username, email, password}  = data;

    // Making sure no field is empty except lastname
    for (const key in data) {
        const val = data[key]

        if(!val){
            throw new ApiError(400, "None of the fields can be empty !")
        }
    }


    // Checking if user doesnt already exist

    const existingUser = await Admin.findOne({
        $or: [{username}, {email}]
    })

    if (existingUser) {
        throw new ApiError(409, "Admin with email or username already exists")
    }else{
        console.log(`Admin is OKAY`);
    }


    // Checking length of passsword is greater than 

    if(password.length < 4){
        throw new ApiError(400, "Password cannot be shorter than 4 characters")
    }



    // making entry into the database

    console.log('Before Registering Admin:', { name , username, email, password});

    const createdUser = new Admin({
        name,
        email,
        username,
        password : password,
    })

        // After creating the user instance
    console.log('After Registering Admin:', createdUser);
    
    try {
        await createdUser.save();
      } catch (error) {
        console.error('Save operation failed:', error);
      }

    res.status(201).json( new ApiRes(201, createdUser, "Admin Registered Successfully"))



})


const updateRefreshToken = async function(user, refreshToken){

    try {
        await Admin.updateOne({_id: user._id}, {refreshToken: refreshToken})
    } catch (error) {
        throw new ApiError(409, "Couldn't Update User Refresh Token")
    }
}


const loginAdmin = asyncHandler(async (req, res) => {
    
    
    const {username, password} = req.body

    // Fetching User from model query
    const loginUser = await Admin.findOne({username: username})

    if(!loginUser){
        throw new ApiError(409, `Admin with username: ${username} does not exist !`)
    }

    // Checking if password matches the hash

    const matchingPasswords = await loginUser.checkPassword(password)



    if(!matchingPasswords){
        throw new ApiError(400, "Password Entered is not Correct")
    }

    const {accessToken, refreshToken} = generateAccessAndRefreshToken(loginUser)

    console.log(loginUser, refreshToken);

    updateRefreshToken(loginUser, refreshToken)


    const loggedInUser = await Admin.findById(loginUser._id).select("-password -refreshToken")

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


const createFolder = asyncHandler(async (req, res) => {

    try {
        // Extract folder data from the request body
        const { name, description } = req.body;

        // Create a new Folder instance
        const newFolder = new Folder({
            name,
            description
        });

        // Save the folder to the database
        await newFolder.save();

        // Send a success response
        res.status(201).json({ message: 'Folder created successfully', folder: newFolder });

    } catch (error) {
        console.error('Error creating folder:', error);
        res.status(500).json({ message: 'Internal server error' });
    }



})



const getAllFolders = asyncHandler(async (req, res) => {

    try{

        const folders = await Folder.find({})

        res.status(201).json({ message: 'Fetched all Folders Successfully', folders: folders });


    }catch (error) {
        console.error('Error Fetching folders:', error);
        res.status(500).json({ message: 'Internal server error' });

    }

})



const deleteFolder = asyncHandler(async (req, res) => {

    try{

        const folderdeleted = await Folder.findOneAndDelete({_id: new mongoose.Types.ObjectId(req.params.folderId) }) 
        
        res.status(200).json({ message: 'Deleted Folders Successfully', folder: folderdeleted });

    }catch{
        console.error('Error Deleting folder:', error);
        res.status(500).json({ message: 'Internal server error' });
    }


})



const getAllFarmers = asyncHandler(async (req, res) => {

    try{

        const allfarmers = await Farmer.find({}) 
        res.status(200).json({ message: ' Fetched All Farmer Data Successfully', farmers: allfarmers });

    }catch{
        console.error('Error Fetching Farmer Data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }


})



const getFarmer = asyncHandler(async (req, res) => {

    try{

        const farmer = await Farmer.find({_id: req.params.farmerId}) 
        res.status(200).json({ message: ' Fetched Farmer Data Successfully', farmer: farmer });

    }catch{
        console.error('Error Fetching Farmer Data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }


})


const getUsersByFolderId = asyncHandler(async (req, res) => {

    try{

        const farmers = await Farmer.find({folder_id: req.params.folderId}) 
        res.status(200).json({ message: ' Fetched Farmers By Folder Id Successfully', farmers: farmers });

    }catch{
        console.error('Error Fetching folders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }



})



const getAllSubmissions = asyncHandler(async (req, res) => {

    try{

        const submissions = await Submission.find({}) 
        res.status(200).json({ message: 'Fetched Submissions Successfully', submissions: submissions });

    }catch{
        console.error('Error Fetching folders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

})


const getSubmissionByCropName = asyncHandler(async (req, res) => {

    try{

        const submissions = await Submission.find({crop_type: req.params.cropName}) 
        res.status(200).json({ message: 'Fetched Submissions Successfully', submissions: submissions });

    }catch{
        console.error('Error Fetching Submissions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

})


const getSubmissionsByFarmerId = asyncHandler(async (req, res) => {

    try{

        const submissions = await Submission.find({farmer_id: req.params.farmerId}) 
        res.status(200).json({ message: 'Fetched Submissions Successfully', submissions: submissions });

    }catch{
        console.error('Error Fetching Submissions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

})


const getSubmissionsByFolderId = asyncHandler(async (req, res) => {

    try{

        const folderId = req.params.folderId

        console.log(folderId);

        const farmersInFolder = await Farmer.find({folder_id: folderId})

        console.log(farmersInFolder);

        const farmerIds = farmersInFolder.map((farmer) => { return farmer._id})

        console.log(farmerIds)

        const submissionByFolderId = await Submission.find({ farmer_id: {$in: farmerIds}} )

        console.log(submissionByFolderId);

        res.status(200).json({ message: 'Fetched Submissions Successfully', submissions: submissionByFolderId });

    }catch{
        console.error('Error Fetching Submissions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }


})




export {
    registerAdmin,
    loginAdmin,
    createFolder,
    getAllFolders,
    deleteFolder,
    getFarmer,
    getAllFarmers,
    getUsersByFolderId,
    getAllSubmissions,
    getSubmissionByCropName,
    getSubmissionsByFarmerId,
    getSubmissionsByFolderId
}