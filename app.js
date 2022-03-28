const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

let app = express();
app.use(express.json());

app.use(cors());

//Establecemos los parametros de conexion
let conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "articulosdb" /* Nombre de tu ddbb */
});

//probamos la conexion
conexion.connect( (error) => {
    if (error){
        throw error;
    }else{
        console.info('Conexion a la base de datos exitosa yeeeeea');
    }
} );

app.get("/", (req, res) => {
    res.send("El servidor esta en funcionamineto");
})

//Mostrar todos los articulos
app.get("/api/articulos", (req, res) => {
    conexion.query("SELECT * FROM Articulos", (error, filas) => {
        if (error){
            throw error;
        }else{
            res.send(filas)
        }
    });
});

//Mostrar un solo articulo - Lo hice bien solo..
app.get("/api/articulos/:id", (req, res) => {
    conexion.query("SELECT * FROM Articulos WHERE id = ?", [req.params.id], (error, fila) => {
        if (error){
            throw error;
        }else{
            res.send(fila);
            //res.send(fila[0].descripcion);
        }
    });
});

//Crear un registro
app.post("/api/articulos", (req,res) => {
    let data = {descripcion:req.body.descripcion, precio:req.body.precio, stock:req.body.stock};
    let sql = "INSERT INTO Articulos SET ?"
    conexion.query(sql, data, (error, results) => {
        if (error){
            throw error;
        }else{
            //res.send(fila)
            res.send(results);
        }
    });
});

//Editar un articulo
app.put("/api/articulos/:id", (req, res) => {
    let id = req.params.id;
    let descripcion =  req.body.descripcion;
    let precio = req.body.precio;
    let stock = req.body.stock;

    let sql = "UPDATE Articulos SET descripcion = ?, precio = ?, stock = ? WHERE id = ?";
    conexion.query(sql, [descripcion, precio, stock, id], (error, results) => {
        if (error){
            throw error;
        }else{
            //res.send(fila)
            res.send(results);
        }
    });
});

//Eliminar articulo
app.delete("/api/articulos/:id", (req, res) => {
    conexion.query("DELETE FROM Articulos WHERE id = ? ", [req.params.id], (error, register) => {
        if (error){
            throw error;
        }else{
            //res.send(fila)
            res.send(register);
        }
    });
});

const puerto = process.env.PUERTO || 8000;
app.listen(puerto, () => {
    console.log("Server running UP in puerto:" + puerto);
});