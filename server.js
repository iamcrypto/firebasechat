import "dotenv/config";
import express from 'express';
import connection from "./src/config/connectDB";
import configViewEngine from './src/config/configEngine';
import routes from './src/routes/web';
import cronJobContronler from './src/controllers/cronJobContronler';
import socketIoController from './src/controllers/socketIoController';
let cookieParser = require('cookie-parser');
const cors = require('cors');
import fileUpload from 'express-fileupload';
const path = require('path');
import md5 from "md5";
const app = express();
app.use(cors());
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const axios = require("axios");
import { S3Client, CreateBucketCommand,DeleteObjectCommand,PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({region: process.env.AWS_REGION,  
  credentials: {
  accessKeyId: process.env.AWS_ACCESSKEY,
  secretAccessKey:process.env.AWS_SEREATEACCESSKEY,
},
});
export { s3Client };

const port =  process.env.PORT;

const TWO_HOURS = 1000 * 60 * 60 * 2;
const IN_PROD = process.env.NODE_ENV === 'production'

const piNetworkApi = process.env.NETWORK_API;
const API_KEY = process.env.PIAPI_KEY;

app.use(cookieParser());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

configViewEngine(app);

routes.initWebRouter(app);

cronJobContronler.cronJobGame1p(io);

socketIoController.sendMessageAdmin(io);


const deleteBankRechargeById = async (id) => {

  const [recharge] = await connection.query("DELETE FROM bank_recharge WHERE id = ?", [id]);

  return recharge
}

app.post('/upload', async function(req, res) {
  let sampleFile;
  let uploadPath;
  let c_rate;
  let c_username;
  let c_upi_id;
  let c_upi_wallet;
  let c_image;
  let auth ;

  c_rate = req.body.edit_rate;
  c_username = req.body.edit_username;
  c_upi_id = req.body.edit_qr_id;
  c_upi_wallet = req.body.edit_upi_id;
  c_image = req.body.qr_code_image_hdd;
  auth = req.body.authtoken;


  const [users] = await connection.query('SELECT * FROM users WHERE token = ?', [md5(auth)]);
  if (!req.files || Object.keys(req.files).length === 0) {
    const [bank_recharge] = await connection.query(`SELECT * FROM bank_recharge WHERE phone = ? AND status = 0;`, [users[0].phone]);
    var transfer_mode = '';
    if(bank_recharge.length != 0)
    {
        transfer_mode = bank_recharge[0].transfer_mode;
    }
    else{
        transfer_mode = "manual";
    }
    let file_name1 = c_image;
    const deleteRechargeQueries = bank_recharge.map(recharge => {
        return deleteBankRechargeById(recharge.id)
    });

   await Promise.all(deleteRechargeQueries)
    let timeNow = Date.now();
    await connection.query("INSERT INTO bank_recharge SET name_bank = ?, name_user = ?, stk = ?, qr_code_image = ?, upi_wallet = ?, transfer_mode = ?,phone=?, colloborator_action = ?, time = ?, type = 'momo', status = 0;", [
        c_rate, c_username, c_upi_id, file_name1, c_upi_wallet,transfer_mode,users[0].phone, "off", timeNow
    ]);

    return res.status(200).json({
        message: 'Successfully changed',
        status: true,
        datas: [],
    });
  }
  else
  {
    sampleFile = req.files.fileUploaded;
    const [bank_recharge] = await connection.query(`SELECT * FROM bank_recharge WHERE phone = ? AND status = 0;`, [users[0].phone]);
    var transfer_mode = '';
    if(bank_recharge.length != 0)
    {
      transfer_mode = bank_recharge[0].transfer_mode;
    }
    else{
        transfer_mode = "manual";
    }
    let file_name1 = path.parse(sampleFile.name).name + "_" + users[0].id_user + "_" + users[0].phone + path.parse(sampleFile.name).ext;
    //let file_url = process.env.AWS_BUCKET_URL+ file_name1;
    const deleteRechargeQueries = bank_recharge.map(async recharge => {
      await s3Client.send(new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: recharge.qr_code_image.toString().trim()
      },function (err,data){}))
      
        return deleteBankRechargeById(recharge.id);
    });

   await Promise.all(deleteRechargeQueries)
    let timeNow = Date.now();
    await connection.query("INSERT INTO bank_recharge SET name_bank = ?, name_user = ?, stk = ?, qr_code_image = ?, upi_wallet = ?, transfer_mode = ?,phone=?, colloborator_action = ?, time = ?, type = 'momo', status = 0;", [
        c_rate, c_username, c_upi_id, file_name1, c_upi_wallet,transfer_mode,users[0].phone, "off", timeNow
    ]);
    const fileContent  = Buffer.from(req.files.fileUploaded.data, 'binary');
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET,
      Key:file_name1,
      Body: fileContent,
  };
    try {
      const results = await s3Client.send(new PutObjectCommand(uploadParams));
      console.log("uploaded");
    } catch (err) {
      console.log("Error", err);
    }
    return res.status(200).json({
      message: 'Successfully changed',
      status: true,
      datas: [],
  });
  }
});

const config = {headers:{'Authorization': 'Key '}}
  app.post('/approve', async (req, res) => {
    const { paymentId } = req.body
    try {
        //send /approve POST request
        await axios.post(`https://${piNetworkApi}/payments/${paymentId}/approve`, {}, {
          headers: {
            'Authorization': `Key ${API_KEY}`
          }
        })
    
        return res.status(200).send({
          message: 'Payment approved!',
          status: 'success'
        });
      } catch (err) {
        console.log(err)
        return res.status(500).send({
          message: `There has been an error!`,
          status: 'error'
        })
      }
  });
  app.post('/complete', async(req, res) => {
    const { paymentId, txid } = req.body
    try {
      //send /approve POST request
      await axios.post(`https://${piNetworkApi}/payments/${paymentId}/complete`, {
        txid
      }, {
        headers: {
          'Authorization': `Key ${API_KEY}`
        }
      })
  
      return res.status(200).send({
        message: 'Payment completed!',
        status: 'success'
      });
    } catch (err) {
      //output error for debugging
      console.log(err)
        
      //return something to your front end
      return res.status(500).send({
        message: `There has been an error!`,
        status: 'error'
      })
    }
  });


server.listen(port, () => {
    console.log("http://localhost:" + port);
});

