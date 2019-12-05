(function () {

    if (typeof browser === "undefined") {
        browser = chrome;
    }

    Interval = {
        PowerPaneControl: {
            Pointer: undefined,
            Count: 0,
            MaxTryCount: 10
        }
    }

    ApplicationType = {
        DynamicsCRM: "Dynamics CRM",
        Dynamics365: "Dynamics 365"
    }

    function GetAppicationType() {

        var mainBody = document.querySelectorAll('body[scroll=no]');
        var topBar = document.querySelector("div[data-id=topBar]")

        if (mainBody && mainBody.length > 0) {
            return ApplicationType.DynamicsCRM
        } else if (topBar) {
            return ApplicationType.Dynamics365
        } else {
            return null;
        }
    }

    function BuildScriptTag(source) {
        var script = document.createElement("script");
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', source);

        return script;
    }

    function BuildSytleTag(source) {
        var style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('type', 'text/css');
        style.setAttribute('src', source);

        return style;
    }

    function BuildPowerPaneButton() {
        var powerPaneButton = document.createElement("span");
        powerPaneButton.setAttribute('class', 'navTabButton');
        powerPaneButton.setAttribute('id', 'crm-power-pane-button');
        powerPaneButton.setAttribute('title', 'Show Dynamics CRM Power Pane');
        

        var linkElement = document.createElement("a");
        linkElement.setAttribute("class", "navTabButtonLink");
        linkElement.setAttribute("title", "");

        var linkImageContainerElement = document.createElement("span");
        linkImageContainerElement.setAttribute("class", "navTabButtonImageContainer");

        var imageElement = document.createElement("img");
        imageElement.setAttribute("src", browser.extension.getURL("img/icon-24.png"));

        if (GetAppicationType() == ApplicationType.Dynamics365) {
            powerPaneButton.setAttribute('style', 'float:left; width:50px; height:48px;cursor:pointer!important');
            linkElement.setAttribute("style", "float:left; width:50px; height:48px;cursor:pointer!important;text-align:center");
            imageElement.setAttribute("style", "padding-top:10px");
        }

        linkImageContainerElement.appendChild(imageElement);
        linkElement.appendChild(linkImageContainerElement);
        powerPaneButton.appendChild(linkElement);

        return powerPaneButton;
    }

    function InjectSource(sources) {
        body = document.querySelector('body[scroll=no]') || document.querySelector('body');

        sources.forEach(function (s) {
            body.appendChild(s);
        });
    }


    function InjectPowerPaneButton() {
        var powerPaneButton = BuildPowerPaneButton();
        var applicationType = GetAppicationType();

        if (applicationType == ApplicationType.DynamicsCRM) {
            var ribbon = document.querySelector('#navBar');

            if (ribbon) {
                ribbon.prepend(powerPaneButton);
            }

        } else if (applicationType == ApplicationType.Dynamics365) {
            var officeWaffle = document.querySelector("button[data-id=officewaffle]");

            if (officeWaffle) {
                officeWaffle.before(powerPaneButton);
            }
        }
    };

    function InjectPowerPane() {
        if (GetAppicationType()) {

            var powerPaneButton = document.getElementById("crm-power-pane-button");

            if (!powerPaneButton) {
                InjectPowerPaneButton();

                var powerPaneTemplate = browser.extension.getURL("ui/pane.html");

                xmlHttp = new XMLHttpRequest();
                xmlHttp.open("GET", powerPaneTemplate, true);

                xmlHttp.onreadystatechange = function () {
                    if (xmlHttp.readyState == XMLHttpRequest.DONE) {
                        if (xmlHttp.status == 200) {
                            var content = document.createElement("div");
                            content.innerHTML = xmlHttp.responseText
                            content.className = "crm-power-pane-container";

                            var style = BuildSytleTag(browser.extension.getURL("ui/css/pane.css"));
                            var script = BuildScriptTag(browser.extension.getURL("ui/js/pane.js"));

                            InjectSource([style, script, content]);
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
    }

    function Initialize() {
        Interval.PowerPaneControl.Pointer = setInterval(function () {

            Interval.PowerPaneControl.Count++;
            if (Interval.PowerPaneControl.Count > Interval.PowerPaneControl.MaxTryCount) {
                clearInterval(Interval.PowerPaneControl.Pointer);
            }

            var powerPaneButton = document.getElementById("crm-power-pane-button");

            if (!powerPaneButton) {
                InjectPowerPaneButton();

                var powerPaneTemplate = browser.extension.getURL("ui/pane.html");

                xmlHttp = new XMLHttpRequest();
                xmlHttp.open("GET", powerPaneTemplate, true);

                xmlHttp.onreadystatechange = function () {
                    if (xmlHttp.readyState == XMLHttpRequest.DONE) {
                        if (xmlHttp.status == 200) {
                            var content = document.createElement("div");
                            content.innerHTML = xmlHttp.responseText
                            content.className = "crm-power-pane-container";

                            var style = BuildSytleTag(browser.extension.getURL("ui/css/pane.css"));
                            var script = BuildScriptTag(browser.extension.getURL("ui/js/pane.js"));

                            InjectSource([style, script, content]);
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
            } else {
                clearInterval(Interval.PowerPaneControl.Pointer);
            }
        }, 1000);
    }

    Initialize();

})();