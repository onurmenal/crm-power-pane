/// <reference path="XrmPageTemplate.js" />
/// <reference path="json2.js" />
/// <reference path="jquery.js" />

/**
* MSCRM 2015, 2013, 2011 Web Service Toolkit for JavaScript
* @author Jaimie Ji
* @author David Berry
* @current version : 2.2.1

* Credits:
*   The idea of this library was inspired by Daniel Cai's CrmWebServiceToolkit.
*   The idea of BusinessEntity was inspired by Daniel Cai && Ascentium CrmService JavaScript Library.
*   The REST Endpoint functions were inspired by MSCRM 2011 SDK JavaScript code and various resources from CRM websites and forums. Some of them were just copies with minor modification.
*   The Soap functions were inspired by Daniel Cai && Jamie Miley && Paul Way && Customer Effective.
*   Additional thanks to all contributors of MSCRM and i have learned a lot from you all.
* Date: February, 2012
*
* Special Thanks:
*   JetBrains ReSharper Open License
* Date: July, 2012
*
* What's new:
**********************************************************************************************************
*   Version: 1.1
*   Date: April, 2012
*       Dependency: JSON2
*       New Function - XrmServiceToolkit.Soap.Assign
*       New Function - XrmServiceToolkit.Soap.GrantAccess
*       New Function - XrmServiceToolkit.Soap.ModifyAccess
*       New Function - XrmServiceToolkit.Soap.GrantAccess
*       New Function - XrmServiceToolkit.Soap.RetrievePrincipalAccess
**********************************************************************************************************
*   Version: 1.2
*   Date: April, 2012
*       Dependency: JSON2
*       New Fix - Fix soaps functions to create/update/retrieve activities with Party List fields.
**********************************************************************************************************
*   Version: 1.3
*   Date: July, 2012
*       Dependency: JSON2, jQuery (latest or 1.7.2 above)
*       New Feature: cross browser support. jQuery Integration.
*       New Extension: A new category of functions to extend some functions:
*          1. JQueryXrmDependentOptionSet: Create Configurable Dependent Option Set to utilize CRM 2011 web resource.
*          2. JQueryXrmFieldTooltip: Create configurable tooltip for fields on CRM 2011 form
*          3. JQueryXrmCustomFilterView: Create configurable ability to add custom filter view to crm 2011 lookup field on the form
*          4. JQueryXrmFormatNotesControl: Format the notes control to allow insert, allow edit
**********************************************************************************************************
*   Version: 1.3.1
*   Date: November, 2012
*       Dependency: JSON2, jQuery (latest or 1.7.2 above)
*       New Feature - A change of logic to increase performance when returning large number of records
*       New Function - XrmServiceToolkit.Soap.QueryAll: Return all available records by query options (>5k+)
*       New Fix - XrmServiceToolkit.Rest.RetrieveMultiple not returning records more than 50
*       New Fix - XrmServiceToolkit.Soap.Business error when referring number fields like (int, double, float)
*       New Fix - XrmServiceToolkit.Soap not handling error message properly
**********************************************************************************************************
*   Version: 1.3.2
*   Date: January, 2013
*       Dependency: JSON2, jQuery (latest or 1.7.2 above)
*       New Fix - XrmServiceToolkit.Soap cross browser support to initialize soap service
**********************************************************************************************************
*   Version: 1.4.0
*   Date: January, 2013
*       Dependency: JSON2, jQuery (latest or 1.7.2 above)
*       Feature: Add Cross Browser Support for RU12
*       Tested Platform: IE9, IE10, Chrome Version 24.0.1312.56 m, Firefox 18.0.1
**********************************************************************************************************
*   Version: 1.4.1
*   Date: April, 2013
*       Dependency: JSON2, jQuery (latest or 1.7.2 above)
*       Tested Platform: IE9, IE10, Chrome Version 26.0.1410.64 m, Firefox 20.0.1
*       Feature: Add Cross Browser Support for RU12, RU13
*       New Fix - XrmServiceToolkit.Common.AddNotification method updated for RU12, RU13, still compatible for RU11 below
*       New Fix - XrmServiceToolkit.Soap.Fetch method did not format linked record correctly
*       New Fix - XrmServiceToolkit.Soap.Retrieve method did not return partylist data for activity
*       New Fix - Added manual conversion from String to Date conversion for cross browser
*       New Fix - getServerUrl method is updated as getClientUrl to align with RU12 SDK method getClientUrl(), still compatible to support RU11 below
*       New Function - getServerUrl private method is updated as getClientUrl to align with RU12 SDK method getClientUrl(), still compatible to support RU11 below
*       New Function - XrmServiceToolkit.Soap.RetrieveAllEntitiesMetadata method is a method to return all metadata for all entities by the specified entity filters
*       New Function - XrmServiceToolkit.Soap.RetrieveEntityMetadata method is a method to return the metadata for a certain entity by the specified entity filters
*       New Function - XrmServiceToolkit.Soap.RetrieveAttributeMetadata method is a method to return the metadata for a certain entity's attribute
**********************************************************************************************************
*   Version: 1.4.2 (beta)
*   Date: May, 2013
*       Dependency: JSON2, jQuery (latest or 1.7.2 above)
*       Tested Platform: IE10
*       New Fix - XrmServiceToolkit.Soap.Fetch now takes an additional parameter, 'fetchAll', that when set to true will retrieve all pages of results
*       New Behaviour - XrmServiceToolkit.Soap.Fetch works best when providing a FetchXML string starting with the "entity" node, because of the way paging works;
*           It will still function with the traditional "fetch" node to start, but then the XML has to be parsed to select just the "entity" node, which adds some overhead.
*       New Behaviour - XrmServiceToolkit fetch and queryall methods use a unified model, and some redundant code has been removed.  This allows better paging operations.
*
**********************************************************************************************************
*   Version: 2.0.0 (beta)
*   Date: October, 2013
*       Dependency: JSON2, jQuery (latest or 1.7.2 above)
*       ---NOTE---Due to the changes for CRM 2013, please use the attached version of JSON2 and jQuery
*       Tested Platform: IE10, latest Chrome, latest FireFox
*    Changes:
*       New Behaviour - XrmServiceTookit.Soap.Fetch parameters change to work with asynchronous callback compared to 1.4.2 beta: XrmServiceToolkit.Soap.Fetch(fetchXml, fetchAll, callback)
*       New Behaviour - XrmServiceTookit.Soap.AddNotification is working with CRM 2013 using the out-of-box functionality. Still support CRM 2011
*       New Fix - XrmServiceToolkit.Common.GetObjectCodeType is now using metadata retrieval as a supported method
*       New Fix - The included jQuery has a line changed at the bottom <window.jQuery = jQuery;> $ is removed to work with CRM 2013 form
*   Beta Release for CRM 2013
**********************************************************************************************************
*   Version: 2.0.1 (beta)
*   Date: April, 2014
*       Dependency: JSON2, jQuery (latest or 1.7.2 above)
*       ---NOTE---Due to the changes for CRM 2013, please use the attached version of JSON2 and jQuery
*       Tested Platform: IE11, IE10, latest Chrome, latest FireFox
*    Changes:
*       New Behaviour - XrmServiceTookit.Soap.Fetch method will allow 'page' and 'count' parameter to limit the returned records.
*       New Fix - XrmServiceToolkit.Soap.Fetch fix an error when passing difference formats of Fetch XML with/without '<fetch>..' statements
*       New Fix - XrmServiceToolkit.Extension methods error when retrieving web resources
*   Beta Release for CRM 2013
**********************************************************************************************************
*   Version: 2.1
*   Date: September, 2014
*       Dependency: JSON2, jQuery (latest or 1.7.2 above)
*       ---NOTE---Due to the changes for CRM 2013, please use the attached version of JSON2 and jQuery
*       Tested Platform: IE11, IE10, latest Chrome, latest FireFox
*    Changes:
*       Performance Refactor
*       New Fix - XrmServiceToolkit.Common.DisableAllControlsInTab to support CRM2013 changes
*   Beta Release for CRM 2013
**********************************************************************************************************
*   Version: 2.2
*   Date: April, 2015
*       Dependency: JSON2, jQuery (latest or 1.7.2 above)
*       ---NOTE---Due to the changes for CRM 2013, please use the attached version of JSON2 and jQuery
*       Tested Platform: IE11, IE10, latest Chrome, latest FireFox
*    Changes:
*       CRM 2015 release
*       New Fix - Error Handling
*       New Fix - XrmServiceToolkit.Soap.Fetch aggregate fix
*       New Fix - XrmServiceToolkit.Soap.Fetch distinct support
*       New Fix - Aliased Values Handling
*   Stable Release for CRM 2013, CRM 2015
**********************************************************************************************************
*   Version: 2.2.1
*   Date: May, 2015
*       Dependency: JSON2, jQuery (latest or 1.7.2 above)
*       ---NOTE---Due to the changes for CRM 2013, please use the attached version of JSON2 and jQuery
*       Tested Platform: IE11, IE10, latest Chrome, latest FireFox
*    Changes:
*       CRM 2015 7.1 release
*       New Fix - Added logic for EntityReference in SOAP for 7.1 changes
*   Beta Release for CRM 2015 online Update 1
**********************************************************************************************************
*/

XrmServiceToolkit = function () {
    /// <summary>
    /// XrmServiceToolkit.Common for common functions.
    /// XrmServiceToolkit.Rest for all REST endpoints functions.
    /// XrmServiceToolkit.Soap for all Soap functions.
    /// XrmServiceToolkit.Extension for all Extension functions.
    /// </summary>
};

XrmServiceToolkit.Common = function () {

    var alertMessage = function (message) {
        (Xrm.Utility !== undefined && Xrm.Utility.alertDialog !== undefined) ? Xrm.Utility.alertDialog(message): alert(message);
    };

    var guidsAreEqual = function (guid1, guid2) {
        /// <summary>
        /// Check if two guids are equal
        /// </summary>
        /// <param name="guid1" type="string">
        /// A string represents a guid
        /// </param>
        /// <param name="guid2" type="string">
        /// A string represents a guid
        /// </param>
        /// <returns type="boolean" />
        var isEqual;
        if (guid1 === null || guid2 === null || guid1 === undefined || guid2 === undefined) {
            isEqual = false;
        } else {
            isEqual = guid1.replace(/[{}]/g, "").toLowerCase() === guid2.replace(/[{}]/g, "").toLowerCase();
        }

        return isEqual;
    };

    var enableField = function (fieldName) {
        /// <summary>
        /// Enable a field by the name
        /// </summary>
        /// <param name="fieldName" type="string">
        /// The name of the field to be enabled
        /// </param>
        /// <returns type="void" />
        Xrm.Page.getControl(fieldName).setDisabled(false);
    };

    var disableField = function (fieldName) {
        /// <summary>
        /// Disable a field by the name
        /// </summary>
        /// <param name="fieldName" type="string">
        /// The name of the field to be disabled
        /// </param>
        /// <returns type="void" />
        Xrm.Page.getControl(fieldName).setDisabled(true);
    };

    var showField = function (fieldName) {
        /// <summary>
        /// Show a field by the name
        /// </summary>
        /// <param name="fieldName" type="string">
        /// The name of the field to be shown
        /// </param>
        /// <returns type="void" />
        Xrm.Page.getControl(fieldName).setVisible(true);
    };

    var hideField = function (fieldName) {
        /// <summary>
        /// Hide a field by the name
        /// </summary>
        /// <param name="fieldName" type="string">
        /// The name of the field to be hidden
        /// </param>
        /// <returns type="void" />
        Xrm.Page.getControl(fieldName).setVisible(false);
    };

    var updateRequirementLevel = function (fieldName, levelName) {
        /// <summary>
        /// Updates the requirement level of a field
        /// </summary>
        /// <param name="fieldName" type="string">
        /// Name of the field
        /// </param>
        /// <param name="levelName" type="string">
        /// Name of the requirement level. [none, recommended, required] (Case Sensitive)
        /// </param>
        /// <returns type="void" />
        Xrm.Page.getAttribute(fieldName).setRequiredLevel(levelName);
    };

    var showError = function (error) {
        /// <summary>
        /// Alert the error message if occurred
        /// </summary>
        /// <param name="error" type="error">
        /// Object of the JavaScript error
        /// </param>
        /// <returns type="void" />
        alertMessage(error.message);
    };

    var getObjectTypeCode = function (entityName) {
        /// <summary>
        /// Gets the EntityTypeCode / ObjectTypeCode of a entity
        /// </summary>
        /// <param name="entityName" type="string">
        /// Name of entity to return object type code of
        /// </param>
        /// <returns type="int" />
        try {
            var entityMetaData = XrmServiceToolkit.Soap.RetrieveEntityMetadata("Entity", entityName, false);
            if (entityMetaData && entityMetaData.length === 1) {
                return entityMetaData[0].ObjectTypeCode;
            } else {
                return null;
            }
        } catch (e) {
            showError(e.message);
            return null;
        }
    };

    var addNotification = function (message, level, uniqueId) {
        /// <summary>
        /// Add a notification bar message with CRM 2011 style
        /// </summary>
        /// <param name="message" type="string">
        /// Details of the message
        /// </param>
        /// <param name="level" type="int">
        /// The warning level of the message: [1 critical, 2 information, 3 warning]
        /// </param>
        /// <param name="uniqueId" type="string">
        /// A unique identifier for the message used with clearFormNotification to remove the notification.
        /// </param>
        /// <returns type="void" />
        if (Xrm.Page.ui.setFormNotification !== undefined) {
            // CRM 2013
            if (!!uniqueId) {
                Xrm.Page.ui.clearFormNotification(uniqueId);
                if (level === 1) {
                    //Error
                    Xrm.Page.ui.setFormNotification(message, "ERROR", uniqueId);
                }
                if (level === 2) {
                    //Info
                    Xrm.Page.ui.setFormNotification(message, "INFO", uniqueId);
                }
                if (level === 3) {
                    //Warning
                    Xrm.Page.ui.setFormNotification(message, "WARNING", uniqueId);
                }
            } else {
                var tempUniqueId = "formNotification00";
                Xrm.Page.ui.clearFormNotification(tempUniqueId);
                if (level === 1) {
                    //Error
                    Xrm.Page.ui.setFormNotification(message, "ERROR", tempUniqueId);
                }
                if (level === 2) {
                    //Info
                    Xrm.Page.ui.setFormNotification(message, "INFO", tempUniqueId);
                }
                if (level === 3) {
                    //Warning
                    Xrm.Page.ui.setFormNotification(message, "WARNING", tempUniqueId);
                }
            }
        } else {
            var notificationsArea = document.getElementById('crmNotifications');
            if (notificationsArea === null || notificationsArea === undefined) {
                alertMessage('Cannot find the notification area');
                return;
            }
            if (typeof notificationsArea.AddNotification !== "undefined" && typeof notificationsArea.control.AddNotification !== "undefined") {
                alertMessage('Add Notification is no longer supported');
                return;
            }
            if (level === 1) {
                //critical
                if (typeof notificationsArea.AddNotification !== "undefined") {
                    notificationsArea.AddNotification('mep1', 1, 'source', message);
                } else if (typeof notificationsArea.control.AddNotification !== "undefined") {
                    notificationsArea.control.AddNotification('mep1', 1, 'source', message);
                }
            }

            if (level === 2) {
                //Info
                if (typeof notificationsArea.AddNotification !== "undefined") {
                    notificationsArea.AddNotification('mep3', 3, 'source', message);
                } else if (typeof notificationsArea.control.AddNotification !== "undefined") {
                    notificationsArea.control.AddNotification('mep3', 3, 'source', message);
                }
            }
            if (level === 3) {
                //Warning
                if (typeof notificationsArea.AddNotification !== "undefined") {
                    notificationsArea.AddNotification('mep2', 2, 'source', message);
                } else if (typeof notificationsArea.control.AddNotification !== "undefined") {
                    notificationsArea.control.AddNotification('mep2', 2, 'source', message);
                }
            }
            if (message === "") {
                if (typeof notificationsArea.SetNotifications !== "undefined") {
                    notificationsArea.SetNotifications(null, null);
                } else if (typeof notificationsArea.control.SetNotifications !== "undefined") {
                    notificationsArea.control.SetNotifications(null, null);
                } else {
                    alertMessage('Set Notification is no longer supported');
                }
            }
        }
    };

    var addControlNotification = function (attributeName, message) {
        if (Xrm.Page.getControl(attributeName).setNotification !== undefined) {
            Xrm.Page.getControl(attributeName).setNotification(message);
        }
    };

    var calculateDaysBetween = function (datetime1, datetime2) {
        /// <summary>
        /// Calculate the days between two dates
        /// </summary>
        /// <param name="datetime1" type="DateTime">
        /// The first / early date to be calculated
        /// </param>
        /// <param name="datetime2" type="DateTime">
        /// The second / later date to e calculated
        /// </param>
        /// <returns type="int" />

        // The number of milliseconds in one day
        var oneDay = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        var date1Ms = datetime1.getTime();
        var date2Ms = datetime2.getTime();

        // Calculate the difference in milliseconds
        var differenceMs = Math.abs(date1Ms - date2Ms); // Convert back to days and return
        return Math.round(differenceMs / oneDay);
    };

    var disableAllControlsInTab = function (tabControlNo) {
        /// <summary>
        /// Disable all controls in a tab by tab number.
        /// </summary>
        /// <param name="tabControlNo" type="int">
        /// The number of the tab
        /// </param>
        /// <returns type="void" />
        var tabControl = Xrm.Page.ui.tabs.get(tabControlNo);
        if (tabControl != null) {
            Xrm.Page.ui.controls.forEach(
                function (control) {
                    if (control.getParent() !== null && control.getParent().getParent() != null && control.getParent().getParent() === tabControl && control.getControlType() !== "subgrid") {
                        control.setDisabled(true);
                    }
                });
        }
    };

    var disableAllControlsInSection = function (sectionLabel) {
        /// <summary>
        /// Disable all controls in a section by section label.
        /// </summary>
        /// <param name="sectionLabel" type="string">
        /// The label of the section
        /// </param>
        /// <returns type="void" />
        var tabs = Xrm.Page.ui.tabs;
        for (var i = 0, tablength = tabs.getLength(); i < tablength; i++) {
            var tab = tabs.get(i);
            var sections = tab.sections;
            for (var j = 0, sectionlength = sections.getLength(); j < sectionlength; j++) {
                var section = sections.get(j);
                if (section.getLabel().toLowerCase() === sectionLabel.toLowerCase()) {
                    Xrm.Page.ui.controls.forEach(
                        function (control) {
                            if (control.getParent() !== null && control.getParent().getLabel() === sectionLabel && control.getControlType() !== "subgrid") {
                                control.setDisabled(true);
                            }
                        });
                    break;
                }
            }
        }
    };

    // Toolkit's public static members
    return {
        EnableField: enableField,
        DisableField: disableField,
        ShowField: showField,
        HideField: hideField,
        UpdateRequiredLevel: updateRequirementLevel,
        GetObjectTypeCode: getObjectTypeCode,
        CalculateDaysBetween: calculateDaysBetween,
        AddNotification: addNotification,
        AddControlNotification: addControlNotification,
        ShowError: showError,
        GuidsAreEqual: guidsAreEqual,
        DisableAllControlsInTab: disableAllControlsInTab,
        DisableAllControlsInSection: disableAllControlsInSection
    };
}();

