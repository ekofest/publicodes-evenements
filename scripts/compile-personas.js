import { parse } from "yaml"
import { readFileSync } from "fs"

/**
 * Parses the festivals-type.yaml file
 * TODO: checks that personas definition are valid.
 *
 * @param {Record<string, import("publicodes").Rule>} model - The publicodes model.
 *
 */
export default function getPersonas(model) {
  const personas = parse(readFileSync("festivals-type.yaml", "utf-8"))
  let error = false

  if (error) {
    console.log()
    process.exit(1)
  }

  return personas
}
