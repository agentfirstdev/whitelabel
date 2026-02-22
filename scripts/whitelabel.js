#!/usr/bin/env node
import childProcess from 'node:child_process';
import filesystem from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);

  process.exit(1);
});

const args = process.argv.slice(2);
const parsedArgs = {};

for (let i = 0; i < args.length; i++) parsedArgs[args[i].replace(/^-{1,2}/, '')] = args[++i];

const docPath = parsedArgs.path || parsedArgs.p;
const companyName = parsedArgs.company || parsedArgs.c;
const emailAddress = parsedArgs.email || parsedArgs.e;
const apiEndpoint = parsedArgs.endpoint;
const dashboardUrl = parsedArgs.dashboard || parsedArgs.d;
const checkoutUrl = parsedArgs.checkout;

if (!docPath || !companyName || !emailAddress || !apiEndpoint || !dashboardUrl || !checkoutUrl) {
  console.error(
    "Usage: npm run whitelabel -- --path '[name]' --company '[name]' --email [address] " +
      '--endpoint [domain] --dashboard [URL] --checkout [URL]'
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
const templateVals = {
  companyName,
  companySlug,
  emailAddress,
  apiEndpoint,
  dashboardUrl,
  checkoutUrl
};
const renderTemplate = async (from, to, vals) => {
  await filesystem.writeFile(
    to,
    (await filesystem.readFile(from, 'utf8'))
      .replaceAll('{{COMPANY_NAME}}', vals.companyName)
      .replaceAll('{{COMPANY_SLUG}}', vals.companySlug)
      .replaceAll('{{EMAIL_ADDRESS}}', vals.emailAddress)
      .replaceAll('{{API_ENDPOINT}}', vals.apiEndpoint)
      .replaceAll('{{DASHBOARD_URL}}', vals.dashboardUrl)
      .replaceAll('{{CHECKOUT_URL}}', vals.checkoutUrl)
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
