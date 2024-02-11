import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json())
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// importing routes

import farmerRoutes from './routes/farmer.routes.js'
import adminRoutes from './routes/admin.routes.js'


// Declaring routes

app.use('/api', farmerRoutes)
app.use('/api/admin', adminRoutes)

export {app}