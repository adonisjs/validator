import execa from 'execa'
import { cyan, green, red } from 'kleur'

async function run() {
	console.log(cyan('Benchmarking against flat object'))
	await execa.node('./flat-object.js', {
		cwd: __dirname,
		stdio: 'inherit',
	})

	console.log(cyan('Benchmarking against flat object with extra properties'))
	await execa.node('./flat-object-extra-properties.js', {
		cwd: __dirname,
		stdio: 'inherit',
	})

	console.log(cyan('Benchmarking against nested object'))
	await execa.node('./nested-object.js', {
		cwd: __dirname,
		stdio: 'inherit',
	})

	console.log(cyan('Benchmarking against array of objects'))
	await execa.node('./array.js', {
		cwd: __dirname,
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
