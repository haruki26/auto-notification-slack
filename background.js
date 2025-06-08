import { config } from "./config.js";


function notify_slack(url, webHookUrl) {
    const payload = {
        text: `閲覧なう\n${url}`,
    };
    if (!webHookUrl) return;
    try {
        fetch(webHookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

function isNotInDenyList(url, denyList) {
    if (!denyList) return true;
    for (const item of denyList) {
        if (url.includes(item)) {
            return false;
        }
    }
    return true;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    chrome.tabs.query({ active: true, currentWindow: true })
        .then(async activeTab => {  
            switch (msg.name) {
                case 'confirm':
                    const url = activeTab[0].url;
                    const denyList = await config.denyList();
                    if (isNotInDenyList(url, denyList)) {
                        sendResponse({ url: url });
                        return;
                    }
                    break;
                case 'notify_slack':
                    const webHookUrl = await config.webHookUrl();
                    notify_slack(msg.url, webHookUrl);
                    break;
                default:
                    break;
            }
        });
    return true;
})
