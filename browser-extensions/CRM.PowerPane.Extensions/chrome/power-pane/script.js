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
                time = time || 6000;
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
            BuildInputPopup: function (header, description, parameters, callback) {
                var popup = new CrmPowerPane.UI.Popup();
                parameters.forEach(function (p) {
                    popup.AddParameter(p.label, p.name);
                });
                popup.Header = header;
                popup.Description = description;
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
                this.Initialize = function () {
                    var $popup = $("#crm-power-pane-popup");
                    $popup.find("h1").html(this.Header).toggle(this.Header != null);
                    $popup.find("p").html(this.Description).toggle(this.Description != null);
                    $popup.find("li").remove();
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
                        $popupParameters.append("<li><span>" + p.label + ":</span><input type='text' name='" + key + "'/></li>");
                    }

                    $popup.fadeIn(CrmPowerPane.Constants.SlideTime);
                    $popup.find("input").first().focus();
                    var $popupBg = $("#crm-power-pane-popup-bg");
                    $popupBg.fadeIn(CrmPowerPane.Constants.SlideTime);

                    $("#crm-power-pane-popup-ok").unbind().click(
                        {
                            $popupList: $popupParameters,
                            popupObj: this
                        }, function (event) {
                            $popup.fadeOut(CrmPowerPane.Constants.SlideTime);
                            $popupBg.fadeOut(CrmPowerPane.Constants.SlideTime);

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
                        $popupParameters.append("<li><span>" + p.label + ":</span><input type='text' value='" + p.value + "' name='" + key + "'/><span class='crm-power-pane-copy'>Copy it!</span></li>");
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
                    CrmPowerPane.ErrorOperations(e);
                }
            },
            GetXrm: function () {
                try {
                    return this.GetContent().Xrm;
                } catch (e) {
                    CrmPowerPane.ErrorOperations(e);
                }
            }
        },
        ErrorOperations: function (e) {
            console.error("An error ocurred while loading Crm Power Pane.", e);
            $("#crm-power-pane-button").hide();
        },
        RegisterEvents: function () {
            var Content, Xrm;


            $(".crm-power-pane-subgroup").bindFirst('click', function () {
                Content = CrmPowerPane.TargetFrame.GetContent();
                Xrm = CrmPowerPane.TargetFrame.GetXrm();
            });

            $("#crm-power-pane-button").click(function () {
                $(".crm-power-pane-sections").slideToggle(CrmPowerPane.Constants.SlideTime).focus();
            });

            // Hide the pane if it is already open and the user clicked somewhere else.
            $(".crm-power-pane-sections").bind("focusout", function () {
                $(this).slideUp(CrmPowerPane.Constants.SlideTime);
            });

            $("#entity-name").click(function () {
                try {
                    CrmPowerPane.UI.BuildOutputPopup(
                                    "Entity name",
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
                    CrmPowerPane.UI.ShowNotification("This action is not available on this page. Please make sure you are on the right page.", "warning");
                }
            });

            $("#record-id").click(function () {
                try {
                    CrmPowerPane.UI.BuildOutputPopup(
                                    "Record id",
                                    "Guid of current record.",
                                    [{
                                        label: "Entity Name",
                                        value: Xrm.Page.data.entity.getId()
                                    }]);
                } catch (e) {
                    CrmPowerPane.UI.ShowNotification("This action is not available on this page. Please make sure you are on the right page.", "warning");
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
                            label: "Entity Name",
                            value: params.join("")
                        }]);
                } catch (e) {
                    CrmPowerPane.UI.ShowNotification("This action is not available on this page. Please make sure you are on the right page.", "warning");
                }

            });

            $("#record-properties").click(function () {
                try {
                    var id = Xrm.Page.data.entity.getId();
                    var etc = Xrm.Page.context.getQueryStringParameters().etc;
                    Content.Mscrm.RibbonActions.openFormProperties(id, etc);
                } catch (e) {
                    CrmPowerPane.UI.ShowNotification("This action is not available on this page. Please make sure you are on the right page.", "warning");
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
                                        var linkProps = [Xrm.Page.context.getClientUrl() + "/main.aspx"];
                                        linkProps.push("?etn=" + params.entityname.value);
                                        linkProps.push("&id=" + params.recordid.value);
                                        linkProps.push("&pagetype=entityrecord");
                                        window.open(linkProps.join(""), '_blank');
                                    });
                } catch (e) {
                    CrmPowerPane.UI.ShowNotification("An error ocurred while redirecting specific record.", "error");
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
                    CrmPowerPane.UI.ShowNotification("This action is not available on this page. Please make sure you are on the right page.", "warning");
                }
            });

            $("#show-all-fields").click(function () {
                try {
                    Xrm.Page.ui.controls.forEach(function (c) {
                        try {
                            c.setVisible(true);
                        } catch (e) { }
                    });
                    CrmPowerPane.UI.ShowNotification("Visibility of all fields updated as visible.");
                } catch (e) {
                    CrmPowerPane.UI.ShowNotification("This action is not available on this page. Please make sure you are on the right page.", "warning");
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
                    CrmPowerPane.UI.ShowNotification("Required level of all fields updated as none.");
                } catch (e) {
                    CrmPowerPane.UI.ShowNotification("This action is not available on this page. Please make sure you are on the right page.", "warning");
                }
            });

            $("#schema-names").click(function () {
                try {
                    Xrm.Page.ui.controls.forEach(function (a) {
                        try {
                            if (a && a.setLabel && a.getName)
                                a.setLabel(a.getName());
                        } catch (e) { }
                    });
                    CrmPowerPane.UI.ShowNotification("All labels updated as schema name.");
                } catch (e) {
                    CrmPowerPane.UI.ShowNotification("This action is not available on this page. Please make sure you are on the right page.", "warning");
                }
            });

            $("#schema-names-as-desc").click(function () {
                try {
                    Xrm.Page.ui.controls.forEach(function (e, t) {
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
                    });
                    CrmPowerPane.UI.ShowNotification("Schema name mode is activated for descriptions. You can copy it with label click."); // ui message will change
                } catch (e) {
                    CrmPowerPane.UI.ShowNotification("This action is not available on this page. Please make sure you are on the right page.", "warning");
                }
            });

            $("#refresh-form").click(function () {
                try {
                    Xrm.Page.data.refresh();
                } catch (e) {
                    CrmPowerPane.UI.ShowNotification("This action is not available on this page. Please make sure you are on the right page.", "warning");
                }
            });

            $("#refresh-ribbon").click(function () {
                try {
                    Xrm.Page.ui.refreshRibbon();
                    CrmPowerPane.UI.ShowNotification("Ribbon refreshing.");
                } catch (e) {
                    CrmPowerPane.UI.ShowNotification("This action is not available on this page. Please make sure you are on the right page.", "warning");
                }
            });

            $("#show-optionset-values").click(function () {
                
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
                                    var exp = "#"+$opt.value+"# ";
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
                Xrm.Page.ui.controls.forEach(function (control) {
                    var attr = (control && control.getAttribute) ? control.getAttribute() : undefined;
                    if (attr && attr.getIsDirty && attr.getIsDirty()) {
                        Content.$("#" + control.getName()).css('background', '#FFFF00');
                    }
                });
                CrmPowerPane.UI.ShowNotification("Dirty fields were highlighted.");
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
        }
    };

    CrmPowerPane.RegisterjQueryExtensions();
    CrmPowerPane.RegisterEvents();
});