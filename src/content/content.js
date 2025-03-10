/* ==========================
   ✅ content.js (Extracts All Possible Locators)
   ========================== */
let lastRightClickedElement = null;

document.addEventListener("contextmenu", (event) => {
  lastRightClickedElement = event.target; // Store the right-clicked element
});

// ✅ Listen for messages to extract and send locators
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "highlightElement") {
    highlightStoredElement();
  }
});

// ✅ Function to highlight and extract locators
function highlightStoredElement() {
  if (lastRightClickedElement) {
    if (window.lastHighlightedElement) {
      window.lastHighlightedElement.style.outline = "";
    }

    lastRightClickedElement.style.outline = "2px dashed red";
    window.lastHighlightedElement = lastRightClickedElement;

    // ✅ Extract all possible locators
    const locators = getLocators(lastRightClickedElement);

    // ✅ Send locators to devtools.js
    chrome.runtime.sendMessage({
      action: "updateQuantumLocatePanel",
      locators: locators,
    });

    console.log("✅ Locators Extracted & Sent:", locators);
  } else {
    console.warn("⚠️ No element stored from right-click.");
  }
}

/* ==========================
   ✅ content.js (Extracts All Possible Locators)
   ========================== */

document.addEventListener("contextmenu", (event) => {
  lastRightClickedElement = event.target; // Store the right-clicked element
});

// ✅ Listen for messages to extract and send locators
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "highlightElement") {
    highlightStoredElement();
  }
});

// ✅ Function to highlight and extract locators
function highlightStoredElement() {
  if (lastRightClickedElement) {
    if (window.lastHighlightedElement) {
      window.lastHighlightedElement.style.outline = "";
    }

    lastRightClickedElement.style.outline = "2px dashed red";
    window.lastHighlightedElement = lastRightClickedElement;

    // ✅ Extract all possible locators
    const locators = getLocators(lastRightClickedElement);

    // ✅ Send locators to devtools.js
    chrome.runtime.sendMessage({
      action: "updateQuantumLocatePanel",
      locators: locators,
    });

    console.log("✅ Extracted Locators:", locators);
  } else {
    console.warn("⚠️ No element stored from right-click.");
  }
}

