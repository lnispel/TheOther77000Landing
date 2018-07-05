import React, { Component } from 'react';
import Header from './components/logo';
import StarryNightBackground from './components/starryNightBackground';
import InfoBoxes from './components/infoBoxes';
import AreaMap from './components/areaMap';
import GeoMessage from './components/geomessage';
import GoogleMapsContainer from './components/googleMapsContainer';
import { graphql } from 'graphql';
import schema from './schema.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      moveClouds: false,
      cloudsMoved: false,
      markers: [],
      lat: "40.808889",
      lng: "-96.680278"
    }
    this.startAnimation = this.startAnimation.bind(this);
    this.addMarker = this.addMarker.bind(this);
  }
  componentDidMount() {

    var query = "{ postList { images postContent latitude longitude dateTimeCreated} }";
    setTimeout(() =>
      graphql(schema, query).then(result => {
        if(result.data.postList.length == 0) {
            let marker = {
              images: "https://s3-us-west-2.amazonaws.com/theother77000/images/the-other-77000-landing.svg/r/n",
              postContent: "The first post for The Other 77000",
              location: {lat: '40.808889', lng: '-96.680278'},
              dateTimeCreated: Date.now(),
              imageUrls: "https://s3-us-west-2.amazonaws.com/theother77000/images/the-other-77000-landing.svg/r/n"
            }

            this.addMarker(marker);
        } else {
          this.setState({ markers: filterPostList(result.data.postList) });
        }
      }), 1000)

    window.addEventListener('scroll', this.handleScroll);
    setTimeout(() =>
      this.setState({ loaded: true }), 500)

      let { lat, lng } = this.state;

      let promiseItem = new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(
          function(location) {
            lat = location.coords.latitude;
            lng = location.coords.longitude;

            let returnItem = { lat: lat, lng: lng };
            resolve(returnItem)
          },
          function(error){
               alert(error.message);
          },
          {
               enableHighAccuracy: true
                    ,timeout : 5000
          }
        )
      }).then(result => {
        this.setState({ lat: result.lat, lng: result.lng});
      });

      setTimeout(() => this.startAnimation(), 5000);
  }

  startAnimation() {
    this.setState({ moveClouds: !this.state.moveClouds ? true : true })
    setTimeout(() => this.setState({ cloudsMoved: true }), 3000);
  }

  addMarker (marker) {
    var mutation = 'mutation {' +
      'addPost(images: "' + marker.imageUrls + '", latitude: "' + marker.location.lat + '", longitude: "' + marker.location.lng + '", postContent: "' + marker.postContent + '", dateTimeCreated: "' + marker.dateTimeCreated + '"){' +
        'images: images ' +
        'latitude: latitude ' +
        'longitude:longitude ' +
        'postContent:postContent ' +
        'dateTimeCreated:dateTimeCreated ' +
      '}' +
    '}';

    graphql(schema, mutation).then(result => {
      console.log(result)
      this.setState({ markers: this.state.markers.concat(marker)})
    });
  }

  render() {


    return (
      <div className={this.state.loaded == false ? "App" :
                      this.state.moveClouds == false ? "App loaded" :
                      this.state.cloudsMoved == true ? "App loaded clouds-moved complete" : "App loaded clouds-moved"}>

        <StarryNightBackground moveClouds={this.state.moveClouds}/>

        <div className="content">
          <Header startAnimation={this.startAnimation} loaded={this.state.loaded} moveClouds={this.state.moveClouds}/>
          <p className={this.state.moveClouds == true ? "App-intro visible" : "App-intro"}>
            The purpose of this app is to encourage connectivity between the cities and the country side surrounding it.
          </p>
          <div>
            <InfoBoxes moveClouds={this.state.moveClouds}/>
            <AreaMap moveClouds={this.state.moveClouds}/>
            <GeoMessage latitude={this.state.lat} longitude={this.state.lng} addMarker={this.addMarker}/>
            <GoogleMapsContainer latitude={this.state.lat} longitude={this.state.lng} markers={this.state.markers}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

function filterPostList(data) {
  var markers = [];
  for(var i = 0; i < data.length; i++) {
    var marker = {
      images: data[i].images,
      postContent: data[i].postContent,
      location: {lat: data[i].latitude, lng: data[i].longitude},
      dateTimeCreated: data[i].dateTimeCreated
    }

    markers.push(marker);
  }
  return markers;
}
