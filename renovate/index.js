const {json} = require('mrm-core')

module.exports = () => {
	json('renovate.json', {
		default: {
			extends: ['@tayloredtechnology']
		}
	}).save()
}
