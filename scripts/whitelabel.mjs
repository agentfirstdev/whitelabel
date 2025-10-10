#!/usr/bin/env node
import filesystem from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);

  process.exit(1);
});

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, ...val] = arg.replace(/^--/, '').split('=');

    return [key, val.join('=')];
  })
);
const companyName = args.company || args.c;
const apiEndpoint = args.endpoint || args.e;

if (!companyName || !apiEndpoint) {
  console.error('Usage: npm run whitelabel -- --company=\'[name]\' --endpoint=[domain]');

  process.exit(1);
}

const whitelabelRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const templateDirectory = path.join(whitelabelRoot, 'templates');
const fromSnippetDirectory = path.join(whitelabelRoot, 'snippets');
const toSnippetDirectory = path.join(whitelabelRoot, '..', 'snippets', 'whitelabel');
const renderTemplate = async (template, rendering, vals) => {
  await filesystem.writeFile(
    rendering,
    (await filesystem.readFile(template, 'utf8'))
      .replaceAll('{{COMPANY_NAME}}', vals.companyName)
      .replaceAll('{{API_ENDPOINT}}', vals.apiEndpoint)
  );
};
const copyDirectory = async (from, to) => {
  for (const entry of await filesystem.readdir(from, { withFileTypes: true })) {
    const fromPath = path.join(from, entry.name);
    const toPath = path.join(to, entry.name);

    if (entry.isDirectory()) {
      await filesystem.mkdir(toPath, { recursive: true });
      await copyDirectory(fromPath, toPath);
    } else {
      await filesystem.copyFile(fromPath, toPath);
    }
  }
};

(async () => {
  await renderTemplate(
    path.join(templateDirectory, 'config.mdx.tmpl'),
    path.join(whitelabelRoot, 'snippets', 'config.mdx'),
    { companyName, apiEndpoint }
  );
  await renderTemplate(
    path.join(templateDirectory, 'openapi.json.tmpl'),
    path.join(whitelabelRoot, 'openapi.json'),
    { companyName, apiEndpoint }
  );
  await filesystem.mkdir(toSnippetDirectory, { recursive: true });
  await copyDirectory(fromSnippetDirectory, toSnippetDirectory);
  console.log('Doc whitelabeled successfully!\n');
})();
