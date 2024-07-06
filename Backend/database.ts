//Manages the database connection with MongoDB.
import { MongoClient, Db } from 'mongodb';
import { WalletData } from './types';

const uri: string = "mongodb+srv://omeciano:rNcgSXyfsstDfLWZ@cluster0.neigmyc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const collectionMails: string = 'mails';
const collectionWallets: string = 'wallets';

const client: MongoClient = new MongoClient(uri, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    }
});
// Open the connection.
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
//  To get all the email from the DB.
const getAllMails = async (): Promise<any[]> => {
    let collection = await db.collection(collectionMails);
    let results = await collection.find({}).toArray();
    return results;
}
//To add the new subscriber to the DB. 
const addMail = async (mail: string, name: string): Promise<any> => {
    try {
        let newDocument = {
            name: name,
            mail: mail,
        };
        let collection = await db.collection(collectionMails);
        let result = await collection.insertOne(newDocument);
        return result;
    } catch (err) {
        console.error(err);
        return null;
    }
}
const addWallet = async (wallet: WalletData): Promise<any> => {
    try {
        let result;
        let collection = await db.collection(collectionWallets);
        const savedWallet =  await collection.findOne<WalletData>({ name: wallet.name });
        if(savedWallet === null){
            let transactions: any[] = generateTransactions(wallet);
            let newDocument = {
                name: wallet.name,
                link: wallet.link,
                data: transactions,
            };
            result = await collection.insertOne(newDocument);

        }
        else{
            let transactions: any[] = generateTransactions(wallet);
            collection.updateOne({name: savedWallet.name}, {$set:{data:transactions}});
        }
        return result;

    } catch(err){
        console.error(err);
        return null;
    }
    


}

function generateTransactions(wallet:WalletData) {
    let transactions: any[] = [];
    wallet.data.forEach(transaction => {
        let t = {
            block: transaction[0],
            time: new Date(transaction[1]),
            amount: transaction[2],
            balance: transaction[3],
            balanceUSD: transaction[4],
            profit: transaction[5],
        };
        transactions.push(t);
    });
    return transactions;
}

const findByBlock = async (block: string) => {
    try {
      const collection = await db.collection(collectionWallets);
      const result = await collection.find({
        "data": { $elemMatch: { block: block } }
      }).toArray();
  
      console.log(result);
      return result;
    } catch (err) {
      console.error(err);
      return null;
    }
  };


const findByTimeRange = async (startTime:string, endTime:string) => {
    try {
      const collection = await db.collection(collectionWallets);
      const result = await collection.find({
        "data": {
          $elemMatch: {
            time: { $gte: new Date(startTime), $lte: new Date(endTime) }
          }
        }
      }).toArray();
  
      console.log(result);
      return result;
    } catch (err) {
      console.error(err);
      return null;
    }
  };
  
async function clearCollection() {
    try {

      const collection = await db.collection(collectionWallets);
  
      const result = await collection.deleteMany({});
  
    } catch (err) {
      console.error(err);
    } finally {
      await client.close();
    }
  }

let db: Db = client.db("crypto-tool");

export { db, connectDB, addMail, addWallet, findByBlock,findByTimeRange, clearCollection };