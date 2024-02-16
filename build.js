import { writeFileSync } from "fs"
import { getModelFromSource } from "@publicodes/tools/compilation"
import Engine from "publicodes"
import getUI from "./scripts/compile-ui.js"

const srcFiles = "rules/**/*.publicodes"
const destPath = "publicodes-evenements.model.json"

const model = getModelFromSource(srcFiles, { verbose: true })

try {
  const engine = new Engine(model)
  engine.evaluate("resultats . bilan total")
} catch (e) {
  console.error(`❌ Model compilation failed:\n${e.message}\n`)
  process.exit(-1)
}

const ui = getUI(model)

writeFileSync(destPath, JSON.stringify(model, null, 2))
console.log(`✅ ${destPath} generated`)

writeFileSync(
  "index.js",
  `
import rules from "./${destPath}" assert { type: "json" };

export const ui = ${JSON.stringify(ui, null, 2)};

export default rules;
`,
)
console.log(`✅ index.js generated`)

let indexDTypes = Object.keys(model).reduce(
  (acc, dottedName) => acc + `| "${dottedName}"\n`,
  `
import { Rule } from "publicodes";

export type DottedName = 
`,
)

indexDTypes += `

declare let ui: {
    categories: Record<RuleName, {index: number, sub: RuleName[]}>;
    questions: Record<RuleName, RuleName[][]>;
}

export { ui }

declare let rules: Record<DottedName, Rule>

export default rules;
`

writeFileSync("index.d.ts", indexDTypes)
console.log(`✅ index.d.ts generated`)
