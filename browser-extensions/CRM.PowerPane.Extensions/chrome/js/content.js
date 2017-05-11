(function () {
    var cssRef = document.createElement('link');
    cssRef.setAttribute('rel', 'stylesheet');
    cssRef.setAttribute('type', 'text/css');
    cssRef.setAttribute('src', chrome.extension.getURL("power-pane/style.css"));

    var scriptTag = document.createElement('script');
    scriptTag.setAttribute('type', 'text/javascript');
    scriptTag.setAttribute('src', chrome.extension.getURL("power-pane/script.js"));

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
                                                + '<img alt="Show Dynamics CRM Power Pane." src="' + chrome.extension.getURL("img/icon-24.png") + '"'
                                            + '</span>'
                                         + '</a>'
            ribbon[0].insertBefore(helperPaneButton, ribbon[0].firstChild);

            var helperPaneTemplate = chrome.extension.getURL("power-pane/pane.html");

            xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", helperPaneTemplate, true);

            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == XMLHttpRequest.DONE) {
                    if (xmlHttp.status == 200) {
                        var inject = document.createElement("div");
                        inject.innerHTML = xmlHttp.responseText

                        mainBody[0].appendChild(cssRef);
                        mainBody[0].appendChild(scriptTag);
                        mainBody[0].appendChild(inject);
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
})();