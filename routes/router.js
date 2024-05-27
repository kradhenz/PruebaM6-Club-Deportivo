import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const __dirname = import.meta.dirname; // mandatory to use path

// root route
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// 1. READ DATA: route to data.json
router.get('/deportes', (req, res) => {
    res.sendFile(path.join(__dirname, '../assets/data/data.json'));
});

// Function to read & write JSON file
const readData = (dataPath) => {
    const data = fs.readFileSync(dataPath);
    return JSON.parse(data);
};

const writeData = (dataPath, data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// 2. CREATE OR ADD PRODUCTS: catch name data from index.html
router.get('/agregar', (req, res) => {
    const { nombre, precio } = req.query;
    // Validation
    if (!nombre || !precio) {
        return res.status(400).send('Nombre y precio son requeridos');
    }

    const dataPath = path.join(__dirname, '../assets/data/data.json');

    try {
        const data = readData(dataPath); // call function to read
        data.deportes.push({ nombre, precio });
        writeData(dataPath, data); // call function to write
        res.send(`Se agregó el deporte ${nombre} con el precio de ${precio}`);
    } catch (error) {
        console.error('Error reading or writing data.json file:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

// 3. ROUTE TO UPDATE OR EDIT PRODUCTS:
router.get('/editar', (req, res) => {
    const { nombre, precio } = req.query;
    // Validation
    if (!nombre || !precio) {
        return res.status(400).send('Nombre y precio son requeridos');
    }

    const dataPath = path.join(__dirname, '../assets/data/data.json');

    try {
        const data = readData(dataPath); // call function to read
        data.deportes = data.deportes.map(d => d.nombre === nombre ? { ...d, precio } : d);
        writeData(dataPath, data); // call function to write
        res.send(`Se editó el deporte ${nombre} con el precio de ${precio}`);
    } catch (error) {
        console.error('Error reading or writing data.json file:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

// 4. ROUTE TO DELETE PRODUCTS:
router.get('/eliminar', (req, res) => {
    const { nombre } = req.query;
    // Validation
    if (!nombre) {
        return res.status(400).send('Nombre es requerido');
    }

    const dataPath = path.join(__dirname, '../assets/data/data.json');

    try {
        const data = readData(dataPath); // call function to read
        data.deportes = data.deportes.filter(d => d.nombre !== nombre);
        writeData(dataPath, data); // call function to write
        res.send(`Se eliminó el deporte ${nombre}`);
    } catch (error) {
        console.error('Error reading or writing data.json file:', error);
        res.status(500).send('Error al procesar la solicitud');
    }
});

export default router;