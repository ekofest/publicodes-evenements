import { copyFileSync } from "fs"

const srcPath = "publicodes-evenements.model.json"
const destPath = `doc/src/${srcPath}`

copyFileSync(srcPath, destPath)
console.log(`✅ ${destPath} correctly written in "doc/src"`)
