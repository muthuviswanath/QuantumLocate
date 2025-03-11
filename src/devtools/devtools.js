// Ensure QuantumLocate sidebar opens automatically in the Elements tab
chrome.devtools.panels.elements.createSidebarPane("QuantumLocate", function (sidebar) {
    sidebar.setPage("src/devtools/devtools.html");
    sidebar.onShown.addListener(function (window) {
      console.log("✅ QuantumLocate Sidebar Automatically Opened.");
    });
  });

  // ✅ Listen for messages from background.js
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "elementSelected") {
        console.log("📌 Element Data Received in DevTools:", message);
    }
});

document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ QuantumLocate DevTools Loaded");

  // ✅ Ensure communication with background script
  chrome.runtime.sendMessage({ action: "devtoolsOpened" });

  // ✅ Listen for messages from content.js
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "updateQuantumLocatePanel" && message.locators) {
          console.log("✅ Locators Received:", message.locators);
          populateTable(message.locators);
      }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ QuantumLocate DevTools Loaded");

  // ✅ Force request for updated locators
  chrome.runtime.sendMessage({ action: "devtoolsOpened" });

    // ✅ Listen for messages from content.js
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log("📩 Message received in devtools.js:", message);
      if (message.action === "updateQuantumLocatePanel" && message.locators) {
          console.log("✅ Updating table with new locators...");
          populateTable(message.locators);
      }
  });
});

// ✅ Function to populate the locator table with only valid locators
function populateTable(locators) {
  const table = document.getElementById("locators-table").getElementsByTagName("tbody")[0];
  if (!table) {
      console.error("❌ Locator table not found!");
      return;
  }

  table.innerHTML = ""; // ✅ Clear previous results

  Object.entries(locators).forEach(([locatorType, locatorData]) => {
      if (locatorData && locatorData.selector !== "N/A" && locatorData.count > 0) {  // ✅ Filter out 0 or undefined matches
          let row = table.insertRow();
          let cell1 = row.insertCell(0);
          let cell2 = row.insertCell(1);
          let cell3 = row.insertCell(2);
          let cell4 = row.insertCell(3);

          // ✅ Display Locator Type
          cell1.textContent = locatorType;

          // ✅ Display Locator Value
          cell2.textContent = locatorData.selector;

          // ✅ Create Bootstrap Pill Badge for Match Count
          let badge = document.createElement("span");
          badge.classList.add("badge", "rounded-pill", "text-white", "p-2");
          badge.textContent = `${locatorData.count}`;

          // ✅ Assign color based on count
          if (locatorData.count === 1) {
              badge.classList.add("bg-success"); // ✅ Green for unique locator
          } else {
              badge.classList.add("bg-danger"); // 🔴 Red for multiple matches
          }

          cell3.appendChild(badge);

          // ✅ Copy Button
          let copyButton = document.createElement("button");
          copyButton.textContent = "Copy";
          copyButton.classList.add("copy-btn", "btn", "btn-sm", "btn-outline-primary");

          copyButton.onclick = function () {
              copyToClipboard(locatorData.selector, locatorType);
          };

          cell4.appendChild(copyButton);
      }
  });

  console.log("✅ Table updated successfully with pill badges.");
}


// ✅ Function to copy text to clipboard (Fixed)
function copyToClipboard(text, locatorType) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  console.log(`✅ Copied: ${locatorType}`);
  showCopyMessage(locatorType);
}

// ✅ Function to show a confirmation message inside the QuantumLocate panel
function showCopyMessage(locatorType) {
  let messageBox = document.getElementById("copy-message");

  // ✅ If message box doesn't exist, create one inside QuantumLocate panel
  if (!messageBox) {
      messageBox = document.createElement("div");
      messageBox.id = "copy-message";
      messageBox.style.position = "absolute";
      messageBox.style.bottom = "10px";
      messageBox.style.right = "10px";
      messageBox.style.backgroundColor = "#28a745";
      messageBox.style.color = "white";
      messageBox.style.padding = "10px 15px";
      messageBox.style.borderRadius = "6px";
      messageBox.style.fontSize = "14px";
      messageBox.style.fontWeight = "bold";
      messageBox.style.zIndex = "9999";
      messageBox.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
      messageBox.style.transition = "opacity 0.5s ease-in-out";
      document.body.appendChild(messageBox);
  }

  messageBox.textContent = `Copied: ${locatorType}`;
  messageBox.style.display = "block";
  messageBox.style.opacity = "1";

  // ✅ Hide the message after 2 seconds
  setTimeout(() => {
      messageBox.style.opacity = "0";
      setTimeout(() => {
          messageBox.style.display = "none";
      }, 500);
  }, 2000);
}






// for validating the xpath or css entered manually

