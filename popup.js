let version = "1.2.1"
let inpt_muteAll;

window.addEventListener('click', function (e) {
   if (e.target.href !== undefined) {
      chrome.tabs.create({ url: e.target.href })
   }
})

window.addEventListener('load', () => {
   inpt_muteAll = document.getElementsByTagName('input')[0]
   inpt_muteAll.checked = chrome.storage.local.get({ muteAll: true }, function (data) {
      inpt_muteAll.checked = data.muteAll
   });

   inpt_muteAll.addEventListener('change', (e) => {
      // Changing the value from checkbox (mute ads)
      if (e.target.checked) {
         chrome.storage.local.set({ muteAll: true }, function () {
            console.log('Value is set to ' + true);
         });
      } else if (!e.target.checked) {
         chrome.storage.local.set({ muteAll: false }, function () {
            console.log('Value is set to ' + false);
         });
      }
   })
})