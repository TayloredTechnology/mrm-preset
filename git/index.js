const {packageJson, install} = require('mrm-core')

module.exports = () => {
	const devPackages = [
		'@commitlint/cli',
		'@commitlint/config-conventional',
		'@commitlint/lint',
		'@commitlint/prompt-cli',
		'lint-staged'
	]

	// Package.json
	packageJson()
		.setScript('commit', 'commit')
		.setScript('commitmsg', 'commitlint -e $GIT_PARAMS')
		.setScript('format', 'redrun -p format:*')
		.set('commitlint', {extends: ['@commitlint/config-conventional']})
		.set('lint-staged', {
			'*.{js}': ['xo', 'git add'],
			'*.{css,md}': ['prettier --write', 'git add']
		})
		.set('husky', {hooks: {'pre-commit': 'lint-staged'}})
		.save()

	// Install
	install(devPackages, {dev: true})
	install('husky', 'next', {dev: true})
}

module.exports.description = 'Enable Commit Guards'
