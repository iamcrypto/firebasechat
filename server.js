import "dotenv/config";
import express from 'express';
import configViewEngine from './src/config/configEngine';
import routes from './src/routes/web';
import cronJobContronler from './src/controllers/cronJobContronler';
import socketIoController from './src/controllers/socketIoController';
let cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
app.use(cors());
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);
const axios = require("axios")

const port =  process.env.PORT;
const TWO_HOURS = 1000 * 60 * 60 * 2;
const IN_PROD = process.env.NODE_ENV === 'production'


const options ={
    connectionLimit: 10,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    database: process.env.DB_DBNAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'custom_session_id',
            expires: 'custom_expires_column_name',
            data: 'custom_data_column_name'
        }
    }

}
const  sessionStore = new mysqlStore(options);

app.use(session({
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    cookie: {
        httpOnly: true,
        maxAge: TWO_HOURS,
        sameSite: true,
        secure: IN_PROD
    }
}))


const piNetworkApi = process.env.NETWORK_API;
const API_KEY = process.env.PIAPI_KEY;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

configViewEngine(app);

routes.initWebRouter(app);

cronJobContronler.cronJobGame1p(io);

socketIoController.sendMessageAdmin(io);


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

