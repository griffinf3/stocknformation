import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';

class MenuNav extends Component {
    
constructor(props){
        super(props);
        this.handleShowAbout = this.handleShowAbout.bind(this);
        this.handleShowHome = this.handleShowHome.bind(this);
    }
    
handleShowAbout(){
    this.props.showAbout();    
}
    
handleShowHome(){
    this.props.showHome();    
}
       
render() {
   const style1 ={
       marginTop: "15px"}
    
    return (
      <div>
       <nav className="navbar navbar-inverse">
         <div className="container-fluid">
        <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>                        
              </button>
          </div>
        
        <div className="collapse navbar-collapse" id="myNavbar">
              <ul className="nav navbar-nav">
                <li onClick={this.handleShowHome} className="active"><IndexLink to="/">Home</IndexLink></li>
                <li className="active"><Link to="/search">Search</Link></li>
               <li onClick={this.handleShowAbout} className="active"><Link to="/about">About</Link></li>
             </ul>
        
        <ul className="nav navbar-nav navbar-right">
        <li className="active">      
 <div style={style1}><span>Number Users Online:</span>&nbsp;<span>{this.props.noUsers}</span></div>
          </li></ul>   
         </div>
         </div>
        </nav>
      </div>
    );
  }
}

export default MenuNav;
