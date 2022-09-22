const express = require('express');
const router = express.Router();
const Book = require('../modal/book')
const { check, validationResult } = require('express-validator');
const Author = require('../modal/author');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];


router.get('/', async (req, res) => {
let query = Book.find();

// Filtering title of book
if(req.query.title != null && req.query.title != ''){
    query = query.regex('name', new RegExp(req.query.title, 'i'))
    // console.log('here')
}


//Filtering Before Date
if(req.query.publishBefore != null && req.query.publishBefore != ''){
    query = query.lte('publishDate', req.query.publishBefore);
}

//Filtering After Date
if(req.query.publishAfter != null && req.query.publishAfter != ''){
    query = query.gte('publishDate', req.query.publishAfter)
}


try {

    const books = await query.exec()
    // console.log(books)
    res.render('books/index', {
        books:books,
        searchOption:req.query
    })
} catch (error) {
    console.log(error)
}

})


//New Book Router
router.get('/new', async  (req, res) => {
    renderNewPage(res, new Book(), 'new', false);
})


router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/show', {book:book});
    } catch (error) {
        res.redirect('/');
    }
    })

    router.get('/:id/edit', async (req, res) => {
        try {
            const book = await Book.findById(req.params.id);
            // console.log('name' , book.name)
            renderEditPage(res, book, 'edit');
        } catch (error) {
            res.redirect('/');
        }
    })
    

//update user
router.put('/:id', async (req, res) => {

    let book
    try {
        book = await Book.findById(req.params.id);
        book.title = req.body.title;
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description

        if(req.body.cover != null && req.body.cover != ''){
            saveCover(book, req.body.cover)
        }
        // ....
        await book.save();
        res.redirect(`/books/${book.id}`);
    }
    catch {
        if (book == null) {
            res.redirect('/');
        }
        else {
          renderEditPage(res, book, true)
        }

    }
    // --------
    // res.send(req.body.name)

    // res.send('Update Author '+ req.params.id)
})


// Create Book Route
router.post('/',   [check('title').isEmpty(), check(' req.body.publishDate').isEmpty(), check(' req.body.author').isEmpty(), check('req.body.description').isEmpty(), ], async  (req, res) => {

    const error = validationResult(req);
    if (error.isEmpty()) {
        console.log(error);
        renderNewPage(res, new Book(), 'new', true);
        return;
    }
const book = new Book({
    name:req.body.title,
    author:req.body.author,
    publishDate: req.body.publishDate,
    pageCount:req.body.pageCount,
    description:req.body.description,
});

saveCover(book, req.body.cover);
if(req.body.cover == '' || req.body.cover == null)
{
    console.log('error for creating book')
}
try {
    const newBook = await book.save();
    res.redirect('/books');
} catch (error) {
    renderNewPage(res, book, true)
}
})


router.delete('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id);
        await book.remove();
        res.redirect('/books')
    } catch (error) {
        if(book != null){
            res.render('books/show', {
                book:book,
                errorMessage:'Could not Remove Book'
            })
        }else{
            res.redirect('/');
        }
    }
})


async function renderNewPage(res, book, form ,hasError){
    renderFormPage(res, book, form, hasError);
}

async function renderEditPage(res, book, form ,hasError = false){
    renderFormPage(res, book, form, hasError);
}

// new one
async function renderFormPage(res, book, form,hasError = false){
    try {
    
        const authors = await Author.find();
        const params = {
            authors:authors,
            book:book
        }

        if(hasError){
            if(form == 'edit')
            params.errorMessage = "Error Updating Book";
            else
            params.errorMessage = "Error Creating Book";
        }
            res.render(`books/${form}`, params);
    
    } catch(error) {
        // console.log(error)
        res.redirect('/books');
    }
    
    // res.render('books/new')
}

function saveCover(book, coverEncoded){
    if(coverEncoded == null)   return 
        const cover = JSON.parse(coverEncoded)

    if(cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}


module.exports = router;