const _getOfficialRate = async () => {
  const fetch = require('node-fetch');
  const keyRegex = new RegExp(/[\d=.]/gm);
  const valueRegex = new RegExp(/[a-zA-Z|=]/gm);
  const OfficialRates = new Map();

  // Make a fetch request
  await fetch('http://arkdedicated.com/dynamicconfig.ini', {
    method: 'GET',
  })
    .then(checkStatus)
    .then((res) => res.text())
    .then(async (body) => {
      const propterties = body.split('\r\n');
      for (let i = 0; i < propterties.length; i++) {
        const key = propterties[i].replace(keyRegex, '');
        const value = propterties[i].replace(valueRegex, '');

        await OfficialRates.set(key, value);
      }
    });

  // Return the results
  return OfficialRates;
};

/**
 * Checks the ARK wiki API for a 200 response
 * @param {*} res
 * @returns
 */
function checkStatus(res) {
  // res.status >= 200 && res.status < 300
  if (res.ok) {
    return res;
  } else {
    throw Error(res.statusText);
  }
}

module.exports = _getOfficialRate;
