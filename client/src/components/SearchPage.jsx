import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import 'whatwg-fetch';
import RingSpinner from './RingSpinner.jsx';
import swal from 'sweetalert';
import {Grid, Col, Row} from 'react-bootstrap';
import Chart from './Chart.jsx';

var moment = require('moment');

var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];


class SearchPage extends Component {
    
constructor(props){
        super(props);
        this.state = {startdate: '', enddate: '', updateRequired: this.props.updateRequired, startdateMS: 0, enddateMS:0, companyArrayIndex: 0, company: '', preBtn: true, nextBtn: false, companyArray: [{company: '', symbol: ''}], noUsers: this.props.noUsers, showSpinner: true, chartData: this.props.chartData, allStocks1: this.props.allStocks1, allStocks2: this.props.allStocks2, allStocks3: this.props.allStocks3, stockArray: [], stockName: '', stockSymbol: '', message: '', fetching: false, data: [],
                      symbolArray: []};
        this.handleStockChange = this.handleStockChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleStockNameChange = this.handleStockNameChange.bind(this);
        this.handleLookup = this.handleLookup.bind(this);
        this.getNamesAndData =this.getNamesAndData.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.handlePre = this.handlePre.bind(this);
        this.handleNext = this.handleNext.bind(this);}
    
componentWillReceiveProps(nextProps){
   if (nextProps.chartData.length === 0 && nextProps.updateRequired === true) 
   {this.fetchData();}
else
    if (nextProps.chartData.length === 0 && this.state.updateRequired === true) 
   {this.fetchData();}}
     
componentDidMount() {
    
var now = new Date();
var mSec= now.getTime(); 
this.setState({enddateMS: mSec});
mSec = mSec - 364*24*3600*1000;
this.setState({startdateMS: mSec});                                                               
var startdate = new Date(mSec).toISOString() 
startdate = moment(startdate).format("YYYY-MM-DD"); 
var enddate = now.toISOString(); 
enddate = moment(enddate).format("YYYY-MM-DD");  
this.setState({startdate: startdate, enddate: enddate})  

    this.fetchData();
}
       
handlePre(){
var CAindex = this.state.companyArrayIndex;
if (CAindex > 0) {
    CAindex--;
    this.setState({companyArrayIndex: CAindex, preBtn: false, nextBtn: false, company: this.state.companyArray[CAindex].company, stockSymbol: this.state.companyArray[CAindex].symbol});
    if (CAindex === 0)
    {this.setState({preBtn: true, nextBtn: false});}}
else {this.setState({preBtn: true, nextBtn: false});}}

    
handleNext(){
var CAlg = this.state.companyArray.length; 
var CAindex = this.state.companyArrayIndex; 
if (CAlg-1 > CAindex){
    CAindex++;     
    this.setState({companyArrayIndex: CAindex, preBtn: false, nextBtn: false, company: this.state.companyArray[CAindex].company, stockSymbol: this.state.companyArray[CAindex].symbol});
    if (CAlg === CAindex+1)
    {this.setState({preBtn: false, nextBtn: true});}}
else {this.setState({preBtn: false, nextBtn: true});}} 
    
fetchData(){   
this.setState({showSpinner: true});
fetch('/api/v1/stocks', {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json()).then((responseJson) => {
    
    if (responseJson.stocksymbols.length> 0)
 {
 this.setState({symbolArray: responseJson.stocksymbols, noUsers: responseJson.noUsers, updateRequired: true});
                                                                                
fetch('/api/v1/api?startdate='+ this.state.startdate + '&enddate=' + this.state.enddate, {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json()).then((responseJson) => {
    this.getNamesAndData({stocksymbols: this.state.symbolArray, stockArray: responseJson.stockArray});}).catch(e => {});}
else
    //there are no stocks yet to plot.
{var datasets = [];
//datasets is an array of objects, empty here.
this.setState({chartData: datasets, showSpinner: false, updateRequired: false});}
});}
         
getNamesAndData(data){
this.setState({chartData: []});
var stocksymbols = data.stocksymbols;     
var arrayLg = stocksymbols.length;
         var allStocks1 = [];
         var allStocks2 = [];
         var allStocks3 = [];
         allStocks1.length = 0;
         allStocks2.length = 0;
         allStocks3.length = 0;   
         for (var i=0; i< Math.ceil(arrayLg/3); i++)
         {allStocks1.push(stocksymbols[3*i]);
          if (arrayLg === 3*i+1) break;
          allStocks2.push(stocksymbols[3*i+1]);
          if (arrayLg === 3*i+2) break;
          allStocks3.push(stocksymbols[3*i+2]);   
         } 
         //inform parent of changes to names.
         this.props.getNames({allStocks1: allStocks1, allStocks2: allStocks2, allStocks3: allStocks3});
var stockArray = data.stockArray;
         if (stockArray.length > 0) 
         {var allDataArray = [];
         var points = [];
         points.length = 0;  
         var point;
         var aminv= 100000000; 
         var minval;
         var amaxv = 0; 
         var maxval;
         var j;
         for (j = 0; j<stockArray.length; j++)
         {
         for (i = 0; i<stockArray[j].length; i++){
            point = {x: stockArray[j][i][0], y: stockArray[j][i][1]} 
            points.push(point);};
          allDataArray.push(points); 
          minval = Math.min(...points.map(o => o.y));
          maxval = Math.max(...points.map(o => o.y));
          if (minval < aminv) aminv= minval; 
          if (maxval > amaxv) amaxv= maxval;
          points = [];
          points.length = 0;};
         //getChartData
     var datasets = [];
    //datasets is an array of objects.
     datasets.length = 0;
     var obj;
     var allDAlg = stockArray.length;
     for (i = 0; i<allDAlg; i++)     
     {j = i -(Math.floor(i/allDAlg))*allDAlg;
      obj = {label: stocksymbols[i],
             fill: false,    
             data: allDataArray[i],
             pointRadius:0,
             borderColor: colorArray[j],
             pointBackgroundColor: colorArray[j],
             PointBorderColor: 'black' 
            }
      datasets.push(obj);
     }  
      this.setState({chartData: datasets, showSpinner: false, updateRequired: true});
      this.props.getData(datasets);
         }
      else { var dataset=[];
        this.setState({chartData: dataset, showSpinner: false, updateRequired: false});
        this.props.getData([]);
         }}
    
handleStockChange(event){
    this.setState({stockSymbol: event.target.value, chartData: []});
   }
    
handleStockNameChange(event){
    this.setState({stockName: event.target.value});
   }
    
  
deleteStock(stocksymbol){
this.setState({showSpinner: false});   
fetch('/api/v1/delete?ss='+ stocksymbol, {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json())
       .then((responseJson) => {
   this.fetchData();
   this.props.modify();});}
    
handleLookup(event){
    event.preventDefault();
    var stockname = encodeURIComponent(this.state.stockName);
    fetch('/api/v1/lookup?sn='+ stockname, {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json())
       .then((responseJson) => {
if (responseJson.length >0)
{var obj;
 var companyArray = [];
 companyArray.length=0;
 for (var i=0; i<responseJson.length; i++)
 {obj= {company: responseJson[i].company, symbol: responseJson[i].symbol}
 companyArray.push(obj);
  
 }
 this.setState({companyArray: companyArray, company: companyArray[0].company, stockSymbol: companyArray[0].symbol, companyArrayIndex: 0});}
else {
    swal({
  title: "No data found.",
  text: "Please try one or more different key words.",
  buttons: [false, "Continue"]
}).then((value) => {});}
        
;});}
    
handleSubmit(event){
     event.preventDefault();
    this.setState({showSpinner: true});
     var stocksymbol = encodeURIComponent(this.state.stockSymbol);
    //We will add a stock to the db if it is not already there.
    fetch('/api/v1/add?stocksymbol='+ stocksymbol + '&startdate='+ this.state.startdate + '&enddate=' + this.state.enddate, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) =>  response.json())
       .then((responseJson) => {
          if (responseJson.status === 'new') {
              this.props.modify();
              this.fetchData(); }
           else if (responseJson.status === 'stored') {
               this.setState({showSpinner: false});
               
                swal({
  title: "Stock already in database!",
  text: "This stock has already been stored and plotted.",
  buttons: [false, "Continue"]
}).then((value) => {this.fetchData();});} 
        else
            //not listed in tradier
        {this.setState({showSpinner: false});
            
            swal({
  title: "Data not found!",
  text: "We're sorry. No data was found for stock that uses this stock symbol.",
  buttons: [false, "Continue"]
}).then((value) => {this.fetchData();});}
});}
  
render() {
      
const rsStyle = {
  backgroundColor: 'lightgrey',
  marginLeft: '450px',
  width: '60px',
  height: '60px',
  borderRadius: "5px",
  border: "1px solid black"
} 

const btn1Style = {
  marginLeft: '10px',
  height: '25px',
  color: 'black'
}

const btn2Style = {
  marginLeft: '5px',
  height: '25px',
  color: 'black'
}

const style1 = {
    color: 'black'
}

const style2 = {
   margin: '10px'
}
   
const gridInstance = 
	<Grid>
		<Row className="show-grid">
            {this.props.allStocks1.map((item,i) =>  <div key={i}>
			<Col xs={6} md={4}>
				<button style={{backgroundColor: colorArray[3*i], color: 'black', margin: '3px', border: "1px solid green", borderRadius: "5px"}}
            onClick={this.deleteStock.bind(this, item)}>{item}
		</button>
			</Col>
                </div>)}
            {this.props.allStocks2.map((item,i) =>  <div key={i}>
			<Col xs={6} md={4}>
				<button style={{backgroundColor: colorArray[3*i+1], color: 'black', margin: '3px', border: "1px solid green", borderRadius: "5px"}}
            onClick={this.deleteStock.bind(this, item)}>{item}
		</button>
			</Col>
              </div>)}
            {this.props.allStocks3.map((item,i) =>  <div key={i}>
			<Col xs={6} md={4}>
				<button style={{backgroundColor: colorArray[2+3*i], color: 'black', margin: '3px', border: "1px solid green", borderRadius: "5px"}}
            onClick={this.deleteStock.bind(this, item)}>{item}
		</button>
			</Col>
              </div>)}
		</Row>
	</Grid>
            
let chartDisplay = !!(
    
    this.state.chartData.length >0) ?
    (<div><Chart chartData={this.props.chartData} startDate={this.state.startdateMS} endDate={this.state.enddateMS} />
 {gridInstance}</div>) :
    (<div></div>)
            
let content = !!this.state.showSpinner ?
    (
<div  style={rsStyle}><RingSpinner />
        </div>      
    ) :
(<div>
<div><h2>Lookup or Enter Stock Symbol Below:</h2></div>
 <form onSubmit={this.handleLookup}> 
        <label style={style2}>Enter Keyword(s):&nbsp;
          <input style={style1} type="text" defaultValue = {this.state.stockName} onChange={this.handleStockNameChange} />
        </label>
        <div style={{marginTop: '10px', display:"inline"}}>
        <input style={style1} type="submit" value="Submit to Search" />
        </div>
        </form>
        
        <div>Company (Returned):&nbsp;<input type="text" style={style1} value={this.state.company} />         
    <button style={btn1Style} disabled={this.state.preBtn} onClick={this.handlePre}>&laquo; Previous</button> 
<button style={btn2Style} disabled={this.state.nextBtn} onClick={this.handleNext}>Next &raquo;</button></div>        
            
<form onSubmit={this.handleSubmit}> 
<label style={style2}>or Enter Symbol:&nbsp;
<input type="text" style={style1} value = {this.state.stockSymbol} onChange={this.handleStockChange} />
        </label>
        <div style={{marginTop: '10px', display:"inline"}}>
        <input style={style1} type="submit" value="Submit to Plot" />
        </div>
        </form> 
        {chartDisplay}
</div>);

   
return(
      <div className="container">
    
        
 {content}
    
     </div>
    );
  }
}

SearchPage.defaultProps = {
  credentials: PropTypes.oneOf(['omit', 'same-origin', 'include']),
};

export default SearchPage;