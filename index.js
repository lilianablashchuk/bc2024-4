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
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Image not found');
            } else {
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
        }
    } else if (req.method === 'PUT') {
        let data = [];

        req.on('data', chunk => {
            data.push(chunk);
        });

        req.on('end', async () => {
            try {
                const imageData = Buffer.concat(data);
                await fs.writeFile(filePath, imageData);
                res.writeHead(201, { 'Content-Type': 'text/plain' });
                res.end('Image created successfully'); 
            } catch (error) {
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
});

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});
