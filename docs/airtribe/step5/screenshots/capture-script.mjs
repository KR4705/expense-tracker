import { createRequire } from 'module';
const require = createRequire('/home/claude/.npm-global/lib/node_modules/@playwright/mcp/');
const { chromium } = require('playwright-core');
import http from 'http'; import fs from 'fs'; import path from 'path';
const [,, dir, out, mode] = process.argv;
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml'};
const srv = http.createServer((q, r) => { let p = path.join(dir, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(dir, 'index.html'); r.writeHead(200, {'content-type': types[path.extname(p)] || 'application/octet-stream'}); fs.createReadStream(p).pipe(r); }).listen(0);
const port = srv.address().port;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
const pg = await b.newPage({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 2 });
await pg.goto(`http://localhost:${port}/`); await pg.waitForLoadState('networkidle');
await pg.screenshot({ path: `${out}-page.png` });
const tiles = await pg.$$eval('label', ls => ls.map(l => { const r = l.getBoundingClientRect(); return { text: l.textContent, w: Math.round(r.width), h: Math.round(r.height) }; }));
console.log(JSON.stringify(tiles));
if (mode === 'after') {
  const btn = pg.getByRole('button', { name: 'Transit or Travel? How they differ' });
  const bb = await btn.boundingBox(); console.log('info button box', JSON.stringify(bb));
  await btn.focus(); await pg.keyboard.press('Enter');
  await pg.screenshot({ path: `${out}-modal.png` });
  console.log('focused in modal:', await pg.evaluate(() => document.activeElement.textContent));
  await pg.keyboard.press('Escape');
  console.log('focus after Escape:', await pg.evaluate(() => document.activeElement.getAttribute('aria-label')));
  await pg.getByRole('checkbox', { name: 'Travel' }).check({ force: true });
  await btn.click(); await pg.getByRole('button', { name: 'Close' }).click();
  console.log('summary after Info round-trip:', await pg.getByRole('status').textContent());
  await pg.screenshot({ path: `${out}-selected-after-info.png` });
}
await b.close(); srv.close();
