import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({

    name: {
        type: String, 
        required: true
    },

    description: {
        type: String
    },

    farmer_count : {
        type: Number,
        default: 0
    }

})


export const Folder = mongoose.model("Folder", folderSchema)