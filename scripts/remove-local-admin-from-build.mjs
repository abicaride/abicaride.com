import { lstat, realpath, rm } from 'node:fs/promises';
import path from 'node:path';

// Astro serves public/admin in development, but the local editor is not a
// production page and must not be included in the GitHub Pages artifact.
const distDirectory = path.resolve('dist');
const adminDirectory = path.join(distDirectory, 'admin');
const workspaceDirectory = await realpath(process.cwd());
const actualDistDirectory = await realpath(distDirectory);

if (path.relative(workspaceDirectory, actualDistDirectory) !== 'dist'
  || path.relative(actualDistDirectory, adminDirectory) !== 'admin') {
  throw new Error('Refusing to remove a path outside the generated admin directory.');
}

let adminStats;
try {
  adminStats = await lstat(adminDirectory);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

if (adminStats) {
  if (!adminStats.isDirectory() || adminStats.isSymbolicLink()) {
    throw new Error('Expected dist/admin to be a generated directory.');
  }
  if (path.relative(actualDistDirectory, await realpath(adminDirectory)) !== 'admin') {
    throw new Error('Refusing to remove a linked admin directory.');
  }
  await rm(adminDirectory, { recursive: true });
  console.log('Removed local-only CMS editor from the production build.');
}
