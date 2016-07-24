const fs = require('fs');
const {join: pjoin} = require('path');
const Task = require('data.task');
const {sequence, map, toUpper, compose} = require('ramda');

const filePath = (file) => (pjoin(__dirname, '../', file));
const logErr = err => console.log(`Error: ${err}`);
const logData = data => console.log('Data', data);
const existy = x => x != null;

const taskifyReadFile = (path) => {
  return new Task((reject, resolve) => {
    fs.readFile(path, 'utf8', (err, data) => existy(err) ? reject(err) : resolve(data));
  });
};

const fNames = ['a.txt', 'b.txt', 'c.txt'];

const composeIt = compose(map(taskifyReadFile), map(filePath));
const filesRead = composeIt(fNames);
const seqd = sequence(Task.of, filesRead);
const done = map(map(toUpper), seqd);

done.fork(logErr, logData);