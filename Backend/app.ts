//  The starting point for the server. 
//  Defines API end points, using express, and initializes data gathering on a set time every
//  15 minutes. 
 
require('dotenv').config();
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fs from 'fs';
import cors from 'cors';
import createError from 'http-errors';
import {  } from 'swagger-autogen';
const nodemailer = require('nodemailer');

import { addMail, addWallet, findByBlock, findByTimeRange, clearCollection, getAllWallets} from './database';
import { crawledWalletData, crawlBitcoinWallets, crawlBitcoinHistory, clearWalletData } from './crawl';
import { BitcoinHistory, WalletData } from './types';
import { log } from 'console';
import { preprocessBitcoinHistory, preprocessWallers } from './genetic';

const app = express();

//  Initialize a nodemailer transport to send emails 
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
  }
});

//  View engine setup 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//  Allow access to the server from all origins/ websites
app.use(cors({ origin: '*', allowedHeaders: '*', methods: '*' }));

//  Returns a JSON file containing open API docs.
app.get('/api-docs', async (req: Request, res: Response) => {
  res.send(JSON.parse(fs.readFileSync("swagger-output.json", "utf-8")));
});

app.get('/', async (req: Request, res: Response) => {
  res.send("<h1>Hello World</h1>");
});
//  Returns an array of historical wallet data.
app.get('/get-wallet-data', (req: Request, res: Response <WalletData[]>) => {
  res.send(crawledWalletData);
});
//  Returns an array of bitcion historical data between from and until dates, if provided, otherwise between 
//  one year ago and today.
app.get('/get-bitcoin-history', async (req: Request, res: Response) => {
  const from: any= req.query.from;
  const until: any = req.query.until;
  console.log("Crawling bitcoin history")
  crawlBitcoinHistory(from, until)
    .then((data:BitcoinHistory[]) => { res.send(data); return; })
    .catch((err:any) => { console.log(err); res.send("ERROR"); return; });  
});


app.get('/get-wallet-data-from-db', async(req: Request, res: Response ) => { 
  res.send(await getAllWallets());
});


app.get('/get-allwallet-genetic', (req: Request, res: Response ) => {
  res.send(preprocessWallers(crawledWalletData));
});

app.get('/get-bitcoinhistory-genetic', (req: Request, res: Response ) => {
  const currentDate = new Date();
  const oneYearAgo = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
  res.send(preprocessBitcoinHistory(oneYearAgo));
});


//  Add a subscriber to the mailing list to the DB.
app.post('/add-subscriber', async (req: Request, res: Response) => {
  const name = req.body.name;
  const mail = req.body.mail;
 const result = await addMail(mail,name);
  if(result != null){
    const mailOptions = {
      from: process.env.EMAIL,
      to: mail, // The email you want to send to
      subject: `New Subscription To Crypto Market Analysis Tool`,
      text: `Thank you for joining us, ${name}.\nTeam of Crypto Market Analysis Tool.`
  };

  //  Send email to the user.
  transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
          console.log(error);
          res.status(500).send('Error sending email');
      } else {
          console.log('Email sent: ' + info.response);
      }
  });
    res.sendStatus(200);

  }
  else{
    res.sendStatus(404);
  }

});

app.get('/get-by-block', async (req: Request, res: Response) => {
  const block:any = req.query.block ; 
  res.send(await findByBlock(block));
});


app.get('/get-by-time', async (req: Request, res: Response) => {
  const startTime:any = req.query.startTime ; 
  const endTime:any = req.query.endTime ; 

  res.send(await findByTimeRange(startTime, endTime));
});

// Catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", "true");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next(createError(404));
});
const saveWallets = async () => {
  clearWalletData(); 
  await crawlBitcoinWallets();
  crawledWalletData.forEach(wallet => {
    addWallet(wallet);
  });


}
//  Get initial data and set a repeating interval to get updated data every 15 minutes.
saveWallets();
setInterval(() => { 
  saveWallets();
 }, 15 * 60 * 1000);




// Error handler.
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});

export default app;