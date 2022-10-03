const mysql = require('promise-mysql')
var cors = require('cors');
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(cors())

function querydb(query) {
  return new Promise((resolve, reject) => {
    var connection;
    var db = "moments";
    mysql.createConnection({
      host: "localhost",
      user: "node",
      password: "1234",
      database: db
    }).then((conn) => {
      connection = conn;
      connection.query(query).then((res) => {
        resolve(res)
        connection.end();
      }).catch((error) => {
        console.error(error);
      });
    }).catch((error) => {
      console.error(error)
    });

  })
}

app.get('/', function (req, res) {
  console.log();
  querydb(`select * from data;`
  ).then((data) => {
    let result = {
      items: data
    }
    res.send(result)
  })
    .catch(() => {

    })
})

app.post('/new', function (req, res) {
  querydb(`INSERT INTO moments.data (image, title, date, about) VALUES ('${req.body.image}', '${req.body.title}', '${req.body.date}', '${req.body.about}');
  `).then(() => { res.send(req.body) })
    .catch((e) => { console.log(e) })
})

app.put('/edit/:id', function (req, res) {
  querydb(`UPDATE moments.data  WHERE (id = '${req.params.id}');
  `).then(() => { res.send(req.body) })
    .catch((e) => { console.log(e) })
})

app.delete('/delete/:id', function (req, res) {
  querydb(`DELETE FROM moments.moment WHERE (id = '${req.params.id}');
`).then(() => { res.send(req.body) })
    .catch((e) => { console.log(e) })
})


// use it before all route definitions
app.use(cors({ origin: 'http://localhost:8888' }));

app.listen(3000)

