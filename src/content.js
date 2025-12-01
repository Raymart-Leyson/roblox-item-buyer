// content.js
(function() {

  // ---- Click the Play button if it exists ----
  function clickPlayButton() {
    const container = document.querySelector("#game-details-play-button-container");
    if (!container) return false;

    const btn = container.querySelector("button:nth-child(1)");
    if (btn) {
      btn.click();
      console.log("✅ Play button clicked dynamically!");
      return true;
    }
    return false;
  }

  // ---- Wait for Play button, timeout by default 15s ----
  function waitForPlayButton(timeout = 15000, intervalTime = 300) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['savedText'], function(result) {
        const savedURL = (result.savedText || "").trim();
        const currentURL = window.location.href;

        if (!savedURL || savedURL !== currentURL) {
          console.warn("🚫 Current URL does not match saved link. Play button will not be clicked.");
          return reject("URL mismatch");
        }

        console.log("✅ URL matched. Waiting for Play button...");

        let elapsed = 0;
        const interval = setInterval(() => {
          if (clickPlayButton()) {
            clearInterval(interval);
            resolve(true);
          } else {
            elapsed += intervalTime;
            if (elapsed >= timeout) {
              clearInterval(interval);
              console.warn("⏰ Play button not found in time.");
              reject("Timeout");
            }
          }
        }, intervalTime);
      });
    });
  }

  // ---- Run on page load, safe with obfuscation ----
  window.addEventListener('load', () => {
    waitForPlayButton().catch(err => {
      console.log("ℹ Play button click skipped:", err);
    });
  });

})();
