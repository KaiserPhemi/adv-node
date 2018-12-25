// dependencies
const http = require('http');
const url = require('url');
const stringDdecoder = require('string_decoder').StringDecoder;
const decoder = new stringDdecoder('utf-8');
const config = require('./config');
const https = require('https');
const fs = require('fs');
const _data = require('./lib/data');

_data.update('test', 'nuFile', { work: 'Software Engineer' }, (err) => {
	console.log('New error', err);
});

// unified server for both http and https requests
const unifiedServer = (request, response) => {

	// get URL and parse it
	let parsedUrl = url.parse(request.url, true);

	// get the path
	let path = parsedUrl.pathname;
	let trimPath = path.replace(/^\/+|\/+$/g,'');

	// get query string
	let queryStr = parsedUrl.query;

	// extract http method
	const method = request.method;

	// get headers
	const allHeaders = request.headers;

	// create a buffer to handle string
	let buffer = '';

	// get payload
	request.on('data', data => buffer += decoder.write(data));
 
	// end request
	request.on('end', () => {
		buffer += decoder.end();

		const chosenHandler = typeof(router[trimPath]) !== 'undefined' ? router[trimPath] : handlers.notFound;

		const data = {
			trimPath,
			queryStr,
			allHeaders,
			payload: buffer
		};

		// route the request to the handler
		chosenHandler(data, (statusCode, payload) => {
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			payload = typeof(payload) == 'object' ? payload : {};

			// convert payload to string
			let payloadString = JSON.stringify(payload);

			// return the response
			response.setHeader('Content-Type', 'application/json');
			response.writeHead(statusCode);
			response.end(payloadString);
			console.log(`Return this response ${statusCode} and ${payloadString}`);
		});
	});
};

// instantiate http server
const httpServer = http.createServer((request, response) => {
	unifiedServer(request, response);
});

// Start the http server and listen on port 4000
httpServer.listen(config.httpPort, () => {
	console.log(`Server is listening on port: ${config.httpPort}`);
});

// https server options
const httpsServerOptions = {
	key: fs.readFileSync('./https/key.pem'),
	cert: fs.readFileSync('./https/cert.pem')
};

// instantiate https server
const httpsServer = http.createServer(httpsServerOptions, (request, response) => {
	unifiedServer(request, response);
});

// Start the http server and listen on port
httpsServer.listen(config.httpsPort, () => {
	console.log(`Server is listening on port: ${config.httpsPort}`);
});

// handlers
let handlers = {};

handlers.ping = (data, callback) => {
	callback(200);
};

// not found handler
handlers.notFound = (data, callback) => {
	callback(404);
};

// define router
const router = {
	ping: handlers.sample
}


