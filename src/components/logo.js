import React, { Component } from 'react';
import mainLogo from '../content/the-other-77000-landing.svg';
import logoMobile from '../content/theother77000-landing-text-mobile.png';
import Clouds from '../content/the-other-77000-clouds.png';
import '../App.css';

export default class Header extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <header className="App-header">
          <div className={this.props.moveClouds == false ? "logo-click animate-flicker" : "logo-click animate-flicker clouds-moved"}></div>
          <div className="App-header-content">
            <div className='logo-intro'>
             *There are 77,358 sq. miles in Nebraska. The urban centers in the state account for roughly only 350 sq. miles of this. In that 350 sq. miles lives over two thirds of the population. But this is not about those 350 sq. miles.
            </div>
            <div className='logo-subtitle'>
              This is about
            </div>
            <div className='logo-title'>
              The Other 77,000
            </div>
            <div onMouseOver={this.props.startAnimation}
             className={this.props.loaded == false ? "App-logo" :
                        this.props.moveClouds == false ? "App-logo loaded" : "App-logo loaded clouds-moved"}
             alt="logo" >
              <div className='logo-enter left'>
              </div>
              <div className='logo-enter center'>
                <img src={mainLogo}/>
              </div>
              <div className='logo-enter right'>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}
