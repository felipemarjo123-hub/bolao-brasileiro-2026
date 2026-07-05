const https = require('https');

https.get('https://logodownload.org/wp-content/uploads/2017/04/campeonato-brasileiro-logo-1.png', (res) => {
  console.log('Status code:', res.statusCode);
});
