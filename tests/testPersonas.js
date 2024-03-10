import c from "ansi-colors"
import Engine from "publicodes"
import { disabledLogger } from "@publicodes/tools"

import {
  getArgs,
  getLocalRules,
  getLocalPersonas,
  getLatestRules,
  getLatestPersonas,
  printResults,
} from "./commons.js"
import safeGetSituation from "./helpers/safeGetSituation.js"

/**
 * Compares the value of all the rules between the local and the prod (or specified) version
 * with the situation of the specified persona (default: all personas).
 **/

const { markdown, persona } = getArgs()

const localRules = await getLocalRules()
let localPersonas = await getLocalPersonas()

const prodRules = getLatestRules()
let prodPersonas = getLatestPersonas()

if (persona && persona in localPersonas && persona in prodPersonas) {
  localPersonas = { [persona]: localPersonas[persona] }
  prodPersonas = { [persona]: prodPersonas[persona] }
}

const localEngine = new Engine(localRules, { logger: disabledLogger })
const prodEngine = new Engine(prodRules, { logger: disabledLogger })

const nbRules = Object.keys(localRules).length

for (const personaName in localPersonas) {
  const { situation: localSituation } = localPersonas[personaName]
  const { situation: prodSituation } = prodPersonas[personaName]
  const results = []

  if (markdown) {
    console.log(`#### ${localPersonas[personaName].titre}\n`)
  } else {
    console.log(
      `[ Test persona ${c.magenta(personaName)} regression against ${c.green(
        "latest"
      )} ]\n`
    )
  }

  try {
    const safeSituation = safeGetSituation({
      situation: localSituation || {},
      parsedRulesNames: Object.keys(localEngine.getParsedRules()),
      version: "local",
    })
    const safeProdSituation = safeGetSituation({
      situation: prodSituation || {},
      parsedRulesNames: Object.keys(prodEngine.getParsedRules()),
      version: "latest",
    })
    localEngine.setSituation(safeSituation)
    prodEngine.setSituation(safeProdSituation)
  } catch (e) {
    printResults({ results: [{ type: "error", message: e.message }], markdown })
    continue
  }

  for (const rule in localRules) {
    if (!(rule in prodRules)) {
      continue
    }

    const local = localEngine.evaluate(rule)
    const prod = prodEngine.evaluate(rule)
    results.push({ type: "result", rule, actual: local, expected: prod })
  }

  printResults({
    markdownHeader: `| Règle | PR | Latest | Δ (%) |`,
    results,
    nbTests: nbRules,
    markdown,
  })
}
