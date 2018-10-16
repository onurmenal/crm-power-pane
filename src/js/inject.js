(function () {

    if(typeof browser === "undefined") {
        browser = chrome;
    }

    var cssRef = document.createElement('link');
    cssRef.setAttribute('rel', 'stylesheet');
    cssRef.setAttribute('type', 'text/css');
    cssRef.setAttribute('src', browser.extension.getURL("ui/css/pane.css"));

    var scriptTag = document.createElement('script');
    scriptTag.setAttribute('type', 'text/javascript');
    scriptTag.setAttribute('src', browser.extension.getURL("ui/js/pane.js"));

    var scriptToolKit = document.createElement('script');
    scriptToolKit.setAttribute('type', 'text/javascript');
    scriptToolKit.setAttribute('src', browser.extension.getURL("ui/js/XrmServiceToolkit.js"));

    var mainBody = document.querySelectorAll('body[scroll=no]');

    if (mainBody && mainBody.length > 0) {
        var ribbon = document.querySelectorAll('#navBar');
        var helperPaneButton = document.getElementById("crm-power-pane-button");
        if (ribbon != null && ribbon.length > 0 && !helperPaneButton) {
            var helperPaneButton = document.createElement("span");
            helperPaneButton.setAttribute('class', 'navTabButton');
            helperPaneButton.setAttribute('id', 'crm-power-pane-button');
            helperPaneButton.setAttribute('title', 'Show Dynamics CRM Power Pane');
            helperPaneButton.innerHTML = '<a class="navTabButtonLink" title="Show Dynamics CRM Power Pane">'
                                            + '<span class="navTabButtonImageContainer">'
                                                + '<img alt="Show Dynamics CRM Power Pane." src="' + browser.extension.getURL("img/icon-24.png") + '"'
                                            + '</span>'
                                         + '</a>'
            ribbon[0].insertBefore(helperPaneButton, ribbon[0].firstChild);

            var helperPaneTemplate = browser.extension.getURL("ui/pane.html");

            xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", helperPaneTemplate, true);

            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == XMLHttpRequest.DONE) {
                    if (xmlHttp.status == 200) {
                        var inject = document.createElement("div");
                        inject.innerHTML = xmlHttp.responseText
                        inject.className = "crm-power-pane-container";
                        
                        mainBody[0].appendChild(cssRef);
                        mainBody[0].appendChild(scriptToolKit);
                        mainBody[0].appendChild(scriptTag);
                        mainBody[0].appendChild(inject);

                        applyUserOptions();
                    }
                    else if (xmlHttp.status == 400) {
                        alert('There was an error 400');
                    }
                    else {
                        alert('something else other than 200 was returned');
                    }
                }
            };

            xmlHttp.send();
        }
    }

    function applyUserOptions() {
        // Show/hide menu items
        browser.storage.sync.get(null, function(settings) {
            for (var setting in settings) {
                if (!settings.hasOwnProperty(setting)) continue;
                if (settings[setting])
                    document.getElementById(setting).style.display = "inherit"
                else 
                    document.getElementById(setting).style.display = "none"
            }
        });
    }
})();