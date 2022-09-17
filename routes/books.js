const express = require('express');
const router = express.Router();
const Book = require('../modal/book')
const Author = require('../modal/author');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
router.get('/', async (req, res) => {
let query = Book.find();

// Filtering title of book
if(req.query.title != null && req.query.title != ''){
    query = query.regex('name', new RegExp(req.query.title, 'i'))
    console.log('here')
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
    console.log(books)
    res.render('books/index', {
        books:books,
        searchOption:req.query
    })
} catch (error) {
    
}

})


//New Book Router
router.get('/new', async  (req, res) => {
    renderNewPage(res, new Book());
// res.send('New book')
// try {
    
//     const authors = await Author.find({});
//     const book = new Book();
    
//     res.render('books/new',{ 
//         authors:authors,
//         book:book
//     })

// } catch(error) {
//     console.log(error)
//     res.redirect('/books');
// }

// // res.render('books/new')
// })

})
// Create Book Route
router.post('/',   async (req, res) => {
    console.log('here' , req.file)
// res.send('create book')
const filename = req.file != null ? req.file.filename: null
const book = new Book({
    name:req.body.title,
    author:req.body.author,
    publishDate: req.body.publishDate,
    pageCount:req.body.pageCount,
    description:req.body.description,
});

saveCover(book, req.body.cover);

try {
    const newBook = await book.save();
    res.redirect('/books');
} catch (error) {
    console.log('somewhete', error);
    renderNewPage(res, book, true)
}
})


async function renderNewPage(res, book, hasError = false){
    try {
    
        const authors = await Author.find({});
        const params = {
            authors:authors,
            book:book
        }

        if(hasError) 
            params.errorMessage = 'Error Creating Book';
            res.render('books/new', params);
    
    } catch(error) {
        console.log(error)
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