import express from 'express';
import path from 'path';

const router = express.Router();
const __dirname = import.meta.dirname;

router.get('/', (req, res) => {
    res.send('<center><h1>👋¡Bienvenido al Club Deportivo!😁</h1></center>');
});

export default router;