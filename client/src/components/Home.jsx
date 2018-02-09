import React from 'react';
import fccLogo from '../img/fcc.jpg';
import swal from 'sweetalert';
 
class Home extends React.Component {    
   constructor(props) {
    super(props);
    this.state = {show: this.props.showHome, noUsers: this.props.noUsers, showAbout:true, showHome: true};
    this.handleClose = this.handleClose.bind(this);
    this.hideAbout = this.hideAbout.bind(this);
    this.onShowAbout = this.onShowAbout.bind(this);
    this.hideHome = this.hideHome.bind(this);
    this.onShowHome = this.onShowHome.bind(this);
  }
    
handleClose(){
      swal({
  title: "Next Step",
  text: "Please select 'About' in the Main Menu for additional instructions on how to use this website.",
  buttons: [false, "Continue"]
});
    this.props.onHideHome();
}

hideAbout(){
    this.setState({show: false});
}
    
hideHome(){
    this.setState({showHome: false});
}
    
onShowAbout(){
    this.setState({show: true});
}
    
onShowHome(){
    this.setState({showHome: true});
}
     
  render() {
      
  const divStyle = {
      color: 'black',
      backgroundColor: 'lightblue',
      margin: 'auto',
      padding: '2em',
      width: '700px',
      border: '1px solid black',
      borderRadius: '5px',
      textAlign: "center",
      verticalAlign: "middle",
      fontFamily: "Helvetica Neue",
      fontStyle: 'normal',
	  fontVariant: 'normal',
	  fontWeight: '500',
	  lineHeight: '26.4px'
}
  
    return (
        <div>{ this.props.showHome ? <div style={divStyle}>
        <button type="button" className="close" aria-label="Close" onClick={this.handleClose}> <span aria-hidden="true">&times;</span></button>       
      <span style={{fontFamily: "Cooper Black"}}>  
 <h2>Stock-n-Formation, </h2></span><h3>a Free Code Camp <a href="https://www.freecodecamp.org/griffinf3" rel="noreferrer noopener" target="_blank">
<img alt="FreeCodeCamp profile" src = {fccLogo}
      style = {{ border: 0, width: 30, height: 30 }}/>
</a> coding project by Franklin Griffin.</h3>
        <h4>
This site makes use of the<a href="https://www.quandl.com/" rel="noreferrer noopener" target="_blank">&nbsp;Quandl&nbsp;</a>
and 
<a href="https://tradier.com/" rel="noreferrer noopener" target="_blank">&nbsp;
Tradier</a>&nbsp;
search engines to find information on user selected stocks for the past year.  No registration or login is required to use this site and all user selected stocks are displayed at the same time.  Refer to the upper right hand of your screen to view how many users are presently accessing this site.</h4></div> : null }

      </div>
    )

}
}

export default Home;