XrmServiceToolkit.Rest = function () {
    // Private members

    var alertMessage = function (message) {
        (Xrm.Utility !== undefined && Xrm.Utility.alertDialog !== undefined) ? Xrm.Utility.alertDialog(message): alert(message);
    };

    var htmlEncode = function (s) {
        if (s === null || s === "" || s === undefined) return s;
        for (var count = 0, buffer = "", hEncode = "", cnt = 0, slength = s.length; cnt < slength; cnt++) {
            var c = s.charCodeAt(cnt);
            if (c > 96 && c < 123 || c > 64 && c < 91 || c === 32 || c > 47 && c < 58 || c === 46 || c === 44 || c === 45 || c === 95)
                buffer += String.fromCharCode(c);
            else buffer += "&#" + c + ";";
            if (++count === 500) {
                hEncode += buffer;
                buffer = "";
                count = 0;
            }
        }
        if (buffer.length) hEncode += buffer;
        return hEncode;
    };

    var innerSurrogateAmpersandWorkaround = function (s) {
        var buffer = '';
        var c0;
        for (var cnt = 0, slength = s.length; cnt < slength; cnt++) {
            c0 = s.charCodeAt(cnt);
            if (c0 >= 55296 && c0 <= 57343)
                if (cnt + 1 < s.length) {
                    var c1 = s.charCodeAt(cnt + 1);
                    if (c1 >= 56320 && c1 <= 57343) {
                        buffer += "CRMEntityReferenceOpen" + ((c0 - 55296) * 1024 + (c1 & 1023) + 65536).toString(16) + "CRMEntityReferenceClose";
                        cnt++;
                    } else
                        buffer += String.fromCharCode(c0);
                } else buffer += String.fromCharCode(c0);
            else buffer += String.fromCharCode(c0);
        }
        s = buffer;
        buffer = "";
        for (cnt = 0, slength = s.length; cnt < slength; cnt++) {
            c0 = s.charCodeAt(cnt);
            if (c0 >= 55296 && c0 <= 57343)
                buffer += String.fromCharCode(65533);
            else buffer += String.fromCharCode(c0);
        }
        s = buffer;
        s = htmlEncode(s);
        s = s.replace(/CRMEntityReferenceOpen/g, "&#x");
        s = s.replace(/CRMEntityReferenceClose/g, ";");
        return s;
    };

    // ReSharper disable UnusedLocals
    var crmXmlEncode = function (s) {
        // ReSharper restore UnusedLocals
        // ReSharper disable UsageOfPossiblyUnassignedValue
        // ReSharper disable ExpressionIsAlwaysConst
        if ('undefined' === typeof s || 'unknown' === typeof s || null === s) return s;
        // ReSharper restore ExpressionIsAlwaysConst
        // ReSharper restore UsageOfPossiblyUnassignedValue
        else if (typeof s != "string") s = s.toString();
        return innerSurrogateAmpersandWorkaround(s);
    };

    // ReSharper disable UnusedLocals
    var crmXmlDecode = function (s) {
        // ReSharper restore UnusedLocals
        if (typeof s != "string") s = s.toString();
        return s;
    };

    var context = function () {
        ///<summary>
        /// Private function to the context object.
        ///</summary>
        ///<returns>Context</returns>
        var oContext;
        if (typeof window.GetGlobalContext != "undefined") {
            oContext = window.GetGlobalContext();
        } else if (typeof GetGlobalContext != "undefined") {
            oContext = GetGlobalContext();
        } else {
            if (typeof Xrm != "undefined") {
                oContext = Xrm.Page.context;
            } else if (typeof window.parent.Xrm != "undefined") {
                oContext = window.parent.Xrm.Page.context;
            } else {
                throw new Error("Context is not available.");
            }
        }
        return oContext;
    };

    var getClientUrl = function () {
        ///<summary>
        /// Private function to return the server URL from the context
        ///</summary>
        ///<returns>String</returns>
        var serverUrl = typeof context().getClientUrl !== "undefined" ? context().getClientUrl() : context().getServerUrl();
        if (serverUrl.match(/\/$/)) {
            serverUrl = serverUrl.substring(0, serverUrl.length - 1);
        }
        return serverUrl;
    };

    var oDataPath = function () {
        ///<summary>
        /// Private function to return the path to the REST endpoint.
        ///</summary>
        ///<returns>String</returns>
        return getClientUrl() + "/XRMServices/2011/OrganizationData.svc/";
    };

    var errorHandler = function (req) {
        ///<summary>
        /// Private function return an Error object to the errorCallback
        ///</summary>
        ///<param name="req" type="XMLHttpRequest">
        /// The XMLHttpRequest response that returned an error.
        ///</param>
        ///<returns>Error</returns>
        try {
            return new Error("Error : " +
                req.status + ": " +
                req.statusText + ": " +
                JSON.parse(req.responseText).error.message.value);
        } catch (err) {
            // Error status codes: https://support.microsoft.com/en-us/kb/193625
            return new Error("Error : " +
                req.status + ": " +
                req.statusText + ": " +
                "Response text could not be parsed (empty?). WinInet Error codes: https://support.microsoft.com/en-us/kb/193625 ."
            );
        }
    };

    var dateReviver = function (key, value) {
        ///<summary>
        /// Private function to convert matching string values to Date objects.
        ///</summary>
        ///<param name="key" type="String">
        /// The key used to identify the object property
        ///</param>
        ///<param name="value" type="String">
        /// The string value representing a date
        ///</param>
        var a;
        if (typeof value === 'string') {
            a = /Date\(([-+]?\d+)\)/.exec(value);
            if (a) {
                return new Date(parseInt(value.replace("/Date(", "").replace(")/", ""), 10));
            }
        }
        return value;
    };

    var parameterCheck = function (parameter, message) {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="Object">
        /// The parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if ((typeof parameter === "undefined") || parameter === null) {
            throw new Error(message);
        }
    };

    var stringParameterCheck = function (parameter, message) {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="String">
        /// The string parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (typeof parameter != "string") {
            throw new Error(message);
        }
    };

    var callbackParameterCheck = function (callbackParameter, message) {
        ///<summary>
        /// Private function used to check whether required callback parameters are functions
        ///</summary>
        ///<param name="callbackParameter" type="Function">
        /// The callback parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (typeof callbackParameter != "function") {
            throw new Error(message);
        }
    };

    var booleanParameterCheck = function (parameter, message) {
        ///<summary>
        /// Private function used to check whether required parameters are null or undefined
        ///</summary>
        ///<param name="parameter" type="String">
        /// The string parameter to check;
        ///</param>
        ///<param name="message" type="String">
        /// The error message text to include when the error is thrown.
        ///</param>
        if (typeof parameter != "boolean") {
            throw new Error(message);
        }
    };

    var getXhr = function () {
        ///<summary>
        /// Get an instance of XMLHttpRequest for all browsers
        ///</summary>
        if (XMLHttpRequest) {
            // Chrome, Firefox, IE7+, Opera, Safari
            // ReSharper disable InconsistentNaming
            return new XMLHttpRequest();
            // ReSharper restore InconsistentNaming
        }
        // IE6
        try {
            // The latest stable version. It has the best security, performance,
            // reliability, and W3C conformance. Ships with Vista, and available
            // with other OS's via downloads and updates.
            return new ActiveXObject('MSXML2.XMLHTTP.6.0');
        } catch (e) {
            try {
                // The fallback.
                return new ActiveXObject('MSXML2.XMLHTTP.3.0');
            } catch (e) {
                alertMessage('This browser is not AJAX enabled.');
                return null;
            }
        }
    };

    var createRecord = function (object, type, successCallback, errorCallback, async) {
        ///<summary>
        /// Sends synchronous/asynchronous request to create a new record.
        ///</summary>
        ///<param name="object" type="Object">
        /// A JavaScript object with properties corresponding to the Schema name of
        /// entity attributes that are valid for create operations.
        ///</param>
        parameterCheck(object, "XrmServiceToolkit.REST.createRecord requires the object parameter.");
        ///<param name="type" type="string">
        /// A String representing the name of the entity
        ///</param>
        stringParameterCheck(type, "XrmServiceToolkit.REST.createRecord requires the type parameter is a string.");
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response.
        /// This function can accept the returned record as a parameter.
        /// </param>
        callbackParameterCheck(successCallback, "XrmServiceToolkit.REST.createRecord requires the successCallback is a function.");
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response.
        /// This function must accept an Error object as a parameter.
        /// </param>
        callbackParameterCheck(errorCallback, "XrmServiceToolkit.REST.createRecord requires the errorCallback is a function.");
        ///<param name="async" type="Boolean">
        /// A Boolean representing if the method should run asynchronously or synchronously
        /// true means asynchronously. false means synchronously
        /// </param>
        booleanParameterCheck(async, "XrmServiceToolkit.REST.createRecord requires the async is a boolean.");

        var req = getXhr();
        req.open("POST", oDataPath() + type, async);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");

        if (async) {
            req.onreadystatechange = function () {
                if (this.readyState === 4 /* complete */ ) {
                    req.onreadystatechange = null;
                    if (req.status === 201) {
                        successCallback(JSON.parse(req.responseText, dateReviver).d);
                    } else {
                        errorCallback(errorHandler(req));
                    }
                }
            };
            req.send(JSON.stringify(object));
        } else {
            req.send(JSON.stringify(object));
            if (req.status === 201) {
                successCallback(JSON.parse(req.responseText, dateReviver).d);
            } else {
                errorCallback(errorHandler(req));
            }
        }

    };

    var retrieveRecord = function (id, type, select, expand, successCallback, errorCallback, async) {
        ///<summary>
        /// Sends synchronous/asynchronous request to retrieve a record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to retrieve.
        ///</param>
        stringParameterCheck(id, "XrmServiceToolkit.REST.retrieveRecord requires the id parameter is a string.");
        ///<param name="type" type="string">
        /// A String representing the name of the entity
        ///</param>
        stringParameterCheck(type, "XrmServiceToolkit.REST.retrieveRecord requires the type parameter is a string.");
        ///<param name="select" type="String">
        /// A String representing the $select OData System Query Option to control which
        /// attributes will be returned. This is a comma separated list of Attribute names that are valid for retrieve.
        /// If null all properties for the record will be returned
        ///</param>
        if (select != null)
            stringParameterCheck(select, "XrmServiceToolkit.REST.retrieveRecord requires the select parameter is a string.");
        ///<param name="expand" type="String">
        /// A String representing the $expand OData System Query Option value to control which
        /// related records are also returned. This is a comma separated list of of up to 6 entity relationship names
        /// If null no expanded related records will be returned.
        ///</param>
        if (expand != null)
            stringParameterCheck(expand, "XrmServiceToolkit.REST.retrieveRecord requires the expand parameter is a string.");
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response.
        /// This function must accept the returned record as a parameter.
        /// </param>
        callbackParameterCheck(successCallback, "XrmServiceToolkit.REST.retrieveRecord requires the successCallback parameter is a function.");
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response.
        /// This function must accept an Error object as a parameter.
        /// </param>
        callbackParameterCheck(errorCallback, "XrmServiceToolkit.REST.retrieveRecord requires the errorCallback parameter is a function.");
        ///<param name="async" type="Boolean">
        /// A Boolean representing if the method should run asynchronously or synchronously
        /// true means asynchronously. false means synchronously
        /// </param>
        booleanParameterCheck(async, "XrmServiceToolkit.REST.retrieveRecord requires the async parameter is a boolean.");

        var systemQueryOptions = "";

        if (select != null || expand != null) {
            systemQueryOptions = "?";
            if (select != null) {
                var selectString = "$select=" + select;
                if (expand != null) {
                    selectString = selectString + "," + expand;
                }
                systemQueryOptions = systemQueryOptions + selectString;
            }
            if (expand != null) {
                systemQueryOptions = systemQueryOptions + "&$expand=" + expand;
            }
        }

        var req = getXhr();
        req.open("GET", oDataPath() + type + "(guid'" + id + "')" + systemQueryOptions, async);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");

        if (async) {
            req.onreadystatechange = function () {
                if (req.readyState === 4 /* complete */ ) {
                    if (req.status === 200) {
                        successCallback(JSON.parse(req.responseText, dateReviver).d);
                    } else {
                        errorCallback(errorHandler(req));
                    }
                }
            };
            req.send();
        } else {
            req.send();
            if (req.status === 200) {
                successCallback(JSON.parse(req.responseText, dateReviver).d);
            } else {
                errorCallback(errorHandler(req));
            }
        }

    };

    var updateRecord = function (id, object, type, successCallback, errorCallback, async) {
        ///<summary>
        /// Sends synchronous/asynchronous request to update a record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to update.
        ///</param>
        stringParameterCheck(id, "XrmServiceToolkit.REST.updateRecord requires the id parameter.");
        ///<param name="object" type="Object">
        /// A JavaScript object with properties corresponding to the Schema name of
        /// entity attributes that are valid for create operations.
        ///</param>
        parameterCheck(object, "XrmServiceToolkit.REST.updateRecord requires the object parameter.");
        ///<param name="type" type="string">
        /// A String representing the name of the entity
        ///</param>
        stringParameterCheck(type, "XrmServiceToolkit.REST.updateRecord requires the type parameter.");
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response.
        /// Nothing will be returned to this function.
        /// </param>
        callbackParameterCheck(successCallback, "XrmServiceToolkit.REST.updateRecord requires the successCallback is a function.");
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response.
        /// This function must accept an Error object as a parameter.
        /// </param>
        callbackParameterCheck(errorCallback, "XrmServiceToolkit.REST.updateRecord requires the errorCallback is a function.");
        ///<param name="async" type="Boolean">
        /// A Boolean representing if the method should run asynchronously or synchronously
        /// true means asynchronously. false means synchronously
        /// </param>
        booleanParameterCheck(async, "XrmServiceToolkit.REST.updateRecord requires the async parameter is a boolean.");

        var req = getXhr();

        req.open("POST", oDataPath() + type + "(guid'" + id + "')", async);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("X-HTTP-Method", "MERGE");

        if (async) {
            req.onreadystatechange = function () {
                if (req.readyState === 4 /* complete */ ) {
                    if (req.status === 204 || req.status === 1223) {
                        successCallback();
                    } else {
                        errorCallback(errorHandler(req));
                    }
                }
            };
            req.send(JSON.stringify(object));
        } else {
            req.send(JSON.stringify(object));
            if (req.status === 204 || req.status === 1223) {
                successCallback();
            } else {
                errorCallback(errorHandler(req));
            }
        }

    };

    var deleteRecord = function (id, type, successCallback, errorCallback, async) {
        ///<summary>
        /// Sends synchronous/asynchronous request to delete a record.
        ///</summary>
        ///<param name="id" type="String">
        /// A String representing the GUID value for the record to delete.
        ///</param>
        stringParameterCheck(id, "XrmServiceToolkit.REST.deleteRecord requires the id parameter.");
        ///<param name="type" type="string">
        /// A String representing the name of the entity
        ///</param>
        stringParameterCheck(type, "XrmServiceToolkit.REST.deleteRecord requires the type parameter.");
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response.
        /// Nothing will be returned to this function.
        /// </param>
        callbackParameterCheck(successCallback, "XrmServiceToolkit.REST.deleteRecord requires the successCallback is a function.");
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response.
        /// This function must accept an Error object as a parameter.
        /// </param>
        callbackParameterCheck(errorCallback, "XrmServiceToolkit.REST.deleteRecord requires the errorCallback is a function.");
        ///<param name="async" type="Boolean">
        /// A Boolean representing if the method should run asynchronously or synchronously
        /// true means asynchronously. false means synchronously
        /// </param>
        booleanParameterCheck(async, "XrmServiceToolkit.REST.deleteRecord requires the async parameter is a boolean.");

        var req = getXhr();
        req.open("POST", oDataPath() + type + "(guid'" + id + "')", async);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("X-HTTP-Method", "DELETE");

        if (async) {
            req.onreadystatechange = function () {
                if (req.readyState === 4 /* complete */ ) {
                    if (req.status === 204 || req.status === 1223) {
                        successCallback();
                    } else {
                        errorCallback(errorHandler(req));
                    }
                }
            };
            req.send();
        } else {
            req.send();
            if (req.status === 204 || req.status === 1223) {
                successCallback();
            } else {
                errorCallback(errorHandler(req));
            }
        }
    };

    var retrieveMultipleRecords = function (type, options, successCallback, errorCallback, onComplete, async) {
        ///<summary>
        /// Sends synchronous/asynchronous request to retrieve records.
        ///</summary>
        ///<param name="type" type="String">
        /// The Schema Name of the Entity type record to retrieve.
        /// For an Account record, use "Account"
        ///</param>
        stringParameterCheck(type, "XrmServiceToolkit.REST.retrieveMultipleRecords requires the type parameter is a string.");
        ///<param name="options" type="String">
        /// A String representing the OData System Query Options to control the data returned
        ///</param>
        if (options != null)
            stringParameterCheck(options, "XrmServiceToolkit.REST.retrieveMultipleRecords requires the options parameter is a string.");
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called for each page of records returned.
        /// Each page is 50 records. If you expect that more than one page of records will be returned,
        /// this function should loop through the results and push the records into an array outside of the function.
        /// Use the OnComplete event handler to know when all the records have been processed.
        /// </param>
        callbackParameterCheck(successCallback, "XrmServiceToolkit.REST.retrieveMultipleRecords requires the successCallback parameter is a function.");
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response.
        /// This function must accept an Error object as a parameter.
        /// </param>
        callbackParameterCheck(errorCallback, "XrmServiceToolkit.REST.retrieveMultipleRecords requires the errorCallback parameter is a function.");
        ///<param name="OnComplete" type="Function">
        /// The function that will be called when all the requested records have been returned.
        /// No parameters are passed to this function.
        /// </param>
        callbackParameterCheck(onComplete, "XrmServiceToolkit.REST.retrieveMultipleRecords requires the OnComplete parameter is a function.");
        ///<param name="async" type="Boolean">
        /// A Boolean representing if the method should run asynchronously or synchronously
        /// true means asynchronously. false means synchronously
        /// </param>
        booleanParameterCheck(async, "XrmServiceToolkit.REST.retrieveMultipleRecords requires the async parameter is a boolean.");

        var optionsString = '';
        if (options != null) {
            if (options.charAt(0) !== "?") {
                optionsString = "?" + options;
            } else {
                optionsString = options;
            }
        }

        var req = getXhr();
        req.open("GET", oDataPath() + type + optionsString, async);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");

        if (async) {
            req.onreadystatechange = function () {
                if (req.readyState === 4 /* complete */ ) {
                    if (req.status === 200) {
                        var returned = JSON.parse(req.responseText, dateReviver).d;
                        successCallback(returned.results);
                        if (returned.__next == null) {
                            onComplete();
                        } else {
                            var queryOptions = returned.__next.substring((oDataPath() + type).length);
                            retrieveMultipleRecords(type, queryOptions, successCallback, errorCallback, onComplete, async);
                        }
                    } else {
                        errorCallback(errorHandler(req));
                    }
                }
            };
            req.send();
        } else {
            req.send();
            if (req.status === 200) {
                var returned = JSON.parse(req.responseText, dateReviver).d;
                successCallback(returned.results);
                if (returned.__next == null) {
                    onComplete();
                } else {
                    var queryOptions = returned.__next.substring((oDataPath() + type).length);
                    retrieveMultipleRecords(type, queryOptions, successCallback, errorCallback, onComplete, async);
                }
            } else {
                errorCallback(errorHandler(req));
            }
        }
    };

    var performRequest = function (settings) {
        parameterCheck(settings, "The value passed to the performRequest function settings parameter is null or undefined.");
        var request = getXhr();
        request.open(settings.type, settings.url, settings.async);
        request.setRequestHeader("Accept", "application/json");
        if (settings.action != null) {
            request.setRequestHeader("X-HTTP-Method", settings.action);
        }
        request.setRequestHeader("Content-Type", "application/json; charset=utf-8");

        if (settings.async) {
            request.onreadystatechange = function () {
                if (request.readyState === 4 /*Complete*/ ) {
                    // Status 201 is for create, status 204/1223 for link and delete.
                    // There appears to be an issue where IE maps the 204 status to 1223
                    // when no content is returned.
                    if (request.status === 204 || request.status === 1223 || request.status === 201) {
                        settings.success(request);
                    } else {
                        // Failure
                        if (settings.error) {
                            settings.error(errorHandler(request));
                        } else {
                            errorHandler(request);
                        }
                    }
                }
            };

            if (typeof settings.data === "undefined") {
                request.send();
            } else {
                request.send(settings.data);
            }
        } else {
            if (typeof settings.data === "undefined") {
                request.send();
            } else {
                request.send(settings.data);
            }
            if (request.status === 204 || request.status === 1223 || request.status === 201) {
                settings.success(request);
            } else {
                // Failure
                if (settings.error) {
                    settings.error(errorHandler(request));
                } else {
                    errorHandler(request);
                }
            }
        }

    };

    var associateRecord = function (entityid1, odataSetName1, entityid2, odataSetName2, relationship, successCallback, errorCallback, async) {
        ///<summary>
        /// Sends synchronous/asynchronous request to associate a record.
        ///</summary>
        ///<param name="entityid1" type="string">
        /// A String representing the GUID value for the record to associate.
        ///</param>
        parameterCheck(entityid1, "XrmServiceToolkit.REST.associateRecord requires the entityid1 parameter.");
        ///<param name="odataSetName1" type="string">
        /// A String representing the odataset name for entityid1
        ///</param>
        parameterCheck(odataSetName1, "XrmServiceToolkit.REST.associateRecord requires the odataSetName1 parameter.");
        ///<param name="entityid2" type="string">
        /// A String representing the GUID value for the record to be associated.
        ///</param>
        parameterCheck(entityid2, "XrmServiceToolkit.REST.associateRecord requires the entityid2 parameter.");
        ///<param name="odataSetName2" type="string">
        /// A String representing the odataset name for entityid2
        ///</param>
        parameterCheck(odataSetName2, "XrmServiceToolkit.REST.associateRecord requires the odataSetName2 parameter.");
        ///<param name="relationship" type="string">
        /// A String representing the name of the relationship for association
        ///</param>
        parameterCheck(relationship, "XrmServiceToolkit.REST.associateRecord requires the relationship parameter.");
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response.
        /// Nothing will be returned to this function.
        /// </param>
        callbackParameterCheck(successCallback, "XrmServiceToolkit.REST.associateRecord requires the successCallback is a function.");
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response.
        /// This function must accept an Error object as a parameter.
        /// </param>
        callbackParameterCheck(errorCallback, "XrmServiceToolkit.REST.associateRecord requires the errorCallback is a function.");
        ///<param name="async" type="Boolean">
        /// A Boolean representing if the method should run asynchronously or synchronously
        /// true means asynchronously. false means synchronously
        /// </param>
        booleanParameterCheck(async, "XrmServiceToolkit.REST.associateRecord requires the async parameter is a boolean");

        var entity2 = {};
        entity2.uri = oDataPath() + "/" + odataSetName2 + "(guid'" + entityid2 + "')";
        var jsonEntity = window.JSON.stringify(entity2);

        performRequest({
            type: "POST",
            url: oDataPath() + "/" + odataSetName1 + "(guid'" + entityid1 + "')/$links/" + relationship,
            data: jsonEntity,
            success: successCallback,
            error: errorCallback,
            async: async
        });
    };

    var disassociateRecord = function (entityid1, odataSetName, entityid2, relationship, successCallback, errorCallback, async) {
        ///<summary>
        /// Sends synchronous/asynchronous request to disassociate a record.
        ///</summary>
        ///<param name="entityid1" type="string">
        /// A String representing the GUID value for the record to disassociate.
        ///</param>
        parameterCheck(entityid1, "XrmServiceToolkit.REST.disassociateRecord requires the entityid1 parameter.");
        ///<param name="odataSetName" type="string">
        /// A String representing the odataset name for entityid1
        ///</param>
        parameterCheck(odataSetName, "XrmServiceToolkit.REST.disassociateRecord requires the odataSetName parameter.");
        ///<param name="entityid2" type="string">
        /// A String representing the GUID value for the record to be disassociated.
        ///</param>
        parameterCheck(entityid2, "XrmServiceToolkit.REST.disassociateRecord requires the entityid2 parameter.");
        ///<param name="relationship" type="string">
        /// A String representing the name of the relationship for disassociation
        ///</param>
        parameterCheck(relationship, "XrmServiceToolkit.REST.disassociateRecord requires the relationship parameter.");
        ///<param name="successCallback" type="Function">
        /// The function that will be passed through and be called by a successful response.
        /// Nothing will be returned to this function.
        /// </param>
        callbackParameterCheck(successCallback, "XrmServiceToolkit.REST.disassociateRecord requires the successCallback is a function.");
        ///<param name="errorCallback" type="Function">
        /// The function that will be passed through and be called by a failed response.
        /// This function must accept an Error object as a parameter.
        /// </param>
        callbackParameterCheck(errorCallback, "XrmServiceToolkit.REST.disassociateRecord requires the errorCallback is a function.");
        ///<param name="async" type="Boolean">
        /// A Boolean representing if the method should run asynchronously or synchronously
        /// true means asynchronously. false means synchronously
        /// </param>
        booleanParameterCheck(async, "XrmServiceToolkit.REST.disassociateRecord requires the async parameter is a boolean.");

        var url = oDataPath() + "/" + odataSetName + "(guid'" + entityid1 + "')/$links/" + relationship + "(guid'" + entityid2 + "')";
        performRequest({
            url: url,
            type: "POST",
            action: "DELETE",
            error: errorCallback,
            success: successCallback,
            async: async
        });
    };

    // Toolkit's public static members
    return {
        Create: createRecord,
        Retrieve: retrieveRecord,
        Update: updateRecord,
        Delete: deleteRecord,
        RetrieveMultiple: retrieveMultipleRecords,
        Associate: associateRecord,
        Disassociate: disassociateRecord
    };
}();

