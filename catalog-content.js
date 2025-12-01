button.addEventListener("click", () => {
  chrome.storage.local.get(['licenseValid'], function(result) {
    if (!result.licenseValid) {
      alert("❌ You must activate your license first.");
      return;
    }

    const url = window.location.href;
    const match = url.match(/(?:catalog|bundles|game-pass|gamepass)\/(\d+)/);

    if (match && match[1]) {
      const itemId = match[1];

      navigator.clipboard.writeText(itemId)
        .then(() => {
          console.log("✅ Copied item ID:", itemId);

          chrome.storage.local.get(["savedText"], function (result) {
            const savedLink = result.savedText?.trim();
            if (savedLink && savedLink.startsWith("http")) {
              chrome.runtime.sendMessage({ action: "openTab", url: savedLink });
            } else {
              alert("❌ Saved link is missing or invalid.");
            }
          });
        })
        .catch(err => {
          alert("❌ Failed to copy item ID: " + err);
        });
    } else {
      alert("❌ Could not find item ID in URL.");
    }
  });
});
