import React, {Component} from 'react';
import MenuNav from './MenuNav.jsx';
import propTypes from 'prop-types';
import openSocket from 'socket.io-client';

const socket = openSocket(); 

class Parent extends Component {
    
constructor(props){
        super(props);
        this.state = {chartData: [], updateRequired: true, allStocks1: [], allStocks2: [], allStocks3: [], noUsers: 0, showAbout:true, showHome: true};
        this.getStockNames = this.getStockNames.bind(this);
        this.getChartData = this.getChartData.bind(this);
        this.emitModify = this.emitModify.bind(this);
        this.onShowHome = this.onShowHome.bind(this);
        this.hideAbout = this.hideAbout.bind(this);
        this.onShowAbout = this.onShowAbout.bind(this);
        this.hideHome = this.hideHome.bind(this);
   //notice from server that another user has modified the data.
   socket.on('updatedata', () => {
   //Make chartData state empty and use nextProps in searchpage to start update process.                        
   this.setState({chartData: [], updateRequired: true});
   });
    
    //update when user opens or closer a browser to update number of users presently online.
        socket.on('userupdate', (nousers) => {
   this.setState({noUsers: nousers.noUsers});});}
    
componentDidMount(){
//How many users are now online?
fetch('/api/v1/users', {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json())
       .then((responseJson) => {
    this.setState({noUsers: responseJson.noUsers}); 
});}
    
emitModify(){
   socket.emit('modify'); 
}    
    
getStockNames(data)
    {console.log('parentsendingnames');
    this.setState({allStocks1: data.allStocks1, allStocks2: data.allStocks2,allStocks3: data.allStocks3});
    }
    
getChartData(data)
    {this.setState({chartData: data});}
    
hideAbout(){
    this.setState({showAbout: false});
}
    
hideHome(){
    this.setState({showHome: false});
}
    
onShowAbout(){
    this.setState({showAbout: true});
    console.log('SAbout:'+ this.state.showAbout);
}
    
onShowHome(){
    this.setState({showHome: true});
}

       
render() {
    var that = this;
    var childrenWithProps = React.Children.map(this.props.children, function(child) {
        return React.cloneElement(child, {
           onHideAbout: that.hideAbout, onHideHome: that.hideHome, modify: that.emitModify, getNames:that.getStockNames, getData:that.getChartData, allStocks1:that.state.allStocks1, allStocks2: that.state.allStocks2, allStocks3:that.state.allStocks3, chartData:that.state.chartData, noUsers:that.state.noUsers, updateRequired:that.state.updateRequired, showAbout: that.state.showAbout, showHome: that.state.showHome});
    });
      
    return (
      <div>
        <MenuNav noUsers={this.state.noUsers} showAbout = {this.onShowAbout} showHome = {this.onShowHome}/>  
        {childrenWithProps}
      </div>
    );
  }
}

Parent.propTypes = {
  children: propTypes.object.isRequired
};

export default Parent;