// ✅ Function to extract basic and XPath locators
function getLocators(element) {

  const locators = {};

  // ✅ Helper function to only add valid locators (with at least 1 match)
  function addIfValid(locatorType, selector, isXPath = false, referenceElement = null) {
      let count = getLocatorCount(selector, isXPath, referenceElement);
      if (count > 0) {  // ✅ Only add locators that have at least 1 match
          locators[locatorType] = { selector, count };
      }
  }

  // ✅ Basic Locators
  addIfValid("ID", `#${element.id}`);
  addIfValid("Class Name", `.${element.className.split(" ").join(".")}`);
  addIfValid("Tag Name", element.tagName.toLowerCase());
  addIfValid("Name", `[name='${element.name}']`);
  
 // ✅ Link Text & Partial Link Text (Fixed Implementation)
 if (element.tagName.toLowerCase() === "a" && element.innerText.trim().length > 0) {
  addIfValid("Link Text", `//a[text()='${element.innerText.trim()}']`, true);
  addIfValid("Partial Link Text", `//a[contains(text(),'${element.innerText.trim().substring(0, 5)}')]`, true);
}
  
    // ✅ XPath Locators

    addIfValid("XPath Absolute", getAbsoluteXPath(element),true);
    addIfValid("XPath Relative", getLocatorCount(getRelativeXPath(element), true),true);
    addIfValid("XPath Attribute", getXPathByAttribute(element),true);
    addIfValid("XPath Text", getXPathByText(element),true);
    addIfValid("XPath Contains", getXPathContains(element),true);
    addIfValid("XPath Starts-With", getXPathStartsWith(element),true);
    addIfValid("XPath Ends-With", getXPathEndsWith(element),true);
    addIfValid("XPath Parent", getLocatorCount(getXPathParent(element), true),true);
    addIfValid("XPath Ancestor", getLocatorCount(getXPathAncestor(element), true),true);
    addIfValid("XPath Following Sibling", getLocatorCount(getXPathFollowingSibling(element), true),true);
    addIfValid("XPath Preceding Sibling", getLocatorCount(getXPathPrecedingSibling(element), true),true);
    addIfValid("XPath Direct Child", getXPathDirectChild(element),true);
    addIfValid("XPath Descendant", getXPathDescendant(element),true);
    addIfValid("XPath First Element", getXPathFirstElement(element),true);
    addIfValid("XPath Last Element", getXPathLastElement(element),true);
    addIfValid("XPath Nth Position", getXPathNthPosition(element),true);
    addIfValid("XPath Wildcard", getXPathWildcard(),true);
    addIfValid("XPath Any Attribute", getXPathAnyAttribute(),true);
    addIfValid("XPath Following Nodes", getXPathFollowingNodes(element),true);
    addIfValid("XPath Preceding Nodes", getXPathPrecedingNodes(element),true);

     // ✅ Basic CSS Selectors
     addIfValid("CSS Universal", getCSSUniversalSelector());
     addIfValid("CSS Type", getLocatorCount(getCSSTypeSelector(element)));
     addIfValid("CSS Class", getCSSClassSelector(element));
     addIfValid("CSS ID", getCSSIDSelector(element));
     addIfValid("CSS Attribute", getCSSAttributeSelector(element));

     // ✅ Advanced Attribute-Based CSS Selectors
     addIfValid("CSS Starts-With", getCSSStartsWithSelector(element));
     addIfValid("CSS Ends-With", getCSSEndsWithSelector(element));
     addIfValid( "CSS Contains", getCSSContainsSelector(element));

     // ✅ Structural & Relationship CSS Selectors
     addIfValid("CSS Descendant", getLocatorCount(getCSSDescendantSelector(element)));
     addIfValid("CSS Child", getLocatorCount(getCSSChildSelector(element)));
     addIfValid( "CSS Adjacent Sibling", getLocatorCount(getCSSAdjacentSiblingSelector(element)));
     addIfValid("CSS General Sibling", getLocatorCount(getCSSGeneralSiblingSelector(element)));

     // ✅ Pseudo-Class CSS Selectors
     addIfValid("CSS First Child", getCSSFirstChildSelector(element));
     addIfValid("CSS Last Child", getCSSLastChildSelector(element));
     addIfValid("CSS Nth Child", getCSSNthChildSelector(element));

   
 


        addIfValid("Relative Above", getLocatorCount(getRelativeAboveLocator(element), false, element));
        addIfValid("Relative Below", getLocatorCount(getRelativeBelowLocator(element), false, element));
        addIfValid("Relative To Left Of", getLocatorCount(getRelativeToLeftOfLocator(element), false, element));
        addIfValid("Relative To Right Of", getLocatorCount(getRelativeToRightOfLocator(element), false, element));
        addIfValid("Relative Near", getLocatorCount(getRelativeNearLocator(element), false, element));

  console.log("✅ Extracted Locators:", locators); // Log locators for verification
  return locators;
}

// ✅ Generate Absolute XPath
function getAbsoluteXPath(element) {
  if (!element) return "N/A";
  let path = "";
  for (; element && element.nodeType === 1; element = element.parentNode) {
    let idx = 1;
    for (
      let sibling = element.previousSibling;
      sibling;
      sibling = sibling.previousSibling
    ) {
      if (sibling.nodeType === 1 && sibling.nodeName === element.nodeName)
        idx++;
    }
    let tagName = element.nodeName.toLowerCase();
    path = `/${tagName}[${idx}]` + path;
  }
  return path;
}
// ✅ Generate Relative XPath
function getRelativeXPath(element) {
  if (!element) return "N/A";
  let tagName = element.tagName.toLowerCase();
  if (element.id) return `//*[@id='${element.id}']`;
  if (element.className)
    return `//${tagName}[contains(@class, '${element.className
      .split(" ")
      .join(" ")}')]`;
  return `//${tagName}`;
}

// ✅ Generate Attribute-based XPath
function getXPathByAttribute(element) {
  return element.hasAttribute("id")
    ? `//*[@id='${element.id}']`
    : element.hasAttribute("name")
    ? `//*[@name='${element.name}']`
    : "N/A";
}

// ✅ Generate Text-based XPath
function getXPathByText(element) {
  return element.innerText
    ? `//${element.tagName.toLowerCase()}[text()='${element.innerText.trim()}']`
    : "N/A";
}

// ✅ Generate XPath using contains() for attributes
function getXPathContains(element) {
  if (!element) return "N/A";

  let attributes = ["id", "class", "name", "placeholder", "href", "src", "alt"];
  for (let attr of attributes) {
      if (element.hasAttribute(attr)) {
          let value = element.getAttribute(attr);
          if (value && value.length > 2) {
              return `//*[contains(@${attr}, '${value.substring(0, 5)}')]`; // Use partial match
          }
      }
  }
  return "N/A";
}

