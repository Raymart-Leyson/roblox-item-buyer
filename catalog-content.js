function createExtensionBuyButton() {
  const button = document.createElement("button");
  button.textContent = "Buy with Extension";
  button.className = "shopping-cart-buy-button btn-growth-lg PurchaseButton";
  button.style.marginTop = "8px"; // Add spacing
  button.id = "extension-buy-button";

  button.addEventListener("click", () => {
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
              // Open new tab with saved link
              chrome.runtime.sendMessage({ action: "openTab", url: savedLink }, (response) => {
                // After opening new tab, try to click play button on current page
                if (typeof clickPlayButton === "function") {
                  if (clickPlayButton()) {
                    console.log("Play button clicked after opening saved link.");
                  } else {
                    console.warn("Play button not found after opening saved link.");
                  }
                }
              });
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

  return button;
}

function injectExtensionBuyButton() {
  const container = document.querySelector(".price-info.row-content");
  if (!container) return;

  // Prevent duplicate button
  if (document.getElementById("extension-buy-button")) return;

  const purchaseContainer = container.querySelector(".item-purchase-btns-container");
  if (!purchaseContainer) return;

  const buttonWrapper = document.createElement("div");
  buttonWrapper.className = "btn-container";

  const button = createExtensionBuyButton();

  buttonWrapper.appendChild(button);
  purchaseContainer.appendChild(buttonWrapper);
  console.log("✅ Extension buy button added.");
}

function observePageChanges() {
  const targetNode = document.body;

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) { // ELEMENT_NODE
          if (
            (node.matches && node.matches(".price-info.row-content")) ||
            (node.querySelector && node.querySelector(".price-info.row-content"))
          ) {
            injectExtensionBuyButton();
          }
        }
      }
    }
  });

  observer.observe(targetNode, {
    childList: true,
    subtree: true,
  });

  // Also try injection immediately on load
  injectExtensionBuyButton();
}

window.addEventListener("load", () => {
  observePageChanges();
});
