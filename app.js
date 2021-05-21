
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const port = 4000;

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

// const data = require('data')
const data = [
  { _id: "MongoDB", children: [] },
  { _id: "dbm", children: [] },
  { _id: "Databases", children: ["MongoDB", "dbm"] },
  { _id: "Languages", children: [] },
  { _id: "Programming", children: ["Databases", "Languages"] },
  { _id: "Books", children: ["Programming"] }
];
// console.log(data)

app.get('/', (req, res) => {
  res.send(`<h1>This is for headless server!</h1>`)
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xzynl.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log(err);
  console.log('database connected')
  const folderCollection = client.db(`${process.env.DATABASE}`).collection("folders");

  // Get Folder Data
  app.get('/folder/:id', (req, res) => {
    folderCollection.findOne({ _id: req.params.id }, (err, doc) => {
      res.send(doc)
    })
  })

  // Delete Folder
  app.delete('/delete/:id', (req, res) => {

    // folderCollection.deleteOne({ _id: req.params.id }, (err, docs) => {
    //   res.send('item deleted')
    // })
    folderCollection.deleteOne({ _id: req.params.id })
      .then(result => {
        res.send(result.deletedCount > 0);
      })
  })

});

app.listen(process.env.PORT || port)