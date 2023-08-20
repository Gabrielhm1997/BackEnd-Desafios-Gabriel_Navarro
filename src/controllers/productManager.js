import { promises as fs } from 'fs'
import { v4 as uuidV4 } from 'uuid'

export class ProductManager {
    constructor(path) {
        this.path = path
    }

    addProduct = async ({ title, description, price, thumbnail, code, stock, category, status }) => {

        return new Promise((resolve, reject) => {
            if (title && description && price && thumbnail && code && category) {
                fs.readFile(this.path, 'utf-8')
                    .then(res => {
                        const inventory = JSON.parse(res)
                        const productFound = inventory.find(item => item.code === code)

                        if (!productFound) {
                            const product = new Product(title, description, price, thumbnail, code, stock, category, status)
                            inventory.push(product)

                            fs.writeFile(this.path, JSON.stringify(inventory))
                                .then(resolve("Producto agregado correctamente"))
                                .catch(error => reject(`Imposible actualizar el archivo ${error}`))
                        } else {
                            reject("El producto ya existe en el array")
                        }
                    })
                    .catch(error => reject(`Imposible leer el archivo ${error}`))
            } else {
                reject("Falta 1 o mas Valores del producto")
            }
        })
    }

    getProducts = async () => {

        return new Promise((resolve, reject) => {
            fs.readFile(this.path, 'utf-8')
                .then(res => resolve(JSON.parse(res)))
                .catch(error => reject(`Imposible leer el archivo ${error}`))
        })
    }

    getProductByID = async (id) => {

        return new Promise((resolve, reject) => {
            fs.readFile(this.path, 'utf-8')
                .then(res => {
                    const inventory = JSON.parse(res)
                    const productFound = inventory.find(item => item.id === id)
                    productFound ? resolve(productFound) : reject("Producto no encontrado")
                })
                .catch(error => reject(`Imposible leer el archivo ${error}`))
        })
    }

    deleteProduct = async (id) => {

        return new Promise((resolve, reject) => {
            fs.readFile(this.path, 'utf-8')
                .then(res => {
                    const inventory = JSON.parse(res)

                    if (inventory.find(item => item.id === id)) {
                        const updatedInventory = inventory.filter(item => item.id != id)
                        fs.writeFile(this.path, JSON.stringify(updatedInventory))
                            .then(resolve("Producto eliminado correctamente"))
                            .catch(error => reject(`Imposible actualizar el archivo ${error}`))
                    } else {
                        reject("Producto no encontrado")
                    }
                })
                .catch(error => reject(`Imposible leer el archivo ${error}`))
        })
    }

    updateProduct = async (id, { title, description, price, thumbnail, code, stock, category, status }) => {

        return new Promise((resolve, reject) => {
            fs.readFile(this.path, 'utf-8')
                .then(res => {
                    const inventory = JSON.parse(res)
                    const index = inventory.findIndex(item => item.id === id)
                    if (index != -1) {

                        inventory[index].title = title ?? inventory[index].title
                        inventory[index].description = description ?? inventory[index].description
                        inventory[index].price = price ?? inventory[index].price
                        inventory[index].thumbnail = thumbnail ?? inventory[index].thumbnail
                        inventory[index].code = code ?? inventory[index].code
                        inventory[index].stock = stock ?? inventory[index].stock
                        inventory[index].category = category ?? inventory[index].category
                        inventory[index].status = status ?? inventory[index].status

                        fs.writeFile(this.path, JSON.stringify(inventory))
                            .then(resolve("Producto actualizado"))
                            .catch(error => reject(`Imposible actualizar el archivo ${error}`))

                    } else {
                        reject("Producto no encontrado")
                    }
                })
                .catch(error => reject(`Imposible leer el archivo ${error}`))
        })
    }
}

export class Product {
    constructor(title, description, price, thumbnail, code, stock, category, status) {
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
        this.category = category
        this.status = Product.setStatus(status) ?? true
        this.id = Product.setId()
    }

    static setId = () => {
        return uuidV4()
    }

    static setStatus = (status) => {

        if (status.toLowerCase().trim() === "true") {
            return true
        } else if (status.toLowerCase().trim() === "false") {
            return false
        }
        return undefined
    }
}