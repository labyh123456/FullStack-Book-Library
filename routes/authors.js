const express = require('express');
const router = express.Router();
const Author = require('../modal/author')

//All Authors Routes
router.get('/', async (req, res) => {

    let searchOption = {};
    if (req.query.name != null && req.query.name != '') {
        searchOption.name = new RegExp(req.query.name, 'i');
        console.log(searchOption.name)
    }

    try {
        console.log(searchOption)
        const autors = await Author.find(searchOption)
        console.log(autors)
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

    // // --

    // try {
    //      // res.redirect(`authors/${newAuthor.id}`);
    //      const newAuthor  = await new author.save();
    //      res.redirect('authors')

    // } catch {
    //     res.render('authors/new', {
    //         author:author,
    //         errorMessage:'error somewhere'
    //     })
    // }

    // })

    // --
    author.save((err, newAuthor) => {
        if (err) {
            res.render('authors/new', {
                author: author,
                errorMessage: 'eror SomeWhere'
            })
        }
        else {
            // res.redirect(`authors/${newAuthor.id}`);
            res.redirect('authors')
        }
    })
    // res.send(req.body.name)
})

module.exports = router;