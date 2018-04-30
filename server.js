const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
var db


// FUNCTIONS
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.post('/posts', (req, res) => {
    db.collection('postsdb').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log(req.body)
        console.log('saved to database')
        res.redirect('/')
    })
})

// GETS
app.get('/', (req, res) => {
    db.collection('postsdb').find().toArray(function (err, results) {
        if (err) return console.log(err)
        res.render('index.ejs', {posts: results})
    })
})

const port = 3001
MongoClient.connect('mongodb://fadi:123456789@ds263089.mlab.com:63089/omar-ex-blog', (err, client) => {
    if (err) return console.log(err)
    db = client.db('omar-ex-blog') // whatever your database name is
    app.listen(port, () => {
        console.log('listening on ' + port)
    })
})