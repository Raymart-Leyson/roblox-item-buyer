// catalog-content.js

function createExtensionBuyButton() {
  const button = document.createElement("button");
  button.textContent = "Buy with Extension";

  // Use Roblox's button class for same size/style
  button.className = "btn-primary-lg"; // matches Add to cart
  button.type = "button";
  button.style.width = "364px";
  button.style.backgroundColor = "#0082c9"; // Roblox blue
  button.id = "extension-buy-button";

  // Optional: Add spacing if needed
  button.style.marginTop = "4px";

  button.addEventListener("click", () => {
    chrome.storage.local.get(["licenseValid"], function (result) {
      if (!result.licenseValid) {
        alert("❌ You must activate a license before using this button.");
        return;
      }

      const url = window.location.href;
      const match = url.match(/(?:catalog|bundles|game-pass|gamepass)\/(\d+)/);

      if (match && match[1]) {
        const itemId = match[1];

        navigator.clipboard.writeText(itemId)
          .then(() => {
            console.log("✅ Copied item ID:", itemId);

            chrome.storage.local.get(["savedText"], function (res) {
              const savedLink = (res.savedText || "").trim();
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

  return button;
}


function injectExtensionBuyButton() {
  // Target the specific Roblox container
  const container = document.querySelector(
    "#item-details > div.price-row-container > div > div > div.price-info.row-content"
  );

  if (!container) return;

  // Prevent duplicate button
  if (document.getElementById("extension-buy-button")) return;

  const buttonWrapper = document.createElement("div");
  buttonWrapper.className = "btn-container";

  const button = createExtensionBuyButton();
  buttonWrapper.appendChild(button);
  container.appendChild(buttonWrapper);

  console.log("✅ Extension buy button added.");
}

function observePageChanges() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1 && node.querySelector) {
          if (node.querySelector(
            "#item-details > div.price-row-container > div > div > div.price-info.row-content"
          )) {
            injectExtensionBuyButton();
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Try injection immediately on load
  injectExtensionBuyButton();
}

// Run on page load
window.addEventListener("load", () => {
  observePageChanges();
});
