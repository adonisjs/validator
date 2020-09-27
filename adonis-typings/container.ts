/*
 * @adonisjs/application
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Adonis/Core/Application' {
	import validator from '@ioc:Adonis/Core/Validator'
	export interface ContainerBindings {
		'Adonis/Core/Validator': typeof validator
	}
}