XrmServiceToolkit.Soap = function () {

    var alertMessage = function (message) {
        (Xrm.Utility !== undefined && Xrm.Utility.alertDialog !== undefined) ? Xrm.Utility.alertDialog(message): alert(message);
    };

    var htmlEncode = function (s) {
        if (s === null || s === "" || s === undefined) return s;
        for (var count = 0, buffer = "", hEncode = "", cnt = 0, sLength = s.length; cnt < sLength; cnt++) {
            var c = s.charCodeAt(cnt);
            if (c > 96 && c < 123 || c > 64 && c < 91 || c === 32 || c > 47 && c < 58 || c === 46 || c === 44 || c === 45 || c === 95)
                buffer += String.fromCharCode(c);
            else buffer += "&#" + c + ";";
            if (++count === 500) {
                hEncode += buffer;
                buffer = "";
                count = 0;
            }
        }
        if (buffer.length) hEncode += buffer;
        return hEncode;
    };

    var innerSurrogateAmpersandWorkaround = function (s) {
        var buffer = '';
        var c0;
        var cnt;
        var cntlength;
        for (cnt = 0, cntlength = s.length; cnt < cntlength; cnt++) {
            c0 = s.charCodeAt(cnt);
            if (c0 >= 55296 && c0 <= 57343)
                if (cnt + 1 < s.length) {
                    var c1 = s.charCodeAt(cnt + 1);
                    if (c1 >= 56320 && c1 <= 57343) {
                        buffer += "CRMEntityReferenceOpen" + ((c0 - 55296) * 1024 + (c1 & 1023) + 65536).toString(16) + "CRMEntityReferenceClose";
                        cnt++;
                    } else
                        buffer += String.fromCharCode(c0);
                } else buffer += String.fromCharCode(c0);
            else buffer += String.fromCharCode(c0);
        }
        s = buffer;
        buffer = "";
        for (cnt = 0, cntlength = s.length; cnt < cntlength; cnt++) {
            c0 = s.charCodeAt(cnt);
            if (c0 >= 55296 && c0 <= 57343)
                buffer += String.fromCharCode(65533);
            else buffer += String.fromCharCode(c0);
        }
        s = buffer;
        s = htmlEncode(s);
        s = s.replace(/CRMEntityReferenceOpen/g, "&#x");
        s = s.replace(/CRMEntityReferenceClose/g, ";");
        return s;
    };

    var crmXmlEncode = function (s) {
        // ReSharper disable UsageOfPossiblyUnassignedValue
        // ReSharper disable ExpressionIsAlwaysConst
        if ('undefined' === typeof s || 'unknown' === typeof s || null === s) return s;
        // ReSharper restore ExpressionIsAlwaysConst
        // ReSharper restore UsageOfPossiblyUnassignedValue
        else if (typeof s != "string") s = s.toString();
        return innerSurrogateAmpersandWorkaround(s);
    };

    var crmXmlDecode = function (s) {
        if (typeof s != "string") s = s.toString();
        return s;
    };

    var padNumber = function (s, len) {
        len = len || 2;

        s = '' + s;
        while (s.length < len) {
            s = "0" + s;
        }
        return s;
    };

    var encodeDate = function (dateTime) {
        return dateTime.getFullYear() + "-" +
            padNumber(dateTime.getMonth() + 1) + "-" +
            padNumber(dateTime.getDate()) + "T" +
            padNumber(dateTime.getHours()) + ":" +
            padNumber(dateTime.getMinutes()) + ":" +
            padNumber(dateTime.getSeconds());
    };

    var encodeValue = function (value) {
        // Handle GUIDs wrapped in braces
        if (typeof value == "string") {
            value = value.replace(/[{}]/g, "");
        }

        // ReSharper disable QualifiedExpressionMaybeNull
        return (typeof value === "object" && value.getTime)
            // ReSharper restore QualifiedExpressionMaybeNull
            ?
            encodeDate(value) :
            crmXmlEncode(value);
    };

    var context = function () {
        ///<summary>
        /// Private function to the context object.
        ///</summary>
        ///<returns>Context</returns>
        var oContext;
        if (typeof window.GetGlobalContext != "undefined") {
            oContext = window.GetGlobalContext();
        } else if (typeof GetGlobalContext != "undefined") {
            oContext = GetGlobalContext();
        } else {
            if (typeof Xrm != "undefined") {
                oContext = Xrm.Page.context;
            } else if (typeof window.parent.Xrm != "undefined") {
                oContext = window.parent.Xrm.Page.context;
            } else {
                throw new Error("Context is not available.");
            }
        }
        return oContext;
    };

    var getClientUrl = function () {
        ///<summary>
        /// Private function to return the server URL from the context
        ///</summary>
        ///<returns>String</returns>
        var serverUrl = typeof context().getClientUrl != 'undefined' ? context().getClientUrl() : context().getServerUrl();
        if (serverUrl.match(/\/$/)) {
            serverUrl = serverUrl.substring(0, serverUrl.length - 1);
        }
        return serverUrl;
    };

    var orgServicePath = function () {
        ///<summary>
        /// Private function to return the path to the organization service.
        ///</summary>
        ///<returns>String</returns>
        return getClientUrl() + "/XRMServices/2011/Organization.svc/web";
    };

    // ReSharper disable UnusedLocals
    var dateReviver = function (key, value) {
        // ReSharper restore UnusedLocals
        ///<summary>
        /// Private function to convert matching string values to Date objects.
        ///</summary>
        ///<param name="key" type="String">
        /// The key used to identify the object property
        ///</param>
        ///<param name="value" type="String">
        /// The string value representing a date
        ///</param>
        var a;
        if (typeof value === 'string') {
            a = /Date\(([-+]?\d+)\)/.exec(value);
            if (a) {
                return new Date(parseInt(value.replace("/Date(", "").replace(")/", ""), 10));
            }
        }
        return value;
    };

    var xrmValue = function (sType, sValue) {
        this.type = sType;
        this.value = sValue;
    };

    var xrmEntityReference = function (gId, sLogicalName, sName) {
        this.id = gId;
        this.logicalName = sLogicalName;
        this.name = sName;
        this.type = 'EntityReference';
    };

    var xrmEntityCollection = function (items) {
        this.value = items;
        this.type = 'EntityCollection';
    };

    var xrmOptionSetValue = function (iValue, sFormattedValue) {
        this.value = iValue;
        this.formattedValue = sFormattedValue;
        this.type = 'OptionSetValue';
    };

    var businessEntity = function (logicalName, id) {
        ///<summary>
        /// A object represents a business entity for CRM 2011.
        ///</summary>
        ///<param name="logicalName" type="String">
        /// A String represents the name of the entity.
        /// For example, "contact" means the business entity will be a contact entity
        /// </param>
        ///<param name="id" type="String">
        /// A String represents the id of the entity. If not passed, it will be auto populated as a empty guid string
        /// </param>
        this.id = (!id) ? "00000000-0000-0000-0000-000000000000" : id;
        this.logicalName = logicalName;
        this.attributes = new Object();
    };

    var stringToDate = function (s) {
        var b = s.split(/\D/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5]));
    };

    var nsResolver = function (prefix) {
        var ns = {
            "s": "http://schemas.xmlsoap.org/soap/envelope/",
            "a": "http://schemas.microsoft.com/xrm/2011/Contracts",
            "i": "http://www.w3.org/2001/XMLSchema-instance",
            "b": "http://schemas.datacontract.org/2004/07/System.Collections.Generic",
            "c": "http://schemas.microsoft.com/xrm/2011/Metadata",
            "ser": "http://schemas.microsoft.com/xrm/2011/Contracts/Services"
        };
        return ns[prefix] || null;
    };

    var isNodeNull = function (node) {
        if (node == null) {
            return true;
        }
        if ((node.attributes.getNamedItem("i:nil") != null) && (node.attributes.getNamedItem("i:nil").value === "true")) {
            return true;
        }
        return false;
    };

    var selectNodes = function (node, xPathExpression) {
        if (typeof (node.selectNodes) != "undefined") {
            return node.selectNodes(xPathExpression);
        } else {
            var output = [];
            var xPathResults = node.evaluate(xPathExpression, node, nsResolver, XPathResult.ANY_TYPE, null);
            var result = xPathResults.iterateNext();
            while (result) {
                output.push(result);
                result = xPathResults.iterateNext();
            }
            return output;
        }
    };

    var selectSingleNode = function (node, xpathExpr) {
        if (typeof (node.selectSingleNode) != "undefined") {
            return node.selectSingleNode(xpathExpr);
        } else {
            var xpe = new XPathEvaluator();
            var results = xpe.evaluate(xpathExpr, node, nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            return results.singleNodeValue;

        }
    };

    var selectSingleNodeText = function (node, xpathExpr) {
        var x = selectSingleNode(node, xpathExpr);
        if (isNodeNull(x)) {
            return null;
        }
        if (typeof (x.text) != "undefined") {
            return x.text;
        } else {
            return x.textContent;
        }
    };

    var getNodeText = function (node) {
        if (typeof (node.text) != "undefined") {
            return node.text;
        } else {
            return node.textContent;
        }
    };

    var setSelectionNamespaces = function (doc) {
        var namespaces = [
            "xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'",
            "xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'",
            "xmlns:i='http://www.w3.org/2001/XMLSchema-instance'",
            "xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'",
            "xmlns:c='http://schemas.microsoft.com/xrm/2011/Metadata'",
            "xmlns:ser='http://schemas.microsoft.com/xrm/2011/Contracts/Services'"
        ];
        doc.setProperty("SelectionNamespaces", namespaces.join(" "));
    };

    var xmlParser = function (txt) {
        ///<summary>
        /// cross browser responseXml to return a XML object
        ///</summary>
        var xmlDoc = null;
        try {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(txt);
        } catch (e) {
            if (window.DOMParser) {
                // ReSharper disable InconsistentNaming
                var parser = new DOMParser();
                // ReSharper restore InconsistentNaming
                xmlDoc = parser.parseFromString(txt, "text/xml");
            } else {
                alertMessage("Cannot convert the XML string to a cross-browser XML object.");
            }
        }

        return xmlDoc;
    };

    var xmlToString = function (responseXml) {
        var xmlString = '';
        try {
            if (responseXml != null) {
                if (typeof XMLSerializer !== "undefined" && typeof responseXml.xml === "undefined") {
                    // ReSharper disable InconsistentNaming
                    xmlString = (new XMLSerializer()).serializeToString(responseXml);
                    // ReSharper restore InconsistentNaming
                } else {
                    if (typeof responseXml.xml !== "undefined") {
                        xmlString = responseXml.xml;
                    } else if (typeof responseXml[0].xml !== "undefined") {
                        xmlString = responseXml[0].xml;
                    }

                }
            }
        } catch (e) {
            alertMessage("Cannot convert the XML to a string.");
        }
        return xmlString;
    };

    businessEntity.prototype = {
        /**
         * Serialize a CRM Business Entity object to XML string in order to be passed to CRM Web Services.
         * @return {String} The serialized XML string of CRM entity.
         */
        serialize: function () {
            var xml = ["<b:value i:type='a:Entity'>"];
            xml.push('<a:Attributes xmlns:b="http://schemas.datacontract.org/2004/07/System.Collections.Generic">');
            var attributes = this.attributes;
            for (var attributeName in attributes) {
                if (attributes.hasOwnProperty(attributeName)) {
                    var attribute = attributes[attributeName];

                    xml.push("<a:KeyValuePairOfstringanyType>");
                    xml.push("<b:key>", attributeName, "</b:key>");

                    if (attribute === null || attribute.value === null) {
                        xml.push("<b:value i:nil='true' />");
                    } else {
                        var sType = (!attribute.type) ?
                            typeof attribute :
                            crmXmlEncode(attribute.type);
                        var value;
                        var encodedValue;
                        var id;
                        var encodedId;
                        var logicalName;
                        var encodedLogicalName;
                        switch (sType) {
                            case "OptionSetValue":
                                value = (attribute.hasOwnProperty("value")) ? attribute["value"] : attribute;
                                encodedValue = encodeValue(value);
                                xml.push("<b:value i:type='a:OptionSetValue'>");
                                xml.push("<a:Value>", encodedValue, "</a:Value>", "</b:value>");
                                break;

                            case "EntityCollection":
                                xml.push("<b:value i:type='a:EntityCollection'>");
                                xml.push("<a:Entities>");
                                value = (attribute.hasOwnProperty("value")) ? attribute["value"] : attribute;
                                var collections = isArray(value) ? value : [value];

                                for (var i = 0, collectionLengh = collections.length; i < collectionLengh; i++) {
                                    var item = collections[i];
                                    id = (item.hasOwnProperty("id")) ? item["id"] : item;
                                    encodedId = encodeValue(id);
                                    logicalName = (item.hasOwnProperty("logicalName")) ? item["logicalName"] : item;
                                    encodedLogicalName = encodeValue(logicalName);
                                    xml.push("<a:Entity>");
                                    xml.push("<a:Attributes>");
                                    xml.push("<a:KeyValuePairOfstringanyType>");
                                    xml.push("<b:key>partyid</b:key>");
                                    xml.push("<b:value i:type='a:EntityReference'>");
                                    xml.push("<a:Id>", encodedId, "</a:Id>");
                                    if (Xrm.Utility.openQuickCreate !== undefined) {
                                        xml.push("<a:KeyAttributes xmlns:c='http://schemas.microsoft.com/xrm/7.1/Contracts' />");
                                    }
                                    xml.push("<a:LogicalName>", encodedLogicalName, "</a:LogicalName>");
                                    xml.push("<a:Name i:nil='true' />");
                                    if (Xrm.Utility.openQuickCreate !== undefined) {
                                        xml.push("<a:RowVersion i:nil='true' />");
                                    }
                                    xml.push("</b:value>");
                                    xml.push("</a:KeyValuePairOfstringanyType>");
                                    xml.push("</a:Attributes>");
                                    xml.push("<a:EntityState i:nil='true' />");
                                    xml.push("<a:FormattedValues />");
                                    xml.push("<a:Id>00000000-0000-0000-0000-000000000000</a:Id>");
                                    xml.push("<a:LogicalName>activityparty</a:LogicalName>");
                                    xml.push("<a:RelatedEntities />");
                                    xml.push("</a:Entity>");
                                }
                                xml.push("</a:Entities>");
                                xml.push("<a:EntityName i:nil='true' />");
                                xml.push("<a:MinActiveRowVersion i:nil='true' />");
                                xml.push("<a:MoreRecords>false</a:MoreRecords>");
                                xml.push("<a:PagingCookie i:nil='true' />");
                                xml.push("<a:TotalRecordCount>0</a:TotalRecordCount>");
                                xml.push("<a:TotalRecordCountLimitExceeded>false</a:TotalRecordCountLimitExceeded>");
                                xml.push("</b:value>");
                                break;

                            case "EntityReference":
                                id = (attribute.hasOwnProperty("id")) ? attribute["id"] : attribute;
                                encodedId = encodeValue(id);
                                logicalName = (attribute.hasOwnProperty("logicalName")) ? attribute["logicalName"] : attribute;
                                encodedLogicalName = encodeValue(logicalName);
                                xml.push("<b:value i:type='a:EntityReference'>");
                                xml.push("<a:Id>", encodedId, "</a:Id>");
                                if (Xrm.Utility.openQuickCreate !== undefined) {
                                    xml.push("<a:KeyAttributes xmlns:c='http://schemas.microsoft.com/xrm/7.1/Contracts' />");
                                }
                                xml.push("<a:LogicalName>", encodedLogicalName, "</a:LogicalName>");
                                xml.push("<a:Name i:nil='true' />");
                                if (Xrm.Utility.openQuickCreate !== undefined) {
                                    xml.push("<a:RowVersion i:nil='true' />");
                                }
                                xml.push("</b:value>");
                                break;

                            case "Money":
                                value = (attribute.hasOwnProperty("value")) ? attribute["value"] : attribute;
                                encodedValue = encodeValue(value);
                                xml.push("<b:value i:type='a:Money'>");
                                xml.push("<a:Value>", encodedValue, "</a:Value>", "</b:value>");
                                break;

                            case "guid":
                                value = (attribute.hasOwnProperty("value")) ? attribute["value"] : attribute;
                                encodedValue = encodeValue(value);
                                xml.push("<b:value i:type='c:guid' xmlns:c='http://schemas.microsoft.com/2003/10/Serialization/'>");
                                xml.push(encodedValue, "</b:value>");
                                break;

                            case "number":
                                value = (attribute.hasOwnProperty("value")) ? attribute["value"] : attribute;
                                encodedValue = encodeValue(value);
                                var oType = (String(parseInt(value, 10)) === encodedValue) ? "c:int" : "c:decimal";
                                xml.push("<b:value i:type='", oType, "' xmlns:c='http://www.w3.org/2001/XMLSchema'>");
                                xml.push(encodedValue, '</b:value>');
                                break;

                            default:
                                value = (attribute.hasOwnProperty("value")) ? attribute["value"] : attribute;
                                encodedValue = encodeValue(value);
                                sType = (typeof value === "object" && value.getTime) ? "dateTime" : sType;
                                xml.push("<b:value i:type='c:", sType, "' xmlns:c='http://www.w3.org/2001/XMLSchema'>", encodedValue, "</b:value>");
                                break;
                        }
                    }
                    xml.push("</a:KeyValuePairOfstringanyType>");
                }
            }

            xml.push("</a:Attributes><a:EntityState i:nil='true' />");
            xml.push("<a:FormattedValues xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic' />");
            xml.push("<a:Id>", encodeValue(this.id), "</a:Id>");
            xml.push("<a:LogicalName>", this.logicalName, "</a:LogicalName>");
            xml.push("<a:RelatedEntities xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic' />");
            xml.push("</b:value>");
            return xml.join("");
        },

        /**
         * Deserialize an XML node into a CRM Business Entity object. The XML node comes from CRM Web Service's response.
         * @param {object} resultNode The XML node returned from CRM Web Service's Fetch, Retrieve, RetrieveMultiple messages.
         */
        deserialize: function (resultNode) {
            var obj = new Object();
            var resultNodes = resultNode.childNodes;

            for (var j = 0, lenj = resultNodes.length; j < lenj; j++) {
                var sKey;
                var parentNode = resultNodes[j];
                switch (parentNode.nodeName) {
                    case "a:Attributes":
                        var attr = parentNode;
                        for (var k = 0, lenk = attr.childNodes.length; k < lenk; k++) {
                            var tempParentNode = attr.childNodes[k];
                            // Establish the Key for the Attribute
                            var tempParentNodeChildNodes = tempParentNode.childNodes;
                            sKey = getNodeText(tempParentNodeChildNodes[0]);

                            var tempNode = tempParentNodeChildNodes[1];
                            // Determine the Type of Attribute value we should expect
                            var sType = tempNode.attributes.getNamedItem("i:type").value;

                            // check for AliasedValue
                            if (sType.replace('c:', '').replace('a:', '') === "AliasedValue") {
                                // reset the type to the actual attribute type
                                var subNode = tempNode.childNodes[2];
                                sType = subNode.attributes.getNamedItem("i:type").value;

                                //sKey = getNodeText(tempNode.childNodes[1]) + "." + getNodeText(tempNode.childNodes[0]);
                                // reset the node to the AliasedValue value node
                                tempNode = subNode;
                            }

                            var entRef;
                            var entCv;
                            switch (sType) {
                                case "a:OptionSetValue":
                                    var entOsv = new xrmOptionSetValue();
                                    entOsv.type = sType.replace('a:', '');
                                    entOsv.value = parseInt(getNodeText(tempNode));
                                    obj[sKey] = entOsv;
                                    break;

                                case "a:EntityReference":
                                    entRef = new xrmEntityReference();
                                    entRef.type = sType.replace('a:', '');
                                    var oChildNodes = tempNode.childNodes;
                                    for (var i = 0, leni = oChildNodes.length; i < leni; i++) {
                                        var entityReferenceNode = oChildNodes[i];

                                        switch (entityReferenceNode.nodeName) {
                                            case "a:Id":
                                                entRef.id = getNodeText(entityReferenceNode);
                                                break;
                                            case "a:LogicalName":
                                                entRef.logicalName = getNodeText(entityReferenceNode);
                                                break;
                                            case "a:Name":
                                                entRef.name = getNodeText(entityReferenceNode);
                                                break;
                                        }
                                    }
                                    obj[sKey] = entRef;
                                    break;

                                case "a:EntityCollection":
                                    entRef = new xrmEntityCollection();
                                    entRef.type = sType.replace('a:', '');

                                    //get all party items....
                                    var items = [];
                                    var partyNodes = tempNode.childNodes;
                                    for (var y = 0, leny = partyNodes[0].childNodes.length; y < leny; y++) {
                                        var itemNodes = tempParentNode.childNodes[1].childNodes[0].childNodes[y].childNodes[0].childNodes;
                                        for (var z = 0, lenz = itemNodes.length; z < lenz; z++) {
                                            var itemNodeChildNodes = itemNodes[z].childNodes;
                                            var nodeText = getNodeText(itemNodeChildNodes[0]);
                                            if (nodeText === "partyid") {
                                                var itemRef = new xrmEntityReference();
                                                var partyListNodes = itemNodeChildNodes[1].childNodes;
                                                for (var pi = 0, lenpi = partyListNodes.length; pi < lenpi; pi++) {
                                                    var partyReferenceNode = partyListNodes[i];

                                                    switch (partyReferenceNode.nodeName) {
                                                        case "a:Id":
                                                            itemRef.id = getNodeText(partyReferenceNode);
                                                            break;
                                                        case "a:LogicalName":
                                                            itemRef.logicalName = getNodeText(partyReferenceNode);
                                                            break;
                                                        case "a:Name":
                                                            itemRef.name = getNodeText(partyReferenceNode);
                                                            break;
                                                    }
                                                }
                                                items[y] = itemRef;
                                            }
                                        }
                                    }
                                    entRef.value = items;
                                    obj[sKey] = entRef;
                                    break;

                                case "a:Money":
                                    entCv = new xrmValue();
                                    entCv.type = sType.replace('a:', '');
                                    entCv.value = parseFloat(getNodeText(tempNode));
                                    obj[sKey] = entCv;
                                    break;

                                default:
                                    entCv = new xrmValue();
                                    entCv.type = sType.replace('c:', '').replace('a:', '');
                                    if (entCv.type === "int") {
                                        entCv.value = parseInt(getNodeText(tempNode));
                                    } else if (entCv.type === "decimal" || entCv.type === "double") {
                                        entCv.value = parseFloat(getNodeText(tempNode));
                                    } else if (entCv.type === "dateTime") {
                                        entCv.value = stringToDate(getNodeText(tempNode));
                                    } else if (entCv.type === "boolean") {
                                        entCv.value = (getNodeText(tempNode) === 'false') ? false : true;
                                    } else {
                                        entCv.value = getNodeText(tempNode);
                                    }
                                    obj[sKey] = entCv;
                                    break;
                            }
                        }
                        this.attributes = obj;
                        break;

                    case "a:Id":
                        this.id = getNodeText(parentNode);
                        break;

                    case "a:LogicalName":
                        this.logicalName = getNodeText(parentNode);
                        break;

                    case "a:FormattedValues":
                        var foVal = parentNode;

                        for (var o = 0, leno = foVal.childNodes.length; o < leno; o++) {
                            // Establish the Key, we are going to fill in the formatted value of the already found attribute
                            var foNode = foVal.childNodes[o];
                            sKey = getNodeText(foNode.childNodes[0]);
                            this.attributes[sKey].formattedValue = getNodeText(foNode.childNodes[1]);
                            if (isNaN(this.attributes[sKey].value) && this.attributes[sKey].type === "dateTime") {
                                this.attributes[sKey].value = new Date(this.attributes[sKey].formattedValue);
                            }
                        }
                        break;
                }
            }
        }
    };

    var getError = function (async, resp, internalCallback) {
        //Error descriptions come from http://support.microsoft.com/kb/193625

        if (resp.status === 12029) {
            throw new Error("The attempt to connect to the server failed.");
        }
        if (resp.status === 12007) {
            throw new Error("The server name could not be resolved.");
        }
        var faultXml = resp.responseXML;

        var errorMessage = "Unknown (unable to parse the fault)";
        if (faultXml !== null && typeof faultXml == "object") {

            var faultstring = null;
            var errorCode = null;

            var bodyNode = faultXml.firstChild.firstChild;

            //Retrieve the fault node
            for (var i = 0; i < bodyNode.childNodes.length; i++) {
                var node = bodyNode.childNodes[i];

                //NOTE: This comparison does not handle the case where the XML namespace changes
                if ("s:Fault" === node.nodeName) {
                    for (var j = 0; j < node.childNodes.length; j++) {
                        var testNode = node.childNodes[j];
                        if ("faultstring" === testNode.nodeName) {
                            faultstring = getNodeText(testNode);
                        }
                        if ("detail" === testNode.nodeName) {
                            for (var k = 0; k < testNode.childNodes.length; k++) {
                                var orgServiceFault = testNode.childNodes[k];
                                if ("OrganizationServiceFault" === orgServiceFault.nodeName) {
                                    for (var l = 0; l < orgServiceFault.childNodes.length; l++) {
                                        var errorCodeNode = orgServiceFault.childNodes[l];
                                        if ("ErrorCode" === errorCodeNode.nodeName) {
                                            errorCode = getNodeText(errorCodeNode);
                                            break;
                                        }
                                    }
                                }
                            }

                        }
                    }
                    break;
                }

            }
        }
        if (errorCode != null && faultstring != null) {
            errorMessage = "Error Code:" + errorCode + " Message: " + faultstring;
        } else {
            if (faultstring != null) {
                errorMessage = faultstring;
            }
        }
        if (async) {
            return new Error(errorMessage);
        } else {
            throw new Error(errorMessage);
        }

    };

    var doRequest = function (soapBody, requestType, async, internalCallback) {
        async = async || false;

        // Wrap the Soap Body in a soap:Envelope.
        var soapXml = ["<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>",
            "<soap:Body>",
            "<", requestType, " xmlns='http://schemas.microsoft.com/xrm/2011/Contracts/Services' xmlns:i='http://www.w3.org/2001/XMLSchema-instance'>", soapBody, "</", requestType, ">",
            "</soap:Body>",
            "</soap:Envelope>"
        ].join("");

        var req = new XMLHttpRequest();
        req.open("POST", orgServicePath(), async);
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/" + requestType);

        //IE10
        try {
            req.responseType = 'msxml-document';
        } catch (e) {}

        if (async) {
            req.onreadystatechange = function () {
                if (req.readyState === 4 /* complete */ ) {
                    req.onreadystatechange = null; //Addresses potential memory leak issue with IE
                    if (req.status === 200) { // "OK"
                        var doc = req.responseXML;
                        try {
                            setSelectionNamespaces(doc);
                        } catch (e) {}
                        internalCallback(doc);
                    } else {
                        getError(true, req);
                    }
                }
            };

            req.send(soapXml);
        } else {
            req.send(soapXml);
            if (req.status === 200) {
                var doc = req.responseXML;
                try {
                    setSelectionNamespaces(doc);
                } catch (e) {}
                var result = doc;
                return !!internalCallback ? internalCallback(result) : result;
            } else {
                getError(false, req);
            }
        }
        // ReSharper disable NotAllPathsReturnValue
    };
    // ReSharper restore NotAllPathsReturnValue

    var sCreate = function (be, callback) {
        ///<summary>
        /// Sends synchronous/asynchronous request to create a new record.
        ///</summary>
        ///<param name="be" type="Object">
        /// A JavaScript object with properties corresponding to the Schema name of
        /// entity attributes that are valid for create operations.
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>
        var request = be.serialize();

        var async = !!callback;

        var mBody = ["<request i:type='a:CreateRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>",
            "<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>Target</b:key>",
            request,
            "</a:KeyValuePairOfstringanyType>",
            "</a:Parameters>",
            "<a:RequestId i:nil='true' />",
            "<a:RequestName>Create</a:RequestName>",
            "</request>"
        ].join("");

        return doRequest(mBody, "Execute", async, function (resultXml) {
            var responseText = selectSingleNodeText(resultXml, "//b:value");

            var result = crmXmlDecode(responseText);

            if (!async)
                return result;
            else
                callback(result);
            // ReSharper disable NotAllPathsReturnValue
        });
        // ReSharper restore NotAllPathsReturnValue
    };

    var sUpdate = function (be, callback) {
        ///<summary>
        /// Sends synchronous/asynchronous request to update an existing record.
        ///</summary>
        ///<param name="businessEntity" type="Object">
        /// A JavaScript object with properties corresponding to the Schema name of
        /// entity attributes that are valid for update operations.
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>
        var request = be.serialize();

        var async = !!callback;

        var mBody = ["<request i:type='a:UpdateRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>",
            "<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>Target</b:key>",
            request,
            "</a:KeyValuePairOfstringanyType>",
            "</a:Parameters>",
            "<a:RequestId i:nil='true' />",
            "<a:RequestName>Update</a:RequestName>",
            "</request>"
        ].join("");

        return doRequest(mBody, "Execute", async, function (resultXml) {
            var responseText = selectSingleNodeText(resultXml, "//a:Results");
            var result = crmXmlDecode(responseText);

            if (!async)
                return result;
            else
                callback(result);
            // ReSharper disable NotAllPathsReturnValue
        });
        // ReSharper restore NotAllPathsReturnValue
    };

    var sDelete = function (entityName, id, callback) {
        ///<summary>
        /// Sends synchronous/asynchronous request to delete a record.
        ///</summary>
        ///<param name="entityName" type="String">
        /// A JavaScript String corresponding to the Schema name of
        /// entity that is used for delete operations.
        /// </param>
        ///<param name="id" type="String">
        /// A JavaScript String corresponding to the GUID of
        /// entity that is used for delete operations.
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>

        var request = [
            "<request i:type='a:DeleteRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'><a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'><a:KeyValuePairOfstringanyType><b:key>Target</b:key><b:value i:type='a:EntityReference'><a:Id>",
            id, "</a:Id><a:LogicalName>",
            entityName, "</a:LogicalName><a:Name i:nil='true' /></b:value></a:KeyValuePairOfstringanyType></a:Parameters><a:RequestId i:nil='true' /><a:RequestName>Delete</a:RequestName></request>"
        ].join("");

        var async = !!callback;

        return doRequest(request, "Execute", async, function (resultXml) {
            var responseText = selectSingleNodeText(resultXml, "//a:Results");
            var result = crmXmlDecode(responseText);

            if (!async)
                return result;
            else
                callback(result);
            // ReSharper disable NotAllPathsReturnValue
        });
        // ReSharper restore NotAllPathsReturnValue
    };

    var execute = function (request, callback) {
        ///<summary>
        /// Sends synchronous/asynchronous request to execute a soap request.
        ///</summary>
        ///<param name="request" type="String">
        /// A JavaScript string corresponding to the soap request
        /// that are valid for execute operations.
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>
        var async = !!callback;

        return doRequest(request, "Execute", async, function (resultXml) {
            if (!async)
                return resultXml;
            else
                callback(resultXml);
            // ReSharper disable NotAllPathsReturnValue
        });
        // ReSharper restore NotAllPathsReturnValue
    };


    var fetchMore = function (fetchCoreXml, pageNumber, pageCookie, fetchResults) {

        //Build new query
        var moreFetchXml = [
            "<fetch mapping='logical' page='" + pageNumber + "' count='5000' paging-cookie='" + pageCookie + "'>",
            fetchCoreXml.replace(/\"/g, "'"),
            "</fetch>"
        ].join("");

        var moreMsgBody = [
            "<request i:type='a:RetrieveMultipleRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>",
            "<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>Query</b:key>",
            "<b:value i:type='a:FetchExpression'>",
            "<a:Query>", crmXmlEncode(moreFetchXml), "</a:Query>",
            "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "</a:Parameters>",
            "<a:RequestId i:nil='true'/>",
            "<a:RequestName>RetrieveMultiple</a:RequestName>",
            "</request>"
        ].join("");


        return doRequest(moreMsgBody, "Execute", false, function (moreResultXml) {
            var newFetchResult = selectSingleNode(moreResultXml, "//a:Entities");

            var newMoreRecords = (selectSingleNodeText(moreResultXml, "//a:MoreRecords") === "true");

            for (var iii = 0, nLength = newFetchResult.childNodes.length; iii < nLength; iii++) {
                var entity = new businessEntity();

                entity.deserialize(newFetchResult.childNodes[iii]);
                fetchResults.push(entity);
            }

            if (newMoreRecords) {
                pageNumber += 1;
                var newPageCookie = selectSingleNodeText(moreResultXml, "//a:PagingCookie").replace(/\"/g, '\'').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&quot;');;

                fetchMore(fetchCoreXml, pageNumber, newPageCookie, fetchResults);
            } else {
                return fetchResults;
            }
        });
    };


    var fetch = function (fetchCore, fetchAll, callback) {
        ///<summary>
        /// Sends synchronous/asynchronous request to do a fetch request.
        ///</summary>
        ///<param name="fetchCore" type="String">
        /// A JavaScript String containing serialized XML using the FetchXML schema.
        /// For efficiency, start with the "entity" node.
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>

        var fetchXml = fetchCore;

        if (fetchCore.slice(0, 7) === "<entity") {
            fetchXml = [
                "<fetch mapping='logical'>",
                fetchCore.replace(/\"/g, "'"),
                "</fetch>"
            ].join("");
        } else {
            var isAggregate = (fetchCore.indexOf("aggregate=") !== -1);
            var isLimitedReturn = (fetchCore.indexOf("page='1'") !== -1 && fetchCore.indexOf("count='") !== -1);

            var distinctPos = fetchCore.indexOf("distinct=");
            var isDistinct = (distinctPos !== -1);
            var valQuotes = fetchCore.substring(distinctPos + 9, distinctPos + 10);
            var distinctValue = isDistinct ?
                fetchCore.substring(fetchCore.indexOf("distinct=") + 10, fetchCore.indexOf(valQuotes, fetchCore.indexOf("distinct=") + 10)) :
                "false";
            var xmlDoc = xmlParser(fetchCore);
            var fetchEntity = selectSingleNode(xmlDoc, "//entity");
            if (fetchEntity === null) {
                throw new Error("XrmServiceToolkit.Fetch: No 'entity' node in the provided FetchXML.");
            }
            var fetchCoreDom = fetchEntity;
            try {
                fetchCore = xmlToString(fetchCoreDom).replace(/\"/g, "'");
            } catch (error) {
                if (fetchCoreDom !== undefined && fetchCoreDom.xml) {
                    fetchCore = fetchCoreDom.xml.replace(/\"/g, "'");
                } else {
                    throw new Error("XrmServiceToolkit.Fetch: This client does not provide the necessary XML features to continue.");
                }
            }

            if (!isAggregate && !isLimitedReturn) {
                fetchXml = [
                    "<fetch mapping='logical' distinct='" + (isDistinct ? distinctValue : "false") + "' >",
                    fetchCore,
                    "</fetch>"
                ].join("");
            }
        }

        var request = [
            "<request i:type='a:RetrieveMultipleRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>",
            "<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>Query</b:key>",
            "<b:value i:type='a:FetchExpression'>",
            "<a:Query>", crmXmlEncode(fetchXml), "</a:Query>",
            "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "</a:Parameters>",
            "<a:RequestId i:nil='true'/>",
            "<a:RequestName>RetrieveMultiple</a:RequestName>",
            "</request>"
        ].join("");

        var async = !!callback;

        return doRequest(request, "Execute", async, function (resultXml) {
            var fetchResult = selectSingleNode(resultXml, "//a:Entities");
            var moreRecords = (selectSingleNodeText(resultXml, "//a:MoreRecords") === "true");

            var fetchResults = [];
            if (fetchResult != null) {
                for (var ii = 0, olength = fetchResult.childNodes.length; ii < olength; ii++) {
                    var entity = new businessEntity();

                    entity.deserialize(fetchResult.childNodes[ii]);
                    fetchResults.push(entity);
                }

                if (fetchAll && moreRecords) {
                    var pageCookie = selectSingleNodeText(resultXml, "//a:PagingCookie").replace(/\"/g, '\'').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&quot;');

                    fetchMore(fetchCore, 2, pageCookie, fetchResults);
                }

                if (!async)
                    return fetchResults;
                else
                    callback(fetchResults);
            }
            // ReSharper disable once NotAllPathsReturnValue
        });
    };

    var retrieve = function (entityName, id, columnSet, callback) {
        ///<summary>
        /// Sends synchronous/asynchronous request to retrieve a record.
        ///</summary>
        ///<param name="entityName" type="String">
        /// A JavaScript String corresponding to the Schema name of
        /// entity that is used for retrieve operations.
        /// </param>
        ///<param name="id" type="String">
        /// A JavaScript String corresponding to the GUID of
        /// entity that is used for retrieve operations.
        /// </param>
        ///<param name="columnSet" type="Array">
        /// A JavaScript Array corresponding to the attributes of
        /// entity that is used for retrieve operations.
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>
        var attributes = "";
        // ReSharper disable AssignedValueIsNeverUsed
        var query = "";
        // ReSharper restore AssignedValueIsNeverUsed
        if (columnSet != null) {
            for (var i = 0, ilength = columnSet.length; i < ilength; i++) {
                attributes += "<c:string>" + columnSet[i] + "</c:string>";
            }
            query = "<a:AllColumns>false</a:AllColumns>" +
                "<a:Columns xmlns:c='http://schemas.microsoft.com/2003/10/Serialization/Arrays'>" +
                attributes +
                "</a:Columns>";
        } else {
            query = "<a:AllColumns>true</a:AllColumns><a:Columns xmlns:b='http://schemas.microsoft.com/2003/10/Serialization/Arrays' />";
        }

        var msgBody = [
            "<request i:type='a:RetrieveRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>",
            "<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>Target</b:key>",
            "<b:value i:type='a:EntityReference'>",
            "<a:Id>", encodeValue(id), "</a:Id>",
            "<a:LogicalName>", entityName, "</a:LogicalName>",
            "<a:Name i:nil='true' />",
            "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>ColumnSet</b:key>",
            "<b:value i:type='a:ColumnSet'>",
            query,
            "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "</a:Parameters>",
            "<a:RequestId i:nil='true' />",
            "<a:RequestName>Retrieve</a:RequestName>",
            "</request>"
        ].join("");

        var async = !!callback;

        return doRequest(msgBody, "Execute", !!callback, function (resultXml) {
            var retrieveResult = selectSingleNode(resultXml, "//b:value");
            var entity = new businessEntity();
            entity.deserialize(retrieveResult);

            if (!async)
                return entity;
            else
                callback(entity);
            // ReSharper disable NotAllPathsReturnValue
        });
        // ReSharper restore NotAllPathsReturnValue
    };

    var retrieveMultiple = function (query, callback) {
        ///<summary>
        /// Sends synchronous/asynchronous request to do a retrieveMultiple request.
        ///</summary>
        ///<param name="query" type="String">
        /// A JavaScript String with properties corresponding to the retrievemultiple request
        /// that are valid for retrievemultiple operations.
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>

        var request = [
            "<request i:type='a:RetrieveMultipleRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>",
            "<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>Query</b:key>",
            "<b:value i:type='a:QueryExpression'>",
            query,
            "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "</a:Parameters>",
            "<a:RequestId i:nil='true'/>",
            "<a:RequestName>RetrieveMultiple</a:RequestName>",
            "</request>"
        ].join("");

        var async = !!callback;

        return doRequest(request, "Execute", async, function (resultXml) {
            var resultNodes = selectSingleNode(resultXml, "//a:Entities");

            var retriveMultipleResults = [];

            for (var i = 0, ilength = resultNodes.childNodes.length; i < ilength; i++) {
                var entity = new businessEntity();

                entity.deserialize(resultNodes.childNodes[i]);
                retriveMultipleResults[i] = entity;
            }

            if (!async)
                return retriveMultipleResults;
            else
                callback(retriveMultipleResults);
            // ReSharper disable NotAllPathsReturnValue
        });
        // ReSharper restore NotAllPathsReturnValue
    };

    var joinArray = function (prefix, array, suffix) {
        var output = [];
        for (var i = 0, ilength = array.length; i < ilength; i++) {
            if (array[i] !== "" && array[i] != undefined) {
                output.push(prefix, array[i], suffix);
            }
        }
        return output.join("");
    };

    var joinConditionPair = function (attributes, values) {
        var output = [];
        for (var i = 0, ilength = attributes.length; i < ilength; i++) {
            if (attributes[i] !== "") {
                var value1 = values[i];
                if (typeof value1 == typeof []) {
                    output.push("<condition attribute='", attributes[i], "' operator='in' >");

                    for (var valueIndex in value1) {
                        if (value1.hasOwnProperty(valueIndex)) {
                            var value = encodeValue(value1[valueIndex]);
                            output.push("<value>" + value + "</value>");
                        }
                    }

                    output.push("</condition>");
                } else if (typeof value1 == typeof "") {
                    output.push("<condition attribute='", attributes[i], "' operator='eq' value='", encodeValue(value1), "' />");
                }
            }
        }
        return output.join("");
    };

    var isArray = function (input) {
        return input.constructor.toString().indexOf("Array") !== -1;
    };

    var queryByAttribute = function (queryOptions, callback) {
        ///<summary>
        /// Sends synchronous/asynchronous request to do a queryByAttribute request.
        ///</summary>
        ///<param name="queryOptions" type="Object">
        /// A JavaScript Object with properties corresponding to the queryByAttribute Criteria
        /// that are valid for queryByAttribute operations.
        /// queryOptions.entityName is a string represents the name of the entity
        /// queryOptions.attributes is a array represents the attributes of the entity to query
        /// queryOptions.values is a array represents the values of the attributes to query
        /// queryOptions.columnSet is a array represents the attributes of the entity to return
        /// queryOptions.orderBy is a array represents the order conditions of the results
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>
        var entityName = queryOptions.entityName;
        var attributes = queryOptions.attributes;
        var values = queryOptions.values;
        var columnSet = queryOptions.columnSet;
        var orderBy = queryOptions.orderBy || '';

        attributes = isArray(attributes) ? attributes : [attributes];
        values = isArray(values) ? values : [values];
        orderBy = (!!orderBy && isArray(orderBy)) ? orderBy : [orderBy];
        columnSet = (!!columnSet && isArray(columnSet)) ? columnSet : [columnSet];

        var xml = [
            "<entity name='", entityName, "'>",
            joinArray("<attribute name='", columnSet, "' />"),
            joinArray("<order attribute='", orderBy, "' />"),
            "<filter>",
            joinConditionPair(attributes, values),
            "</filter>",
            "</entity>"
        ].join("");

        return fetch(xml, false, callback);
    };

    var queryAll = function (queryOptions, callback) {
        ///<summary>
        /// Sends synchronous/asynchronous request to do a queryAll request. This is to return all records (>5k+).
        /// Consider Performance impact when using this method.
        ///</summary>
        ///<param name="queryOptions" type="Object">
        /// A JavaScript Object with properties corresponding to the queryByAttribute Criteria
        /// that are valid for queryByAttribute operations.
        /// queryOptions.entityName is a string represents the name of the entity
        /// queryOptions.attributes is a array represents the attributes of the entity to query
        /// queryOptions.values is a array represents the values of the attributes to query
        /// queryOptions.columnSet is a array represents the attributes of the entity to return
        /// queryOptions.orderBy is a array represents the order conditions of the results
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>
        var entityName = queryOptions.entityName;
        var attributes = queryOptions.attributes;
        var values = queryOptions.values;
        var columnSet = queryOptions.columnSet;
        var orderBy = queryOptions.orderBy || '';

        attributes = isArray(attributes) ? attributes : [attributes];
        values = isArray(values) ? values : [values];
        orderBy = (!!orderBy && isArray(orderBy)) ? orderBy : [orderBy];
        columnSet = (!!columnSet && isArray(columnSet)) ? columnSet : [columnSet];

        var fetchCore = [
            "<entity name='", entityName, "'>",
            joinArray("<attribute name='", columnSet, "' />"),
            joinArray("<order attribute='", orderBy, "' />"),
            "<filter>",
            joinConditionPair(attributes, values),
            "</filter>",
            "</entity>"
        ].join("");


        var async = !!callback;

        return fetch(fetchCore, true, async);
    };

    var setState = function (entityName, id, stateCode, statusCode, callback) {
        ///<summary>
        /// Sends synchronous/asynchronous request to setState of a record.
        ///</summary>
        ///<param name="entityName" type="String">
        /// A JavaScript String corresponding to the Schema name of
        /// entity that is used for setState operations.
        /// </param>
        ///<param name="id" type="String">
        /// A JavaScript String corresponding to the GUID of
        /// entity that is used for setState operations.
        /// </param>
        ///<param name="stateCode" type="Int">
        /// A JavaScript Integer corresponding to the value of
        /// entity state that is used for setState operations.
        /// </param>
        ///<param name="statusCode" type="Int">
        /// A JavaScript Integer corresponding to the value of
        /// entity status that is used for setState operations.
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>
        var request = [
            "<request i:type='b:SetStateRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
            "<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
            "<a:KeyValuePairOfstringanyType>",
            "<c:key>EntityMoniker</c:key>",
            "<c:value i:type='a:EntityReference'>",
            "<a:Id>", encodeValue(id), "</a:Id>",
            "<a:LogicalName>", entityName, "</a:LogicalName>",
            "<a:Name i:nil='true' />",
            "</c:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<c:key>State</c:key>",
            "<c:value i:type='a:OptionSetValue'>",
            "<a:Value>", stateCode.toString(), "</a:Value>",
            "</c:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<c:key>Status</c:key>",
            "<c:value i:type='a:OptionSetValue'>",
            "<a:Value>", statusCode.toString(), "</a:Value>",
            "</c:value>",
            "</a:KeyValuePairOfstringanyType>",
            "</a:Parameters>",
            "<a:RequestId i:nil='true' />",
            "<a:RequestName>SetState</a:RequestName>",
            "</request>"
        ].join("");

        var async = !!callback;

        return doRequest(request, "Execute", async, function (resultXml) {
            var responseText = selectSingleNodeText(resultXml, "//ser:ExecuteResult");
            var result = crmXmlDecode(responseText);
            if (!async)
                return result;
            else
                callback(result);
            // ReSharper disable NotAllPathsReturnValue
        });
        // ReSharper restore NotAllPathsReturnValue
    };

    var associate = function (relationshipName, targetEntityName, targetId, relatedEntityName, relatedBusinessEntities, callback) {
        ///<summary>
        /// Sends synchronous/asynchronous request to associate records.
        ///</summary>
        ///<param name="relationshipName" type="String">
        /// A JavaScript String corresponding to the relationship name
        /// that is used for associate operations.
        /// </param>
        ///<param name="targetEntityName" type="String">
        /// A JavaScript String corresponding to the schema name of the target entity
        /// that is used for associate operations.
        /// </param>
        ///<param name="targetId" type="String">
        /// A JavaScript String corresponding to the GUID of the target entity
        /// that is used for associate operations.
        /// </param>
        ///<param name="relatedEntityName" type="String">
        /// A JavaScript String corresponding to the schema name of the related entity
        /// that is used for associate operations.
        /// </param>
        ///<param name="relationshipBusinessEntities" type="Array">
        /// A JavaScript Array corresponding to the collection of the related entities as BusinessEntity
        /// that is used for associate operations.
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>
        var relatedEntities = relatedBusinessEntities;

        relatedEntities = isArray(relatedEntities) ? relatedEntities : [relatedEntities];

        var output = [];
        for (var i = 0, ilength = relatedEntities.length; i < ilength; i++) {
            if (relatedEntities[i].id !== "") {
                output.push("<a:EntityReference>",
                    "<a:Id>", relatedEntities[i].id, "</a:Id>",
                    "<a:LogicalName>", relatedEntityName, "</a:LogicalName>",
                    "<a:Name i:nil='true' />",
                    "</a:EntityReference>");
            }
        }

        var relatedXml = output.join("");

        var request = [
            "<request i:type='a:AssociateRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>",
            "<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>Target</b:key>",
            "<b:value i:type='a:EntityReference'>",
            "<a:Id>", encodeValue(targetId), "</a:Id>",
            "<a:LogicalName>", targetEntityName, "</a:LogicalName>",
            "<a:Name i:nil='true' />",
            "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>Relationship</b:key>",
            "<b:value i:type='a:Relationship'>",
            "<a:PrimaryEntityRole>Referenced</a:PrimaryEntityRole>",
            "<a:SchemaName>", relationshipName, "</a:SchemaName>",
            "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>RelatedEntities</b:key>",
            "<b:value i:type='a:EntityReferenceCollection'>",
            relatedXml,
            "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "</a:Parameters>",
            "<a:RequestId i:nil='true' />",
            "<a:RequestName>Associate</a:RequestName>",
            "</request>"
        ].join("");

        var async = !!callback;

        return doRequest(request, "Execute", async, function (resultXml) {
            var responseText = selectSingleNodeText(resultXml, "//ser:ExecuteResult");
            var result = crmXmlDecode(responseText);
            if (!async)
                return result;
            else
                callback(result);
            // ReSharper disable NotAllPathsReturnValue
        });
        // ReSharper restore NotAllPathsReturnValue
    };

    var disassociate = function (relationshipName, targetEntityName, targetId, relatedEntityName, relatedBusinessEntities, callback) {
        ///<summary>
        /// Sends synchronous/asynchronous request to disassociate records.
        ///</summary>
        ///<param name="relationshipName" type="String">
        /// A JavaScript String corresponding to the relationship name
        /// that is used for disassociate operations.
        /// </param>
        ///<param name="targetEntityName" type="String">
        /// A JavaScript String corresponding to the schema name of the target entity
        /// that is used for disassociate operations.
        /// </param>
        ///<param name="targetId" type="String">
        /// A JavaScript String corresponding to the GUID of the target entity
        /// that is used for disassociate operations.
        /// </param>
        ///<param name="relatedEntityName" type="String">
        /// A JavaScript String corresponding to the schema name of the related entity
        /// that is used for disassociate operations.
        /// </param>
        ///<param name="relationshipBusinessEntities" type="Array">
        /// A JavaScript Array corresponding to the collection of the related entities as BusinessEntity
        /// that is used for disassociate operations.
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>
        var relatedEntities = relatedBusinessEntities;

        relatedEntities = isArray(relatedEntities) ? relatedEntities : [relatedEntities];

        var output = [];
        for (var i = 0, ilength = relatedEntities.length; i < ilength; i++) {
            if (relatedEntities[i].id !== "") {
                output.push("<a:EntityReference>",
                    "<a:Id>", relatedEntities[i].id, "</a:Id>",
                    "<a:LogicalName>", relatedEntityName, "</a:LogicalName>",
                    "<a:Name i:nil='true' />",
                    "</a:EntityReference>");
            }
        }

        var relatedXml = output.join("");

        var request = [
            "<request i:type='a:DisassociateRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'>",
            "<a:Parameters xmlns:b='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>Target</b:key>",
            "<b:value i:type='a:EntityReference'>",
            "<a:Id>", encodeValue(targetId), "</a:Id>",
            "<a:LogicalName>", targetEntityName, "</a:LogicalName>",
            "<a:Name i:nil='true' />",
            "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>Relationship</b:key>",
            "<b:value i:type='a:Relationship'>",
            "<a:PrimaryEntityRole i:nil='true' />",
            "<a:SchemaName>", relationshipName, "</a:SchemaName>",
            "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>RelatedEntities</b:key>",
            "<b:value i:type='a:EntityReferenceCollection'>",
            relatedXml,
            "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "</a:Parameters>",
            "<a:RequestId i:nil='true' />",
            "<a:RequestName>Disassociate</a:RequestName>",
            "</request>"
        ].join("");

        var async = !!callback;

        return doRequest(request, "Execute", async, function (resultXml) {
            var responseText = selectSingleNodeText(resultXml, "//ser:ExecuteResult");
            var result = crmXmlDecode(responseText);
            if (!async)
                return result;
            else
                callback(result);
            // ReSharper disable NotAllPathsReturnValue
        });
        // ReSharper restore NotAllPathsReturnValue
    };

    var getCurrentUserId = function () {
        ///<summary>
        /// Sends synchronous request to retrieve the GUID of the current user.
        ///</summary>
        var request = [
            "<request i:type='b:WhoAmIRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
            "<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic' />",
            "<a:RequestId i:nil='true' />",
            "<a:RequestName>WhoAmI</a:RequestName>",
            "</request>"
        ].join("");
        var xmlDoc = doRequest(request, "Execute");

        return getNodeText(selectNodes(xmlDoc, "//b:value")[0]);

    };

    var getCurrentUserBusinessUnitId = function () {
        ///<summary>
        /// Sends synchronous request to retrieve the GUID of the current user's business unit.
        ///</summary>
        var request = ["<request i:type='b:WhoAmIRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
            "<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic' />",
            "<a:RequestId i:nil='true' />",
            "<a:RequestName>WhoAmI</a:RequestName>",
            "</request>"
        ].join("");
        var xmlDoc = doRequest(request, "Execute");

        return getNodeText(selectNodes(xmlDoc, "//b:value")[1]);
    };

    var getCurrentUserRoles = function () {
        ///<summary>
        /// Sends synchronous request to retrieve the list of the current user's roles.
        ///</summary>
        var xml = [
            "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>",
            "<entity name='role'>",
            "<attribute name='name' />",
            "<attribute name='businessunitid' />",
            "<attribute name='roleid' />",
            "<order attribute='name' descending='false' />" +
            "<link-entity name='systemuserroles' from='roleid' to='roleid' visible='false' intersect='true'>",
            "<link-entity name='systemuser' from='systemuserid' to='systemuserid' alias='aa'>",
            "<filter type='and'>",
            "<condition attribute='systemuserid' operator='eq-userid' />",
            "</filter>",
            "</link-entity>",
            "</link-entity>",
            "</entity>",
            "</fetch>"
        ].join("");

        var fetchResult = fetch(xml);
        var roles = [];

        if (fetchResult !== null && typeof fetchResult != 'undefined') {
            for (var i = 0, ilength = fetchResult.length; i < ilength; i++) {
                roles[i] = fetchResult[i].attributes["name"].value;
            }
        }

        return roles;
    };

    var isCurrentUserInRole = function () {
        ///<summary>
        /// Sends synchronous request to check if the current user has certain roles
        /// Passes name of role as arguments. For example, IsCurrentUserInRole('System Administrator')
        /// Returns true or false.
        ///</summary>
        var roles = getCurrentUserRoles();
        for (var i = 0, ilength = roles.length; i < ilength; i++) {
            for (var j = 0, jlength = arguments.length; j < jlength; j++) {
                if (roles[i] === arguments[j]) {
                    return true;
                }
            }
        }

        return false;
    };

    var assign = function (targetEntityName, targetId, assigneeEntityName, assigneeId, callback) {
        ///<summary>
        /// Sends synchronous/asynchronous request to assign an existing record to a user / a team.
        ///</summary>
        ///<param name="targetEntityName" type="String">
        /// A JavaScript String corresponding to the schema name of the target entity
        /// that is used for assign operations.
        /// </param>
        ///<param name="targetId" type="String">
        /// A JavaScript String corresponding to the GUID of the target entity
        /// that is used for assign operations.
        /// </param>
        ///<param name="assigneeEntityName" type="String">
        /// A JavaScript String corresponding to the schema name of the assignee entity
        /// that is used for assign operations.
        /// </param>
        ///<param name="assigneeId" type="String">
        /// A JavaScript String corresponding to the GUID of the assignee entity
        /// that is used for assign operations.
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>

        var request = ["<request i:type='b:AssignRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
            "<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
            "<a:KeyValuePairOfstringanyType>",
            "<c:key>Target</c:key>",
            "<c:value i:type='a:EntityReference'>",
            "<a:Id>", encodeValue(targetId), "</a:Id>",
            "<a:LogicalName>", targetEntityName, "</a:LogicalName>",
            "<a:Name i:nil='true' />",
            "</c:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<c:key>Assignee</c:key>",
            "<c:value i:type='a:EntityReference'>",
            "<a:Id>", encodeValue(assigneeId), "</a:Id>",
            "<a:LogicalName>", assigneeEntityName, "</a:LogicalName>",
            "<a:Name i:nil='true' />",
            "</c:value>",
            "</a:KeyValuePairOfstringanyType>",
            "</a:Parameters>",
            "<a:RequestId i:nil='true' />",
            "<a:RequestName>Assign</a:RequestName>",
            "</request>"
        ].join("");
        var async = !!callback;

        return doRequest(request, "Execute", async, function (resultXml) {
            var responseText = selectSingleNodeText(resultXml, "//ser:ExecuteResult");
            var result = crmXmlDecode(responseText);
            if (!async)
                return result;
            else
                callback(result);
            // ReSharper disable NotAllPathsReturnValue
        });
        // ReSharper restore NotAllPathsReturnValue
    };

    var grantAccess = function (accessOptions, callback) {
        ///<summary>
        /// Sends synchronous/asynchronous request to do a grantAccess request.
        /// Levels of Access Options are: AppendAccess, AppendToAccess, AssignAccess, CreateAccess, DeleteAccess, None, ReadAccess, ShareAccess, and WriteAccess
        ///</summary>
        ///<param name="accessOptions" type="Object">
        /// A JavaScript Object with properties corresponding to the grantAccess Criteria
        /// that are valid for grantAccess operations.
        /// accessOptions.targetEntityName is a string represents the name of the target entity
        /// accessOptions.targetEntityId is a string represents the GUID of the target entity
        /// accessOptions.principalEntityName is a string represents the name of the principal entity
        /// accessOptions.principalEntityId is a string represents the GUID of the principal entity
        /// accessOptions.accessRights is a array represents the access conditions of the results
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>

        var targetEntityName = accessOptions.targetEntityName;
        var targetEntityId = accessOptions.targetEntityId;
        var principalEntityName = accessOptions.principalEntityName;
        var principalEntityId = accessOptions.principalEntityId;
        var accessRights = accessOptions.accessRights;

        accessRights = isArray(accessRights) ? accessRights : [accessRights];

        var accessRightString = "";
        for (var i = 0, ilength = accessRights.length; i < ilength; i++) {
            accessRightString += encodeValue(accessRights[i]) + " ";
        }

        var request = ["<request i:type='b:GrantAccessRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
            "<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
            "<a:KeyValuePairOfstringanyType>",
            "<c:key>Target</c:key>",
            "<c:value i:type='a:EntityReference'>",
            "<a:Id>", encodeValue(targetEntityId), "</a:Id>",
            "<a:LogicalName>", targetEntityName, "</a:LogicalName>",
            "<a:Name i:nil='true' />",
            "</c:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<c:key>PrincipalAccess</c:key>",
            "<c:value i:type='b:PrincipalAccess'>",
            "<b:AccessMask>", accessRightString, "</b:AccessMask>",
            "<b:Principal>",
            "<a:Id>", encodeValue(principalEntityId), "</a:Id>",
            "<a:LogicalName>", principalEntityName, "</a:LogicalName>",
            "<a:Name i:nil='true' />",
            "</b:Principal>",
            "</c:value>",
            "</a:KeyValuePairOfstringanyType>",
            "</a:Parameters>",
            "<a:RequestId i:nil='true' />",
            "<a:RequestName>GrantAccess</a:RequestName>",
            "</request>"
        ].join("");
        var async = !!callback;

        return doRequest(request, "Execute", async, function (resultXml) {
            var responseText = selectSingleNodeText(resultXml, "//ser:ExecuteResult");
            var result = crmXmlDecode(responseText);
            if (!async)
                return result;
            else
                callback(result);
            // ReSharper disable NotAllPathsReturnValue
        });
        // ReSharper restore NotAllPathsReturnValue
    };

    var modifyAccess = function (accessOptions, callback) {
        ///<summary>
        /// Sends synchronous/asynchronous request to do a modifyAccess request.
        /// Levels of Access Options are: AppendAccess, AppendToAccess, AssignAccess, CreateAccess, DeleteAccess, None, ReadAccess, ShareAccess, and WriteAccess
        ///</summary>
        ///<param name="accessOptions" type="Object">
        /// A JavaScript Object with properties corresponding to the modifyAccess Criteria
        /// that are valid for modifyAccess operations.
        /// accessOptions.targetEntityName is a string represents the name of the target entity
        /// accessOptions.targetEntityId is a string represents the GUID of the target entity
        /// accessOptions.principalEntityName is a string represents the name of the principal entity
        /// accessOptions.principalEntityId is a string represents the GUID of the principal entity
        /// accessOptions.accessRights is a array represents the access conditions of the results
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>

        var targetEntityName = accessOptions.targetEntityName;
        var targetEntityId = accessOptions.targetEntityId;
        var principalEntityName = accessOptions.principalEntityName;
        var principalEntityId = accessOptions.principalEntityId;
        var accessRights = accessOptions.accessRights;

        accessRights = isArray(accessRights) ? accessRights : [accessRights];

        var accessRightString = "";
        for (var i = 0, ilength = accessRights.length; i < ilength; i++) {
            accessRightString += encodeValue(accessRights[i]) + " ";
        }

        var request = ["<request i:type='b:ModifyAccessRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
            "<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
            "<a:KeyValuePairOfstringanyType>",
            "<c:key>Target</c:key>",
            "<c:value i:type='a:EntityReference'>",
            "<a:Id>", encodeValue(targetEntityId), "</a:Id>",
            "<a:LogicalName>", targetEntityName, "</a:LogicalName>",
            "<a:Name i:nil='true' />",
            "</c:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<c:key>PrincipalAccess</c:key>",
            "<c:value i:type='b:PrincipalAccess'>",
            "<b:AccessMask>", accessRightString, "</b:AccessMask>",
            "<b:Principal>",
            "<a:Id>", encodeValue(principalEntityId), "</a:Id>",
            "<a:LogicalName>", principalEntityName, "</a:LogicalName>",
            "<a:Name i:nil='true' />",
            "</b:Principal>",
            "</c:value>",
            "</a:KeyValuePairOfstringanyType>",
            "</a:Parameters>",
            "<a:RequestId i:nil='true' />",
            "<a:RequestName>ModifyAccess</a:RequestName>",
            "</request>"
        ].join("");
        var async = !!callback;

        return doRequest(request, "Execute", async, function (resultXml) {
            var responseText = selectSingleNodeText(resultXml, "//ser:ExecuteResult");
            var result = crmXmlDecode(responseText);
            if (!async)
                return result;
            else
                callback(result);
            // ReSharper disable NotAllPathsReturnValue
        });
        // ReSharper restore NotAllPathsReturnValue
    };

    var revokeAccess = function (accessOptions, callback) {
        ///<summary>
        /// Sends synchronous/asynchronous request to do a revokeAccess request.
        ///</summary>
        ///<param name="accessOptions" type="Object">
        /// A JavaScript Object with properties corresponding to the revokeAccess Criteria
        /// that are valid for revokeAccess operations.
        /// accessOptions.targetEntityName is a string represents the name of the target entity
        /// accessOptions.targetEntityId is a string represents the GUID of the target entity
        /// accessOptions.revokeeEntityName is a string represents the name of the revokee entity
        /// accessOptions.revokeeEntityId is a string represents the GUID of the revokee entity
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>

        var targetEntityName = accessOptions.targetEntityName;
        var targetEntityId = accessOptions.targetEntityId;
        var revokeeEntityName = accessOptions.revokeeEntityName;
        var revokeeEntityId = accessOptions.revokeeEntityId;

        var request = ["<request i:type='b:RevokeAccessRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
            "<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
            "<a:KeyValuePairOfstringanyType>",
            "<c:key>Target</c:key>",
            "<c:value i:type='a:EntityReference'>",
            "<a:Id>", encodeValue(targetEntityId), "</a:Id>",
            "<a:LogicalName>", targetEntityName, "</a:LogicalName>",
            "<a:Name i:nil='true' />",
            "</c:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<c:key>Revokee</c:key>",
            "<c:value i:type='a:EntityReference'>",
            "<a:Id>", encodeValue(revokeeEntityId), "</a:Id>",
            "<a:LogicalName>", revokeeEntityName, "</a:LogicalName>",
            "<a:Name i:nil='true' />",
            "</c:value>",
            "</a:KeyValuePairOfstringanyType>",
            "</a:Parameters>",
            "<a:RequestId i:nil='true' />",
            "<a:RequestName>RevokeAccess</a:RequestName>",
            "</request>"
        ].join("");
        var async = !!callback;

        return doRequest(request, "Execute", async, function (resultXml) {
            var responseText = selectSingleNodeText(resultXml, "//ser:ExecuteResult");
            var result = crmXmlDecode(responseText);
            if (!async)
                return result;
            else
                callback(result);
            // ReSharper disable NotAllPathsReturnValue
        });
        // ReSharper restore NotAllPathsReturnValue
    };

    var retrievePrincipalAccess = function (accessOptions, callback) {
        ///<summary>
        /// Sends synchronous/asynchronous request to do a retrievePrincipalAccess request.
        ///</summary>
        ///<param name="accessOptions" type="Object">
        /// A JavaScript Object with properties corresponding to the retrievePrincipalAccess Criteria
        /// that are valid for retrievePrincipalAccess operations.
        /// accessOptions.targetEntityName is a string represents the name of the target entity
        /// accessOptions.targetEntityId is a string represents the GUID of the target entity
        /// accessOptions.principalEntityName is a string represents the name of the principal entity
        /// accessOptions.principalEntityId is a string represents the GUID of the principal entity
        /// </param>
        ///<param name="callback" type="Function">
        /// A Function used for asynchronous request. If not defined, it sends a synchronous request.
        /// </param>

        var targetEntityName = accessOptions.targetEntityName;
        var targetEntityId = accessOptions.targetEntityId;
        var principalEntityName = accessOptions.principalEntityName;
        var principalEntityId = accessOptions.principalEntityId;

        var request = ["<request i:type='b:RetrievePrincipalAccessRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>",
            "<a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>",
            "<a:KeyValuePairOfstringanyType>",
            "<c:key>Target</c:key>",
            "<c:value i:type='a:EntityReference'>",
            "<a:Id>", encodeValue(targetEntityId), "</a:Id>",
            "<a:LogicalName>", targetEntityName, "</a:LogicalName>",
            "<a:Name i:nil='true' />",
            "</c:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<c:key>Principal</c:key>",
            "<c:value i:type='a:EntityReference'>",
            "<a:Id>", encodeValue(principalEntityId), "</a:Id>",
            "<a:LogicalName>", principalEntityName, "</a:LogicalName>",
            "<a:Name i:nil='true' />",
            "</c:value>",
            "</a:KeyValuePairOfstringanyType>",
            "</a:Parameters>",
            "<a:RequestId i:nil='true' />",
            "<a:RequestName>RetrievePrincipalAccess</a:RequestName>",
            "</request>"
        ].join("");
        var async = !!callback;

        return doRequest(request, "Execute", async, function (resultXml) {
            var result = selectSingleNodeText(resultXml, "//b:value");
            if (!async)
                return result;
            else
                callback(result);
            // ReSharper disable NotAllPathsReturnValue
        });
        // ReSharper restore NotAllPathsReturnValue
    };

    // Added in 1.4.1 for metadata retrieval
    // Inspired From Microsoft SDK code to retrieve Metadata using JavaScript
    // Copyright (C) Microsoft Corporation.  All rights reserved.
    var arrayElements = ["Attributes",
        "ManyToManyRelationships",
        "ManyToOneRelationships",
        "OneToManyRelationships",
        "Privileges",
        "LocalizedLabels",
        "Options",
        "Targets"
    ];

    var isMetadataArray = function (elementName) {
        for (var i = 0, ilength = arrayElements.length; i < ilength; i++) {
            if (elementName === arrayElements[i]) {
                return true;
            }
        }
        return false;
    };

    var getNodeName = function (node) {
        if (typeof (node.baseName) != "undefined") {
            return node.baseName;
        } else {
            return node.localName;
        }
    };

    var objectifyNode = function (node) {
        //Check for null
        if (node.attributes != null && node.attributes.length === 1) {
            if (node.attributes.getNamedItem("i:nil") != null && node.attributes.getNamedItem("i:nil").nodeValue === "true") {
                return null;
            }
        }

        //Check if it is a value
        if ((node.firstChild != null) && (node.firstChild.nodeType === 3)) {
            var nodeName = getNodeName(node);

            switch (nodeName) {
                //Integer Values
                case "ActivityTypeMask":
                case "ObjectTypeCode":
                case "ColumnNumber":
                case "DefaultFormValue":
                case "MaxValue":
                case "MinValue":
                case "MaxLength":
                case "Order":
                case "Precision":
                case "PrecisionSource":
                case "LanguageCode":
                    return parseInt(node.firstChild.nodeValue, 10);
                    // Boolean values
                case "AutoRouteToOwnerQueue":
                case "CanBeChanged":
                case "CanTriggerWorkflow":
                case "IsActivity":
                case "IsActivityParty":
                case "IsAvailableOffline":
                case "IsChildEntity":
                case "IsCustomEntity":
                case "IsCustomOptionSet":
                case "IsDocumentManagementEnabled":
                case "IsEnabledForCharts":
                case "IsGlobal":
                case "IsImportable":
                case "IsIntersect":
                case "IsManaged":
                case "IsReadingPaneEnabled":
                case "IsValidForAdvancedFind":
                case "CanBeSecuredForCreate":
                case "CanBeSecuredForRead":
                case "CanBeSecuredForUpdate":
                case "IsCustomAttribute":
                case "IsPrimaryId":
                case "IsPrimaryName":
                case "IsSecured":
                case "IsValidForCreate":
                case "IsValidForRead":
                case "IsValidForUpdate":
                case "IsCustomRelationship":
                case "CanBeBasic":
                case "CanBeDeep":
                case "CanBeGlobal":
                case "CanBeLocal":
                    return (node.firstChild.nodeValue === "true") ? true : false;
                    //OptionMetadata.Value and BooleanManagedProperty.Value and AttributeRequiredLevelManagedProperty.Value
                case "Value":
                    //BooleanManagedProperty.Value
                    if ((node.firstChild.nodeValue === "true") || (node.firstChild.nodeValue === "false")) {
                        return (node.firstChild.nodeValue === "true") ? true : false;
                    }
                    //AttributeRequiredLevelManagedProperty.Value
                    if (
                        (node.firstChild.nodeValue === "ApplicationRequired") ||
                        (node.firstChild.nodeValue === "None") ||
                        (node.firstChild.nodeValue === "Recommended") ||
                        (node.firstChild.nodeValue === "SystemRequired")
                    ) {
                        return node.firstChild.nodeValue;
                    } else {
                        //OptionMetadata.Value
                        return parseInt(node.firstChild.nodeValue, 10);
                    }
                    // ReSharper disable JsUnreachableCode
                    break;
                    // ReSharper restore JsUnreachableCode
                    //String values
                default:
                    return node.firstChild.nodeValue;
            }

        }

        //Check if it is a known array
        if (isMetadataArray(getNodeName(node))) {
            var arrayValue = [];
            for (var iii = 0, tempLength = node.childNodes.length; iii < tempLength; iii++) {
                var objectTypeName;
                if ((node.childNodes[iii].attributes != null) && (node.childNodes[iii].attributes.getNamedItem("i:type") != null)) {
                    objectTypeName = node.childNodes[iii].attributes.getNamedItem("i:type").nodeValue.split(":")[1];
                } else {

                    objectTypeName = getNodeName(node.childNodes[iii]);
                }

                var b = objectifyNode(node.childNodes[iii]);
                b._type = objectTypeName;
                arrayValue.push(b);

            }

            return arrayValue;
        }

        //Null entity description labels are returned as <label/> - not using i:nil = true;
        if (node.childNodes.length === 0) {
            return null;
        }

        //Otherwise return an object
        var c = {};
        if (node.attributes.getNamedItem("i:type") != null) {
            c._type = node.attributes.getNamedItem("i:type").nodeValue.split(":")[1];
        }
        for (var i = 0, ilength = node.childNodes.length; i < ilength; i++) {
            if (node.childNodes[i].nodeType === 3) {
                c[getNodeName(node.childNodes[i])] = node.childNodes[i].nodeValue;
            } else {
                c[getNodeName(node.childNodes[i])] = objectifyNode(node.childNodes[i]);
            }

        }
        return c;
    };

    var retrieveAllEntitiesMetadata = function (entityFilters, retrieveIfPublished, callback) {
        ///<summary>
        /// Sends an synchronous/asynchronous RetrieveAllEntitieMetadata Request to retrieve all entities metadata in the system
        ///</summary>
        ///<returns>Entity Metadata Collection</returns>
        ///<param name="entityFilters" type="Array">
        /// The filter array available to filter which data is retrieved. Case Sensitive filters [Entity,Attributes,Privileges,Relationships]
        /// Include only those elements of the entity you want to retrieve in the array. Retrieving all parts of all entities may take significant time.
        ///</param>
        ///<param name="retrieveIfPublished" type="Boolean">
        /// Sets whether to retrieve the metadata that has not been published.
        ///</param>
        ///<param name="callBack" type="Function">
        /// The function that will be passed through and be called by a successful response.
        /// This function also used as an indicator if the function is synchronous/asynchronous
        ///</param>

        entityFilters = isArray(entityFilters) ? entityFilters : [entityFilters];
        var entityFiltersString = "";
        for (var iii = 0, templength = entityFilters.length; iii < templength; iii++) {
            entityFiltersString += encodeValue(entityFilters[iii]) + " ";
        }

        var request = [
            "<request i:type=\"a:RetrieveAllEntitiesRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">",
            "<a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>EntityFilters</b:key>",
            "<b:value i:type=\"c:EntityFilters\" xmlns:c=\"http://schemas.microsoft.com/xrm/2011/Metadata\">" + encodeValue(entityFiltersString) + "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>RetrieveAsIfPublished</b:key>",
            "<b:value i:type=\"c:boolean\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + encodeValue(retrieveIfPublished.toString()) + "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "</a:Parameters>",
            "<a:RequestId i:nil=\"true\" />",
            "<a:RequestName>RetrieveAllEntities</a:RequestName>",
            "</request>"
        ].join("");

        var async = !!callback;
        return doRequest(request, "Execute", async, function (resultXml) {
            var response = selectNodes(resultXml, "//c:EntityMetadata");

            var results = [];
            for (var i = 0, ilength = response.length; i < ilength; i++) {
                var a = objectifyNode(response[i]);
                a._type = "EntityMetadata";
                results.push(a);
            }

            if (!async)
                return results;
            else
                callback(results);
            // ReSharper disable NotAllPathsReturnValue
        });
        // ReSharper restore NotAllPathsReturnValue
    };

    var retrieveEntityMetadata = function (entityFilters, logicalName, retrieveIfPublished, callback) {
        ///<summary>
        /// Sends an synchronous/asynchronous RetreiveEntityMetadata Request to retrieve a particular entity metadata in the system
        ///</summary>
        ///<returns>Entity Metadata</returns>
        ///<param name="entityFilters" type="String">
        /// The filter string available to filter which data is retrieved. Case Sensitive filters [Entity,Attributes,Privileges,Relationships]
        /// Include only those elements of the entity you want to retrieve in the array. Retrieving all parts of all entities may take significant time.
        ///</param>
        ///<param name="logicalName" type="String">
        /// The string of the entity logical name
        ///</param>
        ///<param name="retrieveIfPublished" type="Boolean">
        /// Sets whether to retrieve the metadata that has not been published.
        ///</param>
        ///<param name="callBack" type="Function">
        /// The function that will be passed through and be called by a successful response.
        /// This function also used as an indicator if the function is synchronous/asynchronous
        ///</param>

        entityFilters = isArray(entityFilters) ? entityFilters : [entityFilters];
        var entityFiltersString = "";
        for (var iii = 0, templength = entityFilters.length; iii < templength; iii++) {
            entityFiltersString += encodeValue(entityFilters[iii]) + " ";
        }

        var request = [
            "<request i:type=\"a:RetrieveEntityRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">",
            "<a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>EntityFilters</b:key>",
            "<b:value i:type=\"c:EntityFilters\" xmlns:c=\"http://schemas.microsoft.com/xrm/2011/Metadata\">", encodeValue(entityFiltersString), "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>MetadataId</b:key>",
            "<b:value i:type=\"c:guid\"  xmlns:c=\"http://schemas.microsoft.com/2003/10/Serialization/\">", encodeValue("00000000-0000-0000-0000-000000000000"), "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>RetrieveAsIfPublished</b:key>",
            "<b:value i:type=\"c:boolean\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">", encodeValue(retrieveIfPublished.toString()), "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>LogicalName</b:key>",
            "<b:value i:type=\"c:string\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">", encodeValue(logicalName), "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "</a:Parameters>",
            "<a:RequestId i:nil=\"true\" />",
            "<a:RequestName>RetrieveEntity</a:RequestName>",
            "</request>"
        ].join("");

        var async = !!callback;

        return doRequest(request, "Execute", async, function (resultXml) {
            var response = selectNodes(resultXml, "//b:value");

            var results = [];
            for (var i = 0, ilength = response.length; i < ilength; i++) {
                var a = objectifyNode(response[i]);
                a._type = "EntityMetadata";
                results.push(a);
            }

            if (!async)
                return results;
            else
                callback(results);
            // ReSharper disable NotAllPathsReturnValue
        });
        // ReSharper restore NotAllPathsReturnValue
    };

    var retrieveAttributeMetadata = function (entityLogicalName, attributeLogicalName, retrieveIfPublished, callback) {
        ///<summary>
        /// Sends an synchronous/asynchronous RetrieveAttributeMetadata Request to retrieve a particular entity's attribute metadata in the system
        ///</summary>
        ///<returns>Entity Metadata</returns>
        ///<param name="entityLogicalName" type="String">
        /// The string of the entity logical name
        ///</param>
        ///<param name="attributeLogicalName" type="String">
        /// The string of the entity's attribute logical name
        ///</param>
        ///<param name="retrieveIfPublished" type="Boolean">
        /// Sets whether to retrieve the metadata that has not been published.
        ///</param>
        ///<param name="callBack" type="Function">
        /// The function that will be passed through and be called by a successful response.
        /// This function also used as an indicator if the function is synchronous/asynchronous
        ///</param>

        var request = [
            "<request i:type=\"a:RetrieveAttributeRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">",
            "<a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>EntityLogicalName</b:key>",
            "<b:value i:type=\"c:string\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">", encodeValue(entityLogicalName), "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>MetadataId</b:key>",
            "<b:value i:type=\"ser:guid\"  xmlns:ser=\"http://schemas.microsoft.com/2003/10/Serialization/\">", encodeValue("00000000-0000-0000-0000-000000000000"), "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>RetrieveAsIfPublished</b:key>",
            "<b:value i:type=\"c:boolean\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">", encodeValue(retrieveIfPublished.toString()), "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "<a:KeyValuePairOfstringanyType>",
            "<b:key>LogicalName</b:key>",
            "<b:value i:type=\"c:string\"   xmlns:c=\"http://www.w3.org/2001/XMLSchema\">", encodeValue(attributeLogicalName), "</b:value>",
            "</a:KeyValuePairOfstringanyType>",
            "</a:Parameters>",
            "<a:RequestId i:nil=\"true\" />",
            "<a:RequestName>RetrieveAttribute</a:RequestName>",
            "</request>"
        ].join("");

        var async = !!callback;

        return doRequest(request, "Execute", async, function (resultXml) {
            var response = selectNodes(resultXml, "//b:value");
            var results = [];
            for (var i = 0, ilength = response.length; i < ilength; i++) {
                var a = objectifyNode(response[i]);
                results.push(a);
            }

            if (!async)
                return results;
            else
                callback(results);
            // ReSharper disable NotAllPathsReturnValue
        });
        // ReSharper restore NotAllPathsReturnValue
    };

    //Toolkit's Return Static Methods
    return {
        BusinessEntity: businessEntity,
        Execute: execute,
        Fetch: fetch,
        Retrieve: retrieve,
        RetrieveMultiple: retrieveMultiple,
        Create: sCreate,
        Update: sUpdate,
        Delete: sDelete,
        QueryByAttribute: queryByAttribute,
        QueryAll: queryAll,
        SetState: setState,
        Associate: associate,
        Disassociate: disassociate,
        Assign: assign,
        RetrievePrincipalAccess: retrievePrincipalAccess,
        GrantAccess: grantAccess,
        ModifyAccess: modifyAccess,
        RevokeAccess: revokeAccess,
        GetCurrentUserId: getCurrentUserId,
        GetCurrentUserBusinessUnitId: getCurrentUserBusinessUnitId,
        GetCurrentUserRoles: getCurrentUserRoles,
        IsCurrentUserRole: isCurrentUserInRole,
        RetrieveAllEntitiesMetadata: retrieveAllEntitiesMetadata,
        RetrieveEntityMetadata: retrieveEntityMetadata,
        RetrieveAttributeMetadata: retrieveAttributeMetadata
    };
}();

XrmServiceToolkit.Extension = function () {
    // jQuery Load Help function to add tooltip for attribute in CRM 2011. Unsupported because of the usage of DOM object edit.
    //****************************************************
    var alertMessage = function (message) {
        (Xrm.Utility !== undefined && Xrm.Utility.alertDialog !== undefined) ? Xrm.Utility.alertDialog(message): alert(message);
    };

    var context = function () {
        ///<summary>
        /// Private function to the context object.
        ///</summary>
        ///<returns>Context</returns>
        var oContext;
        if (typeof window.GetGlobalContext != "undefined") {
            oContext = window.GetGlobalContext();
        } else if (typeof GetGlobalContext != "undefined") {
            oContext = GetGlobalContext();
        } else {
            if (typeof Xrm != "undefined") {
                oContext = Xrm.Page.context;
            } else if (typeof window.parent.Xrm != "undefined") {
                oContext = window.parent.Xrm.Page.context;
            } else {
                throw new Error("Context is not available.");
            }
        }
        return oContext;
    };

    var getClientUrl = function () {
        ///<summary>
        /// Private function to return the server URL from the context
        ///</summary>
        ///<returns>String</returns>
        var serverUrl = typeof context().getClientUrl != 'undefined' ? context().getClientUrl() : context().getServerUrl();
        if (serverUrl.match(/\/$/)) {
            serverUrl = serverUrl.substring(0, serverUrl.length - 1);
        }
        return serverUrl;
    };

    var jQueryXrmFieldTooltip = function (filename, bDisplayImg) {
        ///<summary>
        /// A generic configurable method to add tooltip to crm 2011 field.
        ///</summary>
        ///<param name="filename" type="String">
        /// A JavaScript String corresponding the name of the configuration web resource name in CRM 2011 instance
        /// </param>
        ///<param name="bDisplayImg" type="boolean">
        /// A JavaScript boolean corresponding if display a help image for the tooltip
        /// </param>

        /*
        This function is used add tooltips to any field in CRM2011.

        This function requires the following parameters:
        filename :   name of the XML web resource
        bDisplayImg: boolean to show/hide the help image (true/false)
        Returns: nothing
        Example:  jQueryLoadHelp('cm_xmlhelpfile', true);
        Designed by: http://lambrite.com/?p=221
        Adapted by Geron Profet (www.crmxpg.nl), Jaimie Ji
        Modified by Jaimie Ji with jQuery and cross browser
        */

        if (Xrm.Page.ui.setFormNotification !== undefined) {
            alertMessage('XrmServiceToolkit.Extension.JQueryXrmFieldTooltip is not supported in CRM2013.\nPlease use the out of box functionality');
            return;
        }

        if (typeof jQuery === 'undefined') {
            var errorMessage = ('jQuery is not loaded.\nPlease ensure that jQuery is included\n as web resource in the form load.');
            alertMessage(errorMessage);
            return;
        }

        function registerHelp(entity, attr, txt) {
            var obj = jQuery('#' + attr + '_c').children(':first');
            if (obj != null) {
                var html = '<img id="img_' + attr + '" src="/_imgs/ico/16_help.gif" alt="' + txt + '" width="16" height="16" /><div id="help_' + attr + '" style="visibility: hidden; position: absolute;">: ' + txt + '</div>';
                jQuery(obj).append(html);
                //20110909 GP: added line to hide/show help image
                jQuery('#img_' + attr).css('display', (bDisplayImg) ? 'inline' : 'none');
            }
        }

        //****************************************************
        function parseHelpXml(data) {
            var entity = Xrm.Page.data.entity.getEntityName().toString().toLowerCase();
            var entXml = jQuery("entity[name=" + entity + "]", data);
            jQuery(entXml).children().each(function () {
                var attr = jQuery(this).attr('name');
                var txt = jQuery(this).find('shorthelp').text();
                registerHelp(entity, attr, txt);
            });
        }

        jQuery.support.cors = true;

        jQuery.ajax({
            type: "GET",
            url: getClientUrl() + "/WebResources/" + filename,
            dataType: "xml",
            success: parseHelpXml,
            // ReSharper disable UnusedParameter
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                // ReSharper restore UnusedParameter
                alertMessage('Something is wrong to setup the tooltip for the fields. Please contact your administrator');
            }
        }); //end Ajax

    };

    // Generic Dependent Option Set Function. Changed from CRM 2011 SDK example
    var jQueryXrmDependentOptionSet = function (filename) {
        ///<summary>
        /// A generic configurable method to configure dependent optionset for CRM 2011 instance
        ///</summary>
        ///<param name="filename" type="String">
        /// A JavaScript String corresponding the name of the configuration web resource name in CRM 2011 instance
        /// </param>
        if (typeof jQuery === 'undefined') {
            alertMessage('jQuery is not loaded.\nPlease ensure that jQuery is included\n as web resource in the form load.');
            return;
        }

        // This is the function set on the OnChange event for
        // parent fields.
        // ReSharper disable DuplicatingLocalDeclaration
        function filterDependentField(parentField, childField, jQueryXrmDependentOptionSet) {
            // ReSharper restore DuplicatingLocalDeclaration
            for (var depOptionSet in jQueryXrmDependentOptionSet.config) {
                if (jQueryXrmDependentOptionSet.config.hasOwnProperty(depOptionSet)) {
                    var dependentOptionSet = jQueryXrmDependentOptionSet.config[depOptionSet];
                    /* Match the parameters to the correct dependent optionset mapping*/
                    if ((dependentOptionSet.parent === parentField) && (dependentOptionSet.dependent === childField)) {
                        /* Get references to the related fields*/
                        var parent = Xrm.Page.data.entity.attributes.get(parentField);
                        var child = Xrm.Page.data.entity.attributes.get(childField);

                        var parentControl = Xrm.Page.getControl(parentField);
                        var childControl = Xrm.Page.getControl(childField);
                        /* Capture the current value of the child field*/
                        var currentChildFieldValue = child.getValue();

                        /* If the parent field is null the Child field can be set to null */
                        var controls;
                        var ctrl;
                        if (parent.getValue() === null) {
                            child.setValue(null);
                            child.setSubmitMode("always");
                            child.fireOnChange();

                            // Any attribute may have any number of controls,
                            // so disable each instance.
                            controls = child.controls.get();
                            for (ctrl in controls) {
                                if (controls.hasOwnProperty(ctrl)) {
                                    controls[ctrl].setDisabled(true);
                                }
                            }
                            return;
                        }

                        for (var os in dependentOptionSet.options) {
                            if (dependentOptionSet.options.hasOwnProperty(os)) {
                                var options = dependentOptionSet.options[os];
                                var optionsToShow = options.showOptions;
                                /* Find the Options that corresponds to the value of the parent field. */
                                if (parent.getValue().toString() === options.value.toString()) {
                                    controls = child.controls.get(); /*Enable the field and set the options*/
                                    for (ctrl in controls) {
                                        if (controls.hasOwnProperty(ctrl)) {
                                            controls[ctrl].setDisabled(false);
                                            controls[ctrl].clearOptions();

                                            for (var option in optionsToShow) {
                                                if (optionsToShow.hasOwnProperty(option)) {
                                                    controls[ctrl].addOption(optionsToShow[option]);
                                                }
                                            }
                                        }
                                    }
                                    /*Check whether the current value is valid*/
                                    var bCurrentValueIsValid = false;
                                    var childFieldOptions = optionsToShow;

                                    for (var validOptionIndex in childFieldOptions) {
                                        if (childFieldOptions.hasOwnProperty(validOptionIndex)) {
                                            var optionDataValue = childFieldOptions[validOptionIndex].value;

                                            if (currentChildFieldValue === parseInt(optionDataValue)) {
                                                bCurrentValueIsValid = true;
                                                break;
                                            }
                                        }
                                    }
                                    /*
                            If the value is valid, set it.
                            If not, set the child field to null
                            */
                                    if (bCurrentValueIsValid) {
                                        child.setValue(currentChildFieldValue);
                                    } else {
                                        child.setValue(null);
                                    }
                                    child.setSubmitMode("always");
                                    child.fireOnChange();

                                    if (parentControl.getDisabled() === true) {
                                        childControl.setDisabled(true);
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }


        function init(data) {
            var entity = Xrm.Page.data.entity.getEntityName().toString().toLowerCase();
            var configWr = jQuery("entity[name=" + entity + "]", data);

            //Convert the XML Data into a JScript object.
            var parentFields = configWr.children("ParentField");
            var jsConfig = [];
            for (var i = 0, ilength = parentFields.length; i < ilength; i++) {
                var node = parentFields[i];
                var mapping = {};
                mapping.parent = jQuery(node).attr("id");
                mapping.dependent = jQuery(node).children("DependentField:first").attr("id");
                mapping.options = [];
                var options = jQuery(node).children("Option");
                for (var a = 0, alength = options.length; a < alength; a++) {
                    var option = {};
                    option.value = jQuery(options[a]).attr("value");
                    option.showOptions = [];
                    var optionsToShow = jQuery(options[a]).children("ShowOption");
                    for (var b = 0, blength = optionsToShow.length; b < blength; b++) {
                        var optionToShow = {};
                        optionToShow.value = jQuery(optionsToShow[b]).attr("value");
                        optionToShow.text = jQuery(optionsToShow[b]).attr("label"); // Label is not used in the code.

                        option.showOptions.push(optionToShow);
                    }
                    mapping.options.push(option);
                }
                jsConfig.push(mapping);
            }
            // Attach the configuration object to jQueryXrmDependentOptionSet
            // so it will be available for the OnChange events.
            jQueryXrmDependentOptionSet.config = jsConfig;

            //Fire the OnChange event for the mapped optionset fields
            // so that the dependent fields are filtered for the current values.
            for (var depOptionSet in jQueryXrmDependentOptionSet.config) {
                if (jQueryXrmDependentOptionSet.config.hasOwnProperty(depOptionSet)) {
                    var parent = jQueryXrmDependentOptionSet.config[depOptionSet].parent;
                    var child = jQueryXrmDependentOptionSet.config[depOptionSet].dependent;
                    filterDependentField(parent, child, jQueryXrmDependentOptionSet);
                }
            }
        }

        jQuery.support.cors = true;

        jQuery.ajax({
            type: "GET",
            url: getClientUrl() + "/WebResources/" + filename,
            dataType: "xml",
            success: init,
            // ReSharper disable UnusedParameter
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                // ReSharper restore UnusedParameter
                alertMessage('Something is wrong to setup the dependent picklist. Please contact your administrator');
            }
        }); //end Ajax
    };

    var jQueryXrmCustomFilterView = function (filename) {
        ///<summary>
        /// A generic configurable method to add custom filter view to lookup field in crm 2011 instance
        ///</summary>
        ///<param name="filename" type="String">
        /// A JavaScript String corresponding the name of the configuration web resource name in CRM 2011 instance
        /// </param>
        if (typeof jQuery === 'undefined') {
            alertMessage('jQuery is not loaded.\nPlease ensure that jQuery is included\n as web resource in the form load.');
            return;
        }

        function setCustomFilterView(target, entityName, viewName, fetchXml, layoutXml) {
            // use randomly generated GUID Id for our new view
            var viewId = "{1DFB2B35-B07C-44D1-868D-258DEEAB88E2}";

            // add the Custom View to the indicated [lookupFieldName] Control
            Xrm.Page.getControl(target).addCustomView(viewId, entityName, viewName, fetchXml, layoutXml, true);
        }

        function xmlToString(responseXml) {
            var xmlString = '';
            try {
                if (responseXml != null) {
                    if (typeof XMLSerializer !== "undefined" && typeof responseXml.xml === "undefined") {
                        // ReSharper disable InconsistentNaming
                        xmlString = (new XMLSerializer()).serializeToString(responseXml);
                        // ReSharper restore InconsistentNaming
                    } else {
                        if (typeof responseXml.xml !== "undefined") {
                            xmlString = responseXml.xml;
                        } else if (typeof responseXml[0].xml !== "undefined") {
                            xmlString = responseXml[0].xml;
                        }

                    }
                }
            } catch (e) {
                alertMessage("Cannot convert the XML to a string.");
            }
            return xmlString;
        }

        function init(data) {
            var entity = Xrm.Page.data.entity.getEntityName().toString().toLowerCase();
            var configWr = jQuery("entity[name=" + entity + "]", data);

            //Convert the XML Data into a JScript object.
            var targetFields = configWr.children("TargetField");
            var jsConfig = [];
            for (var i = 0, ilength = targetFields.length; i < ilength; i++) {
                var node = targetFields[i];
                var mapping = {};
                mapping.target = jQuery(node).attr("id");
                mapping.entityName = jQuery(node).attr("viewentity");
                mapping.viewName = jQuery(node).attr("viewname");
                mapping.dynamic = jQuery(node).children("dynamic").children();
                mapping.fetchXml = xmlToString(jQuery(node).children("fetch"));
                mapping.layoutXml = xmlToString(jQuery(node).children("grid"));

                jsConfig.push(mapping);
            }
            // Attach the configuration object to JQueryCustomFilterView
            // so it will be available for the OnChange events.
            jQueryXrmCustomFilterView.config = jsConfig;

            //Fire the OnChange event for the mapped fields
            // so that the lookup dialog are changed with the filtered view for the current values.
            for (var customFilterView in jQueryXrmCustomFilterView.config) {
                if (jQueryXrmCustomFilterView.config.hasOwnProperty(customFilterView)) {
                    var target = jQueryXrmCustomFilterView.config[customFilterView].target;
                    var entityName = jQueryXrmCustomFilterView.config[customFilterView].entityName;
                    var viewName = jQueryXrmCustomFilterView.config[customFilterView].viewName;
                    var dynamic = jQueryXrmCustomFilterView.config[customFilterView].dynamic;
                    var fetchXml = jQueryXrmCustomFilterView.config[customFilterView].fetchXml;
                    var layoutXml = jQueryXrmCustomFilterView.config[customFilterView].layoutXml;

                    //TODO: Adding logics for various field and conditions. More tests required.
                    if (dynamic != null) {
                        for (var a = 0, alength = dynamic.length; a < alength; a++) {
                            var dynamicControlType = Xrm.Page.getControl(jQuery(dynamic).attr('name')).getControlType();
                            var fieldValueType = jQuery(dynamic).attr('fieldvaluetype'); //for optionset, name might be used to filter
                            if (Xrm.Page.getAttribute(jQuery(dynamic).attr('name')).getValue() === null) {
                                alertMessage(jQuery(dynamic).attr('name') + ' does not have a value. Please put validation logic on the field change to call this function. Only use XrmServiceToolkit.Extension.JQueryXrmCustomFilterView when the field has a value.');
                                return;
                            }
                            var dynamicValue = null;
                            switch (dynamicControlType) {
                                case 'standard':
                                    dynamicValue = Xrm.Page.getAttribute(jQuery(dynamic).attr('name')).getValue();
                                    break;
                                case 'optionset':
                                    dynamicValue = (fieldValueType != null && fieldValueType === 'label') ? Xrm.Page.getAttribute(jQuery(dynamic).attr('name')).getSelectionOption().text : Xrm.Page.getAttribute(jQuery(dynamic).attr('name')).getValue();
                                    break;
                                case 'lookup':
                                    dynamicValue = (fieldValueType != null && fieldValueType === 'name') ? Xrm.Page.getAttribute(jQuery(dynamic).attr('name')).getValue()[0].name : Xrm.Page.getAttribute(jQuery(dynamic).attr('name')).getValue()[0].id;
                                    break;
                                default:
                                    alertMessage(jQuery(dynamic).attr('name') + " is not supported for filter lookup view. Please change the configuration.");
                                    break;
                            }

                            var operator = jQuery(dynamic).attr('operator');
                            if (operator === null) {
                                alertMessage('operator is missing in the configuration file. Please fix the issue');
                                return;
                            }
                            var dynamicString = jQuery(dynamic).attr('fetchnote');
                            switch (operator.toLowerCase()) {
                                case 'contains':
                                case 'does not contain':
                                    dynamicValue = '%' + dynamicValue + '%';
                                    break;
                                case 'begins with':
                                case 'does not begin with':
                                    dynamicValue = dynamicValue + '%';
                                    break;
                                case 'ends with':
                                case 'does not end with':
                                    dynamicValue = '%' + dynamicValue;
                                    break;
                                default:
                                    break;
                            }

                            fetchXml = fetchXml.replace(dynamicString, dynamicValue);
                        }
                    }

                    //replace the values if required
                    setCustomFilterView(target, entityName, viewName, fetchXml, layoutXml);
                }
            }
        }

        jQuery.support.cors = true;

        jQuery.ajax({
            type: "GET",
            url: getClientUrl() + "/WebResources/" + filename,
            dataType: "xml",
            success: init,
            // ReSharper disable UnusedParameter
            error: function (xmlHttpRequest, textStatus, errorThrown) {
                // ReSharper restore UnusedParameter
                alertMessage('Something is wrong to setup the custom filter view. Please contact your administrator');
            }
        }); //end Ajax

    };

    // Disable or Enable to insert/edit note for entity. Unsupported because of DOM object edit
    var jQueryXrmFormatNotesControl = function (allowInsert, allowEdit) {
        ///<summary>
        /// A generic configurable method to format the note control in crm 2011 instance
        ///</summary>
        ///<param name="allowInsert" type="Boolean">
        /// A JavaScript boolean to format if the note control allow insert
        /// </param>
        ///<param name="allowEdit" type="Boolean">
        /// A JavaScript boolean to format if the note control allow edit
        /// </param>

        if (Xrm.Page.ui.setFormNotification !== undefined) {
            alertMessage('XrmServiceToolkit.Extension.JQueryXrmFormatNotesControl is not supported in CRM2013');
            return;
        }

        if (typeof jQuery === 'undefined') {
            alertMessage('jQuery is not loaded.\nPlease ensure that jQuery is included\n as web resource in the form load.');
            return;
        }

        jQuery.support.cors = true;

        var notescontrol = jQuery('#notescontrol');
        if (notescontrol === null || notescontrol === undefined) return;
        var url = notescontrol.attr('url');
        //if (url === null) return;
        if (url != null) {
            if (!allowInsert) {
                url = url.replace("EnableInsert=true", "EnableInsert=false");
            } else if (!allowEdit) {
                url = url.replace("EnableInlineEdit=true", "EnableInlineEdit=false");
            }
            notescontrol.attr('url', url);
        } else {
            var src = notescontrol.attr('src');
            if (src != null) {
                if (!allowInsert) {
                    src = src.replace("EnableInsert=true", "EnableInsert=false");
                } else if (!allowEdit) {
                    src = src.replace("EnableInlineEdit=true", "EnableInlineEdit=false");
                }
                notescontrol.attr('src', src);
            }
        }
    };

    // Toolkit's public static members
    return {
        JQueryXrmFieldTooltip: jQueryXrmFieldTooltip,
        JQueryXrmDependentOptionSet: jQueryXrmDependentOptionSet,
        JQueryXrmCustomFilterView: jQueryXrmCustomFilterView,
        JQueryXrmFormatNotesControl: jQueryXrmFormatNotesControl
    };
}();