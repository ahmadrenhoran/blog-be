import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import v1Routes from './routes/index';


dotenv.config();


const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use('/api/v1', v1Routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Berhasil connect bruhhh")
});