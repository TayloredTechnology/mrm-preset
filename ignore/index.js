const fs = require('fs')
const {lines} = require('mrm-core')

module.exports = () => {
	const remove = ['node_modules']
	const add = [
		'.nyc_output/',
		'coverage.lcov',
		'*.log',
		'*.sublime-project',
		'*.sublime-workspace',
		'.DS_Store',
		'.idea/',
		'.nyc_output/',
		'.vscode/',
		'Thumbs.db',
		'coverage.lcov',
		'node_modules/',
		'python_modules/'
	]

	// If project uses npm, ignore yarn.lock
	if (fs.existsSync('package-lock.json')) {
		add.push('yarn.lock')
		remove.push('package-lock.json')
	}

	// If project uses Yarn, ignore package-lock.json
	if (fs.existsSync('yarn.lock')) {
		remove.push('yarn.lock')
		add.push('package-lock.json')
	}

	// .gitignore
	lines('.gitignore')
		.remove(remove)
		.add(add)
		.save()

	// .ignore
	lines('.ignore')
		.add(['node_modules/', '.git/', 'package-lock.json', 'python_modules'])
		.save()
}

module.exports.description = 'Adds ignorefiles'
