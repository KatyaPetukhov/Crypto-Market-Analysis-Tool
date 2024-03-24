import { MongoClient, Db } from 'mongodb';

const uri: string = "mongodb+srv://omeciano:rNcgSXyfsstDfLWZ@cluster0.neigmyc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const collectionName: string = 'mails';

const client: MongoClient = new MongoClient(uri, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    }
});

const connectDB = async (): Promise<void> => {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } catch (err) {
        console.error(err);
    }
}

const getAllMails = async (): Promise<any[]> => {
    let collection = await db.collection(collectionName);
    let results = await collection.find({}).toArray();
    return results;
}

const addMail = async (mail: string, name: string): Promise<any> => {
    try {
        let newDocument = {
            name: name,
            mail: mail,
        };
        let collection = await db.collection(collectionName);
        let result = await collection.insertOne(newDocument);
        return result;
    } catch (err) {
        console.error(err);
        return null;
    }
}

let db: Db = client.db("crypto-tool");

export { db, connectDB, addMail };