import { promises as fs } from 'fs'
import { v4 as uuidV4 } from 'uuid'

export class CartManager {
    constructor(path) {
        this.path = path
    }

    static getCart = async (cid, path) => {

        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf-8')
                .then(res => {
                    const cartsList = JSON.parse(res)
                    const cartFound = cartsList.find(cart => cart.cid === cid)
                    cartFound ? resolve(cartFound) : reject("Carrito no encontrado")
                })
                .catch(error => reject(`Imposible leer el archivo ${error}`))
        })
    }

    static saveCart = async (cart, path) => {

        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf-8')
                .then(res => {
                    const cartsList = JSON.parse(res)
                    let index = cartsList.findIndex(cartList => cartList.cid === cart.cid)

                    index === -1 ? cartsList.push(cart) : cartsList[index] = cart

                    fs.writeFile(path, JSON.stringify(cartsList))
                        .then(resolve("Carrito guardado correctamente"))
                        .catch(error => reject(`Imposible actualizar el archivo ${error}`))
                })
                .catch(error => reject(`Imposible leer el archivo ${error}`))
        })
    }

    createCart = async () => {

        return new Promise((resolve, reject) => {
            const cart = new Cart()
            CartManager.saveCart(cart, this.path)
                .then(res => resolve(res))
                .catch(error => reject(`Imposible crear carrito: ${error}`))
        })
    }

    getProducts = async (cid) => {

        return new Promise((resolve, reject) => {
            CartManager.getCart(cid, this.path)
                .then(res => resolve(res.products))
                .catch(error => reject(`Imposible leer el archivo ${error}`))
        })
    }

    addProduct = async (cid, pid, quantity) => {
        return new Promise((resolve, reject) => {

            CartManager.getCart(cid, this.path)
                .then(res => {

                    const cart = res
                    const productFound = cart.products.find(product => product.pid === pid)

                    productFound ? (productFound.quantity += quantity) : cart.products.push({ pid, quantity })

                    CartManager.saveCart(cart, this.path)
                        .then(res => resolve("Producto agregado correctamente"))
                        .catch(error => reject(`Imposible agregar el producto: ${error}`))
                })
                .catch(error => reject(`Imposible agregar el producto: ${error}`))
        })
    }
}

class Cart {
    constructor() {
        this.products = []
        this.cid = Cart.setcid()
    }

    static setcid() {
        return uuidV4()
    }
}