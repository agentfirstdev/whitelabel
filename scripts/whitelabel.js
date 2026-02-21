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
const docPath = args.path || args.p;
const companyName = args.company || args.c;
const apiEndpoint = args.endpoint || args.e;

if (!docPath || !companyName || !apiEndpoint) {
  console.error(
    "Usage: npm run whitelabel -- --path='[name]' --company='[name]' --endpoint=[domain]"
  );

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
const docRoot = path.join(mintlifyRoot, docPath);
const templateDirectory = path.join(whitelabelRoot, 'templates');
const fromSnippetDirectory = path.join(templateDirectory, 'snippets');
const toSnippetDirectory = path.join(mintlifyRoot, 'snippets', 'whitelabel');
const fromApiSpec = path.join(templateDirectory, 'openapi.json');
const toApiSpec = path.join(docRoot, 'openapi.json');
const companySlug = companyName.toUpperCase().replaceAll(' ', '_');
const templateVals = { companyName, companySlug, apiEndpoint };
const renderTemplate = async (from, to, vals) => {
  await filesystem.writeFile(
    to,
    (await filesystem.readFile(from, 'utf8'))
      .replaceAll('{{COMPANY_NAME}}', vals.companyName)
      .replaceAll('{{COMPANY_SLUG}}', vals.companySlug)
      .replaceAll('{{API_ENDPOINT}}', vals.apiEndpoint)
  );
};
const copyDirectory = async (from, to, copyFile = filesystem.copyFile) => {
  await filesystem.mkdir(to, { recursive: true });

  for (const entry of await filesystem.readdir(from, { withFileTypes: true })) {
    const fromPath = path.join(from, entry.name);
    const toPath = path.join(to, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(fromPath, toPath, copyFile);
    } else {
      await copyFile(fromPath, toPath);
    }
  }
};

(async () => {
  // Cleanup of any subtree artifacts
  await filesystem.rm(docRoot, { recursive: true, force: true });
  await filesystem.rm(toSnippetDirectory, { recursive: true, force: true });

  // MDX file transfer
  await filesystem.mkdir(docRoot, { recursive: true });

  for (const entry of await filesystem.readdir(whitelabelRoot, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.mdx')) {
      await filesystem.copyFile(
        path.join(whitelabelRoot, entry.name),
        path.join(docRoot, entry.name)
      );
    }
  }

  // Reference file transfer
  await copyDirectory(path.join(whitelabelRoot, 'reference'), path.join(docRoot, 'reference'));

  // Mintlify-snippet customization
  await copyDirectory(fromSnippetDirectory, toSnippetDirectory, (from, to) => {
    return renderTemplate(from, to, templateVals);
  });

  // OpenAPI-spec customization
  await renderTemplate(fromApiSpec, toApiSpec, templateVals);

  console.log('Doc whitelabeled successfully!\n');
})();
