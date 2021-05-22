
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const port = 4000;

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

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

    folderCollection.deleteOne({ _id: req.params.id })
      .then(result => {
        res.send(result.deletedCount > 0);
      })
  })

  // AddFolder
  app.post('/addfolder/:parentId', (req, res) => {
    console.log(req.body)
    console.log(req.params.parentId)
    const id = `${req.params.parentId}-${req.body.name}`
    folderCollection.insertOne({ _id: id, name: req.body.name, children: [] })
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  // Update Parent Children
  app.patch('/updateparent/:id', (req, res) => {
    const childs = req.body.childs
    folderCollection.updateOne({ _id: req.params.id },
      {
        $set: { 'children': childs }
      }
    ).then(result => {
      res.send(result.modifiedCount > 0)
    })
  })
});

app.listen(process.env.PORT || port)