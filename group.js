const fs = require('fs');
let lines = fs.readFileSync('tests/homePage.spec.ts', 'utf8').split('\n');
const startIdx = lines.findIndex(l => l.includes("test('should display the main logo in the header'"));
const accentsStart = lines.findIndex(l => l.includes("test('should navigate to outdoor accents page when submenu is clicked'"));
const endIdx = lines.findIndex((l, i) => i > accentsStart && l.trim() === '});');

if (startIdx !== -1 && endIdx !== -1) {
  for (let i = startIdx; i <= endIdx; i++) {
    lines[i] = '  ' + lines[i];
  }
  lines.splice(endIdx + 1, 0, '  });');
  lines.splice(startIdx, 0, '  test.describe(\'Header Tests\', () => {', '    // Header tests');
  fs.writeFileSync('tests/homePage.spec.ts', lines.join('\n'));
  console.log('Successfully grouped and indented header tests.');
} else {
  console.log('Indices not found:', startIdx, endIdx);
}
