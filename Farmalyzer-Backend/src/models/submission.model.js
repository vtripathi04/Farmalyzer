import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({

    farmer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },

    crop_type: {
        type: String, 
        required: true
    },

    region: {
        type: String,
        required: true
    },

    submission_date: {
        type: Date,
        default: Date.now
    },

    images: [String],

    additional_info: {
        type: String
    },

    crop_cycle: {
        start_date: { type: Date, required: true },
        end_date: { type: Date, required: true }, 
        growth_stage: String
        
    }

})

export const Submission = mongoose.model("Submission", submissionSchema)