const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID;
var db


//           FUNCTIONS

// to show the data from the posted form
app.use(bodyParser.urlencoded({ extended: true }))
// to use the public folder
app.use(express.static('public'))
// to work with json
app.use(bodyParser.json())
// for render 'ejs' files
app.set('view engine', 'ejs')
// the method 'posts' to add post to DB
app.post('/posts', (req, res) => {
    db.collection('postsdb').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
    })
})
// delete one of the list
app.all('/delete/:id', (req, res) => {
    id = req.params.id
    db.collection('postsdb').deleteOne({ _id: ObjectId(id) })
    res.redirect('/')
})
// update one of the list
app.post('/update/:id', (req, res) => {
    id = req.params.id
    db.collection('postsdb').findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: { title: req.body.title, text: req.body.text } },
        res.redirect('/')
    )
})

//          GETS
app.get('/:sorting?', (req, res) => {
    const sorting = req.params.sorting
    if (!sorting || sorting == "default"){
        db.collection('postsdb').find().toArray(function (err, results) {
            if (err) return console.log(err)
            res.render('index.ejs', { posts: results })
        })
    }else if (sorting == "title"){
        db.collection('postsdb').find().sort({"title" : 1}).toArray(function (err, results) {
            if (err) return console.log(err)
            res.render('index.ejs', { posts: results })
        })
    }else if (sorting == "date"){
        db.collection('postsdb').find().sort({"date" : -1}).toArray(function (err, results) {
            if (err) return console.log(err)
            res.render('index.ejs', { posts: results })
        })
    }
})
app.all('/edit/:id', (req, res) => {
    id = req.params.id
    db.collection('postsdb').find({ _id: ObjectId(id) }).toArray(function (err, results) {
        res.render('update.ejs', { post: results })
    })
})
app.all('/readmore/:id', (req, res) => {
    id = req.params.id
    db.collection('postsdb').find({ _id: ObjectId(id) }).toArray(function (err, results) {
        res.render('readmore.ejs', { post: results })
    })
})

const port = 3000 // change your PORT here

// runnig the server with the MONGODB and port
MongoClient.connect('mongodb://fadi:123456789@ds263089.mlab.com:63089/omar-ex-blog', (err, client) => {
    if (err) return console.log(err)
    db = client.db('omar-ex-blog') // whatever your database name is
    app.listen(port, () => {
        console.log('listening on ' + port)
    })
})