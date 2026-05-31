const bcrypt = require('bcryptjs');
const pin = process.argv[2] || '123456';
bcrypt.hash(pin, 10).then(hash => {
  console.log(`PIN: ${pin}`);
  console.log(`Hash: ${hash}`);
});