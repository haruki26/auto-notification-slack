chrome.runtime.sendMessage({ name: 'confirm' })
    .then((response) => {
        if (response !== undefined) {
            const isOk = window.confirm(`このURLをSlackに送信しますか？\n${response.url}`);
            if (isOk) {
                chrome.runtime.sendMessage({
                    name: 'notify_slack',
                    url: response.url,
                });
            }
        }
    }
).catch(console.log);