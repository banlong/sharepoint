////JS Library for DuPont//////////////
////Version 1.0////////////////////////
////Created from 29/10/2015////////////
////Created by ChinhNH/////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// returns: absolute url of site
/// </summary>
function getSiteAbsoluteUrl() {
    return _spPageContextInfo.siteAbsoluteUrl;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// returns: absolute url of web
/// </summary>
function getWebAbsoluteUrl() {
    return _spPageContextInfo.webAbsoluteUrl;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// returns: server relative url of web
/// </summary>
function getWebServerRelativeUrl() {
    return _spPageContextInfo.webServerRelativeUrl;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// returns: id of current user
/// </summary>
function getCurrentUserId() {
    return _spPageContextInfo.userId;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// returns: guid of current list
/// </summary>
function getCurrentListGuid() {
    return _spPageContextInfo.pageListId;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// returns: id of current item
/// </summary>
function getCurrentItemId() {
    return GetUrlKeyValue('ID');
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// hide ribbon & new Item link in view
/// </summary>
function hideRibbonInView() {
    if (GetUrlKeyValue('IsDlg') === '1' && GetUrlKeyValue('DisplayMode') !== 'true') {
        jQuery("#s4-ribbonrow").hide();
        jQuery(".ms-csrlistview-controldiv").prev().attr('style', 'display:none');
        jQuery(".ms-csrlistview-controldiv").attr('style', 'display:none');
        var code = jQuery(".ms-csrlistview-controldiv").prev().attr('id');
        var code2 = jQuery(".ms-csrlistview-controldiv").attr('id');
        code = '<style type="text/css">#' + code + ' { display:none !important; } #' + code2 + ' { display:none !important; }</style>';
        jQuery('head').append(code);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// open dialog as SP dialog
/// </summary>
/// <param name="targetUrl">target url of dialog</param>
/// <param name="title">title of dialog</param>
/// <param name="onCloseCallback">callback function when close dialog.</param>
function openDialog(targetUrl, title, onCloseCallback) {
    var dlgtitle = 'Dialog';
    if (typeof (dlgtitle) === "undefined") {
        title = dlgtitle;
    }
    var options = {
        url: targetUrl,
        title: title,
        allowMaximize: true,
        showClose: true,
        width: 800,
        height: 600,
        dialogReturnValueCallback: onCloseCallback
    };
    SP.UI.ModalDialog.showModalDialog(options);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// returns: hide field control in form
/// </summary>
/// <param name="fieldName">display name of field</param>
/// <param name="hideParentRow">indicate hide parent row or not. Optional. Default value is true</param>
/// <param name="formMode">string form mode. Optional. Values: new, edit, display. Incase form mode is undefined, the field will be hide in current form</param>
function hideFieldInForm(fieldName, hideParentRow, formMode) {
    var isCorrectForm = false;

    if (typeof (formMode) == 'undefined' || formMode == getCurrentFormMode()) {
        isCorrectForm = true;
    }

    if (isCorrectForm) {
        var isMatched = false;
        var newdivID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); });
        var newdivID = "fptcustomhiddendiv" + newdivID;
        var hiddenDiv = jQuery("div[id='" + newdivID + "']");
        if (hiddenDiv === undefined || hiddenDiv.length === 0) {
            hiddenDiv = jQuery("<div id='" + newdivID + "' style='width:0px;height:0px;overflow:hidden;' />");
            jQuery("#mainContent").after(hiddenDiv);
            hiddenDiv = jQuery("div[id='" + newdivID + "']")[0];
        }
        else {
            hiddenDiv = hiddenDiv[0];
        }
        var newline = fptcustomgetNewLineCharInBrowser();

        jQuery("table.ms-formtable td").each(function () {
            if (!isMatched) {
                if (this.innerHTML.indexOf('<!-- FieldName="' + fieldName + '"' + newline + '\t\t\t FieldInternalName="') != -1) {
                    if (typeof (hideParentRow) == 'undefined' || hideParentRow) {
                        jQuery(this).parent().attr('id', 'oldpos' + newdivID);
                        jQuery(this).parent().contents().appendTo(hiddenDiv);
                    }
                    else {
                        jQuery(this).attr("id", 'oldpos' + newdivID);
                        jQuery(this).contents().appendTo(hiddenDiv);
                    }
                    isMatched = true;
                }
            }
        });

        if (!isMatched) {
            jQuery("span.hillbillyForm").each(function () {
                if (!isMatched) {
                    if (this.innerHTML.indexOf('<!-- FieldName="' + fieldName + '"' + newline + '\t\t\t FieldInternalName="') != -1) {
                        if (typeof (hideParentRow) == 'undefined' || hideParentRow) {
                            jQuery(this).parent().parent().attr('id', 'oldpos' + newdivID);
                            jQuery(this).parent().parent().contents().appendTo(hiddenDiv);
                        }
                        else {
                            jQuery(this).attr("id", 'oldpos' + newdivID);
                            jQuery(this).contents().appendTo(hiddenDiv);
                        }
                        isMatched = true;
                    }
                }
            });
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// returns: show field control in form
/// </summary>
/// <param name="fieldName">display name of field</param>
function showFieldInForm(fieldName, showParentRow, formMode) {
    var hiddenDiv = jQuery("div[id^='fptcustomhiddendiv']");
    if (hiddenDiv !== undefined && hiddenDiv.length !== 0) {
        var newline = fptcustomgetNewLineCharInBrowser();
        for (var i = 0; i < hiddenDiv.length; i++) {
            var innerHTML = jQuery(hiddenDiv[i]).html();
            if (innerHTML.indexOf('<!-- FieldName="' + fieldName + '"' + newline + '\t\t\t FieldInternalName="') != -1) {
                var oldPos = 'oldpos' + hiddenDiv[i].id;
                jQuery(hiddenDiv[i]).contents().appendTo(jQuery("#" + oldPos));
                break;
            }
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// returns: set field to readonly as label
/// </summary>
/// <param name="fieldName">display name of field</param>
/// <param name="formMode">string form mode. Optional. Values: new, edit, display. Incase form mode is undefined, the field will be hide in current form</param>
function setFieldToLabel(fieldName, formMode) {
    var isCorrectForm = false;

    if (typeof (formMode) == 'undefined' || formMode == getCurrentFormMode()) {
        isCorrectForm = true;
    }
    var newline = fptcustomgetNewLineCharInBrowser();

    if (isCorrectForm) {
        var isMatched = false;
        jQuery("table.ms-formtable td").each(function () {
            if (!isMatched) {
                if (this.innerHTML.indexOf('<!-- FieldName="' + fieldName + '"' + newline + '\t\t\t FieldInternalName="') != -1) {
                    isMatched = true;
                    jQuery(this).children().each(function () {
                        jQuery(this).wrap("<div style='overflow:hidden;width:0px;height:0px;' />");
                    });
                    var vl = getFieldValueInForm(this);
                    console.log("Field Value from this");
                    console.log(vl);

                    if (typeof (vl) !== 'undefined') {
                        var newspan;
                        if (!vl.encodeHtml) {
                            var temp = vl.value.split(newline);
                            newspan = jQuery('<span />').text('');
                            for (var ki = 0; ki < temp.length; ki++) {
                                if (temp[ki] !== '') {
                                    var newspantemp = jQuery('<span />').text(temp[ki]);
                                    newspan.html(newspan.html() + newspantemp.html() + '<br />');
                                }
                            }
                            if (newspan.html().endsWith('<br />')) {
                                var htmlcode = newspan.html();
                                newspan.html(htmlcode.subString(0, htmlcode.length - 7));
                            }
                        } else {
                            newspan = jQuery('<span />').html(vl.value);
                        }
                        jQuery(this).append(newspan);
                    }
                }
            }
        });

        if (!isMatched) {
            jQuery("span.hillbillyForm").each(function () {
                if (!isMatched) {
                    if (this.innerHTML.indexOf('<!-- FieldName="' + fieldName + '"' + newline + '\t\t\t FieldInternalName="') != -1) {
                        isMatched = true;
                        jQuery(this).children().each(function () {
                            jQuery(this).wrap("<div style='overflow:hidden;width:0px;height:0px;' />");
                        });
                        var vl = getFieldValueInForm(this);
                        if (typeof (vl) !== 'undefined') {
                            var newspan;
                            if (!vl.encodeHtml) {
                                var temp = vl.value.split(newline);
                                newspan = jQuery('<span />').text('');
                                for (var ki = 0; ki < temp.length; ki++) {
                                    if (temp[ki] !== '') {
                                        var newspantemp = jQuery('<span />').text(temp[ki]);
                                        newspan.html(newspan.html() + newspantemp.html() + '<br />');
                                    }
                                }
                                if (newspan.html().endsWith('<br />')) {
                                    var htmlcode = newspan.html();
                                    newspan.html(htmlcode.subString(0, htmlcode.length - 7));
                                }
                            } else {
                                newspan = jQuery('<span />').html(vl.value);
                            }
                            jQuery(this).append(newspan);
                        }
                    }
                }
            });
        }
    }

    function getFieldValueInForm(control) {
        var retVal = { value: '', encodeHtml: false };
        var newline = fptcustomgetNewLineCharInBrowser();

        var valueCtrl = jQuery(control).find('input[type="text"][title="' + fieldName + '"]');
        if (valueCtrl === undefined || valueCtrl.length === 0) {
            valueCtrl = jQuery(control).find('input[type="text"][title="' + fieldName + ' Required Field"]');
        }
        if (valueCtrl !== undefined && valueCtrl.length > 0) {
            if (valueCtrl[0].id.indexOf('_$TextField') > 0 || valueCtrl[0].id.indexOf('_$NumberField') > 0) {
                ////single line of text
                ////number & currency
                retVal.value = valueCtrl[0].value;
                retVal.encodeHtml = false;
                return retVal;
            }
            else if (valueCtrl[0].id.indexOf('_$UrlField') > 0) {
                ////Url
                retVal.encodeHtml = true;
                retVal.value = "<a href='" + valueCtrl[0].value + "' target='_blank'>" + jQuery(control).find('input[id$="_$UrlFieldDescription"]')[0].value + "</a>";
                return retVal;
            } else if (valueCtrl[0].id.indexOf('_$DateTimeFieldDate') > 0) {
                ////Date time
                var v = valueCtrl[0].value;
                var timeCtrl = jQuery(control).find('select[id$="_$DateTimeFieldDateHours"]');
                if (timeCtrl.length > 0) {
                    v += " " + timeCtrl[0].value + ":";
                }
                timeCtrl = jQuery(control).find('select[id$="_$DateTimeFieldDateMinutes"]');
                if (timeCtrl.length > 0) {
                    v += " " + timeCtrl[0].value;
                }

                retVal.value = v;
                return retVal;
            }
        }

        ////plain text
        ////rich text
        valueCtrl = jQuery(control).find('textarea[title="' + fieldName + '"]');
        if (valueCtrl === undefined || valueCtrl.length === 0) {
            valueCtrl = jQuery(control).find('textarea[title="' + fieldName + ' Required Field"]');
        }
        if (valueCtrl !== undefined && valueCtrl.length > 0) {
            retVal.value = valueCtrl[0].value;
            if (jQuery(control).find('input[type="hidden"][id$="_$TextField_spSave"]').length > 0) {
                retVal.encodeHtml = true;
            }
            return retVal;
        }
        ////enhance rich text
        valueCtrl = jQuery(control).find('input[type="hidden"][id$="_$TextField_spSave"]');
        if (valueCtrl !== undefined && valueCtrl.length > 0) {
            retVal.value = valueCtrl[0].value;
            retVal.encodeHtml = true;
            return retVal;
        }

        ////dropdownlist
        ////lookup
        valueCtrl = jQuery(control).find('select[title="' + fieldName + '"]');
        if (valueCtrl === undefined || valueCtrl.length === 0) {
            valueCtrl = jQuery(control).find('select[title="' + fieldName + ' Required Field"]');
        }
        if (valueCtrl !== undefined && valueCtrl.length > 0 && valueCtrl[0].options.length > 0) {
            retVal.value = valueCtrl[0][valueCtrl[0].selectedIndex].text;
            return retVal;
        }
        ////lookup multi choice
        valueCtrl = jQuery(control).find('select[title="' + fieldName + ' selected values"]');
        if (valueCtrl === undefined || valueCtrl.length === 0) {
            valueCtrl = jQuery(control).find('select[title="' + fieldName + ' selected values Required Field"]');
        }
        if (valueCtrl !== undefined && valueCtrl.length > 0) {
            var count = valueCtrl[0].options.length;
            for (var i = 0; i < count; i++) {
                retVal.value += valueCtrl[0].options[i].text + newline;
            }
            return retVal;
        }

        ////radio button
        valueCtrl = jQuery(control).find('input[type="radio"]');
        if (valueCtrl !== undefined && valueCtrl.length > 0) {
            jQuery(valueCtrl).each(function () {
                if (this.checked) {
                    retVal.value = this.value;
                }
            });

            return retVal;
        }
        ////check box list
        valueCtrl = jQuery(control).find('input[type="checkbox"]');
        if (valueCtrl !== undefined && valueCtrl.length > 0) {
            jQuery(valueCtrl).each(function () {
                if (this.checked) {
                    var labels = jQuery(this).parent().find('label[for="' + this.id + '"]');
                    if (labels !== undefined && labels.length > 0) {
                        retVal.value += labels[0].innerText + newline;
                    } else {
                        retVal.value += this.value + newline;
                    }
                }
            });

            return retVal;
        }

        ////user field
        valueCtrl = jQuery(control).find('div[title="' + fieldName + '"][id$="_$ClientPeoplePicker"]');
        if (valueCtrl !== undefined && valueCtrl.length > 0) {
            ////get internal by control id
            var internalName = valueCtrl[0].id.substring(0, valueCtrl[0].id.length - 57);
            var users = getFieldLookupValue(internalName, getCurrentItemId(), true);
            if (users !== undefined) {
                for (var kkk = 0; kkk < users.length; kkk++) {
                    if (users[kkk].Title !== undefined) {
                        retVal.value += users[kkk].Title + newline;
                    }
                }

                return retVal;
            }
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// returns: return "new", "edit", "display" and string.empty
/// </summary>
function getCurrentFormMode() {
    var url = _spPageContextInfo.serverRequestPath.toLowerCase();
    if (url.indexOf('newform.aspx') > -1) {
        return 'new';
    } else if (url.indexOf('editform.aspx') > -1) {
        return 'edit';
    } else if (url.indexOf('dispform.aspx') > -1) {
        return 'display';
    }

    return '';
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// Get current user
/// </summary>
/// <param name="onSuccess">function returns : SP.user</param>
/// <param name="onFail">function returns : error message</param>
function getCurrentUser(onSuccess, onFail) {
    function _getCurrentUser() {
        var d = jQuery.Deferred();
        var clientContext = SP.ClientContext.get_current();

        var usr = clientContext.get_web().get_currentUser();
        clientContext.load(usr);
        var o = { d: d, user: usr };

        clientContext.executeQueryAsync(
			Function.createDelegate(o, _getCurrent_successCallback),
			Function.createDelegate(o, fptcommondefaultOnFailCallback)
		);

        function _getCurrent_successCallback() {
            this.d.resolve(this.user);
        }

        return d.promise();
    }

    var p = _getCurrentUser();
    p.done(function (result) {
        onSuccess(result);
    });
    p.fail(function (result) {
        if (typeof (onFail) == 'undefined') {
            var error = result;
            console.log(error);
        }
        else {
            onFail(result);
        }
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// Get User By Id
/// </summary>
/// <param name="id">user id</param>
/// <param name="onSuccess">function returns : SP.user</param>
/// <param name="onFail">function returns : error message</param>
function getUserById(id, onSuccess, onFail) {
    function _getUserById() {
        var d = jQuery.Deferred();
        var clientContext = SP.ClientContext.get_current();

        var usr = clientContext.get_web().get_siteUsers().getById(id);
        clientContext.load(usr);
        var o = { d: d, user: usr };

        clientContext.executeQueryAsync(
			Function.createDelegate(o, _getUserById_successCallback),
			Function.createDelegate(o, fptcommondefaultOnFailCallback)
		);

        function _getUserById_successCallback() {
            this.d.resolve(this.user);
        }

        return d.promise();
    }

    var p = _getUserById();
    p.done(function (result) {
        onSuccess(result);
    });

    p.fail(function (result) {
        var error = result;
        if (typeof (onFail) == 'undefined') {
            console.log(error);
        }
        else {
            onFail(result);
        }
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// Ensure user by login name
/// </summary>
/// <param name="loginName">user login name</param>
/// <param name="onSuccess">function returns : SP.user</param>
/// <param name="onFail">function returns : error message</param>
function ensureUserByLoginName(loginName, onSuccess, onFail) {
    function _ensureUserByLoginName() {
        var d = jQuery.Deferred();
        var clientContext = SP.ClientContext.get_current();

        var usr = clientContext.get_web().ensureUser(loginName);
        clientContext.load(usr);
        var o = { d: d, user: usr };

        clientContext.executeQueryAsync(
			Function.createDelegate(o, _ensureUserByLoginName_successCallback),
			Function.createDelegate(o, fptcommondefaultOnFailCallback)
		);

        function _ensureUserByLoginName_successCallback() {
            this.d.resolve(this.user);
        }

        return d.promise();
    }

    var p = _ensureUserByLoginName();
    p.done(function (result) {
        onSuccess(result);
    });

    p.fail(function (result) {
        var error = result;
        if (typeof (onFail) == 'undefined') {
            console.log(error);
        }
        else {
            onFail(result);
        }
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// set value for user field
/// </summary>
/// <param name="fieldName">field name</param>
/// <param name="userName">user login name</param>
function setUserFieldValue(fieldName, loginName) {
    function _setUserFieldValue() {
        var _PeoplePicker = jQuery("div[title='" + fieldName + "']");
        if (_PeoplePicker == undefined || _PeoplePicker.length == 0) {
            _PeoplePicker = jQuery("div[title='" + fieldName + " Required Field']");
        }
        var _PeoplePickerTopId = _PeoplePicker.attr('id');

        if (SPClientPeoplePicker.SPClientPeoplePickerDict[_PeoplePickerTopId] === undefined) {
            setTimeout(_setUserFieldValue, 200);
        }
        else {
            var _PeoplePickerEditer = jQuery("input[title='" + fieldName + "']");
            if (_PeoplePickerEditer == undefined || _PeoplePickerEditer.length == 0) {
                _PeoplePickerEditer = jQuery("input[title='" + fieldName + " Required Field']");
            }
            _PeoplePickerEditer.val(loginName);
            var _PeoplePickerOject = SPClientPeoplePicker.SPClientPeoplePickerDict[_PeoplePickerTopId];
            _PeoplePickerOject.AddUnresolvedUserFromEditor(true);
        }
    }

    function waitcorejs() {
        ExecuteOrDelayUntilScriptLoaded(_setUserFieldValue, "core.js");
    }

    ExecuteOrDelayUntilScriptLoaded(waitcorejs, "clientpeoplepicker.js");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// set value for user field display in SP2010 type
/// </summary>
/// <param name="fieldName">field name</param>
/// <param name="userName">user login name</param>
function setUserFieldValue_SP2010Control(fieldName, loginName, displayName) {
    var newline = fptcustomgetNewLineCharInBrowser();
    function _setUserFieldValue_SP2010Control() {
        var allSpanPeopleEditors = jQuery("span[id$='_UserField']");
        var controltosetvalue;
        if (allSpanPeopleEditors !== undefined && allSpanPeopleEditors.length > 0) {
            for (var i = 0; i < allSpanPeopleEditors.length; i++) {
                var parentCtrl = jQuery(allSpanPeopleEditors[i]).parent().parent();
                if (parentCtrl.html().indexOf('<!-- FieldName="' + fieldName + '"' + newline + '\t\t\t FieldInternalName="') != -1) {
                    controltosetvalue = allSpanPeopleEditors[i];
                    var xml = '<Entities Append="False" Error="" Separator=";" MaxHeight="3">';
                    xml = xml + '<Entity Key="' + loginName + '" DisplayText="' + displayName + '" IsResolved="True" Description="' + loginName + '"><MultipleMatches /></Entity>';
                    xml = xml + '</Entities>';
                    EntityEditorCallback(xml, controltosetvalue.id, true);
                    break;
                }
            }
        }
    }

    function waitcorejs() {
        ExecuteOrDelayUntilScriptLoaded(_setUserFieldValue_SP2010Control, "core.js");
    }

    ExecuteOrDelayUntilScriptLoaded(waitcorejs, "entityeditor.js");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// set current user to user field
/// </summary>
/// <param name="fieldName">field name</param>
function setCurrentUserToUserField(fieldName) {
    getCurrentUser(function (user) {
        var userName = user.get_loginName();
        if (userName.indexOf("i:0#.w|") > -1) {
            userName = userName.split("i:0#.w|")[1];
        }

        setUserFieldValue(fieldName, userName);
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// set value to user field by login name or id
/// </summary>
/// <param name="fieldName">field name</param>
/// <param name="loginName">array of login names or ids</param>
function setUsersToUserField(fieldName, users) {
    for (var i = 0; i < users.length; i++) {
        if (typeof (users[i]) == 'number') {
            ////user id
            getUserById(users[i], function (user) {
                var userName = user.get_loginName();
                if (userName.indexOf("i:0#.w|") > -1) {
                    userName = userName.split("i:0#.w|")[1];
                }

                setUserFieldValue(fieldName, userName);
            });
        }
        else if (typeof (users[i]) == 'string') {
            ////login name
            ensureUserByLoginName(users[i], function (user) {
                var userName = user.get_loginName();
                if (userName.indexOf("i:0#.w|") > -1) {
                    userName = userName.split("i:0#.w|")[1];
                }

                setUserFieldValue(fieldName, userName);
            });
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// set value to user field by login name or id
/// </summary>
/// <param name="groupName">name of group</param>
/// <param name="onSuccess">function returns : SP.user</param>
/// <param name="onFail">function returns : error message</param>
function getAllUsersInGroup(groupName, onSuccess, onFail) {
    function _getAllUsersInGroup() {
        var d = jQuery.Deferred();
        var clientContext = SP.ClientContext.get_current();

        var usrs = clientContext.get_web().get_siteGroups().getByName(groupName).get_users();
        clientContext.load(usrs);
        var o = { d: d, users: usrs };

        clientContext.executeQueryAsync(
			Function.createDelegate(o, _ensureUserByLoginName_successCallback),
			Function.createDelegate(o, fptcommondefaultOnFailCallback)
		);

        function _ensureUserByLoginName_successCallback() {
            this.d.resolve(this.users);
        }

        return d.promise();
    }

    var p = _getAllUsersInGroup();
    p.done(function (result) {
        var us = result.getEnumerator();
        var retVal = new Array();
        while (us.moveNext()) {
            var u = us.get_current();
            retVal.push(u);
        }
        onSuccess(retVal);
    });

    p.fail(function (result) {
        var error = result;
        if (typeof (onFail) == 'undefined') {
            console.log(error);
        }
        else {
            onFail(result);
        }
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// check current user in group or not
/// return true if current user in group, otherwise return false
/// </summary>
/// <param name="groupName">name of group</param>
function isCurrentUserInGroup(groupName) {
    var retVal = false;
    jQuery.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/sitegroups/getByName('" + groupName + "')/Users?$filter=Id eq " + _spPageContextInfo.userId,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if (data.d.results[0] != undefined) {
                retVal = true;
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            ////do nothing
        }
    });

    return retVal;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// check current user in group or not
/// return true if current user in group, otherwise return false
/// </summary>
/// <param name="groupName">name of group</param>
/// <param name="loginName">login name of user</param>
function isUserInGroup(loginName, groupName) {
    var retVal = false;
    if (loginName.indexOf("i:0#.w|") == -1 && loginName.indexOf("i%3A0%23.w%7C") == -1) {
        loginName = "i%3A0%23.w%7C" + loginName;
    }
    else {
        loginName = loginName.replace("i:0#.w|", "i%3A0%23.w%7C");
    }

    jQuery.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/sitegroups/getByName('" + groupName + "')/Users?$filter=LoginName eq '" + loginName + "'",
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if (data.d.results[0] != undefined) {
                retVal = true;
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            ////do nothing
        }
    });

    return retVal;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// get item in current list by id
/// </summary>
/// <param name="id">item id</param>
/// <param name="onSuccess">function returns : SP.ListItem</param>
/// <param name="onFail">function returns : error message</param>
function getItemById(id, onSuccess, onFail) {
    function _getItemById() {
        var d = jQuery.Deferred();
        var clientContext = SP.ClientContext.get_current();

        var item = clientContext.get_web().get_lists().getById(_spPageContextInfo.pageListId).getItemById(id);
        clientContext.load(item);
        var o = { d: d, item: item };

        clientContext.executeQueryAsync(
			Function.createDelegate(o, _getItemById_successCallback),
			Function.createDelegate(o, fptcommondefaultOnFailCallback)
		);

        function _getItemById_successCallback() {
            this.d.resolve(this.item);
        }

        return d.promise();
    }

    var p = _getItemById();
    p.done(function (result) {
        onSuccess(result);
    });

    p.fail(function (result) {
        var error = result;
        if (typeof (onFail) == 'undefined') {
            console.log(error);
        }
        else {
            onFail(result);
        }
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// get items in current list by query
/// </summary>
/// <param name="query">string query or SP.CamlQuery</param>
/// <param name="onSuccess">function returns : array of SP.ListItem</param>
/// <param name="onFail">function returns : error message</param>
function getItemsByQuery(query, onSuccess, onFail) {
    function _getItemsByQuery() {
        var d = jQuery.Deferred();
        var clientContext = SP.ClientContext.get_current();
        var items;
        if (typeof (query) == "string") {
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(query);
            items = clientContext.get_web().get_lists().getById(_spPageContextInfo.pageListId).getItems(camlQuery);
        }
        else if (query instanceof SP.CamlQuery) {
            items = clientContext.get_web().get_lists().getById(_spPageContextInfo.pageListId).getItems(query);
        }
        clientContext.load(items);
        var o = { d: d, items: items };

        clientContext.executeQueryAsync(
			Function.createDelegate(o, _getItemsByQuery_successCallback),
			Function.createDelegate(o, fptcommondefaultOnFailCallback)
		);

        function _getItemsByQuery_successCallback() {
            this.d.resolve(this.items);
        }

        return d.promise();
    }

    var p = _getItemsByQuery();
    p.done(function (result) {
        var items = result.getEnumerator();
        var retVal = new Array();
        while (items.moveNext()) {
            var i = items.get_current();
            retVal.push(i);
        }
        onSuccess(retVal);
    });

    p.fail(function (result) {
        var error = result;
        if (typeof (onFail) == 'undefined') {
            console.log(error);
        }
        else {
            onFail(result);
        }
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// get item in list by id
/// </summary>
/// <param name="listName">list name</param>
/// <param name="id">item id</param>
/// <param name="onSuccess">function returns : SP.ListItem</param>
/// <param name="onFail">function returns : error message</param>
function getItemByIdInList(listName, id, onSuccess, onFail) {
    function _getItemByIdInList() {
        var d = jQuery.Deferred();
        var clientContext = SP.ClientContext.get_current();

        var item = clientContext.get_web().get_lists().getByTitle(listName).getItemById(id);
        clientContext.load(item);
        var o = { d: d, item: item };

        clientContext.executeQueryAsync(
			Function.createDelegate(o, _getItemByIdInList_successCallback),
			Function.createDelegate(o, fptcommondefaultOnFailCallback)
		);

        function _getItemByIdInList_successCallback() {
            this.d.resolve(this.item);
        }

        return d.promise();
    }

    var p = _getItemByIdInList();
    p.done(function (result) {
        onSuccess(result);
    });

    p.fail(function (result) {
        var error = result;
        if (typeof (onFail) == 'undefined') {
            console.log(error);
        }
        else {
            onFail(result);
        }
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// get items in list by query
/// </summary>
/// <param name="listName">list name</param>
/// <param name="query">string query or SP.CamlQuery</param>
/// <param name="onSuccess">function returns : array of SP.ListItem</param>
/// <param name="onFail">function returns : error message</param>
function getItemsByQueryInList(listName, query, onSuccess, onFail) {
    function _getItemsByQuery() {
        var d = jQuery.Deferred();
        var clientContext = SP.ClientContext.get_current();
        var items;
        if (typeof (query) == "string") {
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(query);
            items = clientContext.get_web().get_lists().getByTitle(listName).getItems(camlQuery);
        }
        else if (query instanceof SP.CamlQuery) {
            items = clientContext.get_web().get_lists().getById(_spPageContextInfo.pageListId).getItems(query);
        }
        clientContext.load(items);
        var o = { d: d, items: items };

        clientContext.executeQueryAsync(
			Function.createDelegate(o, _getItemsByQuery_successCallback),
			Function.createDelegate(o, fptcommondefaultOnFailCallback)
		);

        function _getItemsByQuery_successCallback() {
            this.d.resolve(this.items);
        }

        return d.promise();
    }

    var p = _getItemsByQuery();
    p.done(function (result) {
        var items = result.getEnumerator();
        var retVal = new Array();
        while (items.moveNext()) {
            var i = items.get_current();
            retVal.push(i);
        }
        onSuccess(retVal);
    });

    p.fail(function (result) {
        var error = result;
        if (typeof (onFail) == 'undefined') {
            console.log(error);
        }
        else {
            onFail(result);
        }
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// get field lookup value
/// </summary>
/// <param name="internalFieldName">internal name of field</param>
/// <param name="itemId">item id</param>
/// <param name="isMultipleValue">indicate return value is multiple or not. If false return SP.LookupValue, if true return Array of SP.LookupValue. Optional. Default value is false.</param>
/// <param name="listName">list name, optional. Get item in current list incase undefined listName</param>
function getFieldLookupValue(internalFieldName, itemId, isMultipleValue, listName) {
    var url;
    if (typeof (listName) == "undefined") {
        var guid = _spPageContextInfo.pageListId.replace('{', '').replace('}', '');
        url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists(guid'" + guid + "')/items(" + itemId + ")";
    }
    else if (typeof (listName) == "string") {
        url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('" + listName + "')/items(" + itemId + ")";
    }

    if (typeof (isMultipleValue) === "undefined") {
        isMultipleValue = false;
    }

    url += "?$select=ID," + internalFieldName + "/Id," + internalFieldName + "/Title&$expand=" + internalFieldName;
    var retVal;

    jQuery.ajax({
        url: url,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if (data.d != undefined && data.d[internalFieldName] != undefined) {
                if (isMultipleValue) {
                    var t = data.d[internalFieldName].results;
                    retVal = new Array();
                    if (t !== undefined && t.length > 0) {
                        for (var i = 0; i < t.length; i++) {
                            retVal.push(t[i]);
                        }
                    }
                    else {
                        retVal.push(data.d[internalFieldName]);
                    }
                }
                else {
                    var t = data.d[internalFieldName];
                    retVal = t;
                }
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            ////do nothing
        }
    });

    return retVal;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// get field value as object. Must convert return value before using
/// </summary>
/// <param name="internalFieldName">internal name of field</param>
/// <param name="itemId">item id</param>
/// <param name="listName">list name, optional. Get item in current list incase undefined listName</param>
function getFieldValue(internalFieldName, itemId, listName) {
    var url;
    if (typeof (listName) == "undefined") {
        var guid = _spPageContextInfo.pageListId.replace('{', '').replace('}', '');
        url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists(guid'" + guid + "')/items(" + itemId + ")";
    }
    else if (typeof (listName) == "string") {
        url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('" + listName + "')/items(" + itemId + ")";
    }
    url += "?$select=" + internalFieldName;
    var retVal;

    jQuery.ajax({
        url: url,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if (data.d != undefined && data.d[internalFieldName] != undefined) {
                retVal = data.d[internalFieldName];
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            ////do nothing
        }
    });

    return retVal;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// get field text value
/// </summary>
/// <param name="internalFieldName">internal name of field</param>
/// <param name="itemId">item id</param>
/// <param name="listName">list name, optional. Get item in current list incase undefined listName</param>
function getFieldTextValue(internalFieldName, itemId, listName) {
    return getFieldValue(internalFieldName, itemId, listName);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// get field date time value
/// </summary>
/// <param name="internalFieldName">internal name of field</param>
/// <param name="itemId">item id</param>
/// <param name="listName">list name, optional. Get item in current list incase undefined listName</param>
function getFieldDateTimeValue(internalFieldName, itemId, listName) {
    return new Date(getFieldValue(internalFieldName, itemId, listName));
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// get field url value
/// </summary>
/// <param name="internalFieldName">internal name of field</param>
/// <param name="itemId">item id</param>
/// <param name="listName">list name, optional. Get item in current list incase undefined listName</param>
function getFieldUrlValue(internalFieldName, itemId, listName) {
    return getFieldValue(internalFieldName, itemId, listName);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// get field number value
/// </summary>
/// <param name="internalFieldName">internal name of field</param>
/// <param name="itemId">item id</param>
/// <param name="listName">list name, optional. Get item in current list incase undefined listName</param>
function getFieldNumberValue(internalFieldName, itemId, listName) {
    return getFieldValue(internalFieldName, itemId, listName);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// get field number value
/// </summary>
/// <param name="internalFieldName">internal name of field</param>
/// <param name="itemId">item id</param>
/// <param name="listName">list name, optional. Get item in current list incase undefined listName</param>
function getFieldNumberValue(internalFieldName, itemId, listName) {
    return getFieldValue(internalFieldName, itemId, listName);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// binding control cascade lookup (single choice)
/// </summary>
/// <param name="parentFieldName">display name of parent field in main list</param>
/// <param name="childFieldName">display name of child field in main list</param>
/// <param name="lookupList">master list name</param>
/// <param name="lookupParentField">internal name of parent field in lookup list</param>
/// <param name="lookupChildField">internal name of child field in lookup list</param>
/// <param name="multipleSelectionChild">indicate child control is multiple selection or not. Optional. Default value is false</param>
/// <param name="allowBlank">indicate child control has blank value or not. Only apply for single choice. Optional. Default value is false</param>
/// <param name="readOnly">indicate field is editable or not. Optional. Default value is false</param>
function bindCascadeLookup(parentFieldName, childFieldName, lookupList, lookupParentField, lookupChildField, allowBlank, multipleSelectionChild, readOnly) {
    if (multipleSelectionChild === undefined) {
        multipleSelectionChild = false;
    }
    if (allowBlank === undefined) {
        allowBlank = false;
    }
    if (readOnly === undefined) {
        readOnly = false;
    }

    var parentControl = jQuery('select[title="' + parentFieldName + '"]');
    if (parentControl == undefined || parentControl.length == 0) {
        parentControl = jQuery('select[title="' + parentFieldName + ' Required Field"]');
    }
    var childControlOrg;
    if (multipleSelectionChild) {
        childControlOrg = jQuery('textarea[title="' + childFieldName + '"]');
        if (childControlOrg == undefined || childControlOrg.length == 0) {
            childControlOrg = jQuery('textarea[title="' + childFieldName + ' Required Field"]');
        }
    } else {
        childControlOrg = jQuery('input[title="' + childFieldName + '"]');
        if (childControlOrg == undefined || childControlOrg.length == 0) {
            childControlOrg = jQuery('input[title="' + childFieldName + ' Required Field"]');
        }
    }

    if (typeof (parentControl) == 'undefined' || typeof (childFieldName) == 'undefined' || parentControl.length === 0 || childControlOrg.length === 0) {
        return;
    }
    else {
        parentControl = parentControl[0];
        childControlOrg = childControlOrg[0];
    }

    jQuery(childControlOrg).hide();
    jQuery(childControlOrg).parent().find("br").remove();
    var newChildInnerHtml = '';
    if (multipleSelectionChild) {
        newChildInnerHtml = '<table title="' + childFieldName + '" cellpadding="0" cellspacing="1"><tbody></tbody></table>';
    } else {
        if (readOnly) {
            newChildInnerHtml = '<select disabled=disabled title="' + childFieldName +
								'" class="ms-RadioText"></select>';
        } else {
            newChildInnerHtml = '<select title="' + childFieldName +
								'" class="ms-RadioText" onchange="javascript:document.getElementById(\'' +
								jQuery(childControlOrg).attr('id') + '\').value=jQuery(this).val();"></select>';
        }
    }

    jQuery(childControlOrg).parent().append(newChildInnerHtml);
    bindChildControl();

    jQuery(parentControl).change(bindChildControl);

    function bindChildControl() {
        var childControlOrg;
        if (multipleSelectionChild) {
            childControlOrg = jQuery('textarea[title="' + childFieldName + '"]');
            if (childControlOrg == undefined || childControlOrg.length == 0) {
                childControlOrg = jQuery('textarea[title="' + childFieldName + ' Required Field"]');
            }
        } else {
            childControlOrg = jQuery('input[title="' + childFieldName + '"]');
            if (childControlOrg == undefined || childControlOrg.length == 0) {
                childControlOrg = jQuery('input[title="' + childFieldName + ' Required Field"]');
            }
        }
        var selectedId = -1;
        var tttt = jQuery('select[title="' + parentFieldName + '"]');
        if (tttt == undefined) {
            tttt = jQuery('select[title="' + parentFieldName + ' Required Field"]');
        }
        if (tttt[0].options.length > 0 && tttt[0].selectedIndex !== -1) {
            selectedId = tttt[0][tttt[0].selectedIndex].value;
        }
        var query = "<View><Query><Where><Eq><FieldRef Name='ID' /><Value Type='Counter'>" +
					selectedId + "</Value></Eq></Where></Query><ViewFields><FieldRef Name='" +
					lookupChildField + "' /></ViewFields></View>";

        getItemsByQueryInList(lookupList, query, function (result) {
            var childControlNew;
            if (multipleSelectionChild) {
                childControlNew = jQuery('table[title="' + childFieldName + '"]')[0];
            } else {
                childControlNew = jQuery('select[title="' + childFieldName + '"]')[0];
            }
            var innerHtml = '';
            if (!multipleSelectionChild && allowBlank) {
                innerHtml += '<option value="">(None)</option>';
            }

            var newValues = '';
            var newline = fptcustomgetNewLineCharInBrowser();

            var values = childControlOrg.val().split(newline);

            for (var i = 0; i < result.length; i++) {
                if (result[i].get_fieldValues()[lookupChildField] === undefined) {
                    continue;
                }
                var val = result[i].get_fieldValues()[lookupChildField];
                val = val.split('\n');

                var prefix = 'fptrenderfieldcontrol_' + childFieldName.replace(/[^a-z0-9]/gmi, "").replace(/\s+/g, "").replace(/ /g, '') + '_';
                var isMatched = false;
                for (var k = 0; k < val.length; k++) {
                    var textvalue = STSHtmlEncode(val[k]);
                    if (multipleSelectionChild) {
                        isMatched = false;
                        for (var m = 0; m < values.length; m++) {
                            if (values[m] === val[k]) {
                                isMatched = true;
                                newValues += val[k] + newline;
                            }
                        }

                        innerHtml += "<tr><td><span class='ms-RadioText' title='" + val[k] + "'>" +
									 "<input onchange='javascript:fptcascadelookup_updateValueInTextArea(\"" + jQuery(childControlOrg).attr('id') + "\", this.value, this.checked)' " +
									 "type='checkbox' value='" + val[k] + "' " + (isMatched ? "checked=checked " : "") +
									 "id='" + (prefix + k) + "' " + (readOnly ? "disabled=disabled " : "") + ">" +
									 "<label for='" + (prefix + k) + "'>" + textvalue + "</label></span></td></tr>";
                    } else {
                        isMatched = false;
                        if (values.length > 0 && values[0] === val[k]) {
                            isMatched = true;
                            newValues = val[k];
                        }

                        innerHtml += '<option value="' + val[k] + '" ' + (isMatched ? 'selected=selected ' : '') + '>' + textvalue + '</option>';
                    }
                }
            }

            jQuery(childControlNew).html(innerHtml);

            if (!multipleSelectionChild && !isMatched && jQuery(childControlNew)[0].options.length > 0) {
                newValues = jQuery(childControlNew)[0].options[jQuery(childControlNew)[0].selectedIndex].value
            }
            jQuery(childControlOrg).val(newValues);
        });
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// <summary>
/// render div as section control
/// </summary>
/// <param name="divID">ID of div element</param>
/// <param name="sectionHeader">header of section. Optional</param>
/// <param name="collapse">default collapse or expand. Optional. Default value is false</param>
function bindSectionControl(divID, sectionHeader, collapse) {
    var header = sectionHeader === undefined ? "Header" : sectionHeader;
    if (collapse === undefined) {
        collapse = false;
    }
    var div = jQuery('div[id="' + divID + '"]');
    if (collapse) {
        div.wrap('<div id="fptwrapper' + divID + '" class="fptsectioncsscollapse" style="width:0px;height:0px;overflow:hidden;"></div>');
    }
    else {
        div.wrap('<div id="fptwrapper' + divID + '" class="fptsectioncssexpand" style="border-bottom:1px solid #0072c6;border-left:1px solid #0072c6;border-right:1px solid #0072c6;"></div>');
    }
    jQuery('#fptwrapper' + divID).before('<div id="fptheader' + divID +
					'" onclick="fptsectioncontrol_showhide(\'fptwrapper' + divID + '\', this)"' +
					' style="cursor:pointer;border:1px solid #0072c6;font-weight:bold;margin:0px;padding:2px 2px 2px 5px;color:#0072c6;">' +
					header + '<span style="float:right;padding-right:5px;"><img class="fptheaderimage" src="_layouts/15/images/' +
					(collapse ? 'less_arrow.png' : 'more_arrow.png') + '" /></span></div>');
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Private Functions
function fptcommondefaultOnFailCallback() {
    this.d.reject(arguments[1].get_message());
}

function fptcascadelookup_updateValueInTextArea(controlid, value, added) {
    var ctrl = jQuery('textarea[id="' + controlid + '"]');
    var newline = fptcustomgetNewLineCharInBrowser();
    var values = ctrl.val().split(newline);
    var newValues = '';
    for (var i = 0; i < values.length; i++) {
        if (values[i] !== '' && values[i] !== value) {
            newValues += values[i] + newline;
        }
    }

    if (added) {
        newValues += value;
    }

    ctrl.val(newValues);
}
function fptsectioncontrol_showhide(divid, obj) {
    var div = jQuery(document.getElementById(divid));
    var collapse = div.hasClass('fptsectioncsscollapse');
    if (collapse) {
        try {
            div.css('width', 'auto');
            div.css('height', 'auto');
            div.css('overflow', 'auto');
            div.css('border-left', '1px solid #0072c6');
            div.css('border-right', '1px solid #0072c6');
            div.css('border-bottom', '1px solid #0072c6');
            div.removeClass('fptsectioncsscollapse');
            div.addClass('fptsectioncssexpand');

            //for Sharepoint 2013
            jQuery(obj).find('img[class="fptheaderimage"]')[0].src = '_layouts/14/images/more_arrow.png';
        } catch (err) { }
    } else {
        try {
            div.css('width', '0px');
            div.css('height', '0px');
            div.css('overflow', 'hidden');
            div.css('border-left', '');
            div.css('border-right', '');
            div.css('border-bottom', '');
            div.addClass('fptsectioncsscollapse');
            div.removeClass('fptsectioncssexpand');
            jQuery(obj).find('img[class="fptheaderimage"]')[0].src = '_layouts/15/images/less_arrow.png';
        } catch (err) { }
    }
}
function fptcustomisBrowserIE8() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? (parseInt(myNav.split('msie')[1]) <= 8) : false;
}
function fptcustomgetNewLineCharInBrowser() {
    return fptcustomisBrowserIE8() ? '\r\n' : '\n';
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////