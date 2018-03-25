const {packageJson, install} = require('mrm-core')
const execa = require('execa')
const ora = require('ora')()

module.exports = () => {
	const devDependencies = ['nopy', 'jsdoc']

	// Package.json
	packageJson()
		.setScript('docco', '')
		.setScript('nopenv', 'nopenv')
		.setScript('nopy', 'nopy')
		.setScript('install', 'npip install')
		.setScript('npip', 'npip')
		.set('python', {
			dependencies: {
				mkdocs: '>=0/16/3',
				'mkdocs-material': '>=1.8.1',
				'pymdown-extensions': '>=3.5',
				Pygments: '>=2.2.0',
				'sphinx-js': '>=2.4',
				Sphinx: '>=1.7.2',
				mkinx: '>=0.1.7.2'
			}
		})
		.save()

	// Install
	install(devDependencies, {
		dev: true
	})

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

module.description = 'Meta Documentation Management & Generation Config'
