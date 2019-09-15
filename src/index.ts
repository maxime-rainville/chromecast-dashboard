export * from './lib/number';
// @ts-ignore
// import WebCapture from 'webpage-capture';
// import http from 'http';
import IPs from './lib/IPs';
import ChromeCastServer from './lib/server';

const server = new ChromeCastServer(
    [
        {url: 'http://github-dashing.herokuapp.com/default', displayTime: 10000},
        {url: 'https://silverstripe-github-issues.now.sh/?mode=untriaged#', displayTime: 10000},
    ],
    IPs[0]
);

server.cast();