const express = require('express');
const router  = express.Router();
const Book = require('../modal/book')

router.get('/', async (req, res) => {
let book 
try {
 book = await Book.find().sort({ createdAt: 'desc' }).limit(10);

} catch (error) {
    
}
    res.render('index', {books: book});
});

module.exports = router;