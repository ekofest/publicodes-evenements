import { parse } from "yaml"
import { readFileSync } from "fs"

/**
 * Parses the personas.yaml file
 * TODO: checks that personas definition are valid.
 */
export default function getPersonas() {
  const personas = parse(readFileSync("personas.yaml", "utf-8"))
  let error = false

  if (error) {
    console.log()
    process.exit(1)
  }

  return personas
}
