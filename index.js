

const express = require('express');
const http = require('http');

var admin = require("firebase-admin");
const axios = require("axios")

const CURRENT_VERSION = 1;

const piNetworkApi = 'api.minepi.com/v2'
const API_KEY = 'dgxxumldooihfvvtes576er2bhudyfmsmphbuax021iiolgl3sw2z9kdcomlp6tp'

const port = process.env.PORT || 3005

var app = express();
const server = http.createServer(app)



var serviceAccount = require("C:/Users/HOME/Documents/GitHub/firebasechat/nodejs.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://live-chess-dede7-default-rtdb.asia-southeast1.firebasedatabase.app"
});
app.use(express.json());
app.use(express.static(__dirname + "/"));

const database = admin.database();




app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
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
        //output error for debugging
        console.log(err)
          
        //return something to your front end
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


server.listen(port);
console.log("http://localhost:" + port);