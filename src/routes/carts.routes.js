import { Router } from "express"
import { CartManager } from "../controllers/cartManager.js"

const PATH = 'src/models/carts.json'
const manager = new CartManager(PATH)
const routerCart = Router()

routerCart.post('/', async (req, res) => { // Crea un nuevo carrito
    manager.createCart()
        .then(response => res.status(201).send(response))
        .catch(error => {res.status(400).send(error)})
})

routerCart.post('/:cid/product/:pid', async (req, res) => { // Agrega un producto por su id al carrito

    manager.addProduct(req.params.cid, req.params.pid, 1)
        .then(response => res.status(204).send(response))
        .catch(error => res.status(400).send(error))
})

routerCart.get('/:cid', async (req, res) => { // Lista los productos del carrito

    manager.getProducts(req.params.cid)
        .then(response => res.status(200).send(response))
        .catch(error => res.status(404).send(error))
})


export default routerCart