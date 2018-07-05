import AWS from 'aws-sdk';

AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.aws_access_key_id;
AWS.config.secretAccessKey = process.env.aws_secret_access_key;
AWS.config.region = "us-west-2";
AWS.config.apiVersions = {
  "s3": "2006-03-01"
 }
var s3 = new AWS.S3();

export default function uploadFile(time, file) {
  return new Promise((resolve,reject) => {
    let params = {};
    if(file.type == 'image/jpeg') {
      params = {
          'Bucket': 'theother77000',
          'Key': 'images/' + time + file.name,
          'ContentType': file.type,
          'Body': file
      };
    } else {
      params = {
          'Bucket': 'theother77000',
          'Key': 'data/' + file.name,
          'ContentType': file.type,
          'Body': file
      };
    }

    s3.upload(params, function(err, data){
      if(err) {
        return reject(err)
      }
      resolve(data);
    });
  });
}
