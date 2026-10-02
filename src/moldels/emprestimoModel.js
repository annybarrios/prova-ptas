import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, 'data.json')

export async function readUsers() {
  try {
    const raw = await readFile(DB_PATH, 'utf8')
    return JSON.parse(raw)
  } catch (err) {
    if (err.code === 'ENOENT') return []   
    throw err                             
  }
}

export async function writeUsers(data) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8')
}