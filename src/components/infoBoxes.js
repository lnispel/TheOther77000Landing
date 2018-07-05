import React, { Component } from 'react';
import notes from '../content/notes.svg';
import location from '../content/location.svg';
import archive from '../content/archive.svg';
import images from '../content/images.svg';
import features from '../content/the-other-77000-landing-features.png';
import '../App.css';



export default class infoBoxes extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <div className="box-holder">
          <div className="info-box">
            <div className="info-box-title">Archive</div>
            <div className={this.props.moveClouds == true ? "info-boxes archive visible" : "info-boxes archive"}>
              <div className="info-box-head">
                <img src={archive}/>
              </div>
              <div className="info-box-connect">
              </div>
              <div className="info-box-body">
                <div className="info-box-inner-body">
                </div>
                <div className="info-box-inner-text">
                  <div>Over the course of your use
                      of the app, all of your posts
                      will remained saved and
                      avaliable for your own access.</div>
                  <div>You will be able to view posts
                      by date or on a map view to
                      get different perspectives
                      of your journeys.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="info-box">
            <div className="info-box-title">Images</div>
            <div className={this.props.moveClouds == true ? "info-boxes images visible" : "info-boxes images"}>
              <div className="info-box-head">
                <img src={images}/>
              </div>
              <div className="info-box-connect">
              </div>
              <div className="info-box-body">
                <div className="info-box-inner-body">
                </div>
                <div className="info-box-inner-text">
                  <div>Along with notes and other
                      references, you will also be
                      able to take photos that will be
                      geolocated, can be tagged,
                      ect. so that when you look
                      back at the different places
                      you’ve been, these photos
                      will be retrieved along with
                      the other posts you made
                      at that location. </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        <div className="box-holder">
          <div className="features-body">
            <div></div>
            <div></div>
            <div className="features-text">Features Include</div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div className="box-holder">
          <div className="info-box">
            <div className="info-box-title">Journaling</div>
            <div className={this.props.moveClouds == true ? "info-boxes notes visible" : "info-boxes notes"}>
              <div className="info-box-head">
                <img src={notes}/>
              </div>
              <div className="info-box-connect">
              </div>
              <div className="info-box-body">
                <div className="info-box-inner-body">
                </div>
                <div className="info-box-inner-text">
                  <div>The app can be used as
                        a personal journal,
                        integrated with the location
                        services.</div>
                  <div>This way, as you take notes along your journey, you can trace back to thoughts, observations and ideas you had at any given coordinate.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="info-box">
            <div className="info-box-title">Location Integration</div>
            <div className={this.props.moveClouds == true ? "info-boxes location visible" : "info-boxes location"}>
              <div className="info-box-head">
                <img src={location}/>
              </div>
              <div className="info-box-connect">
              </div>
              <div className="info-box-body">
                <div className="info-box-inner-body">
                </div>
                <div className="info-box-inner-text">
                  <div>By using the location services,
                        you will be able to see
                        public posts that were made
                        where you are, see the
                        places you have made posts
                        as well as create more
                        content that will be attached
                        to the location you are at.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
