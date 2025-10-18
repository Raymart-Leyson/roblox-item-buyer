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
});
