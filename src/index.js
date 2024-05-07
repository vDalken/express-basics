import express from 'express'
import booksRouter from './routes/books.js'

const port = 3000
const app = express()

app.use(express.json())
app.use(booksRouter)

app.listen(port, () =>{
    console.log(`Running at http://localhost:${port}`)
})
