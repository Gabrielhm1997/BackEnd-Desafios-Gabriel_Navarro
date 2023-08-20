const socket = io()

const updateListedProducts = () => { //Modifica el DOM para mostrar los productos actualizados

    if (productsListContainer.hasChildNodes()) {
        while (productsListContainer.childNodes.length >= 1) {
            productsListContainer.removeChild(productsListContainer.firstChild)
        }
    }

    inventory.forEach(product => {

        const item = document.createElement("li")
        item.classList.add("text-start")

        item.innerHTML = `
        
            <p>ID: ${product.id}<p>
            <p>Producto: ${product.title} $${product.price} c/u</p>
        `
        productsListContainer.appendChild(item)
    })
}

const getProductsIO = async () => { //Pide los productos de la base de datos mediante Socket.io

    socket.emit("pedirProductos", "algo")

    socket.on("respuestaProductos", respuesta => {

        if (respuesta.status) {
            inventory = respuesta.inventory
            updateListedProducts()
        } else {
            console.log(respuesta.error)
        }
    })
}

let inventory = []

const productsListContainer = document.getElementById("productsList")

//Handshake
socket.emit("solicitarConexion", "Solicitando conexion")
socket.on("respuesta", respuesta => {

    if (respuesta) {
        console.log("Handshake")
        getProductsIO()
    } else {
        console.log("Imposible conectar")
    }
})

// Formulario de Crear Producto
const formCreateProduct = document.getElementById("formCreateProduct")

formCreateProduct.addEventListener('submit', async (e) => {
    e.preventDefault()

    let datForm = new FormData(e.target)
    let product = Object.fromEntries(datForm)

    await socket.emit('nuevoProducto', product)
    await socket.on('mensajeProductoCreado', async (mensaje) => {
        console.log(mensaje)
        await getProductsIO()
    })

    e.target.reset()
})

// Formulario de Borrar Producto
const formDeleteProduct = document.getElementById("formDeleteProduct")

formDeleteProduct.addEventListener('submit', async (e) => {
    e.preventDefault()

    const datForm = new FormData(e.target)
    const id = datForm.get("id")
    console.log(id)

    await socket.emit('borrarProducto', id)
    await socket.on('mensajeProductoBorrado', async (mensaje) => {
        console.log(mensaje)
        await getProductsIO()

    })
    e.target.reset()
})