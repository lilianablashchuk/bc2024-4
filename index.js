const { program } = require('commander');
const http = require('http');

program
    .requiredOption('-h, --host <char>', 'server address')
    .requiredOption('-p, --port <int>', 'server port')
    .requiredOption('-c, --cache <char>', 'path to directory, where cache files will be stored');

program.parse(process.argv); 
const options = program.opts();


if (!options.host) {
    console.error('Please enter server address');
    process.exit(1);
}
if (!options.port) {
    console.error('Please enter server port');
    process.exit(1);
}
if (!options.cache) {
    console.error('Please enter path to cache files');
    process.exit(1);
}


const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Server is running!');
});

server.listen(options.port, options.host, () => {
    console.log(`Server working on http://${options.host}:${options.port}`);
});
