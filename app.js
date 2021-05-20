
const express = require('express')
const app = express()
const port = 4000;

const data = {
  root: {
    folder1: { folder4: {}, folder5: {} },
    folder2: { folder6: {} },
    folder3: { folder7: {} }
  }
};

console.log(data)

app.get('/', (req, res) => {
  res.send(`<h1>This is for headless server!</h1>`)
})
app.get('/directory', (req, res) => {
  res.send(JSON.stringify(data))
})

app.post('/add/:folder', (req, res) => {
  const folder = req.params;
  res.send(folder)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})