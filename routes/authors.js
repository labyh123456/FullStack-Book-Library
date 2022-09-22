const express = require('express');
const router = express.Router();
const Author = require('../modal/author')
const Book = require('../modal/book')
//All Authors Routes
router.get('/', async (req, res) => {

    let searchOption = {};
    if (req.query.name != null && req.query.name != '') {
        searchOption.name = new RegExp(req.query.name, 'i');
        // console.log(searchOption.name)
    }

    try {
        console.log(searchOption)
        const autors = await Author.find(searchOption)
        // console.log(autors)
        res.render('authors/index', { author: autors, searchOption: req.query });
    } catch {
        res.redirect('/');
    }

})


//New Authors Router
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})


// Create Authors Route
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    });

    author.save((err, newAuthor) => {
        if (err) {
            res.render('authors/new', {
                author: author,
                errorMessage: 'Error Creating Author'
            })
        }
        else {
            res.redirect(`authors/${newAuthor.id}`);
            // res.redirect('authors')
        }
    })
})




// showing Book by Authors
router.get('/:id', async (req, res) => {

try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({author:author.id}).limit(6).exec()
    res.render('authors/view', {
        author:author,
        booksByAuthor:books 
    })
     
} catch (error) {
    // console.log(error)
    res.redirect('/')
}



    // res.send('Show Author' + req.params.id)
})

// edit user
router.get('/:id/edit', async (req, res) => {
    try {

        const author = await Author.findById(req.params.id);
        res.render('authors/edit', { author: author });
    } catch (error) {
        res.redirect('/authors');
    }


    // res.send('Edi Author '+ req.params.id)    
})

//update user
router.put('/:id', async (req, res) => {

    let author
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`);
    }
    catch {
        if (author == null) {
            res.redirect('/');
        }
        else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Erorr Updating Author'
            })
        }

    }
    // --------
    // res.send(req.body.name)

    // res.send('Update Author '+ req.params.id)
})

//delte user
router.delete('/:id', async (req, res) => {
    
    let author
    try {
        author = await Author.findById(req.params.id);
        await author.remove();
        res.redirect('/authors');
    }
    catch{
        if (author == null) 
            res.redirect('/');
        else {
            // console.log(error)
            res.redirect(`/authors/${author.id}`)
        }
    }
    
    // res.send('Delete Author ' + req.params.id)
})

module.exports = router;