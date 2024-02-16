import { parse } from "yaml"
import { readFileSync } from "fs"

/**
 * Parses the ui.yaml file and checks that all rules referenced in it exist in the model.
 *
 * @param {Record<string, import("publicodes").Rule>} model - The publicodes model.
 *
 * @throws If a category, subcategory or question referenced in ui.yaml does not exist in the model.
 */
export default function getUI(model) {
  const ui = parse(readFileSync("ui.yaml", "utf-8"))
  let error = false

  for (const cat in ui.categories) {
    if (!(cat in model)) {
      console.error(`(ui:categories) rule [${cat}] not in model`)
      error = true
    }
    for (const sub of ui.categories[cat].sub) {
      if (!(sub in model)) {
        console.error(`(ui:categories:${cat}) rule [${sub}] not in model`)
        error = true
      }
    }
  }

  for (const question in ui.questions) {
    if (!(question in model)) {
      console.error(`(ui:questions) rule [${question}] not in model`)
      error = true
    }
    for (const sub of ui.questions[question]) {
      for (const q of sub) {
        if (!(q in model)) {
          console.error(`(ui:questions:${question}) rule [${q}] not in model`)
          error = true
        }
      }
    }
  }

  if (error) {
    console.log()
    process.exit(1)
  }

  return ui
}
