const fs = require('fs');
const path = 'C:/xampp/htdocs/condominio-pro/resources/js/Pages/Dashboard.jsx';
const data = fs.readFileSync(path, 'utf8');
const lines = data.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('`')) {
    console.log(`${idx + 1}: ${line}`);
  }
});
