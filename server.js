import express from 'express';
import dotnev from 'dotenv';
import cors from 'cors';
import initRoutes from './src/routes/index.js';
import connectDatabase from './src/config/connectDatabase.js';
dotnev.config();

const app = express();
const port = process.env.PORT || 8888
/* allow client access */
app.use(cors({
   origin: process.env.CLIENT_URL,
   methods: ["POST", "GET", "PUT", "DELETE"]
}))
app.use(express.json()) /* can read json from client send */
app.use(express.urlencoded({ extended: true })) /* can read form from client send */
app.use(express.static("public"))

/* call router */
initRoutes(app);
connectDatabase();

/* start server */
app.listen(port, async () => console.log(`Server running on http://localhost:${port}`))
