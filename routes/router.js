import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const __dirname = import.meta.dirname; // mandatory to use path

// root route
router.get('/', (req, res) => {
    // res.send('<center><h1>👋¡Bienvenido al Club Deportivo!😁</h1></center>');
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// READ DATA: route to data.json
router.get('/deportes', (req, res) => {
    res.sendFile(path.join(__dirname, '../assets/data/data.json'));
});

// CREATE PRODUCTS: route to catch name data from index.html
router.get('/agregar', (req, res) => {
    const { nombre, precio } = req.query;
    // Validation
    if (!nombre || !precio) {
        return res.status(400).send('Nombre y precio son requeridos');
    }

    try {
        const dataSports = fs.readFileSync('./assets/data/data.json');
        const { deportes } = JSON.parse(dataSports);
        deportes.push({nombre, precio});
        fs.writeFileSync('./assets/data/data.json', JSON.stringify({ deportes }));
        res.send(`Se agrego el deporte ${nombre} con el precio de ${precio}`);
    } catch (error) {
        console.error('Error reading or writing data.json file:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

export default router;