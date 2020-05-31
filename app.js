const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const ObjectId = require("mongodb").ObjectID; 

//app.use(express.static('public'));-nincs kiszolgálandó asset

function getId(raw) {
    try {
        return new ObjectId(raw);
    } catch (err) {
        return "";
    }
}

function getClient(){
    const MongoClient = require('mongodb').MongoClient;
    const uri = " mongodb+srv://AdminDoit:eeSLr54pnfqhp5U@cluster0-prgde.mongodb.net/test?retryWrites=true&w=majority";
    return new MongoClient(uri,{useNewUrlParser: true,useUnifiedTopology: true});
}

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','index.html')).end();
    
})
app.get('/list',(req,res)=>{
    const client = getClient();
    client.connect(async (err)=>{
        const collection = client.db('todo_app').collection('doit');
        const doit = await collection.find().toArray();
        res.send(doit); 
        res.end();
        client.close()
    })
})
app.post('/list',bodyParser.json(),(req,res)=>{
    const newItem = {
        name: req.body.name,
        desc: req.body.desc,
        date: req.body.date,
    }
    const client = getClient();
    client.connect(async(err)=>{
        if(err){
            console.log('connect error')
        }
        const collection = client.db('todo_app').collection('doit');
        result = await collection.insertOne(newItem);
        if(!result){
            console.log('error')
        }
        client.close();
    })
    
    res.send(newItem);
})
app.delete('/list/:id',(req,res)=>{
    const id = getId(req.params.id);;
    console.log(id)
    const client = getClient();
    client.connect(async (err) => {
        if(err){
            console.log("error")
        }
        const collection = client.db("todo_app").collection("doit");
        const result = await collection.deleteOne({ _id : id });
        if (!result.deletedCount) {
            res.send({ error: "not found" });
            return;
        }
        res.send({ id: req.params.id });
        client.close();
    });
    
})
app.listen(3000);


