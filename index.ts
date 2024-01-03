import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import HandlerRoutes from "./Presentation/controllers/routes";

const c = cors({
    origin: "*"
});
dotenv.config();


const app = express();
app.use(express.json());
app.use(c);

HandlerRoutes(app);


app.listen(process.env.PORT || 7070, ()=>{
    console.log(`porta: ${process.env.PORT}`)
});


