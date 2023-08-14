import express  from "express"
import routerProd from "./routes/products.routes.js"
import routerCart from "./routes/carts.routes.js"

const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', routerProd)

app.use('/api/carts', routerCart)

app.get('*', (req, res) => {
    res.status(404).send("Error 404")
})

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})