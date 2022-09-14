const express  = require('express');
const port = process.env.PORT || 8080;
const app = express();


app.get('/', (req, res) => {
    res.send('hello world can yo do bro fossil');
})

app.listen(port, ()=> {
    console.log(`Listning on the port at ${port}`);
});