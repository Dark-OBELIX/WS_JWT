const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();


require('./src/routes/auth.routes')(app);
