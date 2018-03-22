const {packageJson, install} = require('mrm-core')

module.exports = config => {
	const {coverage} = config
		.defaults({
			coverage: {
				branches: 50,
				functions: 50,
				lines: 90,
				statements: 50
			}
		})
		.values()
	const coverageOptions = Object.keys(coverage).map(
		item => `--${item}=${coverage[item]}`
	)

	const devPackages = [
		'@commitlint/cli',
		'@commitlint/config-conventional',
		'@commitlint/lint',
		'@commitlint/prompt-cli',
		'lint-staged'
	]

	// Package.json
	const pkg = packageJson()
		.setScript('commit', 'commit')
		.setScript('format', 'redrun -p format:*')
		.set('commitlint', {extends: ['@commitlint/config-conventional']})
		.set('husky', {
			hooks: {
				'pre-commit': 'lint-staged',
				'commit-msg': 'commitlint -e $GIT_PARAMS'
			}
		})

	if (pkg.getScript('test') === 'undefined') {
		pkg.set('lint-staged', {
			'*.{js}': ['xo', 'git add'],
			'*.{css,md}': ['prettier --write', 'git add']
		})
	} else {
		pkg.set('lint-staged', {
			'*.{spec,sanity,api}.js': [
				`nyc --per-file --check-coverage ${coverageOptions.join(' ')} tape`
			],
			'*.{js}': ['xo', 'git add'],
			'*.{css,md}': ['prettier --write', 'git add']
		})
	}
	pkg.save()

	// Install
	install(devPackages, {dev: true})
	install('husky', 'next', {dev: true})
}

module.exports.description = 'Enable Commit Guards & Commit Linting'