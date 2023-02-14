import kleur from 'kleur'
import { execaNode } from 'execa'
import { fileURLToPath } from 'node:url'

async function run() {
  console.log(kleur.cyan('Benchmarking against flat object'))
  await execaNode('./flat_object.js', {
    cwd: fileURLToPath(new URL('./', import.meta.url)),
    stdio: 'inherit',
  })

  console.log(kleur.cyan('Benchmarking against flat object with extra properties'))
  await execaNode('./flat_object_extra_properties.js', {
    cwd: fileURLToPath(new URL('./', import.meta.url)),
    stdio: 'inherit',
  })

  console.log(kleur.cyan('Benchmarking against nested object'))
  await execaNode('./nested_object.js', {
    cwd: fileURLToPath(new URL('./', import.meta.url)),
    stdio: 'inherit',
  })

  console.log(kleur.cyan('Benchmarking against array of objects'))
  await execaNode('./array.js', {
    cwd: fileURLToPath(new URL('./', import.meta.url)),
    stdio: 'inherit',
  })
}

run()
  .then(() => {
    console.log(kleur.green('completed'))
  })
  .catch((error) => {
    console.log(kleur.red(error))
  })
