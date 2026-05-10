import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = process.cwd()
const scanRoots = ['src', 'docs']
const extensions = new Set(['.css', '.ts', '.tsx', '.md'])
const banned = [
  /Aboriginal-flag/i,
  /flag-coded/i,
  /color-flag/i,
  /flag-neon/i,
  /btn-flag/i,
  /flag-accent/i,
  /sun-disc/i,
  /ritual-chip/i,
  /campfire-panel/i,
  /blak-motif/i,
  /#DB162F/i,
  /#F3DE2C/i,
  /rgba\(243,222,44/i,
  /rgba\(219,22,47/i,
]

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', 'coverage'].includes(entry)) {
        walk(full, files)
      }
    } else if (extensions.has(full.slice(full.lastIndexOf('.')))) {
      files.push(full)
    }
  }
  return files
}

const matches = []
for (const scanRoot of scanRoots) {
  for (const file of walk(join(root, scanRoot))) {
    const text = readFileSync(file, 'utf8')
    const lines = text.split(/\r?\n/)
    lines.forEach((line, index) => {
      if (banned.some(pattern => pattern.test(line))) {
        matches.push(`${relative(root, file)}:${index + 1}: ${line.trim()}`)
      }
    })
  }
}

if (matches.length > 0) {
  console.error('Mudyin theme check failed. Banned flag-coded styling references remain:')
  for (const match of matches) console.error(`- ${match}`)
  process.exit(1)
}

console.log('Mudyin theme check passed: no banned flag-coded brand styling references found.')
