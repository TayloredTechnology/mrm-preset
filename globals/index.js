const installGlobal = require('npm-install-global')
const isGlobal = require('get-installed-path')

module.exports = () => {
	const globalInstalls = [
		'snyk',
		'redrun',
		'@tayloredtechnology/oneflow',
		'finepack',
		'authenticator',
		'nyc',
		'analyze-module-size',
		'authenticator-cli',
		'fastify-cli',
		'faucet',
		'knex-migrate',
		'meta',
		'npm-check',
		'onchange',
		'pnpm',
		'quasar-cli',
		'run-test'
	]

	const toInstall = []
	globalInstalls.map(install => {
		try {
			isGlobal.getInstalledPathSync(install, {
				local: false
			})
		} catch (err) {
			toInstall.push(install)
		}
		return true
	})

	if (toInstall.length > 0)
		installGlobal.install(toInstall, err => {
			if (err) throw err
		})

	// Additional manual steps to run
	if (toInstall.includes('snyk'))
		console.log('Sign into Snyk via `synk auth` to finish installing')
}

module.exports.description = 'Ensure Global toolset is installed'
