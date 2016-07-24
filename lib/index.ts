const fs = require('fs');
const {join: pjoin} = require('path');
const request = require('request');
const Task = require('data.task');
const {sequence, map, toUpper, compose, prop, append} = require('ramda');

const filePath = (file) => (pjoin(__dirname, '../', file));
const logErr = err => console.log(`Error: ${err}`);
const logData = data => console.log('Data', data);
const exists = x => x != null;

const taskifyReadFile = (path) => {
  return new Task((reject, resolve) => {
    fs.readFile(path, 'utf8', (err, data) => exists(err) ? reject(err) : resolve(data));
  });
};

const taskifyReq = (url) => {
  return new Task((reject, resolve) => {
    request(url, (err, resp, body) => {
      exists(err) ? reject(err) : resolve(JSON.parse(body));
    });
  });
};

const getFilesAsTasks = compose(map(taskifyReadFile), map(filePath));
const getSkywalker = map(prop('name'), taskifyReq('http://swapi.co/api/people/1'));
const files = getFilesAsTasks(['a.txt', 'b.txt', 'c.txt']);
const seq = sequence(Task.of, append(getSkywalker, files));
const done = map(map(toUpper), seq);

done.fork(logErr, logData);