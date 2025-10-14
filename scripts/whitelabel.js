#!/usr/bin/env node
import childProcess from 'node:child_process';
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
  console.error("Usage: npm run whitelabel -- --company='[name]' --endpoint=[domain]");

  process.exit(1);
}

const whitelabelRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mintlifyRoot = childProcess
  .execSync('git rev-parse --show-toplevel', {
    cwd: path.join(whitelabelRoot, '..'),
    stdio: ['ignore', 'pipe', 'ignore']
  })
  .toString()
  .trim();
const templateDirectory = path.join(whitelabelRoot, 'templates');
const fromSnippetDirectory = path.join(templateDirectory, 'snippets');
const toSnippetDirectory = path.join(mintlifyRoot, 'snippets', 'whitelabel');
const fromApiSpec = path.join(templateDirectory, 'openapi.json');
const toApiSpec = path.join(whitelabelRoot, 'openapi.json');
const companySlug = companyName.toUpperCase().replaceAll(' ', '_');
const renderTemplate = async (from, to, vals) => {
  await filesystem.writeFile(
    to,
    (await filesystem.readFile(from, 'utf8'))
      .replaceAll('{{COMPANY_NAME}}', vals.companyName)
      .replaceAll('{{COMPANY_SLUG}}', vals.companySlug)
      .replaceAll('{{API_ENDPOINT}}', vals.apiEndpoint)
  );
};
const renderDirectory = async (from, to, vals) => {
  await filesystem.mkdir(to, { recursive: true });

  for (const entry of await filesystem.readdir(from, { withFileTypes: true })) {
    const fromPath = path.join(from, entry.name);
    const toPath = path.join(to, entry.name);

    if (entry.isDirectory()) {
      await filesystem.mkdir(toPath, { recursive: true });
      await renderDirectory(fromPath, toPath, vals);
    } else {
      await renderTemplate(fromPath, toPath, vals);
    }
  }
};

(async () => {
  await renderDirectory(fromSnippetDirectory, toSnippetDirectory, {
    companyName,
    companySlug,
    apiEndpoint
  });
  await renderTemplate(fromApiSpec, toApiSpec, { companyName, companySlug, apiEndpoint });
  console.log('Doc whitelabeled successfully!\n');
})();
