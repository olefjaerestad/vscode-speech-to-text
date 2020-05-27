const fs = require('fs');

if (!fs.existsSync('out/client')) {
	fs.mkdirSync('out/client', {recursive: true});
}

fs.copyFileSync('./src/client/index.html', 'out/client/index.html');