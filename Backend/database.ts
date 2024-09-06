//Manages the database connection with MongoDB.
import { MongoClient, Db } from "mongodb";
import { Prediction, WalletData } from "./types";

const uri: string =
  "mongodb+srv://omeciano:rNcgSXyfsstDfLWZ@cluster0.neigmyc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const collectionMails: string = "mails";
const collectionWallets: string = "wallets";
const collectionPredictions: string = "predictions";

const client: MongoClient = new MongoClient(uri, {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
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
};
//  To get all the email from the DB.
const getAllMails = async (): Promise<any[]> => {
  let collection = await db.collection(collectionMails);
  let results = await collection.find({}).toArray();
  return results;
};
//To add the new subscriber to the DB.
const addMail = async (mail: string, name: string): Promise<any> => {
  try {
    let result;
    let collection = await db.collection(collectionMails);
    const savedMail = await collection.findOne({
      mail: mail,
    });
    if (savedMail === null) {
      let newDocument = {
        name: name,
        mail: mail,
      };
      result = await collection.insertOne(newDocument);
    } else {
      result = await collection.updateOne(
        { name: savedMail.name },
        { $set: { name: name } }
      );
    }
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};

//To remove the subbscriber from the mailing list by mail.
const deleteMail = async (mail: string) => {
  try {
    const collection = await db.collection(collectionMails);
    const result = await collection.deleteOne({
      mail: mail,
    });
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};

//To add the wallet to the MongoDB.

const addWallet = async (wallet: WalletData): Promise<any> => {
  try {
    let result;
    let collection = await db.collection(collectionWallets);
    const savedWallet = await collection.findOne<WalletData>({
      name: wallet.name,
    });
    if (savedWallet === null) {
      let newDocument = {
        name: wallet.name,
        link: wallet.link,
        data: wallet.data,
      };
      result = await collection.insertOne(newDocument);
    } else {
      result = await collection.updateOne(
        { name: savedWallet.name },
        { $set: { data: wallet.data } }
      );
    }
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};

//To get all the wallets from the DB.
const getAllWallets = async (): Promise<WalletData[]> => {
  try {
    const collection = await db.collection(collectionWallets);
    const result = (await collection
      .find({})
      .toArray()) as unknown as WalletData[];
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
};

//To find the  wallet by block number.
const findByBlock = async (block: string) => {
  try {
    const collection = await db.collection(collectionWallets);
    const result = await collection
      .find({
        data: { $elemMatch: { block: block } },
      })
      .toArray();
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};

//To find the  wallet by time range.
const findByTimeRange = async (startTime: string, endTime: string) => {
  try {
    const collection = await db.collection(collectionWallets);
    const result = await collection
      .find({
        data: {
          $elemMatch: {
            time: { $gte: new Date(startTime), $lte: new Date(endTime) },
          },
        },
      })
      .toArray();

    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};

//To add prediction and its time to the DB.
const addPrediction = async (
  prediction: string,
  date: string
): Promise<any> => {
  try {
    let result;
    let collection = await db.collection(collectionPredictions);
    const savedPrediction = await collection.findOne<string>({
      date: date,
    });
    if (savedPrediction === null) {
      let newDocument = {
        prediction: prediction,
        date: date,
      };
      result = await collection.insertOne(newDocument);
    } else {
      result = await collection.updateOne(
        { date: date },
        { $set: { prediction: prediction } }
      );
    }
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};

//To get the last prediction from the DB.
const getLastPrediction = async () => {
  try {
    const collection = await db.collection(collectionPredictions);
    const cursor = collection
      .find()
      .sort([["_id", -1]])
      .limit(1);

    const result = await cursor.next();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};

//To clear the collection by its name.
async function clearCollection(collectionName: string) {
  try {
    const collection = await db.collection(collectionName);

    const result = await collection.deleteMany({});
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

let db: Db = client.db("crypto-tool");

export {
  db,
  connectDB,
  addMail,
  addWallet,
  findByBlock,
  findByTimeRange,
  clearCollection,
  getAllWallets,
  addPrediction,
  getLastPrediction,
  getAllMails,
  deleteMail,
};
