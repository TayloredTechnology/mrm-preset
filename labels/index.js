const {json, packageJson} = require('mrm-core')
const gitLabel = require('git-label')

const labelConfig = {
	api: 'https://api.github.com',
	repo: packageJson()
		.get('repository.url')
		.split('/')
		.splice(3, 4)
		.join('/')
		.replace('.git', ''),
	token: process.env.GITHUB_TOKEN
}

module.exports = () => {
	const labels = json('git-labels.json', {
		default: [
			{name: 'Status: Abandoned', color: '#000000'},
			{name: 'Status: Accepted', color: '#009800'},
			{name: 'Status: Available', color: '#bfe5bf'},
			{name: 'Status: Blocked', color: '#e11d21'},
			{name: 'Status: Completed', color: '#006b75'},
			{name: 'Status: In Progress', color: '#cccccc'},
			{name: 'Status: Pending', color: '#fef2c0'},
			{name: 'Status: Review Needed', color: '#fbca04'},
			{name: 'Status: Revision Needed', color: '#e11d21'},
			{name: 'Type: Bug', color: '#e11d21'},
			{name: 'Type: Maintenance', color: '#fbca04'},
			{name: 'Type: Enhancement', color: '#84b6eb'},
			{name: 'Type: Question', color: '#cc317c'},
			{name: '┻━┻ ︵ ლ(⌒-⌒ლ)', color: '#cc6699'}
		]
	})
	if (!labels.exists()) labels.save()

	gitLabel
		.add(labelConfig, labels.get().default)
		.then(console.log)
		.catch(console.log)
}

module.exports.description = 'Assign Standard GitHub Labels'
