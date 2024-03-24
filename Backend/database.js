
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://omeciano:rNcgSXyfsstDfLWZ@cluster0.neigmyc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const collectionName = 'mails';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


const connectDB = async () => {

    try {
        // Connect the client to the server
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } catch (err) {
        console.error(err);
    }

}


const getAllMails = async () => {
    let collection = await db.collection(collectionName);
    let results = await collection.find({}).toArray();
    return results;
}


const addMail = async (mail, name) => {
    try {
        let newDocument = {
            name: name,
            mail: mail,
        };
        let collection = await db.collection(collectionName);
        let result = await collection.insertOne(newDocument);
        // res.send(result).status(204);
        return result;
    } catch (err) {
        console.error(err);
        return null;
    }
}
let db = client.db("crypto-tool");

module.exports = { db, connectDB, addMail };
