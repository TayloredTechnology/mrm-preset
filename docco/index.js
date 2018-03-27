const {template, packageJson, install} = require('mrm-core')
const execa = require('execa')
const ora = require('ora')()
const mkdirp = require('mkdirp')
const path = require('upath')

module.exports = config => {
	const devDependencies = ['commentizer', 'nopy', 'jsdoc']

	// Install
	install(devDependencies, {
		dev: true
	})

	// Package.json
	const pkg = packageJson()
		.setScript('docco', 'commentizer ./app/**/*.js !./app/**/*.*.js')
		.setScript('nopenv', 'nopenv')
		.setScript('nopy', 'nopy')
		.setScript('install', 'npip install')
		.setScript('npip', 'npip')
		.set('python', {
			dependencies: {
				'sphinx-js': '>=2.4',
				Sphinx: '>=1.7.2'
			}
		})
		.save()

	// Template/s
	const doccoDir = 'docs'
	const dirs = ['_build', '_static', '_templates']
	dirs.map(dir =>
		mkdirp.sync(path.normalize(process.cwd()) + '/' + doccoDir + '/' + dir)
	)

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

	template(doccoDir + '/conf.py', path.join(templateDir, '/conf.py'))
		.apply(configValues)
		.save()
	template(doccoDir + '/index.rst', path.join(templateDir, '/index.rst'))
		.apply(configValues)
		.save()
	template(doccoDir + '/make.bat', path.join(templateDir, '/make.bat'))
		.apply(configValues)
		.save()
	template(doccoDir + '/Makefile', path.join(templateDir, '/Makefile'))
		.apply(configValues)
		.save()

	// Install PIP Libraries
	ora.start('Installing PIP Libraries')
	try {
		execa.sync('npm', ['run', 'npip', 'install'])
		ora.succeed().stop()
	} catch (err) {
		ora.fail().stop()
		console.error(err)
	}
}

module.description = 'Documentation Management & Generation Config'
