import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';

var moment = require('moment');

class Chart extends Component{

render(){
        const chartStyle =  {margin: 'auto', width: '800px', height: '400px', backgroundColor: 'grey', opacity: '0.9'};
      var alldata = {datasets: this.props.chartData};
        if (this.props.chartData === []) alldata = {};
        return (
        <div style={chartStyle} className= "chart">
        <Line
            data={alldata}
            options={{
            tooltips: {
						position: 'nearest',
						mode: 'index',
						intersect: false,
						yPadding: 10,
						xPadding: 10,
						caretSize: 8,
						backgroundColor: 'red',
						borderColor: 'blue',
						borderWidth: 4,
                        displayColors:true
					},
            title:{
               display: true,
               fontColor: 'white',
               text:'Comparison of Price Trends of Selected Stocks for the Past Year',
               fontSize: 25
            },
            legend:{
            display: false
            },
            scales: {
            xAxes: 
               [{display: true, type: 'time', time: {unit: 'day', unitStepSize: 60, displayFormats: {'day': 'YYYY MMM DD'}}, ticks:{
fontColor: '#CCC'}, scaleLabel: {
        display: true, fontColor: '#CCC',
        labelString: 'Date'
      }}], 
            yAxes: [{ticks: {min: 0, fontColor: '#CCC'},  scaleLabel: {
        display: true, fontColor: '#CCC',
        labelString: '$US per share'
      }}]}
                    }}
            />
            </div>
        
        )}}

export default Chart;