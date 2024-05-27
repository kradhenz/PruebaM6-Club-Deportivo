import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const __dirname = import.meta.dirname; // mandatory to use path
const dataPath = path.join(__dirname, '../assets/data/data.json'); // path to data.json

// root route
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// 1. READ DATA: route to data.json
router.get('/deportes', (req, res) => {
    res.sendFile(path.join(dataPath));
});

// Function to read & write JSON file
const readData = (dataFile) => {
    const dataSports = fs.readFileSync(dataFile);
    return JSON.parse(dataSports); // return object
};

const writeData = (dataFile, dataSports) => {
    fs.writeFileSync(dataFile, JSON.stringify(dataSports, null, 2)); // null, 2 = number of spaces for indentation
};

// Function to manage error
const handleError = (res, error) => {
    console.error('Error reading or writing data.json file:', error);
    res.status(500).send('Error al procesar la solicitud');
};

// 2. CREATE OR ADD PRODUCTS: catch name data from index.html
router.get('/agregar', (req, res) => {
    const { nombre, precio } = req.query;
    // Validation
    if (!nombre || !precio) {
        return res.status(400).send('Nombre y precio son requeridos');
    }

    try {
        const dataSports = readData(dataPath); // call function to read
        dataSports.deportes.push({ nombre, precio });
        writeData(dataPath, dataSports); // call function to write
        res.send(`Se agregó el deporte ${nombre} con el precio de ${precio}`);
    } catch (error) {
        handleError(res, error);
    }
});

// 3. ROUTE TO UPDATE OR EDIT PRODUCTS:
router.get('/editar', (req, res) => {
    const { nombre, precio } = req.query;
    // Validation
    if (!nombre || !precio) {
        return res.status(400).send('Nombre y precio son requeridos');
    }

    try {
        const dataSports = readData(dataPath); // call function to read
        dataSports.deportes = dataSports.deportes.map(d => d.nombre === nombre ? { ...d, precio } : d);
        writeData(dataPath, dataSports); // call function to write
        res.send(`Se editó el deporte ${nombre} con el precio de ${precio}`);
    } catch (error) {
        handleError(res, error);
    }
});

// 4. ROUTE TO DELETE PRODUCTS:
router.get('/eliminar', (req, res) => {
    const { nombre } = req.query;
    // Validation
    if (!nombre) {
        return res.status(400).send('Nombre es requerido');
    }

    try {
        const dataSports = readData(dataPath); // call function to read
        dataSports.deportes = dataSports.deportes.filter(d => d.nombre !== nombre);
        writeData(dataPath, dataSports); // call function to write
        res.send(`Se eliminó el deporte ${nombre}`);
    } catch (error) {
        handleError(res, error);
    }
});

export default router;