// ✅ Generate XPath using starts-with() for attributes
function getXPathStartsWith(element) {
  if (!element) return "N/A";

  let attributes = ["id", "class", "name", "placeholder", "href", "src", "alt"];
  for (let attr of attributes) {
      if (element.hasAttribute(attr)) {
          let value = element.getAttribute(attr);
          if (value && value.length > 2) {
              return `//*[starts-with(@${attr}, '${value.substring(0, 3)}')]`;
          }
      }
  }
  return "N/A";
}

// ✅ Workaround for Ends-With (XPath doesn’t support ends-with directly)
function getXPathEndsWith(element) {
  if (!element) return "N/A";

  let attributes = ["id", "class", "name", "placeholder", "href", "src", "alt"];
  for (let attr of attributes) {
      if (element.hasAttribute(attr)) {
          let value = element.getAttribute(attr);
          if (value && value.length > 3) {
              let lastPart = value.slice(-3); // Get the last 3 characters
              return `//*[contains(@${attr}, '${lastPart}') and substring(@${attr}, string-length(@${attr}) - ${lastPart.length - 1}) = '${lastPart}']`;
          }
      }
  }
  return "N/A";
}

// ✅ Generate Parent XPath
function getXPathParent(element) {
  if (!element || !element.parentElement) return "N/A";
  return `//${element.tagName.toLowerCase()}/..`;
}

// ✅ Generate Ancestor XPath
function getXPathAncestor(element) {
  if (!element) return "N/A";
  let tagName = element.tagName.toLowerCase();
  return `//${tagName}/ancestor::*`;
}

// ✅ Generate Following Sibling XPath
function getXPathFollowingSibling(element) {
  if (!element || !element.nextElementSibling) return "N/A";
  let tagName = element.nextElementSibling.tagName.toLowerCase();
  return `//${element.tagName.toLowerCase()}/following-sibling::${tagName}`;
}

// ✅ Generate Preceding Sibling XPath
function getXPathPrecedingSibling(element) {
  if (!element || !element.previousElementSibling) return "N/A";
  let tagName = element.previousElementSibling.tagName.toLowerCase();
  return `//${element.tagName.toLowerCase()}/preceding-sibling::${tagName}`;
}

// ✅ Generate Direct Child XPath
function getXPathDirectChild(element) {
  if (!element || !element.parentElement) return "N/A";
  let parentTag = element.parentElement.tagName.toLowerCase();
  let childTag = element.tagName.toLowerCase();
  return `//${parentTag}/${childTag}`;
}

// ✅ Generate Descendant XPath
function getXPathDescendant(element) {
  if (!element || !element.parentElement) return "N/A";
  let parentTag = element.parentElement.tagName.toLowerCase();
  let childTag = element.tagName.toLowerCase();
  return `//${parentTag}//${childTag}`;
}

// ✅ Generate First Element XPath
function getXPathFirstElement(element) {
  if (!element) return "N/A";
  let tagName = element.tagName.toLowerCase();
  return `//${tagName}[1]`;
}

// ✅ Generate Last Element XPath
function getXPathLastElement(element) {
  if (!element) return "N/A";
  let tagName = element.tagName.toLowerCase();
  return `//${tagName}[last()]`;
}

// ✅ Generate Nth Position XPath
function getXPathNthPosition(element, position = 2) { // Default to 2nd position
  if (!element) return "N/A";
  let tagName = element.tagName.toLowerCase();
  return `//${tagName}[position()=${position}]`;
}

// ✅ Generate Wildcard XPath (Selects all elements)
function getXPathWildcard() {
  return "//*";
}

// ✅ Generate Any Attribute XPath (Finds elements with at least one attribute)
function getXPathAnyAttribute() {
  return "//*[@*]";
}

// ✅ Generate Following Nodes XPath
function getXPathFollowingNodes(element) {
  if (!element) return "N/A";
  let tagName = element.tagName.toLowerCase();
  return `//${tagName}/following::*`;
}

// ✅ Generate Preceding Nodes XPath
function getXPathPrecedingNodes(element) {
  if (!element) return "N/A";
  let tagName = element.tagName.toLowerCase();
  return `//${tagName}/preceding::*`;
}

// ✅ Universal Selector (Selects all elements)
function getCSSUniversalSelector() {
    return "*";
}

// ✅ Type Selector (Selects all elements of a specific type)
function getCSSTypeSelector(element) {
    return element ? element.tagName.toLowerCase() : "N/A";
}

