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
const bumpType = process.argv[2] || 'patch';

let nextVersion;
switch (bumpType) {
  case 'major':
    nextVersion = `${Number(major) + 1}.0.0`;
    break;
  case 'minor':
    nextVersion = `${major}.${Number(minor) + 1}.0`;
    break;
  case 'patch':
  default:
    nextVersion = `${major}.${minor}.${Number(patch) + 1}`;
    break;
}

packageJson.version = nextVersion;
fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

process.stdout.write(nextVersion);
