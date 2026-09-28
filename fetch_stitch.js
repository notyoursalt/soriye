const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const projectId = '107016028420147432';
const screenIds = [
  '3c05c6bc2af446168fae6f405c241894',
  '537bbdc989904799923a001737b72655',
  '6422023615673387952',
  '10912246852417294854',
  'd224c0ee923f4f69b4cd7ae367cc18ff'
];

async function mcpCall(name, args = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request('https://stitch.googleapis.com/mcp', {
      method: 'POST',
      headers: {
        'X-Goog-Api-Key': 'AQ.Ab8RN6LgNpS-E6mrpslctHSJSf6Nsn9rWgWPc4M-L6t6semYdQ',
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          reject(new Error('Parse error: ' + data));
        }
      });
    });
    req.on('error', reject);
    req.write(JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name,
        arguments: args
      }
    }));
    req.end();
  });
}

function downloadUrl(url, destPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadUrl(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    });
    req.on('error', reject);
  });
}

function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9_\-\.]/gi, '_').substring(0, 100);
}

async function main() {
  const outDir = path.join(__dirname, 'stitch_downloads');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('Fetching project details...');
  const projRes = await mcpCall('get_project', { name: `projects/${projectId}` });
  fs.writeFileSync(path.join(outDir, 'project_details.json'), JSON.stringify(projRes, null, 2));

  for (const id of screenIds) {
    console.log(`\n--- Fetching screen ${id} ---`);
    try {
      const res = await mcpCall('get_screen', { name: `projects/${projectId}/screens/${id}` });
      let screenData = res.result?.structuredContent;
      if (!screenData && res.result?.content && res.result.content[0]?.text) {
        try {
          screenData = JSON.parse(res.result.content[0].text);
        } catch(e) {
          console.log('Raw text:', res.result.content[0].text);
        }
      }
      console.log('Title:', screenData?.title || 'No title');
      console.log('Has Screenshot:', !!screenData?.screenshot?.downloadUrl);
      console.log('Has HTML:', !!screenData?.htmlCode?.downloadUrl);

      const itemDir = path.join(outDir, `${id}_${sanitizeFilename(screenData?.title || 'screen')}`);
      if (!fs.existsSync(itemDir)) fs.mkdirSync(itemDir, { recursive: true });

      fs.writeFileSync(path.join(itemDir, 'metadata.json'), JSON.stringify(screenData || res, null, 2));

      // Download screenshot
      if (screenData?.screenshot?.downloadUrl) {
        const screenshotPath = path.join(itemDir, 'screenshot.png');
        console.log(`Downloading screenshot to ${screenshotPath}...`);
        await downloadUrl(screenData.screenshot.downloadUrl, screenshotPath);
        console.log('Screenshot downloaded.');
      }

      // Download HTML/Code
      if (screenData?.htmlCode?.downloadUrl) {
        const htmlPath = path.join(itemDir, 'code.html');
        console.log(`Downloading HTML to ${htmlPath}...`);
        await downloadUrl(screenData.htmlCode.downloadUrl, htmlPath);
        console.log('HTML downloaded.');
      }

      // Download any other assets / file entries
      if (screenData?.fileEntries) {
        for (const [key, entry] of Object.entries(screenData.fileEntries)) {
          if (entry.downloadUrl) {
            const entryPath = path.join(itemDir, `${key}`);
            console.log(`Downloading file entry ${key} to ${entryPath}...`);
            await downloadUrl(entry.downloadUrl, entryPath);
          }
        }
      }
    } catch(err) {
      console.error(`Error processing ${id}:`, err);
    }
  }

  console.log('\nAll Stitch downloads complete!');
}

main().catch(console.error);
