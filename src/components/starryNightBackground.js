import React, { Component } from 'react';
import stars from '../content/stars.png';
import clouds from '../content/twinkling.png';
import '../App.css';

export default class starryNightBackground extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <img className={this.props.moveClouds == true ? "stars clouds-moved" : "stars"}
             src={stars}/>
        <img className={this.props.moveClouds == true ? "clouds top animate" : "clouds top"}
             src={clouds}
        />
        <img className={this.props.moveClouds == true ? "clouds left animate" : "clouds left"}
             src={clouds}/>
        <img className={this.props.moveClouds == true ? "clouds right animate" : "clouds right"}
             src={clouds}/>
        <img className={this.props.moveClouds == true ? "clouds bottom animate" : "clouds bottom"}
             src={clouds}/>
      </div>
    );
  }
}
