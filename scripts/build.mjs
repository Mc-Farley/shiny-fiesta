import { cp, mkdir, readFile, rm } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'

await rm('dist', { recursive: true, force: true })
await mkdir('dist/assets', { recursive: true })
await Promise.all([
  cp('index.html', 'dist/index.html'),
  cp('src', 'dist/src', { recursive: true })
])

// Extract from the supplied archive instead of committing duplicate binaries.
execFileSync('unzip', [
  '-jo',
  'deepseek-desktop-pet-reaction-library.zip',
  'deepseek-desktop-pet-reaction-library/previews/*.webp',
  '-d',
  'dist/assets'
], { stdio: 'inherit' })

const source = await readFile('dist/index.html', 'utf8')
if (!source.includes('/src/main.js')) throw new Error('Missing application entrypoint')
console.log('Static site built in dist/')
