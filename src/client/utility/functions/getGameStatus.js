/* eslint-disable no-unused-vars */
// Import the fetch library
const fetch = require('node-fetch');


const _getGameStatus = async (client) => {
	try {
		setInterval(async () => {
			fetch('http://arkdedicated.com/officialserverstatus.ini', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then(res => res.text())
				.then(data => formatGameStatus(data))
				.then(status => {
					client.user.setActivity(`ARK: ${status}`, {
						type: 'WATCHING',
					});
				})
				.catch(O_o => '');
		}, 30000);
	}
	catch (e) {
		console.log(e);
	}
};

/**
 * The formatGameStatus function cleans up the data returned
 * from the ARK official server status API.
 */
function formatGameStatus(string) {
	const first = string.search(/>/);
	const second = string.search(/<\/>/);
	const filtered_content = string.substring(first, second)
		.replace(/(<|>|<\/>|\/)/gm, '')
		.trim();
	const status = filtered_content
		.replace(/(>|\(|\))/g, ' ')
		.replace('RichColor Color="1, 0.6, 1, 1"', '')
		.replace('ARK Evolution is now acti', '');
	return status;
}

module.exports = _getGameStatus;