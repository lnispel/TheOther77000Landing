if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const path = require('path');
const storage = require('azure-storage');
const args = require('yargs').argv;
const blobService = storage.createBlobService('theother77000', 'aTxHKgwTfFa164EOG8rlu56jndbbdsk+6Fb3fIVK5ZmMkcvtr/OFFcVODtJf9OqL4ja150j7cmZETBu+DDbH1A==');

const containerName = 'theother77000-markers';
const sourceFilePath = path.resolve('markers.db');
const blobName = 'markers.db';


const createContainer = () => {
    return new Promise((resolve, reject) => {
        blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Container '${containerName}' created` });
            }
        });
    });
};

const upload = () => {
    return new Promise((resolve, reject) => {
        blobService.createBlockBlobFromLocalFile(containerName, blobName, sourceFilePath, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Upload of '${blobName}' complete` });
            }
        });
    });
};

const download = () => {
    return new Promise((resolve, reject) => {
        blobService.getBlobToLocalFile(containerName, blobName, sourceFilePath, err => {
            if (err) {
                console.log(containerName, blobName, sourceFilePath)
                reject(err);
            } else {
                resolve({ message: `Download of '${blobName}' complete` });
            }
        });
    });
};

const list = () => {
    return new Promise((resolve, reject) => {
        blobService.listBlobsSegmented(containerName, null, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Items in container '${containerName}':`, data: data });
            }
        });
    });
};

const deleteBlock = () => {
    return new Promise((resolve, reject) => {
        blobService.deleteBlobIfExists(containerName, blobName, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Block blob '${blobName}' deleted` });
            }
        });
    });
};

const uploadAndList = () => {
    return _module.upload().then(_module.list);
};

const _module = {
    "createContainer": createContainer,
    "uploadAndList": uploadAndList,
    "upload": upload,
    "download": download,
    "delete": deleteBlock,
    "list": list
};

const commandExists = () => {
    var exists = !!_module[args.command];
    return exists;
};

const executeCommand = async () => {
    let response = await _module[args.command]();

    console.log(response.message);

    if (response.data) {
        response.data.entries.forEach(entry => {
            console.log('Name:', entry.name, ' Type:', entry.blobType)
        });
    }

    uploadLoop();
};

try {
    const cmd = args.command;

    console.log(`Executing '${cmd}'...`);

    if (commandExists()) {
        executeCommand();
    } else {
        console.log(`The '${cmd}' command does not exist. Try one of these:`);
        Object.keys(_module).forEach(key => console.log(` - ${key}`));
    }
} catch (e) {
    console.log(e);
}

async function uploadLoop() {
  console.log('In upload loop');
  const response = await _module['upload']();

  console.log(response.message);
  setTimeout(() => uploadLoop(), 300000)
}
