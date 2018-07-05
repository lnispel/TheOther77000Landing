import React, { Component } from 'react';
import areaMapMain from '../content/the-other-77000-map.png';
import areaMapMobile from '../content/the-other-77000-map-mobile.png';
import '../App.css';

export default class areaMap extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <img src={areaMapMain}
             className={this.props.moveClouds == true ? "map visible" : "map"}/>
        <img src={areaMapMobile}
             className={this.props.moveClouds == true ? "map-mobile visible" : "map-mobile"}/>
      </div>
    );
  }
}
