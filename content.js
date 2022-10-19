$(function () {
   $(window).bind('load', function () {
      let videos;
      let loop;

      clearInterval(loop);

      loop = setInterval(() => {
         chrome.storage.local.get(['muteAll'], function (result) {
            videos = document.getElementsByTagName('video');
            // mute_button = $("[data-a-target=player-mute-unmute-button]");

            if (videos.length > 1) { // running ads
               if (!videos[1].src) { // the ads ended
                  if (videos[0].muted) { // if the main video is muted
                     videos[0].muted = false; // UNMUTED
                  }
               } else { // The ads are running
                  if (result.muteAll) { // if user checked "muted ads" button
                     if (!videos[0].muted) { // if main video is not muted
                        videos[0].muted = true; // MUTED
                     }
                  }
                  videos[1].muted = false; // set the volume in small window
                  // videos[1].controls = true;
                  videos[1].volume = videos[0].volume; // set the same volume than main video in small window
               }
            }
         });
      }, 1000)
   });
});