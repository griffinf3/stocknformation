'use strict';
var path = require('path'),
  mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router(),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  request = require('request'),
  Config = require('./config.js'),
  Tradier = require('tradier-client'),
  http = require('http'),
  url = require('url');

var tradier = new Tradier(Config.APIKey2,'sandbox');
const PORT = process.env.PORT || 4000;
var Stock = require('./models/stock');
var Stockdata = require('./models/stockdata');
var db = mongoose.connect(process.env.MONGODB_URI); 

var app = express();
var noUsers = 0;
var userIDArray = [];
userIDArray.length = 0;

var Quandl = require("quandl");
var quandl = new Quandl();
 
var options1 = {
    auth_token: Config.APIKey
}
quandl.configure(options1);

// enable cors
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

app.use(express.static(path.resolve(__dirname, '../client/build')));

//rest API requirements
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use('/api/v1', router);

router.route('/lookup*').get(function (req, res) {
    var stockname = decodeURIComponent(req.query.sn); 
    var url = 'https://sandbox.tradier.com/v1/markets/search?q=' + stockname;
var headers = {
    'Authorization': Config.APIKey3,
    'Accept': 'application/json'};

var options2 = {
    url:  url,
    headers: headers};

function callback(error, response, body) {
    if (error){}
    if (!error) {
        var ob = JSON.parse(response.body);
        var companyArray = []
        companyArray.length = 0;
        var obj; 
        if (ob.securities != null)
        {
        if (ob.securities.security.length > 1)    
        {
        for (var i=0; i< ob.securities.security.length; i++)
        {obj = {company: ob.securities.security[i].description, symbol: ob.securities.security[i].symbol};companyArray.push(obj);}
        }
        else companyArray.push({company: ob.securities.security.description, symbol: ob.securities.security.symbol});    
        }
        //else companyArray = []; no security data with this one.        
    res.json(companyArray);
    }}

request(options2, callback);
            });

router.route('/add*').get(function (req, res) {
    var startdate = req.query.startdate;
    var enddate = req.query.enddate;
    var stocksymbol = decodeURIComponent(req.query.stocksymbol);
    stocksymbol = stocksymbol.toUpperCase();
    var currentdate = new Date();   
    return Stock.findOne({
      'stockname': stocksymbol
    }, function(err, stock) {
      //that stockname was not found, let's add it if Tradier has data for it.
      if (!stock) {
          //is this a stock listed in Tradier?
        quandl.dataset({source: "WIKI",
                        table: stocksymbol}, {
                                    order: "asc",
                                    exclude_column_names: true,
                                    start_date: startdate,
                                    end_date: enddate,
                                    column_index: 4}, 
                                    function(err, response){
                                        if(err) throw err;
                                        var obj = JSON.parse(response);
                                        if (obj.dataset != undefined)
                                        {//found in tradier 
                                            //save this stock's dataset in the database.
                                                var newstockdata = new Stockdata({
                                                stockname: stocksymbol,
                                                startdate: startdate,
                                                dataset: obj.dataset});
                                                newstockdata.save(function(error, savedStockdata){});
                                            //save this stock's symbol in the database.
                                                var newstock = new Stock({
                                                stockname: stocksymbol,
                                                created_at: currentdate});
                                                newstock.save(function(error, savedStock) {
                                                if (error) {} 
                                                res.json({error: error, status: 'new'});});}
                else {
                //not found in tradier.
                res.json({error: err, status: 'undefined'});}});} else {
        //we already have this stock listed in our db.
        res.json({error: err, status: 'stored'});
       // return (err, stock);
      }});});

router.route('/delete*').get(function (req, res) {  
    var stocksymbol = req.query.ss;
    Stock.findOneAndRemove({stockname: stocksymbol}, function(err, result) {
if (err) throw err;
    Stockdata.findOneAndRemove({stockname: stocksymbol}, function(err, result) {if (err) throw err; res.json({result: result});});});});
    
router.route('/stocks').get(function (req, res) {
    getSymbols().then(result => {res.json({stocksymbols: result, noUsers: noUsers});});});

router.route('/users').get(function (req, res) {
var noUsers = userIDArray.length;
res.json({noUsers: noUsers});   
});

function getSymbols(){
return new Promise(
 function (resolve) {
  Stock.find({}, function(err, stocks) {
  if (err) throw err;
  var arrayLg = stocks.length;
  var stocksymbols = []
  stocksymbols.length = 0;
  for(var i=0;i<arrayLg; i++){
      stocksymbols.push(stocks[i].stockname);}  
            resolve(stocksymbols);
        });});}

router.route('/api*').get(function (req, res) {
  var startdate = req.query.startdate;
  var enddate = req.query.enddate;
  Stock.find({}, function(err, stocks) {
  if (err) throw err;
  var arrayLg = stocks.length;
  var stocksymbols = []
  stocksymbols.length = 0;
  for(var i=0;i<arrayLg; i++){
  stocksymbols.push(stocks[i].stockname);}
   //We have the stocks. Now get their data from quandl.
  var promises = [];    

  for(var i=0;i<arrayLg; i++){
   promises.push(getData(stocks[i].stockname));
}
       
function getData(stock)
    { return new Promise((resolve) => {
        return Stockdata.findOne({
      'stockname': stock
    }, function(err, stockdataset) {
      if (!stockdataset) {}
    else resolve(stockdataset.dataset[0].data);
        });

    } ); }
  Promise.all(promises).then((results) => {res.json({stockArray: results, noUsers: noUsers})});});});

const server = app.listen(PORT, function (err) {
    if (err) {
    console.log(err);
  } else {
    console.log(`Listening on port ${PORT}`);
  } });

const io = require('socket.io')(server); 
 
io.on('connection', (client) => {
    //noUsers +=1; 
    var idIndex = userIDArray.indexOf(client.id);
    if (idIndex <0) userIDArray.push(client.id);
     noUsers = userIDArray.length;
    client.broadcast.emit('userupdate', {noUsers: noUsers});
    client.on('modify', () => { 
    client.broadcast.emit('updatedata');         
});        
  client.on('disconnect', () => {
      
var idIndex = userIDArray.indexOf(client.id);
if (idIndex > -1) {userIDArray.splice(idIndex, 1);}
noUsers = userIDArray.length;      
    client.broadcast.emit('userupdate', {noUsers: noUsers});
  });
});


module.exports = app;