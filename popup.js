document.addEventListener('DOMContentLoaded', function () {
  const output = document.getElementById('output');
  const savedText = document.getElementById('savedText');
  const saveBtn = document.getElementById('saveBtn');

  // Get license key from storage
  chrome.storage.local.get(['licenseKey', 'licenseValid'], function(result) {
    if (!result.licenseValid) {
      const key = prompt("Enter your license key to use this extension:");
      if (!key) {
        alert("License key is required.");
        return;
      }

      // Verify license key with backend
      fetch('https://activation-backend-yukn.onrender.com/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          chrome.storage.local.set({ licenseKey: key, licenseValid: true }, function() {
            alert("✅ License activated!");
            loadSavedLink();
          });
        } else {
          alert("❌ License invalid. Please enter a valid key.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("❌ License activation failed.");
      });
    } else {
      // License already valid
      loadSavedLink();
    }
  });

  function loadSavedLink() {
    chrome.storage.local.get(['savedText'], function (result) {
      if (result.savedText) {
        savedText.textContent = result.savedText;
        output.value = result.savedText;
      }
    });
  }

  // Save button - store textarea value
  saveBtn.addEventListener('click', function () {
    const text = output.value.trim();
    chrome.storage.local.get(['licenseValid'], function(result) {
      if (!result.licenseValid) {
        alert("❌ Cannot save link. License not activated.");
        return;
      }
      chrome.storage.local.set({ savedText: text }, function () {
        savedText.textContent = text;
      });
    });
  });
});
