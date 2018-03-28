const {template, packageJson, install} = require('mrm-core')
const path = require('upath')

module.exports = config => {
	// Package.json
	const pkg = packageJson()

	// Templates
	const configValues = config
		.defaults({
			project: pkg.get('name'),
			version: pkg.get('version'),
			versionShort: pkg
				.get('version')
				.match(/^.*[0-9]\.[0-9]+?/)[0]
				.split('.')
				.slice(0, 2)
				.join('.'),
			author: pkg.get('author.name')
		})
		.values()

	const templateDir = path.join(path.normalize(__dirname), '../templates/')

	const templateFiles = [
		'README.md',
		'CONDUCT.md',
		'issue_template.md',
		'pull_request_template.md',
		'CONTRIBUTING.md'
	]

	templateFiles.map(item => {
		const itemTemplate = template(item, path.join(templateDir, item))
		if (!itemTemplate.exists()) itemTemplate.apply(configValues).save()
	})
}

module.description = 'Default Markdown files only creates if not present'
