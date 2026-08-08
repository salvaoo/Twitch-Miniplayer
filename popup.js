window.addEventListener('click', (e) => {
  if (e.target.href !== undefined) {
    chrome.tabs.create({ url: e.target.href });
  }
});

window.addEventListener('load', () => {
  const muteAllInput = document.getElementById('mute_all_ads');
  const versionEl = document.getElementById('version');

  if (versionEl) {
    versionEl.textContent = `v.${chrome.runtime.getManifest().version}`;
  }

  chrome.storage.local.get({ muteAll: true }, (data) => {
    muteAllInput.checked = data.muteAll !== false;
  });

  muteAllInput.addEventListener('change', (e) => {
    chrome.storage.local.set({ muteAll: e.target.checked });
  });
});
