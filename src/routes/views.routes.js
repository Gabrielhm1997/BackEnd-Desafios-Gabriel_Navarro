import { Router } from "express"
import { ProductManager } from "../controllers/ProductManager.js"

const PATH = 'src/models/inventory.json'
const productManager = new ProductManager(PATH)
const routerViews = Router()

//Rutas Handlebars
routerViews.get('/', (req, res) => {

    productManager.getProducts()
        .then(response => {

            const inventory = response

            res.status(200).render('home', {
                script: "home",
                title: "Home",
                css: "home",
                inventory: inventory
            })
        })
        .catch(error => res.status(400).send(error))
})

routerViews.get('/realtimeproducts', (req, res) => {

    // Render de HandleBars
    res.render('realTimeProducts', {
        script: "realTimeProducts",
        title: "Real Time Products",
        css: "realTimeProducts"
    })
})

export const conexionIO = (io) => {
    // Conexion de Socket.io
    io.on("connection", (socket) => {
        console.log("Connection with socket.io established")

        // Handshake
        socket.on("solicitarConexion", datos => {
            console.log(datos)
            socket.emit("respuesta", true)
        })

        // Peticion productos
        socket.on("pedirProductos", datos => {

            productManager.getProducts()
                .then(response => {
                    const inventory = response
                    socket.emit("respuestaProductos", { status: true, inventory: inventory })
                })
                .catch(error => {
                    socket.emit("respuestaProductos", { status: false, error: error })
                })
        })

        // Crear Producto
        socket.on("nuevoProducto", (product) => {

            console.log(product)
            productManager.addProduct(product)
                .then(response => io.emit("mensajeProductoCreado", response))
                .catch(error => io.emit("mensajeProductoCreado", error))
        })

        //Borrar producto
        socket.on("borrarProducto", (id) => {

            console.log(id)
            productManager.deleteProduct(id)
                .then(response => io.emit("mensajeProductoBorrado", response))
                .catch(error => io.emit("mensajeProductoBorrado", error))
        })
    })

}

export default routerViews