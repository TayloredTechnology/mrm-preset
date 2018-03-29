const path = require('path')
const editorConfigToPrettier = require('editorconfig-to-prettier')
const {json, packageJson, install} = require('mrm-core')
const {getStyleForFile, getExtsFromCommand, lines} = require('mrm-core')

const defaultPattern = '**/*.{css,md}'
const defaultOverrides = [
	{
		files: '*.md',
		options: {
			printWidth: 70,
			useTabs: false,
			trailingComma: 'none',
			proseWrap: 'never'
		}
	}
]
const defaultPrettierOptions = {
	bracketSpacing: false,
	semi: false,
	singleQuote: true,
	tabWidth: 2,
	trailingComma: 'none',
	useTabs: true
}
const ignores = ['python_modules/']

module.exports = config => {
	const packages = ['prettier']

	const {indent, prettierPattern, prettierOptions, prettierOverrides} = config
		.defaults({
			indent: 'tab',
			prettierPattern: defaultPattern
		})
		.values()

	// Try to read options from EditorConfig
	const testJsFile = path.join(process.cwd(), 'test.js')
	const editorconfigOptions = editorConfigToPrettier(
		getStyleForFile(testJsFile)
	)

	const pkg = packageJson()

	const overrides = prettierOverrides || defaultOverrides
	const options = Object.assign(
		defaultPrettierOptions,
		prettierOptions
			? {}
			: {
					useTabs: indent === 'tab'
			  },
		editorconfigOptions,
		prettierOptions,
		overrides && {overrides}
	)

	// .prettierrc
	json('.prettierrc')
		.merge(options)
		.save()

	// Keep custom pattern
	let pattern = prettierPattern
	const formatScript = pkg.getScript('format:prettier')
	if (formatScript) {
		const exts = getExtsFromCommand(formatScript)
		if (exts) {
			pattern = `**/*.{${exts}}`
		}
	}

	pkg
		// Add format script
		.setScript('format:prettier', `prettier --write '${pattern}'`)
		// Add pretest script
		.save()

	// Ignores
	lines('.prettierignore', ignores).save()

	// Dependencies
	install(packages)
}

module.exports.description = 'Adds Prettier'
