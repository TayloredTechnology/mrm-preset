const {install, packageJson} = require('mrm-core')

module.exports = config => {
	const {coverage, codecovToken} = config
		.defaults({
			coverage: {
				branches: 50,
				functions: 50,
				lines: 90,
				statements: 50
			},
			codecovToken: ''
		})
		.values()

	const pkg = packageJson()
	const packages = [
		'fastest-validator',
		'is-installed',
		'tap-lochnest',
		'tape',
		'tape-promise',
		'per-env',
		'redrun'
	]
	const devPackages = [
		'chuhai',
		'clear-require',
		'codecov',
		'faker',
		'nyc',
		'tap-summary',
		'tape-index',
		'tap-dot',
		'testdouble'
	]

	const coverageOptions = Object.keys(coverage).map(
		item => `--${item}=${coverage[item]}`
	)

	// Package.json
	pkg
		.setScript('test', 'per-env')
		.setScript(
			'test:api',
			"nyc --cache --per-file --silent tape '{,!(node_modules)/**/}*.?(api).js' | tap-dot"
		)
		.setScript(
			'test:development',
			"nyc --cache --per-file --silent tape '{,!(node_modules)/**/}*.?(spec|sanity).js' | tap-dot"
		)
		.setScript(
			'test:sanity',
			"nyc --cache --per-file --silent tape '{,!(node_modules)/**/}*.?(sanity).js' | tap-dot"
		)
		.setScript(
			'test:ci',
			"nyc --cache --per-file --silent tape '{,!(node_modules)/**/}*.?(spec|sanity|api).js' | tap-dot"
		)
		.setScript('posttest:ci', 'redrun -p codecov:*')
		.setScript(
			'codecov:check',
			`nyc check-coverage ${coverageOptions.join(' ')}`
		)
		.setScript(
			'codecov:generate',
			'nyc report --reporter=text-lcov > coverage.lcov'
		)
		.setScript('codecov:report', 'nyc report --reporter=text')
		.setScript('codecov:upload', `codecov -t ${codecovToken}`)
		.setScript(
			'prestart:production',
			"tape '{,!(node_modules)/**/}*.?(sanity|api).js' | tap-dot"
		)
		.setScript('posttest', 'redrun -p codecov:report codecov:check')
		.save()

	// Install
	install(devPackages, {dev: true})
	install(packages, {dev: false})
}

module.exports.description =
	'Enable Test Framework for Development & Production sanity checks'
