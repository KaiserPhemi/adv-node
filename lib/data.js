// dependencies
const fs = require('fs');
const path = require('path');

// lib object
const lib = {};

// base directory
lib.baseDir = path.join(__dirname, '/../.data/');

// write data to file
lib.create = (dir, file, data, callback) => {
  // open file for write
  fs.open(lib.baseDir+dir+'/'+file+'.json','wx', (err, fileDescriptor) => {
    if(!err && fileDescriptor) {
      // convert data to string
      const stringData = JSON.stringify(data);

      // write to file and close it
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if(!err) {
          fs.close(fileDescriptor, (err) => {
            if(!err) {
              callback(false);
            } else {
              callback('Error closing new file.')
            }
          });
        } else {
          callback('Error writing to new file');
        }
      });
    } else {
      callback('Could not create new file. It may already exist');
    }
  })
};

// reads file
lib.read = (dir, file, callback) => {
  fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf-8', (err, data) => {
    callback(err, data);
  });
};

lib.update = (dir, file, data, callback) => {
  fs.open(lib.baseDir+dir+'/'+file+'.json','r+', (err, fileDescriptor) => {
    if(!err && fileDescriptor) {
      const stringData = JSON.stringify(data);
      fs.truncate(fileDescriptor, (err) =>{
        if(!err) {
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if(!err) {
              fs.close(fileDescriptor, (err) => {
                if(!err) {
                  callback(false);
                } else {
                  callback('Error closing new file.')
                }
              });
            } else {
              callback('Error writing to new file');
            }
          });
        } else {
          callback('Error truncating file');
        }
      });
    } else { 
      callback('Could not open file for update. It may not exist yet');
    }
  });
};

// export container
module.exports = lib;