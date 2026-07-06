const fs = require('fs');
const https = require('https');
const path = require('path');

function download(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, filename).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      const file = fs.createWriteStream(filename);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', (err) => {
        fs.unlink(filename, () => reject(err));
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

Promise.all([
  download('https://upload.wikimedia.org/wikipedia/pt/4/42/Campeonato_Brasileiro_S%C3%A9rie_A_logo.png', path.join(publicDir, 'brasileirao-logo.png')),
  download('https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg', path.join(publicDir, 'whatsapp-3d.svg'))
]).then(() => {
  console.log('Images downloaded successfully');
}).catch((err) => {
  console.error('Error downloading images:', err);
  process.exit(1);
});
