import express from "express"
import multer from "multer"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import routerProd from "./routes/products.routes.js"
import routerCart from "./routes/carts.routes.js"
import routerViews from "./routes/views.routes.js"
import { conexionIO } from "./routes/views.routes.js"

const PORT = 8080
const app = express()

// Server
export const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

const io = new Server((server) /*, { 'force new connection': true }*/)

//Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
})

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', 'src/views')
const upload = multer({ storage: storage })

//Routes 
app.use('/static', express.static('src/public')) //Rutas Publicas, no necesite usar el archivo path.js, no se el porque
app.use('/api/products', routerProd) //Rutas ProductManager
app.use('/api/carts', routerCart) //Rutas CartManager
app.use('/static', routerViews) //Rutas HandleBars
conexionIO(io) //Uso de Socket.io en views.routes

app.post('/upload', upload.single('product'), (req, res) => { //Ruta de carga de imagenes
    res.status(200).send("Imagen cargada")
})

app.get('*', (req, res) => {
    res.status(404).send("Error 404")
})