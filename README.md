<div align="center">
  <h3 align="center">
	<big>Modèle Publicodes Evènements</big>
  </h3>
  <p align="center">
   <a href="https://github.com/ekofest/publicodes-evenements/issues">Report Bug</a>
   •
   <a href="https://ekofest.github.io/publicodes-evenements/">Documentation</a>
   •
   <a href="https://publi.codes">Publicodes</a>
   •
   <a href="https://ekofest.fr">ekofest.fr</a>

  </p>

A Publicodes model to calculate the environmental impact of events.

</div>

---

This model is used by [ekofest.fr](https://ekofest.fr) to calculate the
environmental impact of the festival. The model is written in
[Publicodes](https://publi.codes), a domain-specific language to write and
share calculation models and quickly build online calculators.

> [!WARNING]
> This model is a work in progress and is not yet ready for production use.

## Local development

```bash
# Install dependencies
yarn && yarn --cwd doc

# Build the model
yarn build

# Start the documentation server
yarn doc:start
```
