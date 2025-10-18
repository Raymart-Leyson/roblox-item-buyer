function clickPlayButton() {
  const container = document.querySelector("#game-details-play-button-container");
  if (!container) {
    return false;
  }
  const btn = container.querySelector("button:nth-child(1)");
  if (btn) {
    btn.click();
    console.log("Play button clicked dynamically!");
    return true;
  }
  return false;
}

function waitForPlayButton(timeout = 15000, intervalTime = 300) {
  return new Promise((resolve, reject) => {
    let elapsed = 0;

    const interval = setInterval(() => {
      if (clickPlayButton()) {
        clearInterval(interval);
        resolve(true);
      } else {
        elapsed += intervalTime;
        if (elapsed >= timeout) {
          clearInterval(interval);
          console.log("Play button not found in time.");
          reject(false);
        }
      }
    }, intervalTime);
  });
}

// Run on page load
window.addEventListener('load', () => {
  waitForPlayButton().catch(() => {
    // Optionally, try MutationObserver fallback here if needed
  });
});
