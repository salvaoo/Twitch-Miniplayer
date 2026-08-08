(() => {
  const AD_LABEL = '[data-a-target="video-ad-label"]';
  const PIP_CONTAINER = '[data-test-selector="picture-by-picture-player-container"]';
  const MUTE_BUTTON = '[data-a-target="player-mute-unmute-button"]';
  const WE_MUTED_KEY = 'twitch-miniplayer-we-muted';

  let muteAll = true;
  let adsActive = false;
  /** True only when this extension muted the main player for an ad. */
  let weMutedMain = sessionStorage.getItem(WE_MUTED_KEY) === '1';
  let savedVolume = 1;
  let checkScheduled = false;
  let lastUrl = location.href;

  function setWeMutedMain(value) {
    weMutedMain = value;
    if (value) {
      sessionStorage.setItem(WE_MUTED_KEY, '1');
    } else {
      sessionStorage.removeItem(WE_MUTED_KEY);
    }
  }

  function getPlayers() {
    const videos = document.getElementsByTagName('video');
    const pipContainer = document.querySelector(PIP_CONTAINER);
    const pipFromContainer = pipContainer?.querySelector('video') ?? null;

    // Same order the old extension relied on: [0] main/ad, [1] miniplayer.
    const mainVideo = videos[0] || null;
    const pipVideo = pipFromContainer || videos[1] || null;

    return { mainVideo, pipVideo, videos };
  }

  function adsArePlaying() {
    return document.querySelector(AD_LABEL) !== null;
  }

  function clickUnmuteButton() {
    const btn = document.querySelector(MUTE_BUTTON);
    if (!btn) return;
    const label = (btn.getAttribute('aria-label') || '').toLowerCase();
    if (label.includes('unmute')) {
      btn.click();
    }
  }

  function unmuteMain(mainVideo) {
    if (mainVideo) {
      mainVideo.muted = false;
    }
    clickUnmuteButton();
  }

  function enableMiniplayer(pipVideo) {
    if (!pipVideo) return;
    pipVideo.controls = true;
    pipVideo.muted = false;
    pipVideo.volume = savedVolume;
  }

  function enterAdMode() {
    const { mainVideo, pipVideo } = getPlayers();
    if (!mainVideo || !pipVideo) return false;

    adsActive = true;
    savedVolume = mainVideo.volume > 0 ? mainVideo.volume : savedVolume;

    // Only mute if the user hadn't already muted; remember we did it.
    if (muteAll && !mainVideo.muted) {
      mainVideo.muted = true;
      setWeMutedMain(true);
    }

    enableMiniplayer(pipVideo);
    return true;
  }

  /** Twitch often remutes the PiP after mount — keep forcing stream audio. */
  function maintainAdMode() {
    const { mainVideo, pipVideo } = getPlayers();
    if (!pipVideo) return;

    if (muteAll && weMutedMain && mainVideo && !mainVideo.muted) {
      mainVideo.muted = true;
    }

    enableMiniplayer(pipVideo);
  }

  function exitAdMode() {
    const { mainVideo, pipVideo } = getPlayers();

    // Wait until PiP is gone so we unmute the live player, not the ad element.
    if (pipVideo && document.querySelector(PIP_CONTAINER)) return false;

    if (weMutedMain) {
      if (!mainVideo) return false;
      unmuteMain(mainVideo);
      if (mainVideo.muted) return false;
      setWeMutedMain(false);
    }

    adsActive = false;
    return true;
  }

  function syncAdState() {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      adsActive = false;
    }

    const playingAds = adsArePlaying();

    if (playingAds) {
      if (!adsActive) {
        if (!enterAdMode()) {
          scheduleCheck();
        }
      } else {
        maintainAdMode();
      }
    } else if (adsActive || weMutedMain) {
      if (!exitAdMode()) {
        scheduleCheck();
      }
    }
  }

  function scheduleCheck() {
    if (checkScheduled) return;
    checkScheduled = true;
    requestAnimationFrame(() => {
      checkScheduled = false;
      syncAdState();
    });
  }

  chrome.storage.local.get({ muteAll: true }, (data) => {
    muteAll = data.muteAll !== false;
    syncAdState();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !changes.muteAll) return;
    muteAll = changes.muteAll.newValue !== false;
  });

  const observer = new MutationObserver(scheduleCheck);
  const startObserver = () => {
    if (!document.documentElement) return;
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    syncAdState();
  };

  // Keep PiP audio alive during ads; retry unmute after ads.
  setInterval(syncAdState, 500);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver, { once: true });
  } else {
    startObserver();
  }
})();
