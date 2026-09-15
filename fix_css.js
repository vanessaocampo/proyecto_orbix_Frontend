const fs = require('fs');
const files = ['frontend/src/components/ProfileDropdown.css', 'frontend/src/components/dashboardAdmin/Sidebar.css'];
files.forEach(f => {
  let buf = fs.readFileSync(f);
  // If UTF-16 LE BOM (FF FE)
  if (buf[0] === 0xFF && buf[1] === 0xFE) {
    let str = buf.toString('utf16le');
    fs.writeFileSync(f, str, 'utf8');
  } else if (buf.includes(0x00)) {
    // UTF-16 without BOM
    let str = buf.toString('utf16le');
    fs.writeFileSync(f, str, 'utf8');
  }
});
