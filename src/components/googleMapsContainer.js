import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../App.css';
import {Map, Marker, GoogleApiWrapper, InfoWindow} from 'google-maps-react';
import GoogleMapsStyle from '../GoogleMapsStyle';
import moment from 'moment';
require('dotenv').config();

export class GoogleMapsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMarker: {},
      showingInfoWindow: false
    }
    this.onMarkerClick = this.onMarkerClick.bind(this)
    this.loadMap = this.loadMap.bind(this)
  }

  componentDidMount() {
    this.loadMap();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.markers !== this.props.markers) {
      this.loadMap(); // call loadMap function to load the google map
    }
  }

  onMarkerClick(props, marker, e) {
    this.setState({
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }
  loadMap() {
    if (this.props && this.props.google) { // checks to make sure that props have been passed
      const {google} = this.props; // sets props equal to google
      const maps = google.maps; // sets maps to google maps props

      const mapRef = this.refs.map; // looks for HTML div ref 'map'. Returned in render below.
      const node = ReactDOM.findDOMNode(mapRef); // finds the 'map' div in the React DOM, names it node

      let latitude = this.props.latitude;
      let longitude = this.props.longitude;

      let center = "";
      if(latitude != "") {
        center = new google.maps.LatLng(latitude,longitude);
      } else {
        center = {lat: 34.7485722, lng: -119.0068633}
      }

      const mapConfig = Object.assign({}, {
        styles: GoogleMapsStyle,
        center: center,
        zoom: 3, // sets zoom. Lower numbers are zoomed further out.
      })

      this.map = new maps.Map(node, mapConfig); // creates a new Google map on the specified node (ref='map') with the specified configuration set above.

      let markers = [];

      this.props.markers.forEach( content => { // iterate through locations saved in state
       const postCreatedAtMoment =  moment(parseInt(content.dateTimeCreated))
       const postCreatedAt = postCreatedAtMoment.format('h:mm A') + " " + postCreatedAtMoment.format('ddd, MMM Do, YYYY')

       const location = new google.maps.LatLng(content.location.lat,
                                               content.location.lng)
       const marker = new google.maps.Marker({ // creates a new Google maps Marker object.
         position: location, // sets position of marker to specified location
         map: this.map, // sets markers to appear on the map we just created on line 35
         title: postCreatedAt, // the title of the marker is set to the name of the location
       });

       let images = content.images.split('/r/n').filter(x => x != "");
       let imageString = "";

       for(var i = 0; i < images.length; i++) {
         imageString += '<div style="margin: 10px;"><img height="220" src="' + images[i] + '"/></div>';
       }


       var urlRegex = /(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+/g;
       var contentWithUrls = content.postContent.replace(urlRegex, function(url) {
           return '<a href="http://' + url + '">' + url + '</a>';
       })

       const infoBody = '<div style="border: 2px solid black; border-radius: 10px; padding: 15px; margin: 10px; background-color: #efefef; max-height: 400px; overflow: scroll;">' +
                           '<div>'+
                             '<div style="font-weight: bold; margin: 10px;">' + postCreatedAt + '</div>' +
                           '</div>' +
                          '<div style="display:flex; flex-direction: column;">' + imageString + '</div>' +
                          '<p style="font-weight:bold;">' + contentWithUrls + '</p>' +
                        '</div>'
       let markerContent = new google.maps.InfoWindow({
           content: infoBody,
       });

       google.maps.event.addListener(marker, 'click', function() {
         markerContent.open(this.map,marker);
       });
     })
    }
  }

  render() {
    // const SetMarkers = this.props.markers.map((x,y) =>{
    //   return (
    //     <Marker key={y} position={x.location} title={x.postContent}/>
    // )})

    return (
      <div className="google-maps-holder">
        <div className="google-map" ref="map">
        </div>
      </div>
    );
  }
}

if (process.env.REACT_APP_TEST) {
} else {
  console.log('nope')
}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_GOOGLE_MAPS_API_KEY)
})(GoogleMapsContainer)
