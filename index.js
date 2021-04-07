const  express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();
app.use(cors());
app.use(express.json());
const port = 4000
require('dotenv').config()


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.77ufn.mongodb.net/EmaJohanDataBase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productcollection = client.db("EmaJohanDataBase").collection("Products");
  const Ordercollection=client.db("EmaJohanDataBase").collection("Orders");
  // perform actions on the collection object
    app.post('/addProduct',(req,res)=>{
        const Products=req.body;
        productcollection.insertOne(Products)
        .then(result=>{
           res.send(result.insertedCount);
        })
    })
    //All products Get
    app.get('/products',(req,res)=>{
        productcollection.find({})
        .toArray((err,document)=>{
            res.send(document)
        })
    })
// Single product Get
    app.get('/products/:productKey',(req,res)=>{
        productcollection.find({key:req.params.productKey})
        .toArray((err,document)=>{
            res.send(document[0])
        })
    })

    //Matching products Get
    app.post('/productByKey',(req,res)=>{
        const productkey=req.body;
        productcollection.find({key:{ $in: productkey}})
        .toArray((err,document)=>{
            res.send(document)
        })
    })

    app.post('/addOrder',(req,res)=>{
      const Products=req.body;
      Ordercollection.insertOne(Products)
      .then(result=>{
         res.send(result.insertedCount);
      })
  })
  console.log('Database Connected');
});



app.get('/', (req, res) => {
  res.send('Hello Ema-Johan!')
})



app.listen(process.env.PORT||port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})