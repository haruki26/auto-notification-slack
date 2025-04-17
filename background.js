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

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    chrome.tabs.query({ active: true, currentWindow: true })
        .then(activeTab => {  
            switch (msg.name) {
                case 'confirm':
                    sendResponse({
                        url: activeTab[0].url,
                    })
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