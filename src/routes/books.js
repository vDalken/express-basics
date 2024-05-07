import { Router } from 'express'
import { books } from '../data/data.js'
import { createBookSchema } from '../validation_schemas/createBook.js'
import { checkSchema, matchedData, validationResult } from 'express-validator'

const router = Router()

router.get('/books', (request, response) => {
  if (books.length === 0) {
    return response.status(404).send({ msg: 'No books posted yet' })
  }
  return response.send(books)
})

router.post('/books', checkSchema(createBookSchema), (request, response) => {
  const result = validationResult(request)

  if (!result.isEmpty())
    return response.status(400).send({ errors: result.array() })

  const { title, author, pages } = matchedData(request)

  const book = {
    id: books.length,
    title: title,
    author: author,
    pages: pages
  }

  books.push(book)

  return response.status(200).send(book)
})

router.get('/books/:id', (request, response) => {
  const {
    params: { id }
  } = request

  const book = books.find((book) => book.id === parseInt(id))

  if (!book) {
    response.status(404).send({ msg: 'No book with that id found' })
  }

  return response.status(200).send(book)
})

router.put('/books/:id', checkSchema(createBookSchema), (request, response) => {
  const result = validationResult(request)

  if (!result.isEmpty()) {
    return response.status(400).send({ errors: result.array() })
  }

  const { title, author, pages } = matchedData(request)

  const bookIndex = books.findIndex((book) => book.id === parseInt(request.params.id))
  console.log(bookIndex)

  if (bookIndex === -1) {
    return response
      .status(400)
      .send({ msg: 'There is no such book with that id' })
  }

  const newBook = {
    id: bookIndex,
    title: title,
    author: author,
    pages: pages
  }

  books[bookIndex] = newBook

  return response.status(200).send(newBook)
})

router.delete('/books/:id', (request,response)=>{
    const {params: {id}} = request

    const bookIndex = books.findIndex((book) => book.id === parseInt(id))

    if(bookIndex === -1){
        return response.status(400).send({msg: 'No book with that id was found'})
    }

    books.splice(bookIndex, 1)

    return response.sendStatus(204)

})

export default router
