import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import v1Routes from './routes/index';
import { errorHandler } from './middleware/error.middleware';


dotenv.config();


const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use('/api/v1', v1Routes);
app.use(errorHandler)

const PORT = process.env.PORT || 7860;
app.listen(PORT, () => {
    console.log("Berhasil connect bruhhh")
});