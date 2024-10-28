const { program } = require('commander');
const http = require('http');
const fs = require('fs').promises;
const path = require('path');

program
    .requiredOption('-h, --host <char>', 'server address')
    .requiredOption('-p, --port <int>', 'server port')
    .requiredOption('-c, --cache <char>', 'path to directory where cache files are stored')
    .parse(process.argv);

const { host, port, cache } = program.opts();

const server = http.createServer(async (req, res) => {
    const statusCode = req.url.slice(1); 
    const filePath = path.join(cache, `${statusCode}.jpg`);

    if (req.method === 'GET') {
        try {
            const imageData = await fs.readFile(filePath);
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            res.end(imageData);
        } catch (error) {
            const status = error.code === 'ENOENT' ? 404 : 500;
            res.writeHead(status, { 'Content-Type': 'text/plain' });
            res.end(status === 404 ? 'Image not found' : 'Internal Server Error');
        }
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
});

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});

