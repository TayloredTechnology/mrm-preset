const {packageJson, install} = require('mrm-core')

module.exports = () => {
	const devPackages = [
		'@commitlint/cli',
		'@commitlint/config-conventional',
		'@commitlint/lint',
		'@commitlint/prompt-cli',
		'husky'
	]

	// Package.json
	packageJson()
		.setScript('commit', 'commit')
		.setScript('precommit', 'redrun -p format:*')
		.set('commitlint', {extends: ['@commitlint/config-conventional']})
		.save()

	// Install
	install(devPackages, {dev: true})
}

module.exports.description = 'Enable Commit Guards'
