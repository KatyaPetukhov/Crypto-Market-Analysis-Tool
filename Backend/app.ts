//  The starting point for the server.
//  Defines API end points, using express, and initializes data gathering on a set time every
//  15 minutes.

require("dotenv").config();
import express, { Request, Response, NextFunction, response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import fs from "fs";
import cors from "cors";
import createError from "http-errors";
import swaggerAutogen from "swagger-autogen";
const nodemailer = require("nodemailer");
import { Worker } from "worker_threads";
import {
  addMail,
  getLastPrediction,
  getAllMails,
  deleteMail,
} from "./database";
import { crawlBitcoinHistory } from "./crawlBitcoinHistory";
import { BitcoinHistory, WalletData } from "./types";
import { createBitcoinWallets } from "./getWalletData";
const app = express();
let predictionForToday: number | undefined = undefined;

startWorker();
setInterval(() => {
  startWorker();
}, 24 * 60 * 60 * 1000);

//  Initialize a nodemailer transport to send emails
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

//  View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//  Allow access to the server from all origins/ websites
app.use(cors({ origin: "*", allowedHeaders: "*", methods: "*" }));

//  Returns a JSON file containing open API docs.
app.get("/api-docs", async (req: Request, res: Response) => {
  res.send(JSON.parse(fs.readFileSync("swagger-output.json", "utf-8")));
});

app.get("/", async (req: Request, res: Response) => {
  res.send("<h1>Hello World</h1>");
});
//  Returns an array of historical wallet data.

//  Returns an array of bitcoin historical data between from and until dates, if provided, otherwise between
//  one year ago and today.
app.get("/get-bitcoin-history", async (req: Request, res: Response) => {
  const from: any = req.query.from;
  const until: any = req.query.until;
  console.log("Crawling bitcoin history");
  crawlBitcoinHistory(from, until)
    .then((data: BitcoinHistory[]) => {
      res.send(data);
      return;
    })
    .catch((err: any) => {
      console.log(err);
      res.send("ERROR");
      return;
    });
});

app.get("/get-wallet-data", async (req: Request, res: Response) => {
  res.send(createBitcoinWallets());
});

app.get("/get-prediction", async (req: Request, res: Response) => {
  res.send({
    statusCode: 200,
    predictionForToday: predictionForToday,
  });
});

//  Add a subscriber to the mailing list to the DB.
app.post("/add-subscriber", async (req: Request, res: Response) => {
  const name = req.body.name;
  const mail = req.body.mail;
  const result = await addMail(mail, name);
  if (result != null) {
    try {
      sendMail(
        mail,
        `New Subscription To Crypto Market Analysis Tool`,
        `Thank you for joining us, ${name}.\nTeam of Crypto Market Analysis Tool.`
      );
    } catch (e) {
      res.status(500).send("Error sending email");
      return;
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.post("/remove-subscriber", async (req: Request, res: Response) => {
  const mail: any = req.query.mail;
  await deleteMail(mail);
  res.send({});
});

// Catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next(createError(404));
});

//Automatically get bitcoin price history and Wallet Transactions
//By scraping and downloading info.
//Disabled due to CAPCHA

// const saveWallets = async () => {
//   // await crawlBitcoinWallets();
//   // crawledWalletData.forEach(wallet => {
//   //   addWallet(wallet);
//   // });
//   const bitcoinWallets = createBitcoinWallets();
//   bitcoinWallets.forEach((wallet) => {
//     addWallet(wallet);
//   });
// };

// Error handler.
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});

function sendMail(mail: string, subject: string, text: string) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: mail, // The email you want to send to
    subject: subject,
    text: text,
  };

  //  Send email to the user.
  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.log(error);
      throw new Error("Failed to send mail.");
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

// Create a new thread to run the genetic algorithm and
// calculate a prediction without blocking the main server.
async function startWorker() {
  const worker = new Worker(path.resolve(__dirname, "./genetic-thread.js"));
  worker.on("error", (e: any) => {
    console.log("error is : " + e.message);
  });
  worker.on("message", async (prediction: number) => {
    predictionForToday = prediction;
    const lastPrediction = await getLastPrediction();
    const mails = await getAllMails();
    let predictionText = convertPredictionToText(predictionForToday);
    const url = process.env.URL + "unsubscribe";
    if (predictionForToday != lastPrediction?.prediction) {
      for (let i = 0; i < mails.length; i++) {
        let mail = mails[i].mail;
        sendMail(
          mail,
          "Crypto Market Analysis Tool - New prediction for today!",
          `Hello, ${mails[i].name}\nThe prediction was changed from yesterday. The new prediction for today is to: ${predictionText}.\n\n\nTo unsubscribe, click here: ${url}/${mail}`
        );
      }
    }

    console.log("The prediction is : " + predictionForToday);
  });
}

function convertPredictionToText(prediction: number) {
  return prediction == 0 ? "Hold" : prediction > 0 ? "Buy" : "Sell";
}

export default app;
