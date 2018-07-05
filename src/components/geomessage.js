import React, { Component } from 'react';
import { graphql } from 'graphql';
import '../App.css';
import moment from 'moment';
import Dropzone from 'react-dropzone';
import schema from '../schema.js';
import uploadFile from '../s3Services';

export default class GeoMessage extends Component {
    constructor(props) {
      super(props)
      this.state = {
        opened: false,
        images: [],
        warning: "",
        postContent: ""
      }
      this.deleteImage = this.deleteImage.bind(this);
      this.submitPost = this.submitPost.bind(this);
      this.onTextChange = this.onTextChange.bind(this);
      this.postImages = this.postImages.bind(this);
    }

    deleteImage(name) {
      var index = this.state.images.findIndex((x,y) => x.name == name);

      var images = this.state.images;
      images.splice(index, 1);

      this.setState({ images: images });
    }

    onDropAccepted(images) {
      var duplicateImages = this.state.images.filter(x => x.name == images[0].name);

      if(duplicateImages.length < 1) {
        this.setState({
          images: this.state.images.concat(images),
          warning: ""
        });
      } else {
        this.setState({ warning: "Image already uploaded"});
      }
    }

    onDropRejected() {
      this.setState({ warning: "Invalid Upload" });
    }

    onTextChange(event) {
      this.setState({ postContent: event.target.value.replace(/(&nbsp;|<([^>]+)>)/ig, "") })
    }

    submitPost(imagesURLS, imageFiles, time) {
      let dateTimeCreated = time ? time : Date.now();
      let imagesURLs = imagesURLS ? imagesURLS : [];
      let imagePreviews = imageFiles ? imageFiles : [];
      let imageString = '';
      let previewString = '';

      for(var i = 0; i < imagesURLs.length; i++) {
         let image = imagesURLs[i];
         imageString += image + '/r/n';
      }

      for(var i = 0; i < imagePreviews.length; i++) {
         let image = imagePreviews[i];
         previewString += image + '/r/n';
      }

      var postSubmission = {
          imageUrls: imageString,
          location: {lat: this.props.latitude, lng: this.props.longitude},
          postContent: wordFilter(this.state.postContent),
          dateTimeCreated: dateTimeCreated,
          images: previewString
      }

      this.props.addMarker(postSubmission);

      this.setState({ opened: false, images: [], postContent: "" })
    }

    postImages(images) {
      let time =  Date.now();
      let imageUrls = [];
      let imagePreviews = [];
      images.forEach(file => {
        let url = "https://s3-us-west-2.amazonaws.com/theother77000/images/" + time.toString() + file.name;
        imageUrls.push(url);
        imagePreviews.push(file.preview);

        console.log(uploadFile(time, file));

        if(imageUrls.length == images.length) {
          this.submitPost(imageUrls, imagePreviews, time);
        }
      });
    }

    render() {

      const currentTime = moment(Date.now());
      return (
        <div className="geo-message-component">
          <div className="geo-message-holder">
            <div className="geo-message-overlay">
            </div>
              <div className="geo-message">
                <div className={this.state.opened == true ? "geo-message-button expanded" : "geo-message-button"}>

                  <div>
                    <div className="geo-message-current-time">
                      <div>{currentTime.format('h:mm A')}</div>
                      <div>{currentTime.format('ddd, MMM Do, YYYY')}</div>
                    </div>
                    <div onClick={() => this.setState({ opened: true })} className="geo-intro">Begin Message</div>
                    <textarea disabled={this.state.opened == true ? null : 'disabled'}
                              value={this.state.postContent}
                              onChange={this.onTextChange}
                              name="geo-input"
                              className="geo-message-input">
                    </textarea>
                  </div>
                  <div className="geo-message-tip">
                  </div>
                  <div className="geo-message-test">Try out our services</div>
                </div>

                <Dropzone accept={({
                            name: 'my file.png',
                            type: 'image/png'
                        }, 'image/*')}
                        className={this.state.opened == false ? "dropzone" : "dropzone expanded"}         onDropAccepted={this.onDropAccepted.bind(this)}
                        onDropRejected={this.onDropRejected.bind(this)}>
                  {this.state.images.length > 0 ?
                        <p>
                          { this.state.warning == "" ?
                              this.state.images.length + " " +
                              (this.state.images.length == 1 ?
                              "Image"
                              :
                              "Images") +
                             " uploaded"
                            :
                            this.state.warning
                          }
                        </p>
                      :
                        <p>Drop Images Here</p>
                  }
                </Dropzone>

                <div onClick={this.state.images.length <= 0 ? () => this.submitPost() : () => this.postImages(this.state.images)} className={this.state.opened == false ? "geo-submit" : "geo-submit expanded"}>Submit Message</div>
              </div>
          </div>
          <div className="geo-message-uploaded-files">
            {this.state.images.map((x,y) =>
             {
                return (
                  <div key={y} className="image-upload">
                    <div className="image-upload-delete" onClick={() => this.deleteImage(x.name)}>X</div>
                    <div className="image-upload-preview">
                      <img src={x.preview}/>
                    </div>
                    <div className="image-upload-title">Image {y+1}</div>
                  </div>
                )
             })}
          </div>
        </div>
      )
    }
}


let filterWords = ["fuck", "shit", "asshole", "ass", "cunt", "slut", "douche", "douchebag", "dick", "whore", "nigger", "faggot", "dyke", "chink"];
      // "i" is to ignore case and "g" for global
let rgx = new RegExp(filterWords.join("|"), "gi");

function wordFilter(str) {
    return str.toLowerCase().replace(rgx, function (match) {
        //replace each letter with a star
        let stars = '';
        for (let i = 0; i < match.length; i++) {
            stars += '*';
        }
        return stars;
    });
}
