ATTRIBUTES_TO_DELETE = [
    "STYLE",
    
    // Table
    "BORDER",
    "CELLSPACING",
    "CELLPADDING",
    "VALIGN",

    "TITLE",
    "SUMMARY",
];

ELEMENTS_TO_DELETE = [ // Must be uppercase
    // Block
    "DIV",
    "TABLE",
    "TBODY",
    "TR",
    "TD",
    "TH",

    // Inline
    "SPAN",
];

ELEMENTS_TO_DELETE_IF_EMPTY = [ // Must be uppercase
    // Block
    "P",

    // Inline
    "B",
    "I",
    "U",
    "STRONG",
    "EM",
];

/**
 * Clean up the contents of the element elem.
 */
function cleanUp(elem) {
    // Clean up
    if(elem instanceof Element && elem.id != "neattribute-edit-rich") {
        // Add B/I/U if needed
        if(elem.style.textDecorationLine == "underline") {
            let underlineElem = document.createElement("u");
            elem.parentElement.replaceChild(underlineElem, elem);
            underlineElem.appendChild(elem);
        }
        if(elem.style.fontStyle == "italic") {
            let italicElem = document.createElement("i");
            elem.parentElement.replaceChild(italicElem, elem);
            italicElem.appendChild(elem);
        }
        if(elem.style.fontWeight == "bold") {
            let boldElem = document.createElement("b");
            elem.parentElement.replaceChild(boldElem, elem);
            boldElem.appendChild(elem);
        }
        
        // Delete unnecessary attributes
        ATTRIBUTES_TO_DELETE.forEach((attribute) => {
            if(elem.hasAttribute(attribute)) elem.removeAttribute(attribute);
        });

        // Delete unnecessary elements but not their contents
        for(let i = 0; i < ELEMENTS_TO_DELETE.length; i++) {
            if(elem.tagName.toUpperCase() == ELEMENTS_TO_DELETE[i]) {
                // Move children to parent element as deleting this
                let parent = elem.parentNode;
                while(elem.childNodes.length > 0) {
                    // Remove first node and move it to parent - all nodes will become first nodes in this process
                    cleanUp(elem.childNodes[0]);
                    parent.insertBefore(elem.childNodes[0], elem);
                }
                parent.removeChild(elem);
                return;
            }
        }
        
        // Delete unnecessary empty (whitespace-only) elements but not their contents
        for(let i = 0; i < ELEMENTS_TO_DELETE_IF_EMPTY.length; i++) {
            if(elem.tagName.toUpperCase() == ELEMENTS_TO_DELETE_IF_EMPTY[i] && elem.innerHTML.replace("&nbsp;", " ").trim().length == 0) {
                elem.parentElement.removeChild(elem);
                return;
            }
        }
    }

    // Recurse deeper
    elem.childNodes.forEach((node) => {
        if(node.nodeType != Node.TEXT_NODE) {
            cleanUp(node);
        }
    });
}