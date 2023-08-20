import { Router } from "express"
import { ProductManager } from "../controllers/ProductManager.js"

const PATH = 'src/models/inventory.json'
const manager = new ProductManager(PATH)
const routerProd = Router()

routerProd.get('/', async (req, res) => { //Devuelve todos los productos o la cantidad marcada por el limit
    const { limit } = req.query
    manager.getProducts()
        .then(response => {
            if (limit && limit > 0) {
                res.status(200).send(response.slice(0, limit))
            } else {
                res.status(200).send(response)
            }
        })
        .catch(error => res.status(400).send(error))
})
 
routerProd.get('/:pid', async (req, res) => { //Devuelve el producto del id especifico 
    manager.getProductByID(req.params.pid)
        .then(response => res.status(200).send(response))
        .catch(error => res.status(400).send(error))
})

routerProd.post('/', async (req, res) => { //Agrega un producto 
    manager.addProduct(req.body)
        .then(response => res.status(201).send(response))
        .catch(error => res.status(400).send(error))
})

routerProd.put('/:pid', async (req, res) => { //Actualiza un producto
    manager.updateProduct(req.params.pid, req.body)
        .then(response => res.status(200).send(response))
        .catch(error => res.status(404).send(error))
})

routerProd.delete('/:pid', async (req, res) => { //Borra un producto
    manager.deleteProduct(req.params.pid)
        .then(response => res.status(204).send(response))
        .catch(error => res.status(404).send(error))
})

export default routerProd