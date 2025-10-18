document.addEventListener('DOMContentLoaded', function () {
  const output = document.getElementById('output');
  const savedText = document.getElementById('savedText');
  const saveBtn = document.getElementById('saveBtn');
  const buyBtn = document.getElementById('buyBtn');

  // Load saved link into textarea and display
  chrome.storage.local.get(['savedText'], function (result) {
    if (result.savedText) {
      savedText.textContent = result.savedText;
      output.value = result.savedText;
    }
  });

  // Save button - store textarea value
  saveBtn.addEventListener('click', function () {
    const text = output.value.trim();
    chrome.storage.local.set({ savedText: text }, function () {
      savedText.textContent = text;
    });
  });

  // Buy button logic
  buyBtn.addEventListener('click', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    const url = currentTab.url;

    const match = url.match(/(?:catalog|bundles|game-pass|gamepass)\/(\d+)/);
    if (match && match[1]) {
      const itemId = match[1];

      navigator.clipboard.writeText(itemId).then(() => {
        console.log('Item ID copied to clipboard:', itemId);

        chrome.storage.local.set({ selectedItemId: itemId }, function () {
          chrome.storage.local.get(['savedText'], function (result) {
            const savedLink = result.savedText?.trim();

            if (savedLink && savedLink.startsWith("http")) {
              chrome.tabs.create({ url: savedLink });
            } else {
              alert("Saved link is missing or invalid.");
            }
          });
        });
      }).catch(err => {
        alert('Failed to copy item ID: ' + err);
      });

    } else {
      alert("No valid item ID found in the current tab URL.");
    }
  });
  });
});
