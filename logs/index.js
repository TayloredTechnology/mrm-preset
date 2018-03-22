const {install} = require('mrm-core')

module.exports = () => {
	const dependencies = ['debug', 'pino', 'pino-debug']

	// Install
	install(dependencies, {dev: false})
}