// ✅ Class Selector (Selects elements by class)
function getCSSClassSelector(element) {
    if (!element || !element.className) return "N/A";
    return "." + element.className.trim().split(/\s+/).join(".");
}

// ✅ ID Selector (Selects elements by ID)
function getCSSIDSelector(element) {
    return element && element.id ? `#${element.id}` : "N/A";
}

// ✅ Attribute Selector (Selects elements based on a specific attribute)
function getCSSAttributeSelector(element) {
    if (!element) return "N/A";
    let attributes = ["name", "type", "placeholder", "href", "alt", "value"];
    for (let attr of attributes) {
        if (element.hasAttribute(attr)) {
            return `[${attr}='${element.getAttribute(attr)}']`;
        }
    }
    return "N/A";
}

// ✅ Starts-With Selector (Matches elements where an attribute starts with a value)
function getCSSStartsWithSelector(element) {
  if (!element) return "N/A";
  let attributes = ["id", "class", "name", "placeholder", "href", "src", "alt"];
  for (let attr of attributes) {
      if (element.hasAttribute(attr)) {
          let value = element.getAttribute(attr);
          if (value && value.length > 2) {
              return `[${attr}^='${value.substring(0, 3)}']`; // First 3 characters
          }
      }
  }
  return "N/A";
}

// ✅ Ends-With Selector (Matches elements where an attribute ends with a value)
function getCSSEndsWithSelector(element) {
  if (!element) return "N/A";
  let attributes = ["id", "class", "name", "placeholder", "href", "src", "alt"];
  for (let attr of attributes) {
      if (element.hasAttribute(attr)) {
          let value = element.getAttribute(attr);
          if (value && value.length > 3) {
              return `[${attr}$='${value.slice(-3)}']`; // Last 3 characters
          }
      }
  }
  return "N/A";
}

// ✅ Contains Selector (Matches elements where an attribute contains a value)
function getCSSContainsSelector(element) {
  if (!element) return "N/A";
  let attributes = ["id", "class", "name", "placeholder", "href", "src", "alt"];
  for (let attr of attributes) {
      if (element.hasAttribute(attr)) {
          let value = element.getAttribute(attr);
          if (value && value.length > 3) {
              return `[${attr}*='${value.substring(1, 4)}']`; // Extracts middle part of the text
          }
      }
  }
  return "N/A";
}

// ✅ Descendant Selector (Selects all nested elements inside a parent)
function getCSSDescendantSelector(element) {
  if (!element || !element.parentElement) return "N/A";
  let parentTag = element.parentElement.tagName.toLowerCase();
  let childTag = element.tagName.toLowerCase();
  return `${parentTag} ${childTag}`;
}

// ✅ Child Selector (Selects only direct child elements)
function getCSSChildSelector(element) {
  if (!element || !element.parentElement) return "N/A";
  let parentTag = element.parentElement.tagName.toLowerCase();
  let childTag = element.tagName.toLowerCase();
  return `${parentTag} > ${childTag}`;
}

// ✅ Adjacent Sibling Selector (Selects the immediate next sibling element)
function getCSSAdjacentSiblingSelector(element) {
  if (!element || !element.nextElementSibling) return "N/A";
  let siblingTag = element.nextElementSibling.tagName.toLowerCase();
  let elementTag = element.tagName.toLowerCase();
  return `${elementTag} + ${siblingTag}`;
}

// ✅ General Sibling Selector (Selects all siblings of the same type)
function getCSSGeneralSiblingSelector(element) {
  if (!element || !element.parentElement) return "N/A";
  let elementTag = element.tagName.toLowerCase();
  return `${elementTag} ~ *`;
}

// ✅ First Child Selector (Selects the first child inside a parent)
function getCSSFirstChildSelector(element) {
  if (!element || !element.parentElement) return "N/A";
  let elementTag = element.tagName.toLowerCase();
  return `${elementTag}:first-child`;
}

// ✅ Last Child Selector (Selects the last child inside a parent)
function getCSSLastChildSelector(element) {
  if (!element || !element.parentElement) return "N/A";
  let elementTag = element.tagName.toLowerCase();
  return `${elementTag}:last-child`;
}

// ✅ Nth Child Selector (Selects the nth child inside a parent)
function getCSSNthChildSelector(element) {
  if (!element || !element.parentElement) return "N/A";
  let elementTag = element.tagName.toLowerCase();
  let index = Array.from(element.parentElement.children).indexOf(element) + 1;
  return `${elementTag}:nth-child(${index})`;
}

