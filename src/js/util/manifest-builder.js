const build = (target, version) => {

    var manifest = {};
    
    // Common properties
    manifest.manifest_version = 2
    manifest.name = "Dynamics 365 Power Pane"
    manifest.short_name = "Dynamics 365 Power Pane"
    manifest.version = version
    manifest.description = "The Dynamics 365 Power Pane is a helper tool designed to integrate with Microsoft Dynamics CRM and Dynamics 365 application and allow you to manipulate forms."
    manifest.content_security_policy = "script-src 'self'; object-src 'self'"

    manifest.browser_action = {};
    manifest.browser_action.default_title = "Dynamics 365 Power Pane"

    manifest.icons = {};
    manifest.icons[32] = "img/icon-32.png"
    manifest.icons[48] = "img/icon-48.png"
    manifest.icons[64] = "img/icon-64.png"
    manifest.icons[128] = "img/icon-128.png"

    manifest.content_scripts = []
    manifest.content_scripts.push({});

    manifest.content_scripts[0].run_at = "document_end"

    manifest.content_scripts[0].matches = [];
    manifest.content_scripts[0].matches.push("<all_urls>");

    manifest.content_scripts[0].js = [];
    manifest.content_scripts[0].js.push("js/inject.js")

    manifest.content_scripts[0].css = [];
    manifest.content_scripts[0].css.push("ui/css/pane.css")

    manifest.permissions = []
    manifest.permissions.push("identity");
    manifest.permissions.push("tabs");
    manifest.permissions.push("activeTab");
    manifest.permissions.push("storage");
    manifest.permissions.push("http://*/*");
    manifest.permissions.push("https://*/*");

    manifest.web_accessible_resources = [];
    manifest.web_accessible_resources.push("ui/*");
    manifest.web_accessible_resources.push("img/*");

    manifest.background = {};
    manifest.background.scripts = ["js/background.js"];
    manifest.background.persistent  = false;

    // Chrome properties
    if(target === 'chrome') {
        manifest.options_page = "ui/options.html"
        manifest.browser_action.default_icon = "img/icon-48.png"
    }
    
    // Firefox properties
    if(target === 'firefox') {
        manifest.options_ui = {
            page: "ui/options.html",
            browser_style: true,
            //open_in_tab: true
        }

        manifest.browser_action.default_icon = {};
        manifest.browser_action.default_icon[32] = "img/icon-32.png"
    }

    // Edge properties
    if(target === 'edge') {
        manifest.author = "Onur Menal";
        manifest.options_page = "ui/options.html"        
        manifest.browser_action.default_icon = {};
        manifest.browser_action.default_icon[30] = "img/icon-32.png"
        manifest.browser_action.default_icon[35] = "img/icon-32.png"
    }
    
    // Chrome properties
    if(target === 'edge-chromium') {
        manifest.options_page = "ui/options.html"
        manifest.browser_action.default_icon = "img/icon-48.png"
    }
    
    // TODO: Add firefox and edge-specific conversions.
    return manifest;
}

module.exports = {
    build: build
};