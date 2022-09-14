const express  = require('express');
const app = express();


app.get('/', (req, res) => {
    res.send('hello world can yo do ');
})

app.listen(8080);