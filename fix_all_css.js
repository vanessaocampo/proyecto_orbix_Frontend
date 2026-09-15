const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.css')) results.push(file);
    }
  });
  return results;
}

const files = walk('frontend/src');
files.forEach(f => {
  let buf = fs.readFileSync(f);
  if (buf[0] === 0xFF && buf[1] === 0xFE) {
    console.log('Fixing BOM in', f);
    let str = buf.toString('utf16le');
    fs.writeFileSync(f, str, 'utf8');
  } else if (buf.indexOf(0x00) !== -1) {
    console.log('Fixing UTF-16 in', f);
    let str = buf.toString('utf16le');
    fs.writeFileSync(f, str, 'utf8');
  }
});
