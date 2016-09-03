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
                time = time || 4000;
                type = type || 'info';
                var className = CrmPowerPane.Constants.NotificationClassPrefix + type;
                var $notification = $("#crm-power-pane-notification");
                $notification.find('span').html(message);
                $notification.attr('class', '');
                $notification.addClass(className).fadeIn(CrmPowerPane.Constants.SlideTime);
                CrmPowerPane.Constants.NotificationTimer = setTimeout(function () {
                    $notification.fadeOut(CrmPowerPane.Constants.SlideTime);
                }, time);
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
                $(".crm-power-pane-sections").slideToggle(CrmPowerPane.Constants.SlideTime);
            });

            $(window).blur(function () {
                if (document.activeElement.id.indexOf('contentIFrame') > -1) {
                    var $panes = $(".crm-power-pane-sections");
                    if ($panes.length) {
                        var $pane = $panes.first();
                        if ($pane.css('display') !== 'none') {
                            $pane.slideUp(CrmPowerPane.Constants.SlideTime);
                        }
                    }
                }
            });

            $("#entity-name").click(function () {
                window.prompt("Entity Name:", Xrm.Page.data.entity.getEntityName());
            });

            $("#record-id").click(function () {
                window.prompt("Record Guid :", Xrm.Page.data.entity.getId());
            });

            $("#record-url").click(function () {
                var params = [Xrm.Page.context.getClientUrl() + "/main.aspx"];
                params.push("?etn=" + Xrm.Page.data.entity.getEntityName());
                params.push("&id=" + Xrm.Page.data.entity.getId());
                params.push("&pagetype=entityrecord");
                window.prompt("Record Url:", params.join(""));
            });

            $("#record-properties").click(function () {
                var id = Xrm.Page.data.entity.getId();
                var etc = Xrm.Page.context.getQueryStringParameters().etc;
                Content.Mscrm.RibbonActions.openFormProperties(id, etc);
            });

            $("#go-to-record").click(function () {
                
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
                    CrmPowerPane.UI.ShowNotification("An error ocurred whilst updating disable status of all fields as false.", "error");
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
                    CrmPowerPane.UI.ShowNotification("An error ocurred whilst updating visibility  of all fields as visible.", "error");
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
                    CrmPowerPane.UI.ShowNotification("An error ocurred whilst updating required level of all fields as none.", "error");
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
                    CrmPowerPane.UI.ShowNotification("An error ocurred whilst updating label names as schema name.", "error");
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
                    CrmPowerPane.UI.ShowNotification("An error ocurred whilst activating schema name mode on descriptions.", "error");
                }
            });

            $("#refresh-form").click(function () {
                Xrm.Page.data.refresh();
            });

            $(".crm-power-pane-subgroup").click(function () {
                $(".crm-power-pane-sections").slideUp(CrmPowerPane.Constants.SlideTime);
            });
        }
    };

    CrmPowerPane.RegisterjQueryExtensions();
    CrmPowerPane.RegisterEvents();
});