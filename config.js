const _loadConfig = async (key) => {
    return new Promise((resolve) => {
        chrome.storage && chrome.storage.local.get(key, (result) => {
            resolve(result[key]);
        });
    });
}

const loadWebHookUrl = async () =>  await _loadConfig('webHookUrl');
const loadDenyList = async () =>  await _loadConfig('denyList');

export const config = {
    webHookUrl: loadWebHookUrl,
    denyList: loadDenyList,
}
