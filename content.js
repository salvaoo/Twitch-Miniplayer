$(function () {
   $(window).bind('load', function () {
      let videos;
      let loop;
      var mute = 0;

      videos = document.getElementsByTagName('video');

      loop = setInterval(() => {
         chrome.storage.local.get(['muteAll'], function (result) {
            // mute_button = $("[data-a-target=player-mute-unmute-button]");

            if (videos.length > 1) { // 2 videos in site
               if (!videos[1].src && mute == 1) { // the ads ended
                  mute = 0;
                  if (result.muteAll) {
                     videos[0].muted = false; // UNMUTED
                  }
               } else { 
                  if (videos[1].src) { // ads running
                     mute = 1;
                     if (result.muteAll) { // if user checked "muted ads" button
                        if (videos[0].volume > 0) { // if main video is not muted
                           videos[0].muted = true; // MUTED
                           // mute_button.click();
                        }
                     }
                     videos[1].muted = false; // set the volume in small window
                     // videos[1].controls = true;
                     videos[1].volume = videos[0].volume; // set the same volume than main video in small window
                  }
               }
            }
         });
      }, 1000)
   });
});