const fs = require('fs');
const Task = require('data.task');
// const {sequence, liftMN} = require('control.monads');
// const {add} = require('core.operators');

const {add, liftN, sequence, map, compose, join, toUpper, unnest} = require('ramda');

const PATH = '/Users/githop/dev/js/typescript-node/';

const logErr = err => console.log(`Error: ${err}`);
const logData = data => console.log('Data', data);
const existy = x => x != null;


const taskifyReadFs = (path) => {
  return new Task((reject, resolve) => {
    fs.readFile(path, 'utf8', (err, data) => existy(err) ? reject(err) : resolve(data));
  });
};

// let a = taskifyReadFs(PATH + 'a.txt');
// let b = taskifyReadFs(PATH + 'b.txt');
// let c = taskifyReadFs(PATH + 'c.txt');

const paths = [PATH + 'a.txt', PATH + 'b.txt', PATH + 'c.txt'];

const files = map(taskifyReadFs, paths);
const seqd = sequence(Task.of, files);
const done = map(map(toUpper), seqd);



done.fork(logErr, logData);