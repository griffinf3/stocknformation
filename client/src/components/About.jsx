import React from 'react';
import fccLogo from '../img/fcc.jpg';
import swal from 'sweetalert';

class About extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = {show: this.props.showAbout};
    this.handleClose = this.handleClose.bind(this);
  }
     
handleClose(){
     swal({
  title: "Next Step",
  text: "Select the 'Search' button in the Main Menu to begin searching and viewing stock information.",
  buttons: [false, "Continue"]});
  this.props.onHideAbout(); 
}
  
  render() {
      
  const divStyle = {
      color: 'black',
      backgroundColor: 'white',
      margin: '20px',
      padding: '2em',
      border: '1px solid black',
      borderRadius: '5px',
  }
      
    return (
      <div>{ this.props.showAbout ? <div style={divStyle}>
         <button type="button" className="close" aria-label="Close" onClick={this.handleClose}> <span aria-hidden="true">&times;</span></button>
        
        <div style={{display:"inline", fontSize: "30px", fontFamily: "Cooper Black"}}>Stock-n-Formation</div><div style={{display: "inline"}}> is a Free Code Camp (FCC) <a href="https://www.freecodecamp.org/griffinf3" rel="noreferrer noopener" target="_blank">
<img alt="FreeCodeCamp profile" src = {fccLogo}
      style = {{ border: 0, width: 30, height: 30 }}/>
</a> stock search application developed by Franklin Griffin. This project was written to fulfill part of FCC's requirements for certification in backend website development.  This website provides all users with the following options and capabilities:</div>
<ol>
<li>Search and display a stock by entering and submtting the stock's symbol.</li>       
<li>Delete any stock displayed on the screen. (Note that each stock has a delete button located under the graph.)</li>
<li>Enter one or more keywords to find symbols for stocks of interest.</li>
<li>View the results of a search and select a symbol that appears in the search results.</li> 
<li>View the number of users presently logged in to this site.</li>
</ol> 
</div> : null }
      </div>
    )
  }
}

export default About;