document.getElementById("findElement").addEventListener("click", function() {
  
    document.querySelectorAll(".highlighted-element, .context-highlight").forEach(el => {
        console.log(el);
        el.style.outline = "";
        el.classList.remove("highlighted-element", "context-highlight");
      });

    const selector = document.getElementById("selectorInput").value;
    chrome.scripting.executeScript({
      target: {tabId: chrome.devtools.inspectedWindow.tabId},
      function: highlightElements,
      args: [selector]
    });
  });
  
  function highlightElements(selector) {
    // Remove previous highlights including context menu highlights
  
  document.querySelectorAll(".highlighted-element, .context-highlight").forEach(el => {
    console.log(el);
    el.style.outline = "";
    el.classList.remove("highlighted-element", "context-highlight");
  });
  
    let elements;
    try {
      if (selector.startsWith("//")) {
        elements = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (elements.snapshotLength > 0) {
          elements.snapshotItem(0).style.outline = "2px solid green";
          elements.snapshotItem(0).classList.add("highlighted-element");
          for (let i = 1; i < elements.snapshotLength; i++) {
            elements.snapshotItem(i).style.outline = "2px solid blue";
            elements.snapshotItem(i).classList.add("highlighted-element");
          }
        }
      } else {
        elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          elements[0].style.outline = "2px solid green";
          elements[0].classList.add("highlighted-element");
          elements.forEach((el, index) => {
            if (index > 0) {
              el.style.outline = "2px solid blue";
              el.classList.add("highlighted-element");
            }
          });
        }
      }
    } catch (error) {
      console.error("Invalid selector", error);
    }
  }











  document.addEventListener("DOMContentLoaded", function () {
    // Wait for the DevTools panel to load
    const inputField = document.querySelector("#selectorInput");
    const messageElement = document.querySelector("#validationMessage");

    if (!inputField || !messageElement) return;

    // Function to validate XPath syntax
    const isValidXPath = (xpath) => {
        try {
            document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
            return true;
        } catch (e) {
            return false;
        }
    };

    // Function to validate CSS selector syntax
    const isValidCSS = (css) => {
        try {
            document.querySelector(css);
            return true;
        } catch (e) {
            return false;
        }
    };

    // Event listener for real-time validation
    inputField.addEventListener("input", function () {
        const value = inputField.value.trim();
        let isValid = false;
        let message = "Invalid syntax.";

        if (value.startsWith("/") || value.startsWith("//")) {
            isValid = isValidXPath(value);
            message = isValid ? "✅ Valid XPath syntax." : "❌ Invalid XPath syntax.";
        } else {
            isValid = isValidCSS(value);
            message = isValid ? "✅ Valid CSS syntax." : "❌ Invalid CSS syntax.";
        }

        messageElement.textContent = message;
        messageElement.style.color = isValid ? "green" : "red";
    });
});








document.addEventListener("DOMContentLoaded", function () {
    const findElementButton = document.querySelector("#findElementBtn");
    const selectorTableBody = document.querySelector("#selectorTable tbody");

    if (!findElementButton || !selectorTableBody) return;

    // Function to update the table with selectors
    const updateSelectorTable = (selectors) => {
        selectorTableBody.innerHTML = ""; // Clear existing entries

        if (selectors.length >= 1) {
            selectors.forEach(sel => {
                let row = document.createElement("tr");
                let typeCell = document.createElement("td");
                let selectorCell = document.createElement("td");

                typeCell.textContent = sel.type;
                selectorCell.textContent = sel.selector;

                row.appendChild(typeCell);
                row.appendChild(selectorCell);
                selectorTableBody.appendChild(row);
            });
        }
    };

    // Send a request to content.js when Find Element is clicked
    findElementButton.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "getSelectors" }, (response) => {
            if (response && response.selectors.length > 0) {
                updateSelectorTable(response.selectors);
            } else {
                console.warn("No element selected yet.");
            }
        });
    });
});












document.addEventListener("DOMContentLoaded", function () {
  const inputBox = document.getElementById("selectorInput");
  const suggestionBox = document.getElementById("suggestion-box");
  const resultCount = document.getElementById("result-count");

  let cachedQueries = {};

  inputBox.addEventListener("input", function () {
      const query = inputBox.value.trim();
      if (query === "") {
          suggestionBox.innerHTML = "";
          resultCount.textContent = "";
          return;
      }

      if (cachedQueries[query]) {
          displayResults(cachedQueries[query]);
          return;
      }

      chrome.devtools.inspectedWindow.eval(`
          (function() {
              try {
                  let elements;
                  if ('${query}'.startsWith('/') || '${query}'.startsWith('.//')) {
                      let xpathResult = document.evaluate('${query}', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                      elements = [];
                      for (let i = 0; i < xpathResult.snapshotLength; i++) {
                          elements.push(xpathResult.snapshotItem(i));
                      }
                  } else {
                      elements = Array.from(document.querySelectorAll('${query}'));
                  }
                  
                  elements.forEach(el => el.style.outline = "");
                  elements.slice(0, 5).forEach(el => el.style.outline = "2px solid red");
                  
                  return { count: elements.length, suggestions: elements.slice(0, 5).map(el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '')) };
              } catch (e) {
                  return { count: 0, suggestions: [] };
              }
          })();
      `, function(result, isException) {
          if (isException || !result) {
              resultCount.textContent = "Invalid selector";
              suggestionBox.innerHTML = "";
              return;
          }
          cachedQueries[query] = result;
          displayResults(result);
      });
  });

  function displayResults(result) {
      resultCount.textContent = `Matches: ${result.count}`;
      suggestionBox.innerHTML = result.suggestions.length ? 
          result.suggestions.map(tag => `<div class="suggestion">${tag}</div>`).join("") : "<div class='no-match'>No suggestions</div>";
  }
});
