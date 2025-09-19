import { writeFile } from 'fs/promises'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { fetchEtaDb } from 'hk-bus-eta'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function main() {
  try {
    const db = await fetchEtaDb()
    const outputPath = resolve(__dirname, '../public/routeList.json')
    await writeFile(outputPath, JSON.stringify(db, null, 2), 'utf-8')
    console.log(`routeList.json saved to ${outputPath}`)
  } catch (error) {
    console.error('生成 routeList.json 失敗', error)
    process.exit(1)
  }
}

main()
