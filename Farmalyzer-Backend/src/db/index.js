import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {

    try {

        const connInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Connected to MONGODB database host : ${connInstance.connection.host}`)
       

    } catch (err) {

        console.log(`Cannot connect to MONGODB database : ${err}` );
        process.exit(1)
    }


}

export default connectDB 