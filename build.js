import { writeFileSync } from "fs"
import { getModelFromSource } from "@publicodes/tools/compilation"
import Engine from "publicodes"
import getUI from "./scripts/compile-ui.js"
import getPersonas from "./scripts/compile-personas.js"

const srcFiles = "rules/**/*.publicodes"
const modelDestPath = "publicodes-evenements.model.json"
const personasDestPath = "publicodes-evenements.personas.json"

const model = getModelFromSource(srcFiles, { verbose: true })

try {
  const engine = new Engine(model)
  engine.evaluate("resultats . bilan total")
} catch (e) {
  console.error(`❌ Model compilation failed:\n${e.message}\n`)
  process.exit(-1)
}

writeFileSync(modelDestPath, JSON.stringify(model, null, 2))
console.log(`✅ ${modelDestPath} generated`)

const personas = getPersonas(model)

writeFileSync(personasDestPath, JSON.stringify(personas, null, 2))
console.log(`✅ ${personasDestPath} generated`)

const ui = getUI(model)

writeFileSync(
  "index.js",
  `
import rules from "./${modelDestPath}" assert { type: "json" };

import personas from "./${personasDestPath}" assert { type: "json" };

export const ui = ${JSON.stringify(ui, null, 2)};

export { personas };

export default rules;
`
)
console.log(`✅ index.js generated`)

let indexDTypes = Object.keys(model).reduce(
  (acc, dottedName) => acc + `| "${dottedName}"\n`,
  `
import { Rule } from "publicodes";

export type DottedName = 
`
)

indexDTypes += `

declare let personas: {
    [key: string]: {
      titre: string;
      description: string;
      situation: Situation;
    }
}

declare let ui: {
  categories: Record<RuleName, {index: number, sub: RuleName[]}>;
  questions: Record<RuleName, RuleName[][]>;
}

export { ui, personas }

declare let rules: Record<DottedName, Rule>

export default rules;
`

writeFileSync("index.d.ts", indexDTypes)
console.log(`✅ index.d.ts generated`)