// ✅ Relative Locator - Above (Finds elements above the current element)
function getRelativeAboveLocator(element) {
  let aboveElement = document.elementFromPoint(element.getBoundingClientRect().left, element.getBoundingClientRect().top - 10);
  return aboveElement ? `RelativeLocator.withTagName("${aboveElement.tagName.toLowerCase()}").above(${getElementIdentifier(element)})` : "N/A";
}

// ✅ Relative Locator - Below (Finds elements below the current element)
function getRelativeBelowLocator(element) {
  let belowElement = document.elementFromPoint(element.getBoundingClientRect().left, element.getBoundingClientRect().bottom + 10);
  return belowElement ? `RelativeLocator.withTagName("${belowElement.tagName.toLowerCase()}").below(${getElementIdentifier(element)})` : "N/A";
}

// ✅ Relative Locator - To Left Of (Finds elements to the left of the current element)
function getRelativeToLeftOfLocator(element) {
  let leftElement = document.elementFromPoint(element.getBoundingClientRect().left - 10, element.getBoundingClientRect().top);
  return leftElement ? `RelativeLocator.withTagName("${leftElement.tagName.toLowerCase()}").toLeftOf(${getElementIdentifier(element)})` : "N/A";
}

// ✅ Relative Locator - To Right Of (Finds elements to the right of the current element)
function getRelativeToRightOfLocator(element) {
  let rightElement = document.elementFromPoint(element.getBoundingClientRect().right + 10, element.getBoundingClientRect().top);
  return rightElement ? `RelativeLocator.withTagName("${rightElement.tagName.toLowerCase()}").toRightOf(${getElementIdentifier(element)})` : "N/A";
}

// ✅ Relative Locator - Near (Finds elements near the current element within 50px)
function getRelativeNearLocator(element) {
  let nearElement = document.elementFromPoint(element.getBoundingClientRect().left + 25, element.getBoundingClientRect().top + 25);
  return nearElement ? `RelativeLocator.withTagName("${nearElement.tagName.toLowerCase()}").near(${getElementIdentifier(element)})` : "N/A";
}

// ✅ Helper function to get a unique identifier for an element
function getElementIdentifier(element) {
  if (element.id) return `By.id("${element.id}")`;
  if (element.className) return `By.className("${element.className.split(" ").join(".")}")`;
  if (element.name) return `By.name("${element.name}")`;
  return `By.tagName("${element.tagName.toLowerCase()}")`;
}

// ✅ Function to count matching elements in DOM
function getLocatorCount(selector, isXPath = false, referenceElement = null) {
  let count = 0;

  try {
      if (isXPath) {
          let result = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
          count = result.snapshotLength;
      } else if (referenceElement) {
          count = getRelativeLocatorCount(selector, referenceElement);
      } else {
          count = document.querySelectorAll(selector).length;
      }
  } catch (e) {
      count = 0;
  }

  return count;
}

// ✅ Function to count elements for Selenium 4 Relative Locators
function getRelativeLocatorCount(locator, referenceElement) {
  let count = 0;

  if (locator.includes("above")) {
      count = document.elementsFromPoint(referenceElement.getBoundingClientRect().left, referenceElement.getBoundingClientRect().top - 10).length;
  } else if (locator.includes("below")) {
      count = document.elementsFromPoint(referenceElement.getBoundingClientRect().left, referenceElement.getBoundingClientRect().bottom + 10).length;
  } else if (locator.includes("toLeftOf")) {
      count = document.elementsFromPoint(referenceElement.getBoundingClientRect().left - 10, referenceElement.getBoundingClientRect().top).length;
  } else if (locator.includes("toRightOf")) {
      count = document.elementsFromPoint(referenceElement.getBoundingClientRect().right + 10, referenceElement.getBoundingClientRect().top).length;
  } else if (locator.includes("near")) {
      count = document.elementsFromPoint(referenceElement.getBoundingClientRect().left + 25, referenceElement.getBoundingClientRect().top + 25).length;
  }

  return count;
}





let selectedElement = null; // Store the last clicked/highlighted element

// Listen for clicks in the page to track the selected element
document.addEventListener("click", (event) => {
    selectedElement = event.target; // Store the exact clicked element
}, true); // Captures all clicks in the DOM

// Listen for messages from devtools.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getSelectors") {
        if (selectedElement) {
            const selectors = getElementSelectors(selectedElement); // Use existing function
            sendResponse({ selectors: selectors });
        } else {
            sendResponse({ selectors: [], error: "No element selected yet." });
        }
    }
    return true; // Required for async sendResponse
});
