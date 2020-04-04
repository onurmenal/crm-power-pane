if (typeof browser === "undefined") {
    browser = chrome;
}

browser.browserAction.onClicked.addListener(function () {

    var togglePowerPaneCode = ''
        + 'var pane = document.querySelector(".crm-power-pane-sections");'
        + 'var nextValue = (pane.style.display !== "" && pane.style.display !== "none") ? "none" : "block";'
        + 'pane.style.display = nextValue;'

    browser.tabs.executeScript({
        code: togglePowerPaneCode
    });
});
