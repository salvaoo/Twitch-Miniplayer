let version = "1.0"
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

   // fetch('https://raw.githubusercontent.com/LasTechLabs/ttv-ad-compromiser/main/manifest.json')
   // 	.then(response => response.json())
   // 	.then(data => {
   // 		if (data.version != version) {
   // 			document.getElementsByClassName("hidden")[0].classList.remove('hidden')
   // 		}
   // 	});
})