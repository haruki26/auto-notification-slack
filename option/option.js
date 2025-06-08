const webhookInput = document.getElementById('webhookUrl');
const saveWebhookBtn = document.getElementById('saveWebhook');
const denyListDiv = document.getElementById('denyList');
const denyInput = document.getElementById('denyInput');
const addDenyBtn = document.getElementById('addDeny');

// 初期表示
function loadSettings() {
    chrome.storage.local.get(['webHookUrl', 'denyList'], (result) => {
        webhookInput.value = result.webHookUrl || '';
        renderDenyList(result.denyList || []);
    });
}

// webhook保存
saveWebhookBtn.onclick = () => {
    const url = webhookInput.value.trim();
    chrome.storage.local.set({ webHookUrl: url }, () => {
        alert('Webhook URL保存しました');
    });
};

// denyList表示
function renderDenyList(list) {
    denyListDiv.innerHTML = '';
    list.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = 'deny-item';
        row.innerHTML = `<span>${item}</span><button data-idx="${idx}">削除</button>`;
        row.querySelector('button').onclick = function() {
            removeDeny(idx);
        };
        denyListDiv.appendChild(row);
    });
}

// denyList追加
addDenyBtn.onclick = () => {
    const value = denyInput.value.trim();
    if (!value) return;
    chrome.storage.local.get(['denyList'], (result) => {
        const list = result.denyList || [];
        if (list.includes(value)) {
            alert('既にリストに入っています');
            return;
        }
        list.push(value);
        chrome.storage.local.set({ denyList: list }, () => {
            denyInput.value = '';
            renderDenyList(list);
        });
    });
};

// denyList削除
function removeDeny(idx) {
    chrome.storage.local.get(['denyList'], (result) => {
        const list = result.denyList || [];
        list.splice(idx, 1);
        chrome.storage.local.set({ denyList: list }, () => {
            renderDenyList(list);
        });
    });
}

loadSettings();
