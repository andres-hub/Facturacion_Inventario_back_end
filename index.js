require('dotenv').config();
const path = require('path');

const express = require('express');
const cors = require('cors');

const {dbConnection} = require('./database/config');

const app = express();

app.use(cors());

app.use(express.json());

dbConnection();

// Directorio publico
app.use(express.static('public'));

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/modulos', require('./routes/modulos'));
app.use('/api/entidades', require('./routes/entidades'));
app.use('/api/parametros', require('./routes/parametros'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/permisos', require('./routes/permisos'));
app.use('/api/upload', require('./routes/uploads'));
app.use('/api/login', require('./routes/auth'));

// Negocio
app.use('/api/empresas', require('./routes/empresas'));
app.use('/api/sucursales', require('./routes/sucursales'));
app.use('/api/proveedores', require('./routes/proveedores'));
app.use('/api/productos', require('./routes/productos'));

// Lo ultimo 
app.get('*', (req, res) => {
    res.sendFile( path.resolve(__dirname, 'public/index.html') );
})

app.listen(process.env.PORT, ()=>{
    console.log("servidor corriendo en puerto "+ process.env.PORT);
});

