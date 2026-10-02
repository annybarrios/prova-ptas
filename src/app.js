import express from 'express';
import {erroHandler} from 'middlewares/erroMiddleware.js';
import emprestimosRouter from 'routes/emprestimosRouter.js';

const app = express();
app.use(express.json());


