$(function () {
    var CrmPowerPane = {
        ApplicationType: {
            DynamicsCRM: "Dynamics CRM",
            Dynamics365: "Dynamics 365"
        },
        Constants: {
            SlideTime: 250,
            NotificationClassPrefix: "crm-power-pane-",
            NotificationTimer: null
        },
        UI: {
            ShowNotification: function (message, type, time) {
                window.clearTimeout(CrmPowerPane.Constants.NotificationTimer);
                time = time || 5500;
                type = type || 'info';
                var className = CrmPowerPane.Constants.NotificationClassPrefix + type;
                var $notification = $("#crm-power-pane-notification");
                $notification.find('span').html(message);
                $notification.attr('class', '');
                $notification.addClass(className).fadeIn(CrmPowerPane.Constants.SlideTime);
                CrmPowerPane.Constants.NotificationTimer = setTimeout(function () {
                    $notification.fadeOut(CrmPowerPane.Constants.SlideTime);
                }, time);
            },
            BuildInputPopup: function (header, description, parameters, callback, inlineTransition) {
                inlineTransition = inlineTransition || false;
                var popup = new CrmPowerPane.UI.Popup();
                parameters.forEach(function (p) {
                    popup.AddParameter(p.label, p.name, p.defaultValue);
                });
                popup.Header = header;
                popup.Description = description;
                popup.InlineTransition = inlineTransition;
                popup.RetreiveData(callback);
            },
            BuildOutputPopup: function (header, description, parameters, callback) {
                var popup = new CrmPowerPane.UI.Popup();
                parameters.forEach(function (p, i) {
                    popup.AddParameter(p.label, i, p.value);
                });
                popup.Header = header;
                popup.Description = description;
                popup.ShowData(callback);
            },
            Popup: function () {
                this.Parameters = [],
                this.Header = null,
                this.Description = null,
                this.InlineTransition = null,
                this.Initialize = function () {
                    var $popup = $("#crm-power-pane-popup");
                    $popup.find("h1").html(this.Header).toggle(this.Header != null);
                    $popup.find("p").html(this.Description).toggle(this.Description != null);
                    $popup.find("li").remove();

                    $popup.unbind().keyup(function(event) {
                        if (event.key === "Enter")
                            $("#crm-power-pane-popup-ok") && $("#crm-power-pane-popup-ok").click();
                        else if (event.key === "Escape")
                            $("#crm-power-pane-popup-cancel") && $("#crm-power-pane-popup-cancel").click();
                    });
                    return $popup;
                },
                this.AddParameter = function (label, name, value) {
                    this.Parameters[name] = {
                        label: label,
                        value: value || null
                    }
                },
                this.RetreiveData = function (callback) {
                    var $popup = this.Initialize();
                    
                    $popupParameters = $popup.find("ul");

                    for (var key in this.Parameters) {
                        var p = this.Parameters[key];
                        var defaultValue = p.value || "";
                        $popupParameters.append("<li><span class='crm-power-pane-popup-input-text'>" + p.label + ":</span><input type='text' value ='" + defaultValue + "' name='" + key + "'/></li>");
                    }

                    $popup.fadeIn(CrmPowerPane.Constants.SlideTime);
                    $popup.find("input").first().focus();
                    var $popupBg = $("#crm-power-pane-popup-bg");
                    $popupBg.fadeIn(CrmPowerPane.Constants.SlideTime);
                    var transition = this.InlineTransition;
                    $("#crm-power-pane-popup-ok").unbind().click(
                        {
                            $popupList: $popupParameters,
                            popupObj: this
                        }, function (event) {
                            if (transition != true) {
                                $popup.fadeOut(CrmPowerPane.Constants.SlideTime);
                                $popupBg.fadeOut(CrmPowerPane.Constants.SlideTime);
                            }

                            var popupObj = event.data.popupObj;
                            var params = popupObj.Parameters;
                            var $popupList = event.data.$popupList;

                            for (var key in params) {
                                var p = params[key];
                                p.value = $popupList.find("input[name='" + key + "']").val();
                            }
                            callback(popupObj);
                        });
                },
                this.ShowData = function (callback) {
                    var $popup = this.Initialize();
                    $popupParameters = $popup.find("ul");

                    for (var key in this.Parameters) {
                        var p = this.Parameters[key];
                        if (Array.isArray(p.value)) {
                            var li = "<li><span class='crm-power-pane-popup-input-text'>" + p.label + ":</span>";
                            p.value.forEach(function(item) {
                                var url = Xrm.Page.context.getClientUrl() + "/main.aspx?etn=" + item.entityType + "&id=" + item.id + "&pagetype=entityrecord";
                                li += "<li><a href='#' onclick='window.open(\"" + url +"\")'>" + item.name + "</a></li>"
                            });
                            li += "</li>";
                            $popupParameters.append(li);                        
                        } else {
                            $popupParameters.append("<li><span class='crm-power-pane-popup-input-text'>" + p.label + ":</span><input type='text' value='" + p.value + "' name='" + key + "'/><span class='crm-power-pane-copy'>Copy it!</span></li>");
                        }
                    }

                    $popup.fadeIn(CrmPowerPane.Constants.SlideTime);
                    $popup.find("input").first().focus();
                    var $popupBg = $("#crm-power-pane-popup-bg");
                    $popupBg.fadeIn(CrmPowerPane.Constants.SlideTime);

                    $("#crm-power-pane-popup-ok").unbind().click(
                        {
                            $popupList: $popupParameters,
                            params: this.Parameters
                        }, function (event) {
                            $popup.fadeOut(CrmPowerPane.Constants.SlideTime);
                            $popupBg.fadeOut(CrmPowerPane.Constants.SlideTime);
                        });
                }
            },
            SetButtonBackgrounds: function () {
                var color = "#001ca5";
                if (CrmPowerPane.TargetFrame.GetApplicationType() == CrmPowerPane.ApplicationType.DynamicsCRM) {
                    color = $("#crmMasthead").css("background-color");
                } else if (CrmPowerPane.TargetFrame.GetApplicationType() == CrmPowerPane.ApplicationType.Dynamics365) {
                    color = $("div[data-id=topBar]").css("background-color");
                }

                color = (color == "rgb(0, 32, 80)" || color == "rgb(0, 20, 51)") ? "#001ca5" : color;

                //$("#crm-power-pane-button").css("background-color", color);
                $(".crm-power-pane-subgroup .icon").css("background-color", color);
                $(".crm-power-pane-header").css("color", color);

            }
        },
        Utils: {
            PrettifyXml: function (sourceXml) {
                var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
                var xsltDoc = new DOMParser().parseFromString([
                    '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
                    '  <xsl:strip-space elements="*"/>',
                    '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
                    '    <xsl:value-of select="normalize-space(.)"/>',
                    '  </xsl:template>',
                    '  <xsl:template match="node()|@*">',
                    '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
                    '  </xsl:template>',
                    '  <xsl:output indent="yes"/>',
                    '</xsl:stylesheet>',
                ].join('\n'), 'application/xml');

                var xsltProcessor = new XSLTProcessor();
                xsltProcessor.importStylesheet(xsltDoc);
                var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
                var resultXml = new XMLSerializer().serializeToString(resultDoc);
                return resultXml;
            }
        },
        ServiceOperations: {
            ExecuteQuery: function (query, isAsync, successCallback, errorCallback) {
                var req = new XMLHttpRequest();
                req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/" + query, isAsync);
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                req.setRequestHeader("Prefer", "odata.include-annotations=*");
                req.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        req.onreadystatechange = null;
                        if (this.status == 200) {
                            var data = JSON.parse(this.response);
                            if (data != null && data.value != null && successCallback) {
                                successCallback(data);
                            }
                        } else {
                            if (errorCallback)
                                errorCallback(JSON.parse(this.response).error);
                        }
                    }
                };
                req.send();
            },
            RetrieveEntities: function () {
                CrmPowerPane.ServiceOperations.ExecuteQuery(
                    "EntityDefinitions?$select=LogicalName,ObjectTypeCode,DisplayName&$filter=IsValidForAdvancedFind eq true",
                    true,
                    function (data) {
                        console.log(data.value);
                    },
                    function (error) {

                    });
            },
            RetrieveEntityMetadata: function (entityMetadataId) {
                CrmPowerPane.ServiceOperations.ExecuteQuery(
                    "EntityDefinitions(" + entityMetadataId + ")?$select=LogicalName&$expand=Attributes($select=LogicalName,DisplayName)",
                    true,
                    function (data) {
                        console.log(data.value);
                    },
                    function (error) {

                    });
            },
        },
        RegisterjQueryExtensions: function () {
            $.fn.bindFirst = function (name, fn) {
                this.on(name, fn);
                this.each(function () {
                    var handlers = $._data(this, 'events')[name.split('.')[0]];
                    var handler = handlers.pop();
                    handlers.splice(0, 0, handler);
                });
            };
        },
        TargetFrame: {
            GetApplicationType: function () {
                var mainBody = document.querySelectorAll('body[scroll=no]');
                var topBar = document.querySelector("div[data-id=topBar]")

                if (mainBody && mainBody.length > 0) {
                    return CrmPowerPane.ApplicationType.DynamicsCRM
                } else if (topBar) {
                    return CrmPowerPane.ApplicationType.Dynamics365
                } else {
                    return null;
                }
            },
            GetContent: function () {
                try {
                    var applicationType = CrmPowerPane.TargetFrame.GetApplicationType()
                    if (applicationType == CrmPowerPane.ApplicationType.DynamicsCRM) {
                        return $("iframe").filter(function () {
                            return $(this).css("visibility") == "visible"
                        })[0].contentWindow;
                    } else if (applicationType == CrmPowerPane.ApplicationType.Dynamics365) {
                        return window;
                    } else {
                        return null;
                    }
                } catch (e) {
                    CrmPowerPane.Errors.ExecutionError(e);
                }
            },
            GetXrm: function () {
                try {
                    return this.GetContent().Xrm;
                } catch (e) {
                    CrmPowerPane.Errors.ExecutionError(e);
                }
            }
        },
        Errors: {
            ExecutionError: function (e) {
                console.error("An error ocurred while loading Crm Power Pane.", e);
                $("#crm-power-pane-button").hide();
            },
            WrongPageWarning: function () {
                CrmPowerPane.UI.ShowNotification("You need to open a record form to use this action. ", "warning");
            }

        },
        RegisterEvents: function () {
            var Content, Xrm;

            var _getObjectTypeCode = function () {

                    // The `etc` query string parameter is not available in UCI, so only show this
                    // if it's available.
                    var entityName = Xrm.Page.data.entity.getEntityName();
                    var objectTypeCode = Xrm.Page.context.getQueryStringParameters().etc;
                    if(!objectTypeCode) {
                        // UCI - try getting the object type code using the internal API
                        try {
                            objectTypeCode = Xrm.Internal.getEntityCode(entityName);
                        }
                        catch (e) {
                            /* do nothing */
                        }
                    }

                    return objectTypeCode;
            }

            var _getAttributeContainer = function (attributeLogicalName) {
                var $container = Content.$("#" + attributeLogicalName);

                if(!$container.length) {
                    $container = Content.$('[data-id="' + attributeLogicalName + '"]');
                }

                return $container;
            }

            var _getLabelElement = function (attributeLogicalName) {
                var $label = Content.$("#" + attributeLogicalName + "_c");
                
                if(!$label.length) {
                    // Try to get the label for UCI
                    $label = Content.$("label", '[data-id="' + attributeLogicalName + '"]');
                }

                return $label.length 
                    ? Content.$($label[0]) // TODO: refactor later - yuck. inefficient jquery wrapping
                    : null;
            }

            var _getSelectElement = function (attributeLogicalName) {
                var $select = Content.$('select.ms-crm-SelectBox[attrname=' + attributeLogicalName + ']');

                if(!$select.length) {
                    // Try to get the dropdown for UCI
                    $select = Content.$("select", '[data-id="' + attributeLogicalName + '"]');
                }
                
                return $select;
            };

            $(".crm-power-pane-subgroup").bindFirst('click', function () {
                Content = CrmPowerPane.TargetFrame.GetContent();
                Xrm = CrmPowerPane.TargetFrame.GetXrm();
            });


            $(document).on("click", "#crm-power-pane-button", function (e) {
                $(".crm-power-pane-sections").slideToggle(CrmPowerPane.Constants.SlideTime);
                e.stopPropagation();
            });

            // Hide the pane if it is already open and the user clicked somewhere else.
            $(document).on("click", function () {
                $(".crm-power-pane-sections").delay(100).slideUp(CrmPowerPane.Constants.SlideTime);
            });

            $(window).on("blur", function () {
                $(".crm-power-pane-sections").delay(100).slideUp(CrmPowerPane.Constants.SlideTime);
            });
            
            $(".crm-power-pane-sections").click(function (e) {
                e.stopPropagation();
            });

            $("#entity-name").click(function () {
                try {


                    var entityName = Xrm.Page.data.entity.getEntityName();
                    var values = [
                        {
                            label: "Entity Name",
                            value: entityName
                        }
                    ];

                    // Show object type code if known 
                    var objectTypeCode = _getObjectTypeCode();
                    if(!!objectTypeCode) {
                        values.push({
                            label: "Entity Type Code",
                            value: objectTypeCode
                        });
                    }

                    CrmPowerPane.UI.BuildOutputPopup(
                                    "Entity info",
                                    "Entity schema name of current record.",
                                    values);
                } catch (e) {
                    CrmPowerPane.Errors.WrongPageWarning();
                }
            });

            $("#record-id").click(function () {
                try {
                    CrmPowerPane.UI.BuildOutputPopup(
                                    "Record id",
                                    "Guid of current record.",
                                    [{
                                        label: "Record Id",
                                        value: Xrm.Page.data.entity.getId()
                                    }]);
                } catch (e) {
                    CrmPowerPane.Errors.WrongPageWarning();
                }
            });

            $("#record-url").click(function () {
                try {
                    var header = "Record url";
                    var description = "Url of current record.";

                    var url = [Xrm.Page.context.getClientUrl() + "/main.aspx?"];
                    url.push("etn=" + Xrm.Page.data.entity.getEntityName());
                    url.push("&id=" + Xrm.Page.data.entity.getId());
                    url.push("&pagetype=entityrecord");

                    var result = [{
                        label: "Record Url",
                        value: url.join("")
                    }];

                    if (Xrm.Utility && Xrm.Utility.getGlobalContext && Xrm.Utility.getGlobalContext().getCurrentAppProperties) {
                        Xrm.Utility.getGlobalContext().getCurrentAppProperties().then(function (appDetails) {
                            url.splice(1, 0, "appid=" + appDetails.appId + "&");
                            result.push({
                                label: "Record Url for Current Application",
                                value: url.join("")
                            });
                            CrmPowerPane.UI.BuildOutputPopup(header, description, result);
                        });
                    } else {
                        CrmPowerPane.UI.BuildOutputPopup(header, description, result);
                    }
                } catch (e) {
                    CrmPowerPane.Errors.WrongPageWarning();
                }

            });

            $("#record-properties").click(function () {
                try {
                    var id = Xrm.Page.data.entity.getId();
                    var etc = _getObjectTypeCode();
                    
                    if(Content.Mscrm && Content.Mscrm.RibbonActions && Content.Mscrm.RibbonActions.openFormProperties) { 
                        Content.Mscrm.RibbonActions.openFormProperties(id, etc);
                    }
                    else {
                        var recordPropertiesUrl = Xrm.Page.context.getClientUrl() + "/_forms/properties/properties.aspx?dType=1&id=" + id + "&objTypeCode=" + etc;
                        var options = {
                            width: 420,
                            height: 505
                        };

                        if(Xrm.Internal.getAllowLegacyDialogsEmbedding()) {
                            Xrm.Internal.openLegacyWebDialog(recordPropertiesUrl, options)
                        }
                        else {
                            Xrm.Navigation.openUrl(recordPropertiesUrl, options);
                        }
                    }
                } catch (e) {
                    CrmPowerPane.Errors.WrongPageWarning();
                }
            });

            $("#go-to-record").click(function () {
                try {
                    CrmPowerPane.UI.BuildInputPopup(
                                    "Go to record",
                                    "Redirects you to specific record by id.",
                                    [
                                        {
                                            label: "Entity Schema Name",
                                            name: "entityname"
                                        },
                                        {
                                            label: "Record Id",
                                            name: "recordid"
                                        }
                                    ],
                                    function (popupObj) {
                                        var params = popupObj.Parameters;
                                        if (params.entityname.value && params.recordid.value) {
                                            var linkProps = [Xrm.Page.context.getClientUrl() + "/main.aspx"];
                                            linkProps.push("?etn=" + params.entityname.value.toLowerCase());
                                            linkProps.push("&id=" + params.recordid.value);
                                            linkProps.push("&pagetype=entityrecord");
                                            window.open(linkProps.join(""), '_blank');
                                        } else {
                                            CrmPowerPane.UI.ShowNotification("Entity name and record guid are required. Please fill them and try again.", "warning");
                                        }
                                    });
                } catch (e) {
                    CrmPowerPane.UI.ShowNotification("An error ocurred while redirecting to specified record.", "error");
                }
            });

            $("#user-info").click(function () {
                try {
                    function getUserRoles() {
                        var userId = Xrm.Page.context.getUserId();
                        var serverUrl = Xrm.Page.context.getClientUrl();
                        var query = serverUrl + "/XRMServices/2011/OrganizationData.svc/SystemUserSet?$select=systemuserroles_association/Name,systemuserroles_association/RoleId&$expand=systemuserroles_association&$filter=SystemUserId eq guid'" + userId + "'";
                        var service = new XMLHttpRequest();
                        service.open("GET", query, false);
                        service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
                        service.setRequestHeader("Accept", "application/json, text/javascript, */*");
                        service.send(null);
                        var requestResults = eval('(' + service.responseText + ')').d;
                        var results = requestResults.results[0].systemuserroles_association.results;
                        return results.map(function(r) { return {
                            name: r.Name, 
                            id: r.RoleId,
                            entityType: "role"
                        }})
                    }                   
                    function getUserTeams() {
                        var userId = Xrm.Page.context.getUserId();
                        var serverUrl = Xrm.Page.context.getClientUrl();
                        var query = serverUrl + "/XRMServices/2011/OrganizationData.svc/SystemUserSet?$select=teammembership_association/Name,teammembership_association/TeamId&$expand=teammembership_association&$filter=SystemUserId eq guid'" + userId + "'";
                        var service = new XMLHttpRequest();
                        service.open("GET", query, false);
                        service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
                        service.setRequestHeader("Accept", "application/json, text/javascript, */*");
                        service.send(null);
                        var requestResults = eval('(' + service.responseText + ')').d;
                        var results = requestResults.results[0].teammembership_association.results;
                        return results.map(function(t) { return {
                            name: t.Name, 
                            id: t.TeamId,
                            entityType: "team"
                        }})
                    }

                    CrmPowerPane.UI.BuildOutputPopup(
                                    "User Info",
                                    "Current user information",
                                    [{
                                        label: "User name",
                                        value: Xrm.Page.context.getUserName()
                                    },
                                    {
                                        label: "User id",
                                        value: Xrm.Page.context.getUserId()
                                    }, 
                                    {
                                        label: "User Roles",
                                        value: getUserRoles()
                                    }, 
                                    {
                                        label: "User Teams",
                                        value: getUserTeams()
                                    }
                                    ]);
                } catch (e) {
                    CrmPowerPane.UI.ShowNotification("An error occurred while getting the user information.","error");
                }
            });

            $("#enable-all-fields").click(function () {
                try {
                    Xrm.Page.ui.controls.forEach(function (c) {
                        try {
                            c.setDisabled(false);
                        } catch (e) { }
                    });
                    
                    CrmPowerPane.UI.ShowNotification("All fields are enabled.");
                } catch (e) {
                    CrmPowerPane.Errors.WrongPageWarning();
                }
            });

            $("#show-all-fields").click(function () {
                try {
                    Xrm.Page.ui.controls.forEach(function (c) {
                        try {
                            c.setVisible(true);
                        } catch (e) { }
                    });

                    Xrm.Page.ui.tabs.forEach(function (t) {
                        try {
                            if (t.setVisible) {
                                t.setVisible(true);
                            }

                            if (t.sections && t.sections.getAll) {
                                t.sections.getAll().forEach(function (s) {
                                    try {
                                        if (s && s.setVisible) {
                                            s.setVisible(true);
                                        }
                                    } catch (e) {

                                    }
                                });
                            }
                        } catch (e) {

                        }
                    });

                    CrmPowerPane.UI.ShowNotification("Visibility of all fields updated to visible.");
                } catch (e) {
                    CrmPowerPane.Errors.WrongPageWarning();
                }
            });

            $("#disable-field-requirement").click(function () {
                try {
                    Xrm.Page.ui.controls.forEach(function (c) {
                        try {
                            if (c && c.getAttribute && c.getAttribute().setRequiredLevel)
                                c.getAttribute().setRequiredLevel("none");
                        } catch (e) { }
                    });
                    CrmPowerPane.UI.ShowNotification("Required level of all fields updated to none.");
                } catch (e) {
                    CrmPowerPane.Errors.WrongPageWarning();
                }
            });

            $("#schema-names").click(function () {
                try {
                    var updateStatus;
                    Xrm.Page.ui.controls.forEach(function (a) {
                        try {
                            if (a && a.setLabel && a.getName)
                                if (!a._$originalLabel) {
                                    a._$originalLabel = a.getLabel();
                                    a.setLabel(a.getName());
                                    updateStatus = "update";
                                }
                                else {
                                    updateStatus = "rollback"
                                    a.setLabel(a._$originalLabel);
                                    a._$originalLabel = null;
                                }
                        } catch (e) { }
                    });
                    if(updateStatus == "update")
                        CrmPowerPane.UI.ShowNotification("All labels updated to schema name.");
                    else if(updateStatus == "rollback")
                        CrmPowerPane.UI.ShowNotification("Schema name updates rolled back.");

                    updateStatus = null;

                } catch (e) {
                    CrmPowerPane.Errors.WrongPageWarning();
                }
            });

            $("#schema-names-as-desc").click(function () {
                try {
                    var responsibleControls = ["standard", "optionset", "lookup"];
                    Xrm.Page.ui.controls.forEach(function (control) {
                        if (responsibleControls.indexOf(control.getControlType()) > -1)
                        {
                            var attributeLogicalName = control.getName(),
                            attributeLabel = control.getLabel(),
                            $label = _getLabelElement(attributeLogicalName)
                            if($label) {
                                $label.attr("title", attributeLogicalName), $label.off("click").click(function () {
                                    var canCopy = document.queryCommandSupported("copy");
                                    if (canCopy) {
                                        var tempTextArea = document.createElement("textarea");
                                        tempTextArea.style.position = "absolute", tempTextArea.style.top = -9999, tempTextArea.style.left = -9999, tempTextArea.style.width = "2em", tempTextArea.style.height = "2em", tempTextArea.style.padding = 0, tempTextArea.style.border = "none", tempTextArea.style.outline = "none", tempTextArea.style.boxShadow = "none", tempTextArea.style.background = "transparent", tempTextArea.value = attributeLogicalName, document.body.appendChild(tempTextArea), tempTextArea.select();
                                        try {
                                            var didCopy = document.execCommand("copy");
                                            if (didCopy) {
                                                CrmPowerPane.UI.ShowNotification("Copied <b>\"" + attributeLogicalName + "\"</b> to clipboard.", "success");
                                            } else {
                                                CrmPowerPane.UI.ShowNotification("Copying failed. Please copy it yourself.", "error");
                                            }
                                        } catch (i) {
                                            console.log("Oops, unable to copy")
                                        }
                                        tempTextArea.remove();
                                    } else prompt("Copying is not supported. Please copy it yourself. " + attributeLabel, attributeLogicalName)
                                })
                            }
                        }
                    });
                    CrmPowerPane.UI.ShowNotification("Schema name mode is activated for descriptions. You can copy it with label click."); // ui message will change
                } catch (e) {
                    CrmPowerPane.Errors.WrongPageWarning();
                }
            });

            $("#schema-names-in-brackets").click(function () {
                try {
                    var updateStatus;
                    Xrm.Page.ui.controls.forEach(function (a) {
                        try {
                            if (a && a.setLabel && a.getName)
                                if (!a._$originalLabel) {
                                    a._$originalLabel = a.getLabel();
                                    var newLabel = `${a.getLabel()} [${a.getName()}]`;
                                    a.setLabel(newLabel);
                                    updateStatus = "update";
                                }
                                else {
                                    updateStatus = "rollback"
                                    a.setLabel(a._$originalLabel);
                                    a._$originalLabel = null;
                                }
                        } catch (e) { }
                    });
                    if(updateStatus == "update")
                        CrmPowerPane.UI.ShowNotification("Added schema names in brackets.");
                    else if(updateStatus == "rollback")
                        CrmPowerPane.UI.ShowNotification("Removed schema names in brackets.");

                    updateStatus = null;

                } catch (e) {
                    CrmPowerPane.Errors.WrongPageWarning();
                }
            });

            $("#refresh-form").click(function () {
                try {
                    Xrm.Page.data.refresh();
                } catch (e) {
                    CrmPowerPane.Errors.WrongPageWarning();
                }
            });

            $("#toggle-lookup-links").click(function () {
                if (Content.$(".lookup-link").length !== 0) {
                    Content.$(".lookup-link").remove();
                    return;
                }
                Xrm.Page.ui.controls.forEach(function (control) {
                    try {
                        if (control.getControlType() === 'lookup') {
                            
                            var linkId = control.getName() + "-lookup-link";
                            var externalIcon = '<svg id="i-external" viewBox="0 0 32 32" width="16" height="16" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M14 9 L3 9 3 29 23 29 23 18 M18 4 L28 4 28 14 M28 4 L14 18" /></svg>';
                            var openInNewWindowLink = $('<a id="' + linkId + '" class="crm-power-pane-lookup-link" alt="Open this record in a new window" title="Open this record in a new window"  style="cursor: pointer;margin-left: 5px">' + externalIcon + '</a>');
                            Content.$("#" + control.getName()).append(openInNewWindowLink);
                            Content.$(openInNewWindowLink).click(function () {
                                try {
                                    var attribute = control.getAttribute().getValue()[0];
                                    var url = Xrm.Page.context.getClientUrl() + "/main.aspx?etn=" + attribute.entityType + "&id=" + attribute.id + "&pagetype=entityrecord";
                                    window.open(url);
                                } catch (e) { }
                            });
                        }
                    } catch (e) { }
                });
            });

            $("#refresh-ribbon").click(function () {
                try {
                    Xrm.Page.ui.refreshRibbon();
                    CrmPowerPane.UI.ShowNotification("Ribbon refreshing.");
                } catch (e) {
                    CrmPowerPane.Errors.WrongPageWarning();
                }
            });

            $("#show-optionset-values").click(function () {
                
                try {
                    Xrm.Page.ui.controls.forEach(function (control) {
                        if (control.getControlType && control.getControlType() == "optionset") {
                            var name = control.getName();
                            var $selectBox = _getSelectElement(name)

                            var $options = ($selectBox) ? $selectBox.find("option") : null;

                            if ($options && $options.length > 0) {

                                var changedOrReverted = null;

                                for (var i = 0; i < $options.length; i++) {
                                    var $opt = $options[i];
                                    if ($opt.text != "" && $opt.value != "") {
                                        var exp = "#" + $opt.value + "# ";
                                        if ($opt.text.indexOf(exp) > -1) {
                                            $opt.text = $opt.text.replace(exp, "");
                                            $opt.title = $opt.title.replace(exp, "");
                                            changedOrReverted = "reverted";
                                        } else {
                                            $opt.text = "#" + $opt.value + "# " + $opt.text;
                                            $opt.title = "#" + $opt.value + "# " + $opt.title;
                                            changedOrReverted = "changed";
                                        }
                                    }

                                    if (changedOrReverted == "changed") {
                                        CrmPowerPane.UI.ShowNotification("Added value property to the option labels for all optionset. Like that <b>#value#</b>");
                                    } else if (changedOrReverted == "reverted") {
                                        CrmPowerPane.UI.ShowNotification("Removed value property from the option labels for all optionset.", "error");
                                    }

                                }
                            }
                        }
                    });
                } catch (e) {
                    CrmPowerPane.Errors.WrongPageWarning();
                }

            });

            $("#crm-diagnostics").click(function () {
                window.open(Content.Xrm.Page.context.getClientUrl() + "/tools/diagnostics/diag.aspx");
            });

            $("#mobile-client").click(function () {
                var url = Content.Xrm.Page.context.getClientUrl(); 
                window.open(url + "/nga/main.htm?org=" + Content.Xrm.Page.context.getOrgUniqueName() + "&server=" + url); 
            });

            $("#performance-center").click(function () {
                Mscrm.Performance.PerformanceCenter.get_instance().TogglePerformanceResultsVisibility();
            });

            $("#show-dirty-fields").click(function () {
                try {
                    Xrm.Page.ui.controls.forEach(function (control) {
                        var attr = (control && control.getAttribute) ? control.getAttribute() : undefined;
                        if (attr && attr.getIsDirty && attr.getIsDirty()) {
                            var name = control.getName();
                            _getAttributeContainer(name).css('background', '#FFFF00');
                        }
                    });
                    CrmPowerPane.UI.ShowNotification("Dirty fields were highlighted.");
                } catch (e) {
                    CrmPowerPane.Errors.WrongPageWarning();
                }
            });

            $("#clear-all-notifications").click(function () {
                try {
                    Xrm.Page.ui.controls.forEach(function (c) {
                        try {
                            c.clearNotification();
                        } catch (e) { }
                    });
                    CrmPowerPane.UI.ShowNotification("Notifications of all fields have been cleared.");
                } catch (e) {
                    CrmPowerPane.Errors.WrongPageWarning();
                }
            });

            $("#open-entity-editor").click(function () {
                try {
                    CrmPowerPane.UI.BuildInputPopup(
                                    "Open entity editor",
                                    "Opens entity editor according the specified entity.",
                                    [
                                        {
                                            label: "Entity Schema Name (optional)",
                                            name: "entityname",
                                            defaultValue: (Xrm && Xrm.Page 
                                                            && Xrm.Page.data 
                                                            && Xrm.Page.data.entity 
                                                            && Xrm.Page.data.entity.getEntityName) ? Xrm.Page.data.entity.getEntityName() : null
                                        }
                                    ],
                                    function (popupObj) {
                                        var entityDetail = "";
                                        var entityName = popupObj.Parameters.entityname.value;
                                        if (entityName && entityName.trim() != "") {
                                            var entityTypeCode = Xrm.Internal.getEntityCode(entityName);
                                            var entitiesCategoryCode = 9801; // undocumented
                                            entityDetail = "&def_category=" + entitiesCategoryCode + "&def_type=" + entityTypeCode
                                        }
                                        
                                        // ref https://docs.microsoft.com/en-us/previous-versions/dynamicscrm-2016/developers-guide/gg328257(v=crm.8)?redirectedfrom=MSDN#constant-solutionid-values
                                        var defaultSolutionId = "{FD140AAF-4DF4-11DD-BD17-0019B9312238}";

                                        window.open(Content.Xrm.Page.context.getClientUrl() + "/tools/solution/edit.aspx?id=" + defaultSolutionId + entityDetail);
                                    });
                } catch (e) {
                    CrmPowerPane.UI.ShowNotification("An error ocurred while redirecting to entity editor.", "error");
                }
            });

            $("#show-field-value").click(function () {
                try {

                    if (Xrm.Page.ui.getFormType() != 0) {
                        CrmPowerPane.UI.BuildInputPopup(
                            "Show Field Value",
                            "Shows the field value on the form.",
                            [
                                {
                                    label: "Field Schema Name",
                                    name: "fieldname",
                                }
                            ],
                            function (popupObj) {

                                var params = popupObj.Parameters;

                                if (params.fieldname.value) {
                                    var control = Xrm.Page.getControl(params.fieldname.value);

                                    if (control && control.getControlType) {

                                        var controlType = control.getControlType();
                                        var outputParams = null;

                                        if (controlType == "optionset") {

                                            outputParams = [
                                                {
                                                    label: "Selected Option Text",
                                                    value: control.getAttribute().getText()
                                                },
                                                {
                                                    label: "Selected Option Value",
                                                    value: control.getAttribute().getValue()
                                                }
                                            ];

                                        } else if (controlType == "lookup") {
                                            var controlValue = control.getAttribute().getValue();
                                            controlValue = (controlValue && controlValue.length > 0) ? controlValue[0] : null

                                            if (controlValue != null) {
                                                outputParams = [
                                                    {
                                                        label: "Name",
                                                        value: controlValue.name
                                                    },
                                                    {
                                                        label: "Id",
                                                        value: controlValue.id
                                                    },
                                                    {
                                                        label: "Entity Name",
                                                        value: controlValue.entityType
                                                    },
                                                    {
                                                        label: "Entity Type Code",
                                                        value: controlValue.type
                                                    }
                                                ]
                                            } else {
                                                outputParams = [
                                                    {
                                                        label: "Name",
                                                        value: null
                                                    },
                                                    {
                                                        label: "Id",
                                                        value: null
                                                    },
                                                    {
                                                        label: "Entity Name",
                                                        value: null
                                                    },
                                                    {
                                                        label: "Entity Type Code",
                                                        value: null
                                                    }
                                                ];
                                            }
                                        } else if (controlType == "standard") {
                                            outputParams = [
                                                {
                                                    label: "Value",
                                                    value: control.getAttribute().getValue()
                                                }
                                            ];
                                        }
                                    }
                                }
                                if (outputParams) {
                                    popupObj.Description = "Control type of  <b>" + control.getLabel() + "(" + popupObj.Parameters.fieldname.value + ")</b> is " + controlType + ". The values like below."
                                    popupObj.Parameters = outputParams;
                                    popupObj.ShowData();
                                } else {
                                    CrmPowerPane.UI.ShowNotification("The control type of your field is not recognized.", "warning");
                                }
                            },
                            true);
                    }
                    
                } catch (e) {
                    CrmPowerPane.Errors.WrongPageWarning();
                }
            });

            $("#find-field-in-form").click(function () {

                try {
                    if (Xrm.Page.ui.getFormType() != 0) {
                        CrmPowerPane.UI.BuildInputPopup(
                            "Find Field On Form",
                            "Finds and focus speicified field.",
                            [
                                {
                                    label: "Field Schema Name",
                                    name: "fieldname"
                                }
                            ],
                            function (popupObj) {
                                var fieldName = popupObj.Parameters.fieldname.value;
                                if (fieldName) {
                                    var control = Xrm.Page.getControl(fieldName);
                                    if (control && control.setFocus) {
                                        control.setFocus();
                                        var hiddenMessage = "";
                                        if (control.getVisible() == false) {
                                            hiddenMessage = "Control is <b>hidden</b>, it changed as visible.";
                                            control.setVisible(true);
                                        };
                                        CrmPowerPane.UI.ShowNotification("Focused on the " + fieldName + " field. " + hiddenMessage);
                                        Content.$("#" + control.getName()).css('background', '#FFFF00');
                                    }
                                } else {
                                    CrmPowerPane.UI.ShowNotification(fieldName + " field could not be found.", "warning");
                                }
                            });
                    }
                } catch (e) {
                    CrmPowerPane.Errors.WrongPageWarning();
                }

            });

            $("#clone-record").click(function () {
                try {
                    var excludedFields = ["createdon", "createdby", "modifiedon", "modifiedby", "ownerid"];
                    var collectedFields = [];

                    Xrm.Page.data.entity.attributes.forEach(function (a) {
                        var name = a.getName();
                        var value = a.getValue();

                        if (!value)
                            return;

                        if (excludedFields.indexOf(name) > -1)
                            return;

                        switch (a.getAttributeType()) {
                            case "lookup":
                                if (a.getLookupTypes()) {
                                    collectedFields.push(name + '=' + value[0].id);
                                    collectedFields.push(name + 'name=' + value[0].name);

                                    if (a.getLookupTypes().length > 1)
                                        collectedFields.push(name + 'type=' + value[0].entityType);
                                }
                                break;
                            case "datetime":
                                collectedFields.push(name + '=' + value.toLocaleDateString());
                                break;
                            default:
                                collectedFields.push(name + '=' + value);
                                break;
                        }
                    });

                    var createUrl = Xrm.Page.context.getClientUrl()
                        + '/main.aspx?etn=' + Xrm.Page.data.entity.getEntityName()
                        + '&pagetype=entityrecord'
                        + '&extraqs=?' + encodeURIComponent(collectedFields.join('&'));

                    window.open(createUrl, '_blank', "location=no,menubar=no,status=no,toolbar=no", false);
                } catch (e) {
                    CrmPowerPane.Errors.WrongPageWarning();
                }

            });

            $(".crm-power-pane-subgroup").click(function () {
                $(".crm-power-pane-sections").slideUp(CrmPowerPane.Constants.SlideTime);
            });

            $("#crm-power-pane").on("click", '.crm-power-pane-copy', function () {
                $(".crm-power-pane-copy").removeClass("crm-power-pane-copied").html("Copy it!")
                $input = $(this).parent().find("input").select();
                document.execCommand("copy");
                $(this).addClass("crm-power-pane-copied").html("Copied to clipboard!");
            });

            $("#crm-power-pane-popup-cancel").click(function () {
                $("#crm-power-pane-popup").fadeOut(CrmPowerPane.Constants.SlideTime);
                $("#crm-power-pane-popup-bg").fadeOut(CrmPowerPane.Constants.SlideTime);
            });

            $("#fetch-xml").click(function () {
                var $popupBg = $("#crm-power-pane-popup-bg");
                $popupBg.fadeIn(CrmPowerPane.Constants.SlideTime);
                var $fetchPopup = $("#crm-power-pane-fetchxml-popup");
                $fetchPopup.fadeIn(CrmPowerPane.Constants.SlideTime);

                var activeTabClass = "dynamics-crm-power-pane-active-tab";

                $("#crm-power-pane-fetchxml-popup-container ul li").removeClass(activeTabClass).first().addClass(activeTabClass);
                $(".crm-power-pane-fetchxml-tab").hide().first().show();
                
            });

            $("#crm-power-pane-fetchxml-popup-container ul li").click(function () {
                var activeClass = "dynamics-crm-power-pane-active-tab";
                $("#crm-power-pane-fetchxml-popup-container ul li").removeClass(activeClass);
                $(this).addClass(activeClass);
                $tabs = $(".crm-power-pane-fetchxml-tab");
                $tabs.hide();
                $tabs.eq($(this).index()).show();
            });

            $("#crm-power-pane-popup-cancel-fetch").click(function () {
                $("#crm-power-pane-fetchxml-popup").fadeOut(250);
                $("#crm-power-pane-popup-bg").fadeOut(250);
            });

            $("#crm-power-pane-popup-ok-fetch").click(function () {
                var xml = $("#crm-power-pane-tab1 textarea").val();
                if (xml.trim() == "") {
                    return;
                }

                var $resultArea = $("#crm-power-pane-fetchxml-result-area");
                $resultArea.val("");
                $resultArea.css("color", "#000000");
                
                var request = '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body>';
                request += '<Execute xmlns="http://schemas.microsoft.com/xrm/2011/Contracts/Services">' + '<request i:type="b:RetrieveMultipleRequest" ' + ' xmlns:b="http://schemas.microsoft.com/xrm/2011/Contracts" ' + ' xmlns:i="http://www.w3.org/2001/XMLSchema-instance">' + '<b:Parameters xmlns:c="http://schemas.datacontract.org/2004/07/System.Collections.Generic">' + '<b:KeyValuePairOfstringanyType>' + '<c:key>Query</c:key>' + '<c:value i:type="b:FetchExpression">' + '<b:Query>';
                request += CrmEncodeDecode.CrmXmlEncode(xml);
                request += '</b:Query>' + '</c:value>' + '</b:KeyValuePairOfstringanyType>' + '</b:Parameters>' + '<b:RequestId i:nil="true"/>' + '<b:RequestName>RetrieveMultiple</b:RequestName>' + '</request>' + '</Execute>';
                request += '</s:Body></s:Envelope>';

                $.ajax({
                    type: "POST",
                    url: Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web",
                    contentType: "text/xml",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Accept", "application/xml, text/xml, */*");
                        xhr.setRequestHeader("SoapAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
                    },
                    data: request,
                    dataType: "text",
                    processData: false,
                    success: function (data, status, req) {
                            $resultArea.val(CrmPowerPane.Utils.PrettifyXml(data));
                            $("#crm-power-pane-fetchxml-popup-container ul li").eq($resultArea.parent().index()).trigger("click");
                    },
                    error: function (err) {
                        var errorDetails = err.statusText + "\n";
                        errorDetails += err.responseText;
                        $resultArea.val(errorDetails);
                        $resultArea.css("color", "red");
                        $("#crm-power-pane-fetchxml-popup-container ul li").eq($resultArea.parent().index()).trigger("click");
                    }
                });
                return;
            });

            $("#solutions").click(function () {
                window.open(Xrm.Page.context.getClientUrl() +"/tools/Solution/home_solution.aspx?etc=7100" , '_blank');
            });

            $("#go-to-create-form").click(function () {
                try {
                    CrmPowerPane.UI.BuildInputPopup(
                        "Go to create form", 
                        "Redirects you to create form of specified entity. ",
                        [
                            {
                                label: "Entity Schema Name",
                                name: "entityname"
                            }
                        ],
                        function (popupObj) {
                            var params = popupObj.Parameters;
                            if (params.entityname.value) {
                                var linkProps = [Xrm.Page.context.getClientUrl() + "/main.aspx"];
                                linkProps.push("?etn=" + params.entityname.value.toLowerCase());
                                linkProps.push("&newWindow=true");
                                linkProps.push("&pagetype=entityrecord");
                                window.open(linkProps.join(""), '_blank');
                            } else {
                                CrmPowerPane.UI.ShowNotification("Entity name is required. Please fill it and try again.", "warning");
                            }
                        });
                } catch (e) {
                    CrmPowerPane.UI.ShowNotification("An error ocurred while redirecting to specified create form.", "error");
                }
            });

            $("#open-form-editor").click(function () {
                try {
                    var params = [Xrm.Page.context.getClientUrl() + "/main.aspx"];
                    params.push("?pagetype=formeditor");
                    params.push("&appSolutionId={FD140AAF-4DF4-11DD-BD17-0019B9312238}");
                    params.push("&etn=" + Xrm.Page.data.entity.getEntityName().toLowerCase());
                    params.push("&extraqs=formtype=main");
                    params.push("&formId=" + Xrm.Page.ui.formSelector.getCurrentItem().getId());
                    window.open(params.join(""), "_blank");
                } catch (e) {
                    CrmPowerPane.UI.ShowNotification("An error ocurred while redirecting to form editor.", "error");
                }
            });
        }
    };

    CrmPowerPane.UI.SetButtonBackgrounds();
    CrmPowerPane.RegisterjQueryExtensions();
    CrmPowerPane.RegisterEvents();
    
});