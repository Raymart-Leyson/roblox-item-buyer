document.addEventListener('DOMContentLoaded', function () {
  const output = document.getElementById('output');
  const savedText = document.getElementById('savedText');
  const saveBtn = document.getElementById('saveBtn');
  const licenseInput = document.getElementById('licenseInput');
  const activateBtn = document.getElementById('activateBtn');
  const licenseStatus = document.getElementById('licenseStatus');

  let isLicensed = false;

  // Load saved link and license status
  chrome.storage.local.get(['savedText', 'licenseValid'], function (result) {
    if (result.savedText) {
      savedText.textContent = result.savedText;
      output.value = result.savedText;
    }
    if (result.licenseValid) {
      isLicensed = true;
      licenseStatus.textContent = "✅ License active";
    }
  });

  // Save link
  saveBtn.addEventListener('click', function () {
    if (!isLicensed) {
      alert("❌ You must activate a license first.");
      return;
    }
    const text = output.value.trim();
    chrome.storage.local.set({ savedText: text }, function () {
      savedText.textContent = text;
    });
  });

  // Activate license
  activateBtn.addEventListener('click', async function () {
    const key = licenseInput.value.trim();
    if (!key) return alert("❌ Please enter a license key.");

    try {
      const response = await fetch("https://activation-backend-yukn.onrender.com/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key })
      });
      const data = await response.json();

      if (data.success) {
        isLicensed = true;
        chrome.storage.local.set({ licenseValid: true }, () => {
          licenseStatus.textContent = "✅ License active";
          alert("License activated successfully!");
        });
      } else {
        alert("❌ License activation failed: " + (data.message || "Invalid key"));
      }
    } catch (err) {
      alert("❌ License activation error: " + err);
    }
  });
});
