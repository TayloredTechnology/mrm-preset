/* eslint camelcase: 0 */
const {ini} = require('mrm-core')

const mdRules = {
	trim_trailing_whitespace: false
}

const mdExtensions = ['md']

const jsonRules = {
	indent_style: 'space',
	indent_size: 2
}
const jsonExtensions = ['json', 'yml', 'njk']

function task(config) {
	const {indent} = config.defaults({indent: 'tab'}).values()

	const generalRules = Object.assign(
		indent === 'tab'
			? {
					indent_style: 'tab',
					indent_size: 2
			  }
			: {
					indent_style: 'space',
					indent_size: indent
			  },
		{
			end_of_line: 'lf',
			charset: 'utf-8',
			trim_trailing_whitespace: true,
			insert_final_newline: true
		}
	)

	// .editorconfig
	const editorconfig = ini('.editorconfig', 'editorconfig.org')
	editorconfig.set('_global', {root: true}).set('*', generalRules)

	// Set/update JSON-like section
	const jsonSection = editorconfig.get().find(section => /json/.test(section))
	if (jsonSection) {
		editorconfig.unset(jsonSection)
	}

	if (indent !== jsonRules.indent_size) {
		editorconfig.set('*.{' + jsonExtensions.join(',') + '}', jsonRules)
	}

	// Set/update MD-like section
	const mdSection = editorconfig.get().find(section => /md/.test(section))
	if (mdSection) {
		editorconfig.unset(mdSection)
	}

	editorconfig.set('*.{' + mdExtensions.join(',') + '}', mdRules)

	editorconfig.save()
}

task.description = 'Adds EditorConfig'
module.exports = task
