$(function () {
   $(window).bind('load', function () {
      let videos;
      let loop;
      let labelAd;
      var mute = 0;

      videos = document.getElementsByTagName('video');

      // const increaseMiniplayer = () => {
      //    document.querySelector('.tw-title').innerHTML = 'increasing..';
      //    $('main').attr('style', 'display: none !important');
      //    $('main').nextAll('div:first').css('width', '100%');
      //    $('.channel-root__right-column').css('width', '100%');
      //    $('.channel-root__right-column').css('transform', 'translateX(0) translateZ(0px)');
      // }
      // const decreaseMiniplayer = () => {
      //    document.querySelector('.tw-title').innerHTML = 'decreasing..';
      //    $('main').removeAttr('style');
      //    $('main').nextAll('div:first').css('width', 'fit-content');
      //    $('.channel-root__right-column').css('width', '34rem');
      //    $('.channel-root__right-column').css('transform', 'translateX(-34rem) translateZ(0px)');
      // }

      loop = setInterval(() => {
         chrome.storage.local.get(['muteAll'], function (result) {
            labelAd = $("[data-a-target=video-ad-label]");

            if (labelAd.length > 0) { // Ads running
               mute = 1;
               if (result.muteAll) { // if user checked "muted ads" button
                  if (videos[0].volume > 0) { // if main video is not muted
                     videos[0].muted = true; // MUTED
                  }
               }
               videos[1].muted = false; // set the volume in small window
               // videos[1].controls = true;
               videos[1].volume = videos[0].volume; // set the same volume than main video in small window
            } else if(mute == 1) { // Ads ended
               mute = 0;
               if (result.muteAll) {
                  videos[0].muted = false; // UNMUTED
               }
            }
         });
      }, 1000)
   });
});