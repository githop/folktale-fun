const fs = require('fs');
const {join: pjoin} = require('path');
const request = require('request');
const Task = require('data.task');
const {map, toUpper, compose, prop, append, traverse} = require('ramda');

const filePath = (file:string):string => (pjoin(__dirname, '../', file));
const logErr = (err):void => console.log(`Error: ${err}`);
const logData = (data):void => console.log('Data', data);
const exists = (x):boolean => x != null;

const taskifyReadFile = (path:string) => {
  return new Task((reject, resolve) => {
    fs.readFile(path, 'utf8', (err, data) => exists(err) ? reject(err) : resolve(data));
  });
};

const taskifyReq = (url:string) => {
  return new Task((reject, resolve) => {
    request(url, (err, resp, body) => {
      exists(err) ? reject(err) : resolve(JSON.parse(body));
    });
  });
};

const getFilesAsTasks = compose(map(taskifyReadFile), map(filePath));
const files = getFilesAsTasks(['a.txt', 'b.txt', 'c.txt']);
const getSkywalker = map(prop('name'), taskifyReq('http://swapi.co/api/people/1'));
const done = traverse(Task.of, map(toUpper), append(getSkywalker, files));

done.fork(logErr, logData);