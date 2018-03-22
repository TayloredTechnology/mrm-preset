const finepack = require('finepack')
const {packageJson} = require('mrm-core')

const promisify = fn => (pkg, options) =>
	new Promise((resolve, reject) =>
		fn(pkg, options, (err, val) => (err ? reject(err) : resolve(val)))
	)

module.exports = () => {
	const pkg = packageJson()
	promisify(finepack)(pkg.get(), {})
		.then(res => pkg.set(res).save())
		.catch(console.error)
}
