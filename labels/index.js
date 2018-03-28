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
	const labelPurge = [
		{name: 'bug', color: ''},
		{name: 'duplicate', color: ''},
		{name: 'enhancement', color: ''},
		{name: 'good first issue', color: ''},
		{name: 'invalid', color: ''},
		{name: 'question', color: ''},
		{name: 'wontfix', color: ''}
	]

	const labelData = [
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
		{name: 'Type: Duplicate', color: '#ffffff'},
		{name: 'Type: Enhancement', color: '#84b6eb'},
		{name: 'Type: Maintenance', color: '#fbca04'},
		{name: 'Type: Question', color: '#cc317c'},
		{name: 'ʕノ•ᴥ•ʔノ ︵ ┻━┻', color: '#003366'}
	]
	const labels = json('git-labels.json', {labelData})

	if (!labels.exists())
		gitLabel
			.remove(labelConfig, labelPurge)
			.then(console.log)
			.catch(console.log)

	labels.merge(labelData).save()

	let gitLabelData = Object.keys(labels.get()).map(k => {
		if (k !== 'default') return labels.get()[k]
	})

	gitLabelData.pop()
	gitLabel
		.add(labelConfig, gitLabelData)
		.then(console.log)
		.catch(console.log)
}

module.exports.description = 'Assign Standard GitHub Labels'
