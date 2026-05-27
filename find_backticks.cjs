const { execSync } = require('child_process');

const script = `
const p = require('./node_modules/@babel/parser');
const fs = require('fs');
const code = fs.readFileSync('resources/js/Pages/Dashboard.jsx', 'utf8');
try {
    p.parse(code, {sourceType: 'module', plugins: ['jsx']});
    console.log('PARSED OK');
} catch(e) {
    console.log('Error type:', e.constructor.name);
    console.log('Message:', e.message);
    console.log('Location:', JSON.stringify(e.loc));
    // Show 5 lines around the error
    const lines = code.split('\\n');
    const errLine = (e.loc && e.loc.line) ? e.loc.line : 0;
    for (let i = Math.max(0, errLine - 4); i < Math.min(lines.length, errLine + 3); i++) {
        console.log((i+1 === errLine ? '>>>' : '   ') + ' L' + (i+1) + ': ' + lines[i].trim().substring(0, 100));
    }
}
`;

try {
    const result = execSync(`node -e "${script.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, 
        { cwd: 'C:/xampp/htdocs/condominio-pro', encoding: 'utf8', timeout: 30000 });
    console.log(result);
} catch(e) {
    console.log(e.stdout);
    console.log(e.message.substring(0, 500));
}
