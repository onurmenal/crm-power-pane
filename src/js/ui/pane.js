/// <reference path="XrmServiceToolkit.js" />
$(function () {
    var CrmPowerPane = {
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
            GetContent: function () {
                try {
                    return $("iframe").filter(function () {
                        return $(this).css("visibility") == "visible"
                    })[0].contentWindow;
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

            $(".crm-power-pane-subgroup").bindFirst('click', function () {
                Content = CrmPowerPane.TargetFrame.GetContent();
                Xrm = CrmPowerPane.TargetFrame.GetXrm();
            });

            $("#crm-power-pane-button").click(function (e) {
                $(".crm-power-pane-sections").slideToggle(CrmPowerPane.Constants.SlideTime);
                e.stopPropagation();
            });

            // Hide the pane if it is already open and the user clicked somewhere else.
            $(window).on("click", function () {
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
                    CrmPowerPane.UI.BuildOutputPopup(
                                    "Entity info",
                                    "Entity schema name of current record.",
                                    [{
                                        label: "Entity Name",
                                        value: Xrm.Page.data.entity.getEntityName()
                                    },
                                    {
                                        label: "Entity Type Code",
                                        value: Xrm.Page.context.getQueryStringParameters().etc
                                    }
                                    ]);
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
                    var params = [Xrm.Page.context.getClientUrl() + "/main.aspx"];
                    params.push("?etn=" + Xrm.Page.data.entity.getEntityName());
                    params.push("&id=" + Xrm.Page.data.entity.getId());
                    params.push("&pagetype=entityrecord");

                    CrmPowerPane.UI.BuildOutputPopup(
                        "Record url",
                        "Url of current record.",
                        [{
                            label: "Record Url",
                            value: params.join("")
                        }]);
                } catch (e) {
                    CrmPowerPane.Errors.WrongPageWarning();
                }

            });

            $("#record-properties").click(function () {
                try {
                    var id = Xrm.Page.data.entity.getId();
                    var etc = Xrm.Page.context.getQueryStringParameters().etc;
                    Content.Mscrm.RibbonActions.openFormProperties(id, etc);
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
                    CrmPowerPane.Errors.WrongPageWarning();
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

                    Xrm.Page.ui.tabs.getAll().forEach(function (t) {
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
                    Xrm.Page.ui.controls.forEach(function (e, t) {
                        if (responsibleControls.indexOf(e.getControlType()) > -1)
                        {
                            var o = e.getName(),
                            n = e.getLabel(),
                            l = Content.$("#" + o + "_c");
                            l.attr("title", o), l.off("click").click(function () {
                                var e = document.queryCommandSupported("copy");
                                if (e) {
                                    var t = document.createElement("textarea");
                                    t.style.position = "fixed", t.style.top = 0, t.style.left = 0, t.style.width = "2em", t.style.height = "2em", t.style.padding = 0, t.style.border = "none", t.style.outline = "none", t.style.boxShadow = "none", t.style.background = "transparent", t.value = o, document.body.appendChild(t), t.select();
                                    try {
                                        var l = document.execCommand("copy");
                                        if (l) {
                                            CrmPowerPane.UI.ShowNotification("Copied <b>\"" + o + "\"</b> to clipboard.", "success");
                                        } else {
                                            CrmPowerPane.UI.ShowNotification("Copying failed. Please copy it yourself.", "error");
                                        }
                                    } catch (i) {
                                        console.log("Oops, unable to copy")
                                    }
                                } else prompt("Copying is not supported. Please copy it yourself. " + n, o)
                            })
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
                            var openInNewWindowLink = $('<a id="' + linkId + '" class="lookup-link" alt="Open this record in a new window" title="Open this record in a new window"  style="cursor: pointer;margin-left: 5px">' + externalIcon + '</a>');
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
                            var $selectBox = Content.$('select.ms-crm-SelectBox[attrname=' + name + ']');

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

            $("#mobile-express").click(function () {
                window.open(Content.Xrm.Page.context.getClientUrl() + "/m");
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
                            Content.$("#" + control.getName()).css('background', '#FFFF00');
                        }
                    });
                    CrmPowerPane.UI.ShowNotification("Dirty fields were highlighted.");
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
                                        var params = popupObj.Parameters;
                                        var entityTypeCode = Mscrm.EntityPropUtil.EntityTypeName2CodeMap[params.entityname.value];
                                        Mscrm.RibbonActions.openEntityEditor(entityTypeCode)
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
                    var excludedFields = ["createdon", "createdby", "modifiedon", "modifiedby", "ownerid","vrp_numberofchildincidents"];
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
                var $resultArea = $("#crm-power-pane-fetchxml-result-area");
                $resultArea.val("");

                var xml = $("#crm-power-pane-tab1 textarea").val();

                if (xml && xml != "") {
                    var result = XrmServiceToolkit.Soap.Fetch(xml);
                    var $resultArea = $("#crm-power-pane-fetchxml-result-area")
                    $resultArea.val(JSON.stringify(result, null, 2));
                    $("#crm-power-pane-fetchxml-popup-container ul li").eq($resultArea.parent().index()).trigger("click");
                }
            });

            $("#solutions").click(function () {
                var $popupBg = $("#crm-power-pane-popup-bg");
                $popupBg.fadeIn(CrmPowerPane.Constants.SlideTime);
                var $solutionsPopup = $("#crm-power-pane-solutions-popup");
                $solutionsPopup.fadeIn(CrmPowerPane.Constants.SlideTime);
            });
        }
    };
    CrmPowerPane.RegisterjQueryExtensions();
    CrmPowerPane.RegisterEvents();
    
});