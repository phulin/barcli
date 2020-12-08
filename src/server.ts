import { myHash, visitUrl, write } from 'kolmafia';

export function main() {
  let page = visitUrl();
  page = page.replace('<body', `<body data-pwd=${myHash()}`);
  page = page.replace('</body>', '<script src="/barcli.js"></script></body>');
  write(page);
}
