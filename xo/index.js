const {packageJson, install} = require('mrm-core')

const concatAndDeDuplicate = (...arrs) => [...new Set([].concat(...arrs))]

module.exports = config => {
	const configValues = config.values()

	// Package.json
	const pkg = packageJson()
	pkg
		.set('xo.prettier', true)
		.set('xo.semicolon', false)
		.set('xo.rules', {
			'import/no-unresolved': 'off',
			'import/order': 'off',
			'import/no-extraneous-dependencies': 'off',
			'import/no-unassigned-import': 'off',
			'generator-star-spacing': 'off',
			'operator-linebreak': 'off'
		})
		.setScript('format:xo', 'xo ./**/*.js')

	if (configValues.xoIgnores)
		pkg.set(
			'xo.ignores',
			concatAndDeDuplicate(
				pkg.get('xo.ignores', ['**/*.spec.js', '**/*.test.js']),
				configValues.xoIgnores
			)
		)

	if (configValues.globals)
		pkg.set(
			'xo.globals',
			concatAndDeDuplicate(
				pkg.get('xo.globals', ['$', 'co']),
				configValues.globals
			)
		)

	pkg.save()

	// Install
	install(['xo'], {dev: true})
}
