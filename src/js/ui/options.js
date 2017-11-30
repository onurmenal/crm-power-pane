// Saves options to chrome.storage
function saveOptions() {
    var dataToSave = {}
    var options = document.forms[0].elements;
    for (var i = 0; i < options.length; i++) {
        dataToSave[options[i].id] = options[i].checked
    }
    chrome.storage.sync.set(dataToSave, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
  }
  
// Loads options from chrome.storage
function loadOptions() {
    chrome.storage.sync.get(null, function(options) {
        for (var option in options) {
            if (!options.hasOwnProperty(option)) continue;
            var optionCheckbox = document.getElementById(option);
            if (optionCheckbox) optionCheckbox.checked = options[option]
        }
    });
}
  
// Generates options page based on pane.html content
function generateOptionsPage() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", chrome.extension.getURL("ui/pane.html"), true);
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            parser = new DOMParser();
            paneDocument = parser.parseFromString(xmlHttp.responseText, "text/html");
            var paneSections = paneDocument.getElementsByClassName("crm-power-pane-section");
            var options = document.getElementById("options");
            for (var i = 0; i < paneSections.length; i++)
            {
                var optionsGroup = document.createElement('div');
                var groupHeader = document.createElement("h3");
                groupHeader.innerHTML = paneSections[i].getElementsByClassName("crm-power-pane-header")[0].innerHTML
                optionsGroup.appendChild(groupHeader);
                var paneItems = paneSections[i].getElementsByClassName("crm-power-pane-subgroup");
                for (var j = 0; j < paneItems.length; j++)
                {
                    var checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = true;
                    checkbox.id = paneItems[j].id;
                    var optionsItem = document.createElement("label");
                    optionsItem.htmlFor = paneItems[j].id;
                    optionsItem.appendChild(checkbox);
                    optionsItem.appendChild(document.createTextNode(paneItems[j].children[0].innerText));
                    optionsGroup.appendChild(optionsItem);
                }
                options.appendChild(optionsGroup);
            }
        }
    }   
    xmlHttp.send(null);
  }
  
document.addEventListener('DOMContentLoaded', function() {
    generateOptionsPage();
    loadOptions();
    saveOptions();
});
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('select-all').addEventListener('click', function() {
    var checkboxes = document.forms[0].elements;
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true
    }
});
document.getElementById('deselect-all').addEventListener('click', function() {
    var checkboxes = document.forms[0].elements;
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false
    }
});