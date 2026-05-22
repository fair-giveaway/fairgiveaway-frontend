const url = "https://x.com/SapphireIV/status/2057204717059444786?s=20";
const match = url.match(/(?:x\.com|twitter\.com)\/([^/]+)\/status/);
console.log(match ? match[1] : 'unknown');
