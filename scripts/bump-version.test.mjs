import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const scriptPath = path.resolve(process.cwd(), 'scripts', 'bump-version.mjs');

function runBump(initialVersion) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'decival-bump-version-'));
  const packageJsonPath = path.join(tempDir, 'package.json');

  fs.writeFileSync(
    packageJsonPath,
    `${JSON.stringify({ name: 'test-app', version: initialVersion }, null, 2)}\n`
  );

  const stdout = execFileSync(process.execPath, [scriptPath], {
    cwd: tempDir,
    encoding: 'utf8',
  }).trim();

  const updatedPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  return { stdout, updatedPackageJson };
}

describe('bump-version script', () => {
  it('bumps a stable patch version', () => {
    const { stdout, updatedPackageJson } = runBump('1.2.3');

    expect(stdout).toBe('1.2.4');
    expect(updatedPackageJson.version).toBe('1.2.4');
  });

  it('normalizes a prerelease version to the next stable patch', () => {
    const { stdout, updatedPackageJson } = runBump('1.0.2-beta');

    expect(stdout).toBe('1.0.3');
    expect(updatedPackageJson.version).toBe('1.0.3');
  });
});
