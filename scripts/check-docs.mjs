#!/usr/bin/env node
/**
 * Documentation gate: word budgets, local links, heading anchors, trailing newline.
 *
 * Budgets come from `scripts/doc-budgets.json`. A file absent from the manifest
 * falls back to 400 words when it is a subtree `AGENTS.md` and 1,200 when it
 * lives under `docs/`; anything else is ungoverned. An empty corpus is a
 * failure: a gate that checks nothing passes everything. Symlinked files are
 * skipped so a `CLAUDE.md` alias is never counted twice.
 *
 * Usage: `node scripts/check-docs.mjs`
 */

import { readFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const SKIP_DIRECTORIES = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage'])
const SUBTREE_BUDGET = 400
const DOCS_BUDGET = 1_200

const errors = []

const budgets = JSON.parse(await readFile(join(ROOT, 'scripts/doc-budgets.json'), 'utf8'))

async function collect(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (SKIP_DIRECTORIES.has(entry.name) || entry.isSymbolicLink()) continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await collect(path))
    else if (entry.name.endsWith('.md')) files.push(path)
  }
  return files
}

/** Replace fenced code blocks with blank lines so their contents are not parsed. */
function withoutFences(text) {
  let open = false
  return text.split('\n').map(line => {
    if (line.trimStart().startsWith('```')) {
      open = !open
      return ''
    }
    return open ? '' : line
  }).join('\n')
}

/** GitHub-style heading id, close enough for every heading this repository writes. */
function slug(heading) {
  return heading.toLowerCase().trim()
    .replace(/[^\p{L}\p{N} _-]/gu, '')
    .replace(/\s+/gu, '-')
}

function budgetFor(file) {
  if (file in budgets) return budgets[file]
  if (file.endsWith('/AGENTS.md')) return SUBTREE_BUDGET
  if (file.startsWith('docs/')) return DOCS_BUDGET
  return Infinity
}

const files = (await collect(ROOT)).sort()

if (files.length === 0) {
  errors.push('documents: no Markdown files found; refusing to pass an empty corpus')
}

const anchors = new Map()
const contents = new Map()

for (const absolute of files) {
  const file = relative(ROOT, absolute).split('\\').join('/')
  const text = await readFile(absolute, 'utf8')
  contents.set(file, text)
  anchors.set(file, new Set(
    [...withoutFences(text).matchAll(/^#{1,6}\s+(.+)$/gmu)].map(match => slug(match[1])),
  ))
}

for (const [file, text] of contents) {
  const budget = budgetFor(file)
  const words = text.trim().split(/\s+/u).filter(Boolean).length
  if (words > budget) {
    errors.push(`${file}: ${words} words exceeds the ${budget}-word budget`)
  }

  if (!text.endsWith('\n') || text.endsWith('\n\n')) {
    errors.push(`${file}: file must end with exactly one newline`)
  }

  for (const [index, line] of withoutFences(text).split('\n').entries()) {
    for (const match of line.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const target = match[1]
      if (/^(?:https?:|mailto:)/u.test(target)) continue

      const [path, anchor = ''] = target.split('#')
      const destinationPath = path === '' ? join(ROOT, file) : resolve(dirname(join(ROOT, file)), path)
      const destination = relative(ROOT, destinationPath).split('\\').join('/')

      if (!existsSync(destinationPath)) {
        errors.push(`${file}:${index + 1}: missing file ${target}`)
        continue
      }
      if (anchor === '') continue
      if (!contents.has(destination)) {
        errors.push(`${file}:${index + 1}: heading anchor on a non-Markdown target ${target}`)
      } else if (!anchors.get(destination).has(slug(anchor))) {
        errors.push(`${file}:${index + 1}: missing heading ${target}`)
      }
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'))
  console.error(`\ndocs: ${errors.length} problem(s) in ${files.length} files`)
  process.exit(1)
}

console.log(`docs: ${files.length} files, links and anchors resolve, budgets hold`)
