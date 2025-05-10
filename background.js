import { config } from "./config.js";


function notify_slack(url) {
    const payload = {
        text: `閲覧なう\n${url}`,
    };
    const webHookUrl = config.webHookUrl;

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
    };
}

function isNotInDenyList(url) {
    const denyList = config.denyList;
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
        .then(activeTab => {  
            switch (msg.name) {
                case 'confirm':
                    const url = activeTab[0].url;
                    if (isNotInDenyList(url)) {
                        sendResponse({ url: url });
                        return;
                    }
                    break;
                case 'notify_slack':
                    notify_slack(msg.url);
                    break;
                default:
                    break;
            }
        });
    return true;
})
