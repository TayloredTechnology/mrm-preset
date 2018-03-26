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

	const templateDir = path.join(path.normalize(__dirname), '../templates/docco')

	template(configValues.readmeFile, path.join(templateDir, '/README.md'))
		.apply(configValues)
		.save()
	template('CONDUCT.md', path.join(templateDir, '/CONDUCT.md'))
		.apply(configValues)
		.save()
	template('issue_template.md', path.join(templateDir, '/issue_template.md'))
		.apply(configValues)
		.save()
	template(
		'pull_request_template.md',
		path.join(templateDir, '/pull_request_template.md')
	)
		.apply(configValues)
		.save()
	template('CONTRIBUTING.md', path.join(templateDir, '/CONTRIBUTING.md'))
		.apply(configValues)
		.save()
}

module.description = 'Default Markdown files'
