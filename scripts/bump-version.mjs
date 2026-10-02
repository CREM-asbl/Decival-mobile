#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const packageJsonPath = path.resolve(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const version = packageJson.version;
const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(version);

if (!match) {
  throw new Error(`Unsupported version format: ${version}`);
}

const [, major, minor, patch] = match;
const nextVersion = `${major}.${minor}.${Number(patch) + 1}`;

packageJson.version = nextVersion;
fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

process.stdout.write(nextVersion);
