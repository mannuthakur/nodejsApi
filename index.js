const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
app.use(express.json())
const cors = require('cors');


//////######## mongo connection ##########/////////
const uri = "mongodb+srv://manishsolanki1989:manish0123@nodejs.xliaiar.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  } 
});
const dbName = 'sample_analytics';
client.connect();
const db = client.db(dbName);
//////######## mongo connection ##########/////////


/////######### All api routes #########///////
app.get('/',function(req,res){
    res.send('hello i am manish');
})

app.get('/get-all-customers',getAllCustomers);
app.get('/find-customers-by-email/:email',findCustomerByEmail);
app.post('/update-customers-by-email/',updateCustomerByEmail);
app.get('/get-customer-transaction/',getCustomerTransaction);
/////######### All api routes #########///////




async function getAllCustomers(req,res){
    const collection = db.collection('customers');
    const customerData = await collection.find({}).toArray();
    res.send(customerData);
    //await client.close();

}

async function findCustomerByEmail(req,res){
    const body = req.params;
    const collection = db.collection('customers');
    const condition = {email:body.email};
    const customerData = await collection.find(condition).toArray();
    res.send(customerData);
   // await client.close();

}

async function updateCustomerByEmail(req,res){
    const body = req.body;
    const collection = db.collection('customers');
    const condition = {email:body.email};
    const updateSet = {'$set':{'address':body.address}}
    const customerData = await collection.updateOne(condition,updateSet);
    res.send(customerData);
   // await client.close();

}

async function getCustomerTransaction(req,res){
    const body = req.body;
    const collection = db.collection('accounts');
    const condition = {'$lookup':{from:'transactions',localfield:"account_id",foreignField:"account_id",as:"customerTransactions"}};
    const customerData = await collection.aggregate([condition]);
    res.send(customerData);
   // await client.close();

}




app.use(cors());

app.listen(3000,() => {
    console.log('runninnnn server on port 3000');
});