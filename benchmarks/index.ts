import { getDirname } from '@poppinss/utils'
import { execaNode } from 'execa'
import { cyan, green, red } from 'kleur'

async function run() {
  console.log(cyan('Benchmarking against flat object'))
  await execaNode('./flat-object.js', {
    cwd: getDirname(new URL('./', import.meta.url)),
    stdio: 'inherit',
  })

  console.log(cyan('Benchmarking against flat object with extra properties'))
  await execaNode('./flat-object-extra-properties.js', {
    cwd: getDirname(new URL('./', import.meta.url)),
    stdio: 'inherit',
  })

  console.log(cyan('Benchmarking against nested object'))
  await execaNode('./nested-object.js', {
    cwd: getDirname(new URL('./', import.meta.url)),
    stdio: 'inherit',
  })

  console.log(cyan('Benchmarking against array of objects'))
  await execaNode('./array.js', {
    cwd: getDirname(new URL('./', import.meta.url)),
    stdio: 'inherit',
  })
}

run()
  .then(() => {
    console.log(green('completed'))
  })
  .catch((error) => {
    console.log(red(error))
  })
