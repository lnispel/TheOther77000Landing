import graphql, {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';
require('dotenv').config();

const Promise = require("bluebird");
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

firebase.initializeApp({
  apiKey: process.env.FIREBEASE_DOMAINAPI_KEY,
  authDomain: process.env.FIREBEASE_DOMAIN,
  projectId: '"' + process.env.FIREBASE_PROJECTID + '"'
});

// Initialize Cloud Firestore through Firebase
const db = firebase.firestore();
const settings = { timestampsInSnapshots: true};
db.settings(settings);

function clearTable() {
  return new Promise((resolve, reject) => {
    db.collection("markers").delete().then(function() {
        console.log("Documents successfully deleted!");
        resolve('Success');
    }).catch(function(error) {
        console.error("Error removing document: ", error);
        reject(error);
    });

  });
 }

function insertPost(post) {
  return new Promise((resolve, reject) => {
    db.collection("markers").add(post).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        resolve(docRef.id)
    }).catch(function(error) {
        console.error("Error adding document: ", error);
        reject(error)
    });
  });
}

function getAllPosts() {
  return new Promise((resolve, reject) => {
    db.collection("markers").get().then((querySnapshot) => {
        let markers = [];

        if(querySnapshot.docs.length != 0) {
          querySnapshot.forEach((doc) => {
              let data = doc.data()

              let marker = {
                images: data.images,
                latitude: data.latitude,
                longitude: data.longitude,
                postContent: data.postContent,
                dateTimeCreated: data.dateTimeCreated,
              }
              markers = markers.concat(marker);

              if(markers.length == querySnapshot.docs.length) {
                resolve(markers);
              }
          });
        } else {
          resolve(markers);
        }
    });
  });
}

function handleError(error) {
  console.log(error);
}

let postItem = { images: 'https://s3-us-west-2.amazonaws.com/theother77000/images/the-other-77000-landing.svg/r/n', latitude: '40.808889', longitude: '-96.680278', postContent: 'The first post for The Other 77000', dateTimeCreated: Date.now()  };

//clearTable();

class Post {
  constructor({images, latitude, longitude, postContent, dateTimeCreated}) {
    this.images = images;
    this.latitude = latitude;
    this.longitude = longitude;
    this.postContent = postContent;
    this.dateTimeCreated = dateTimeCreated;
  }
}

const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    images: {
      type: GraphQLString
    },
    latitude: {
      type: GraphQLString
    },
    longitude: {
      type: GraphQLString
    },
    postContent: {
      type: GraphQLString
    },
    dateTimeCreated: {
      type: GraphQLString
    }
  })
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addPost: {
            type: PostType,
            args: {
                images: {type: new GraphQLNonNull(GraphQLString)},
                latitude: {type: new GraphQLNonNull(GraphQLString)},
                longitude: {type: new GraphQLNonNull(GraphQLString)},
                postContent: {type: new GraphQLNonNull(GraphQLString)},
                dateTimeCreated: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                let id = insertPost(args);
                return id;
            }
        }
    }
})

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
       postList: {
           type: new GraphQLList(PostType),
           resolve(parentValue, args) {
                return getAllPosts();
            }
       }
    }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Schema;

function run_cmd(cmd, args, cb, end) {
    var spawn = require('child_process').spawn,
        child = spawn(cmd, args),
        me = this;
    child.stdout.on('data', function (buffer) { cb(me, buffer) });
    child.stdout.on('end', end);
}
