

//-------------------------------------------------------------------------------------------
// START - Prototype functions
//-------------------------------------------------------------------------------------------

String.prototype.trim = function () {
    //return jQuery.trim(this);
    return this.ltrim().rtrim();
}
String.prototype.ltrim = function () {
    return this.replace(/^\s+/, "");
}
String.prototype.rtrim = function () {
    return this.replace(/\s+$/, "");
}
String.prototype.removeDoubleSpaces = function () {
    return this.replace(/\s+/g, " ");
}
String.prototype.containsStr = function (str) {
    if (this.indexOf(str) >= 0) { return true; }
    else { return false; }
}
String.prototype.padLeft = function (length, character) {
    if (character == null || character == '') character = '0';
    if (length == null || length == '') length = 0;
    length = parseInt(length);
    var str = this;
    while (str.length < length) {
        str = character + str;
    }
    return str;
}
String.prototype.padRight = function (length, character) {
    if (character == null || character == '') character = '0';
    if (length == null || length == '') length = 0;
    length = parseInt(length);
    var str = this;
    while (str.length < length) {
        str = str + character;
    }
    return str;
}
String.prototype.stringToBoolean = function () {
    return StringToBoolean(this);
}

function StringToBoolean(val) {
    if (IsEmpty(val)) return false;

    switch (val.toLowerCase()) {
        case "true": case "yes": case "1": return true;
        case "false": case "no": case "0": case null: return false;
        default: return Boolean(val);
    }
}

String.prototype.startsWith = function (str) {
    return this.indexOf(str) == 0;
};
String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};


// Formats a number.
Number.prototype.FormatNumber = function (decimals, bAddCommas) {
    var res = this.toFixed(parseInt(decimals));
    if (bAddCommas) {
        res += '';
        var x = res.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        res = x1 + x2;
    }
    return res;
}

// Parses out the date based on the date format (MM/dd/yyyy).
String.prototype.parseToDate = function () {
    var pattern = '^([1-9]|0[1-9]|1[0-2])\/([1-9]|0[1-9]|[1-2][0-9]|3[0-1])\/(19[0-9]{2}|2[0-9]{3})$';
    if (!this.match(pattern)) { return null; }

    var arr = this.split(/\//);
    var mm = parseInt(arr[0]) - 1;
    var dd = parseInt(arr[1]);
    var yyyy = parseInt(arr[2]);

    return new Date(yyyy, mm, dd);
}


function SortHashKeys(oInput) {
    var keys = [];
    for (var key in oInput) {
        keys.push(key);
    }
    keys.sort();

    return keys;
}
//-------------------------------------------------------------------------------------------
// END - Prototype functions
//-------------------------------------------------------------------------------------------



//-------------------------------------------------------------------------------------------
// Keep track of pending operations (e.g., loading multiple drop down lists on demand).
//-------------------------------------------------------------------------------------------
var iPendingOperations = 0;
function AddPendingOperation() {
    ++iPendingOperations;
    return iPendingOperations;
}
function RemovePendingOperation() {
    --iPendingOperations;
    return iPendingOperations;
}
function GetPendingOperations() {
    return iPendingOperations;
}
//-------------------------------------------------------------------------------------------



// START - Processing overlay
//-------------------------------------------------------------------------------------------
var sDefaultStatusMsg = '';
var bOverlayVisible = false;
function DisplayProcessingOverlay(sStatusMsg) {
    if (bOverlayVisible == true) return;

    var ol = $('#dvProcessingOverlay');
    if (ol.length <= 0) return;
    ol.height($(document).height());
    ol.show();

    var proc = $('div.processing-overlay');
    if (sDefaultStatusMsg == '') sDefaultStatusMsg = $('span', proc).html();
    if (IsEmpty(sStatusMsg)) sStatusMsg = sDefaultStatusMsg;
    $('span', proc).html(sStatusMsg);
    proc.show();
    proc.css('top', ($(window).height() / 2) - 10);
    setTimeout(function () { $('img', proc).attr("src", $('img', proc).attr("src")); }, 100);

    bOverlayVisible = true;
}
function DisplayOverlay(sStatusMsg) {
    if (bOverlayVisible == true) return;

    var ol = $('#dvProcessingOverlay');
    if (ol.length <= 0) return;
    ol.height($(document).height());
    ol.show();

    var proc = $('div.processing-overlay');
    if (sDefaultStatusMsg == '') sDefaultStatusMsg = $('span', proc).html();
    if (IsEmpty(sStatusMsg)) sStatusMsg = sDefaultStatusMsg;
    $('span', proc).html(sStatusMsg);
    proc.hide();

    bOverlayVisible = true;
}
function HideProcessingOverLay() {
    var iPOper = GetPendingOperations();
    if (iPOper > 0) return;

    bOverlayVisible = false;
    var ol = $('#dvProcessingOverlay');
    ol.hide();
    $('div.processing-overlay').hide();
}
//-------------------------------------------------------------------------------------------


// START - Message Manager
//-------------------------------------------------------------------------------------------
var aMsgMngr = new Array();

function DisplayMsg(iIndex, sMsgType, sMessage, sTitle, fnFunction, RedirectURL) {
    if (IsEmpty(iIndex)) iIndex = -1;
    iIndex = parseInt(iIndex);

    if (iIndex == -1) {
        var counter = 0;
        var modalPopupIndex;
        for (var i in aMsgMngr) {
            if (aMsgMngr[i].mode == 'inline') {
                if (i >= 0) {
                    DisplayMsg(i, sMsgType, sMessage, sTitle, fnFunction, RedirectURL);
                    ++counter;
                }
            }
            else if (aMsgMngr[i].mode == 'modal-popup') {
                iIndex = i;
            }
        }

        if (counter > 0 || iIndex < 0) return;
    }

    var errorMsg = '';
    var iconClass = '';
    var bckgClass = '';
    var msgContiner;

    var mngr = aMsgMngr[iIndex];
    if (mngr === undefined || mngr == null || mngr == '') {
        alert('Invalid message manager index (' + iIndex + ').');
        return;
    }

    var displayMode = mngr.mode;
    if (displayMode === undefined || displayMode == null || displayMode == '') {
        displayMode = 'modal-popup';
        mngr.mode = displayMode;
    }

    if (sMsgType == 'error') {
        iconClass = 'ui-icon ui-icon-alert';
        bckgClass = 'ui-state-error ui-corner-all';
    }
    else {
        errorType = '';
        iconClass = 'ui-icon ui-icon-info';
        bckgClass = 'ui-state-highlight ui-corner-all';
    }

    if (displayMode == 'inline') {
        msgContiner = $('#litInlineErr_' + iIndex);
        $('.msg-manager-inl-text', msgContiner).html(sMessage);

        //        if (!IsEmpty(mngr.width)) {
        //            $('.msg-manager-inl-text', msgContiner).width(parseInt(mngr.width));
        //        }

        var backg = $('> div', msgContiner);
        backg.removeClass();
        backg.addClass(bckgClass + ' msg-manager-inl-wrapper');

        var icon = $('span.msg-manager-inl-img', msgContiner);
        icon.removeClass();
        icon.addClass(iconClass + ' msg-manager-inl-img');
        window.scrollTo(0, 0);
        msgContiner.show();
    }
    else if (displayMode == 'modal-popup') {
        msgContiner = $('#litModalErr_' + iIndex);
        $('.msg-manager-modal-text', msgContiner).html(sMessage);

        var backg = $(msgContiner);
        backg.removeClass();
        backg.addClass('ui-state-highlight ui-corner-all');

        var icon = $('span.msg-manager-modal-img', msgContiner);
        icon.removeClass();
        icon.addClass(iconClass + ' msg-manager-modal-img');

        $('#litModalErr_' + iIndex + ':ui-dialog').dialog('destroy');

        var msgWidth = parseInt(mngr.width);
        $(msgContiner).dialog({
            modal: true, title: sTitle, zIndex: 9999, resizable: false,
            buttons: {
                Ok: function () {
                    if (RedirectURL != null && RedirectURL != '') {
                        location.href = RedirectURL;
                    }
                    $(this).dialog('close');
                }
            }, open: function () {
                $(this).closest(".ui-dialog")
                .find(".ui-dialog-titlebar-close").addClass("ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only")
                .html("<span class='ui-button-icon-primary ui-icon ui-icon-closethick'></span>");
            }
        });

        if (msgWidth > 0) $(msgContiner).dialog("option", "width", msgWidth);

        $(msgContiner).unbind('dialogclose');
        if (fnFunction != null && fnFunction != '') {
            $(msgContiner).bind('dialogclose', fnFunction);
        }

        if (window.DisplayOverlay && window.HideProcessingOverLay) {
            AddPendingOperation();
            DisplayOverlay();
            $(msgContiner).bind('dialogclose', function () { RemovePendingOperation(); HideProcessingOverLay(); });
        }
    }
    else {
        alert(sMessage);
    }
};
// Displays the confirmation message box with two buttons (OK and Cancel).
function DisplayConfirmationMsg(sMessage, sTitle,
            sOKButtonText, fnOKButtonFunction,
            sCancelButtonText, fnCancelButtonFunction) {

    if (aMsgMngr.length <= 0) {
        alert('Error: No message manager found.');
        return;
    }

    var iIndex, mngr;
    for (var i in aMsgMngr) {
        iIndex = parseInt(i);
        mngr = aMsgMngr[i];
        break;
    }

    if (sOKButtonText === undefined || sOKButtonText == null || sOKButtonText == '') sOKButtonText = 'OK';
    if (sCancelButtonText === undefined || sCancelButtonText == null || sCancelButtonText == '') sCancelButtonText = 'Cancel';

    var errorMsg = '';
    var iconClass = '';
    var bckgClass = '';

    var msgContiner = $('#litModalErr_' + iIndex);
    $('.msg-manager-modal-text', msgContiner).html(sMessage);

    var backg = $(msgContiner);
    backg.removeClass();
    backg.addClass('ui-state-highlight ui-corner-all');

    var icon = $('span.msg-manager-modal-img', msgContiner);
    icon.removeClass();
    icon.addClass('ui-icon ui-icon-help msg-manager-modal-img');

    $('#litModalErr_' + iIndex + ':ui-dialog').dialog('destroy');

    var msgWidth = parseInt(mngr.width);
    $(msgContiner).dialog({
        modal: true, title: sTitle, zIndex: 9999, resizable: false,
        buttons: [
                {
                    text: sOKButtonText,
                    click: function () {
                        if (fnOKButtonFunction !== undefined && fnOKButtonFunction != null && fnOKButtonFunction != '') {
                            setTimeout(function () { fnOKButtonFunction(); }, 100);
                        }
                        $(this).dialog('close');
                    }
                },
                {
                    text: sCancelButtonText,
                    click: function () {
                        if (fnCancelButtonFunction !== undefined && fnCancelButtonFunction != null && fnCancelButtonFunction != '') {
                            setTimeout(function () { fnCancelButtonFunction(); }, 100);
                        }
                        $(this).dialog('close');
                    }
                }
        ], open: function () {
            $(this).closest(".ui-dialog")
            .find(".ui-dialog-titlebar-close").addClass("ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only")
            .html("<span class='ui-button-icon-primary ui-icon ui-icon-closethick'></span>");
        }
    });

    if (msgWidth > 0) $(msgContiner).dialog("option", "width", msgWidth);

    $(msgContiner).unbind('dialogclose');

    if (window.DisplayOverlay && window.HideProcessingOverLay) {
        AddPendingOperation();
        DisplayOverlay();
        $(msgContiner).bind('dialogclose', function () { RemovePendingOperation(); HideProcessingOverLay(); });
    }
};
// Displays the confirmation message box with three buttons (Yes, No and Cancel).
function DisplayConfirmationMsg3(sMessage, sTitle,
            sYesButtonText, fnYesButtonFunction,
            sNoButtonText, fnNoButtonFunction,
            sCancelButtonText, fnCancelButtonFunction) {

    if (aMsgMngr.length <= 0) {
        alert('Error: No message manager found.');
        return;
    }

    var iIndex, mngr;
    for (var i in aMsgMngr) {
        iIndex = parseInt(i);
        mngr = aMsgMngr[i];
        break;
    }

    if (sYesButtonText === undefined || sYesButtonText == null || sYesButtonText == '') sYesButtonText = 'Yes';
    if (sNoButtonText === undefined || sNoButtonText == null || sNoButtonText == '') sNoButtonText = 'No';
    if (sCancelButtonText === undefined || sCancelButtonText == null || sCancelButtonText == '') sCancelButtonText = 'Cancel';

    var errorMsg = '';
    var iconClass = '';
    var bckgClass = '';

    var msgContiner = $('#litModalErr_' + iIndex);
    $('.msg-manager-modal-text', msgContiner).html(sMessage);

    var backg = $(msgContiner);
    backg.removeClass();
    backg.addClass('ui-state-highlight ui-corner-all');

    var icon = $('span.msg-manager-modal-img', msgContiner);
    icon.removeClass();
    icon.addClass('ui-icon ui-icon-help msg-manager-modal-img');

    $('#litModalErr_' + iIndex + ':ui-dialog').dialog('destroy');

    var msgWidth = parseInt(mngr.width);
    $(msgContiner).dialog({
        modal: false, title: sTitle, zIndex: 9999, resizable: false,
        buttons: [
        {
            text: sYesButtonText,
            click: function () {
                if (fnYesButtonFunction !== undefined && fnYesButtonFunction != null && fnYesButtonFunction != '') {
                    setTimeout(function () { fnYesButtonFunction(); }, 100);

                }
                $(this).dialog('close');
            }
        },
            {
                text: sNoButtonText,
                click: function () {
                    if (fnNoButtonFunction !== undefined && fnNoButtonFunction != null && fnNoButtonFunction != '') {
                        setTimeout(function () { fnNoButtonFunction(); }, 100);
                    }
                    $(this).dialog('close');
                }
            },
            {
                text: sCancelButtonText,
                click: function () {
                    if (fnCancelButtonFunction !== undefined && fnCancelButtonFunction != null && fnCancelButtonFunction != '') {
                        setTimeout(function () { fnCancelButtonFunction(); }, 100);
                    }
                    $(this).dialog('close');
                }
            }

        ]
    });

    if (msgWidth > 0) $(msgContiner).dialog("option", "width", msgWidth);

    $(msgContiner).unbind('dialogclose');

    if (window.DisplayOverlay && window.HideProcessingOverLay) {
        AddPendingOperation();
        DisplayOverlay();
        $(msgContiner).bind('dialogclose', function () { RemovePendingOperation(); HideProcessingOverLay(); });
    }
};
function HideMsg(iIndex) {
    if (IsEmpty(iIndex)) iIndex = -1;

    iIndex = parseInt(iIndex);
    if (iIndex == -1) {
        for (var i in aMsgMngr) {
            if (i >= 0 && aMsgMngr[i].mode == 'inline') {
                HideMsg(i);
            }
        }
        return;
    }

    var mngr = aMsgMngr[iIndex];
    if (mngr === undefined || mngr == null || mngr == '') {
        alert('Invalid message manager index (' + iIndex + ').');
        return;
    }

    var displayMode = mngr.mode;
    if (displayMode === undefined || displayMode == null || displayMode == '') displayMode = 'modal-popup';

    if (displayMode == 'inline') {
        $('#litInlineErr_' + iIndex).hide();
    }
    else if (displayMode == 'modal-popup') {
        $('#litModalErr_' + iIndex).dialog('close');
    }
};

var aDialogs = new Array();
var bIsPopupWindow = false;
var iMyDialogIndex = null;
var oOptionsDefault = {
    bHideCloseButton: false
}


// Displays a page as dialog box.
// Parameters:
//      iDialogIndex - (Required) The dialog index. It should be greater than zero.
//      sPageURL - (Required) The URL of the page to be displayed in the dialog box.
//      sTitle - (Required) The title of the page.
//      sTitleImgUrl - (Optional) The image url to be displayed in the title.
//      iWidth - (Required) The width of the box (in pixels).
//      iHeight - (Required) The height of the box (in pixels).
//      fnOnClose - (Optional) The function to be executed when the dialog closes.
//      oOptions - (Optional) The options as object.
// Output: True - On success, False - On failure.
function DisplayDialogPage(divID, screenName, title, height, width) {
    jQuery.ajax({
        type: "GET",
        url: screenName,
        dataType: "html",
        cache: false,
        success: function (response) {
            jQuery('#' + divID).html(response);
            $("#" + divID).dialog({
                modal: true,
                title: title,
                height: height,
                width: width,
                open: function () {
                    $(this).closest(".ui-dialog")
                    .find(".ui-dialog-titlebar-close").addClass("ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only")
                    .html("<span class='ui-button-icon-primary ui-icon ui-icon-closethick'></span>");
                }
            });
        },
        error: function () {
            jQuery('#' + divID).html('Error on page rendering');
        }
    });
}

function DialogLoaded(iDialogIndex) {
    bIsPopupWindow = true;
    iMyDialogIndex = iDialogIndex;
    return self.parent.DialogLoadedParent(iDialogIndex);
}
function DialogLoadedParent(iDialogIndex) {
    var oDialog;
    if (aDialogs[iDialogIndex] !== undefined) oDialog = aDialogs[iDialogIndex];
    if (oDialog === undefined || oDialog == null) return false;

    if (oDialog.iFrame === undefined || oDialog.iFrame == null || oDialog.iFrame.length <= 0) return false;

    var iFrame2 = $(oDialog.iFrame)[0];
    var iframewindow = iFrame2.contentWindow ? iFrame2.contentWindow : iFrame2.contentDocument.defaultView;

    var blanket = oDialog.iFrame.next(".processing-overlay");
    if (blanket.length > 0) blanket.remove();

    oDialog.iFrame.css({ "visibility": "visible" });

    return true;
}

function RunWindowOnCloseFn() {
    if (iMyDialogIndex == null) return false;
    return self.parent.RunOnCloseFnPrent(iMyDialogIndex);
}
function RunOnCloseFnPrent(iDialogIndex) {
    if (iDialogIndex === undefined || iDialogIndex == null || iDialogIndex < 0) iDialogIndex = 0;

    var oDialog;
    if (aDialogs[iDialogIndex] !== undefined) oDialog = aDialogs[iDialogIndex];
    if (oDialog === undefined || oDialog == null) return false;

    var dlog1 = oDialog.dlog;
    if (dlog1 !== undefined && dlog1 != null && dlog1.length > 0) {
        oDialog.RunOnCloseFn = true;
        return true;
    }

    return false;
}

function CloseMe(bRunOnCloseFn) {
    if (iMyDialogIndex == null) return false;
    return self.parent.CloseDialogParent(iMyDialogIndex, bRunOnCloseFn);
}
function CloseDialogParent(iDialogIndex, bRunOnCloseFn) {
    if (iDialogIndex === undefined || iDialogIndex == null || iDialogIndex < 0) iDialogIndex = 0;

    var oDialog;
    if (aDialogs[iDialogIndex] !== undefined) oDialog = aDialogs[iDialogIndex];
    if (oDialog === undefined || oDialog == null) return false;

    var dlog1 = oDialog.dlog;
    if (dlog1 !== undefined && dlog1 != null && dlog1.length > 0) {
        if (!IsEmpty(bRunOnCloseFn)) oDialog.RunOnCloseFn = bRunOnCloseFn;
        dlog1.dialog("close");
        return true;
    }

    return false;
}


function ReloadMe(newUrl) {
    if (!IsEmpty(iMyDialogIndex)) {
        newUrl = AddQueryStringParam(newUrl, 'dlgindx', iMyDialogIndex);
    }
    window.location.href = newUrl;
    return false;
}

// Refresh the page.
function RefreshPage() {
    var sURL = unescape(window.location.pathname);
    window.location.href = sURL;
    return false;
}

function MyPageFunction(sFunctionName) {
    var sURL = unescape(window.location.pathname);
    if (sURL.indexOf("?") > -1) {
        sURL = sURL.substr(0, sURL.indexOf("?"));
    }

    return sURL + '/' + sFunctionName;
}

function TopWindow() {
    var win = self;
    while (win.parent != win) {
        win = win.parent;
    }
    return win;
}

//--------------------------------------------------------------------------------------
// Validation
//--------------------------------------------------------------------------------------

function IsNull(obj) { return obj === undefined || obj == null; }
function IsArray(obj) { return obj !== undefined && obj != null && obj instanceof Array; }
function IsEmpty(obj) { return obj === undefined || obj == null || jQuery.trim(obj).length == 0; }
function IsFunction(obj) { return obj !== undefined && obj != null && typeof obj == 'function'; }

function COALESCE(obj, val) {
    if (!IsEmpty(obj)) {
        return obj;
    }
    else {
        return val;
    }
}

function IsNumber(num) {
    if (num.length <= 0) { return false; }
    if (isNaN(num)) { return false; }
    return true;
}
// Checks whether positive number.
function IsPositiveNumber(num) {
    if (num.length <= 0) { return false; }
    if (isNaN(num)) { return false; }
    if (num <= 0) { return false; }
    return true;
}
// Checks whether positive or zero.
function IsPositiveNumberOrZero(num) {
    if (num.length <= 0) { return false; }
    if (isNaN(num)) { return false; }
    if (num < 0) { return false; }
    return true;
}
function IsInteger(s) {
    if (!IsNumber(s)) return false;

    var i;
    for (i = 0; i < s.length; i++) {
        // Check that current character is number.
        var c = s.charAt(i);
        if (((c < "0") || (c > "9"))) return false;
    }
    // All characters are numbers.
    return true;
}

function IsDecimal(num) {
    if (!IsNumber(s)) return false;
    return num % 1 ? true : false;
}

// Validate date: MM/dd/yyyy
function IsValidDate(date) {

    var pattern = /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/((19|20)\d\d)$/i;
    if (pattern.test(date) == true) {
        var aa = date.match(pattern);
        var mo = aa[1] - 0;
        var d = aa[2] - 0;
        var y = aa[3] - 0;
        var date = new Date(y, mo - 1, d);
        var ny = date.getFullYear();
        var nmo = date.getMonth() + 1;
        var nd = date.getDate();
        return ny == y && nmo == mo && nd == d;
    }
    else return false;
};

// Validates US zip codes (xxxxx or xxxxx-xxxx)
function IsValidUSzipcode(zip) {
    var pattern = new RegExp(/(^\d{5}$)|(^\d{5}\-?\d{4}$)/);
    return pattern.test(zip);
};
// Validates US phone numbers 1-XXX-XXX-XXXX
function IsValidUSFaxNumber(fax) {
    var pattern = new RegExp(/^(1\s*[-\/\.]?)?(\((\d{3})\)|(\d{3}))\s*[-\/\.]?\s*(\d{3})\s*[-\/\.]?\s*(\d{4})\s*(([xX]|[eE][xX][tT])\.?\s*(\d+))*$/);
    return pattern.test(fax);
};
// Validates US phone numbers 1-XXX-XXX-XXXX
function IsValidUSPhoneNumber(phoneno) {
    var pattern = new RegExp(/^(1\s*[-\/\.]?)?(\((\d{3})\)|(\d{3}))\s*[-\/\.]?\s*(\d{3})\s*[-\/\.]?\s*(\d{4})\s*(([xX]|[eE][xX][tT])\.?\s*(\d+))*$/);
    return pattern.test(phoneno);
};
function IsValidURL(url) {
    var v = new RegExp();
    v.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$");
    return v.test(url);
}
function IsValidEmail(Email) {
    var pattern = new RegExp(/^[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]@[a-zA-Z][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/);
    return pattern.test(Email);
}
function IsMeReadOnly(thisObj) {
    var c = (thisObj instanceof jQuery) ? thisObj : $('#' + thisObj);
    if (c.length <= 0) return false;
    if (c.attr('readonly')) return true;
    return false;
}
function IsMeDisabled(thisObj) {
    var c = (thisObj instanceof jQuery) ? thisObj : $('#' + thisObj);
    if (c.length <= 0) return false;
    if (c.is(':disabled')) return true;
    return false;
}

var aCtrls = {};
var aCtrlGroups = {};
var aDDLList = {};
var aDT = {};
var bDisplayAllErrors = false;
var bIsValid = true;
var cSetFocus = null
var aErrorMsg = [];
var tTabs;

function GetControlIndex(sClientID) {
    for (var index in aCtrls) {
        if (aCtrls[index].sClientID == sClientID) return index;
    }
    return null;
}

function GetControl(sClientID, sCtrlType) {

    if (IsEmpty(sCtrlType)) {
        for (var index in aCtrls) {
            if (aCtrls[index].sClientID == sClientID) {
                sCtrlType = aCtrls[index].sCtrlType;
                break;
            }
        }
    }

    // radio group buttons
    if (sCtrlType == 'rgbtn') {
        return $('input[name=' + sClientID + ']');
    }
    else {
        return $('#' + sClientID);
    }
}

function GetValue(sClientID, sCtrlType, oInfo) {

    var index = null;
    if (IsEmpty(sCtrlType)) {
        for (index in aCtrls) {
            if (aCtrls[index].sClientID == sClientID) {
                sCtrlType = aCtrls[index].sCtrlType;
                oInfo = aCtrls[index];
                break;
            }
        }
    }

    var sValue = '';

    // checkbox and radiobuttons.
    if (sCtrlType == 'chk' || sCtrlType == 'rad') {
        sValue = $('#' + sClientID).is(':checked');
    }
        // radio group buttons
    else if (sCtrlType == 'rgbtn') {
        if ($('input[name="' + sClientID + '"]:checked').length <= 0) {
            sValue = '';
        }
        else {
            sValue = $('input[name="' + sClientID + '"]:checked').val();
        }
    }
    else if (sCtrlType == 'fu') {
        sValue = oInfo.oOtherProp.sett;
    }
    else if (sCtrlType == 'img') {
        sValue = oInfo.oOtherProp.sImageName;
    }
    else if (sCtrlType == 'ddl' || sCtrlType == 'txt_auto') {
        if (IsEmpty(oInfo)) {
            index = GetControlIndex(sClientID);
            oInfo = aCtrls[index];
        }

        if (!IsEmpty(oInfo)) {
            sValue = oInfo.oOtherProp.sValue;
        }
        else {
            sValue = $('#' + sClientID).val();
        }
    }
    else if (sCtrlType == 'lbl') {
        sValue = $('#' + sClientID).html();
    }
    else {
        sValue = $('#' + sClientID).val();
    }

    return sValue;
}

function GetValueByClientID(sClientID) {
    var oInfo;
    for (var index in aCtrls) {
        oInfo = aCtrls[index];

        if (oInfo.sClientID == sClientID) {
            return GetValue(oInfo.sClientID, oInfo.sCtrlType, oInfo);
        }
    }

    return null;
}


function SetValue(sClientID, sValue, sText) {
    var oInfo;
    var index;
    for (var i in aCtrls) {
        if (aCtrls[i].sClientID == sClientID) {
            sCtrlType = aCtrls[i].sCtrlType;
            oInfo = aCtrls[i];
            index = i;
            break;
        }
    }

    var sName = '';
    sName = !IsEmpty(oInfo.sCName) ? oInfo.sCName : oInfo.sClientID;

    if (oInfo.sCtrlType == 'chk' || oInfo.sCtrlType == 'rad') {
        $('#' + oInfo.sClientID).prop('checked', sValue.stringToBoolean());
    }
    else if (oInfo.sCtrlType == 'rgbtn') {
        $('input[name="' + oInfo.sClientID + '"]').filter('[value="' + sValue + '"]').prop('checked', true);
    }
    else if (oInfo.sCtrlType == 'ddl') {
        oInfo.oOtherProp.sValue = sValue;
        if (!IsEmpty(oInfo.oOtherProp.sColumnNameText)) {
            oInfo.oOtherProp.sText = sText + '';
        }

        if (aCtrlGroups[oInfo.iGroupID].sWorkMode == 'R' && !IsEmpty(oInfo.oOtherProp.sColumnNameText)) {
            if (oInfo.oOtherProp.sDefaultSelValue !== undefined && oInfo.oOtherProp.sDefaultSelValue == oInfo.oOtherProp.sValue) {
                $('#' + oInfo.oOtherProp.sClientIDR).val(oInfo.oOtherProp.sValue);
            }
            else {
                $('#' + oInfo.oOtherProp.sClientIDR).val(oInfo.oOtherProp.sText);
            }
        }
        else {
            if (IsDDLLoaded(index)) {
                $('#' + oInfo.sClientID).val(oInfo.oOtherProp.sValue);
                if (oInfo.oOtherProp.sDefaultSelValue !== undefined && oInfo.oOtherProp.sDefaultSelValue == oInfo.oOtherProp.sValue) {
                    $('#' + oInfo.oOtherProp.sClientIDR).val(oInfo.oOtherProp.sValue);
                }
                else {
                    $('#' + oInfo.oOtherProp.sClientIDR).val($('#' + oInfo.sClientID + ' option:selected').text());
                }
                oInfo.oOtherProp.sText = $('#' + oInfo.sClientID + ' option:selected').text();
            }
            else if (oInfo.oOtherProp.bLoadOnDemand == true) {
                LoadDropDownList(oInfo.sClientID, oInfo.oOtherProp.sOnDemandUrl, GetDDLExtraParams(index), false,
                            oInfo.oOtherProp.sValue, oInfo.oOtherProp.sText, false, false,
                            -1, true, null);
            }
        }
    }
    else if (oInfo.sCtrlType == 'txt_auto') {
        oInfo.oOtherProp.sText = sValue;
        oInfo.oOtherProp.sValue = sText + '';
        $('#' + oInfo.sClientID).val(sValue);
    }
    else if (oInfo.sCtrlType == 'lbl') {
        $('#' + oInfo.sClientID).html(sValue);
    }
    else {
        $('#' + oInfo.sClientID).val(sValue);
    }
}


function GetNextControlIndex() {
    var index;
    for (var i = 1; i < 1000; ++i) {
        index = i + '';
        index = index.padLeft(3, '0');
        if (aCtrls[index] === undefined || aCtrls[index] == null) return index;
    }
    return '001';
}

function GetNextTableIndex() {
    var index;
    for (var i = 1; i < 1000; ++i) {
        index = i + '';
        index = index.padLeft(3, '0');
        if (aDT[index] === undefined || aDT[index] == null) return index;
    }
    return '001';
}




function RegisterControl(sCtrlIndex, sClientID, sCtrlType, bIsAJAXParam, sCName, bPK, iGroupID, bHasValidation, oOtherProp, sTabID) {
    if (aCtrls[sCtrlIndex] === undefined || aCtrls[sCtrlIndex] == null) {

        if (bIsAJAXParam == true && IsEmpty(sCName)) throw "Error(JS): The column name cannot be empty (ID: " + sClientID + ").";

        var oInfo = new Object();
        oInfo.sClientID = sClientID;
        oInfo.sCtrlType = sCtrlType;
        oInfo.bIsAJAXParam = bIsAJAXParam;
        oInfo.sCName = sCName;
        oInfo.bPK = bPK;
        oInfo.iGroupID = parseInt(iGroupID);
        oInfo.bHasValidation = bHasValidation;
        oInfo.oOtherProp = oOtherProp;
        oInfo.sTabID = sTabID;

        aCtrls[sCtrlIndex] = oInfo;
    }
    else {
        throw "Error(JS): Invalid control index (ID: " + sClientID + "). The index (" + sCtrlIndex + ") is already in use.";
    }
}


function ValidateAllControls(iGroupID, iMsgManagerIndex) {
    if (IsEmpty(iGroupID)) iGroupID = -1;
    if (IsEmpty(iMsgManagerIndex)) iMsgManagerIndex = -1;
    iGroupID = parseInt(iGroupID);
    iMsgManagerIndex = parseInt(iMsgManagerIndex);

    ResetAllErrors();
    HideMsg(iMsgManagerIndex);

    var oInfo;
    var aIndexes = [];
    for (var index in aCtrls) {
        oInfo = aCtrls[index];
        if (iGroupID > -1 && oInfo.iGroupID != iGroupID) continue;
        if (aCtrlGroups[oInfo.iGroupID].sWorkMode == 'R') continue;
        aIndexes.push(index);
    }

    aIndexes.sort();

    var sTabID = '';
    var index;
    for (var i in aIndexes) {
        index = aIndexes[i];
        oInfo = aCtrls[index];
        if (oInfo.bHasValidation) {
            if (!ValidateControl(oInfo.sClientID, oInfo.sCtrlType)) {
                if (IsEmpty(sTabID)) sTabID = oInfo.sTabID;
            }
        }
    }

    if (!IsEmpty(sTabID)) {
        SetActiveTab(sTabID);
    }

    return IsPageValid(iMsgManagerIndex);
};
function ValidateControl(thisObj, sCtrlType) {
    var c = (thisObj instanceof jQuery) ? thisObj : GetControl(thisObj, null);
    if (c.length == 0) return true;
    ResetError(c);
    return c.trigger('validate');
};
function IsPageValid(iMsgManagerIndex) {
    if (!bIsValid) {
        if (aErrorMsg.length > 0) {
            var sMessage = aErrorMsg.join('<br />');
            aErrorMsg.splice(0, aErrorMsg.length);
            if (cSetFocus != null) {
                DisplayMsg(iMsgManagerIndex, 'error', sMessage, 'Validation Failed', function () { cSetFocus.focus(); }, null);
            }
            else {
                DisplayMsg(iMsgManagerIndex, 'error', sMessage, 'Validation Failed', null, null);
            }
        }
        else {
            if (cSetFocus != null) { cSetFocus.focus(); }
        }
    }
    return bIsValid;
}



// Checks whether the textbox is empty.
function IsTexboxEmpty(thisObj, sErrorMsg, bDisplayAsterisk, iTabID) {

    var c = (thisObj instanceof jQuery) ? thisObj : $('#' + thisObj);
    if (c.length == 0) return true;

    ResetError(c);
    if (jQuery.trim(c.val()).length == 0) {
        AddMsgInQueue(c, sErrorMsg, bDisplayAsterisk, iTabID);
        return true;
    }
    else {
        return false;
    }
}

// Checks whether the textbox is empty.
function IsFileUploadEmpty(thisObj, sErrorMsg, bDisplayAsterisk, iTabID) {

    var c = (thisObj instanceof jQuery) ? thisObj : $('#' + thisObj);
    if (c.length == 0) return true;

    var cIndex = GetControlIndex($(c).attr('id'));

    ResetError(c);
    var bIsEmpty = false;

    if (aCtrls[cIndex].oOtherProp.files.length == 0) {
        var sImgPrevId = aCtrls[cIndex].oOtherProp.sImgPrevId;
        if (!IsEmpty(sImgPrevId)) {
            var cImgPrevIndex = GetControlIndex(sImgPrevId);
            if (IsEmpty(aCtrls[cImgPrevIndex].oOtherProp.sImageName)) {
                bIsEmpty = true;
            }
        }
        else {
            bIsEmpty = true;
        }
    }

    if (bIsEmpty) {
        AddMsgInQueue(c, sErrorMsg, bDisplayAsterisk, iTabID);
        return true;
    }
    else {
        return false;
    }
}

// Checks whether the textbox is a date.
function IsTexboxDate(thisObj, sErrorMsg, bDisplayAsterisk, iTabID) {

    var c = (thisObj instanceof jQuery) ? thisObj : $('#' + thisObj);
    if (c.length == 0) return false;
    if (c.val().trim().length == 0) return true;

    ResetError(c);

    if (!IsValidDate(jQuery.trim(c.val()))) {
        AddMsgInQueue(c, sErrorMsg, bDisplayAsterisk, iTabID);
        return false;
    }
    else {
        return true;
    }
}
// Checks whether the textbox is within a specified range.
function IsTexboxInRange(thisObj, sDateType, sMainRange, sMaxRange, sErrorMsg, bDisplayAsterisk, iTabID) {

    var c = (thisObj instanceof jQuery) ? thisObj : $('#' + thisObj);
    if (c.length == 0) return false;
    if (c.val().trim().length == 0) return true;

    ResetError(c);

    // Check date range
    if (sDateType == 'd') {
        var txt = c.val().parseToDate();
        if (txt > sMaxRange.parseToDate()) {
            AddMsgInQueue(c, sErrorMsg, bDisplayAsterisk, iTabID);
            return false;
        }
        else if (txt < sMainRange.parseToDate()) {
            AddMsgInQueue(c, sErrorMsg, bDisplayAsterisk, iTabID);
            return false;
        }
        else {
            return true;
        }
    }
        // Check numeric range
    else if (sDateType == 'n') {
        var txt = parseFloat(c.val());
        if (txt > parseFloat(sMaxRange)) {
            AddMsgInQueue(c, sErrorMsg, bDisplayAsterisk, iTabID);
            return false;
        }
        else if (txt < parseFloat(sMainRange)) {
            AddMsgInQueue(c, sErrorMsg, bDisplayAsterisk, iTabID);
            return false;
        }
        else {
            return true;
        }
    }

    return true;
}

// Checks whether the textbox is numeric.
function IsTexboxNumeric(thisObj, sErrorMsg, bAllowDecimal, bAllowNagative, bAllowZero, bDisplayAsterisk, iTabID) {

    var c = (thisObj instanceof jQuery) ? thisObj : $('#' + thisObj);
    if (c.length == 0) return false;
    if (c.val().trim().length == 0) return true;

    ResetError(c);

    var val = c.val().trim();

    var bValid = true;

    if (bValid && !IsNumber(val)) bValid = false;
    if (bValid && !bAllowDecimal && !IsInteger(val)) bValid = false;
    if (bValid && !bAllowNagative && !IsPositiveNumberOrZero(val)) bValid = false;
    if (bValid && !bAllowZero && (parseFloat(val) == 0)) bValid = false;

    if (!bValid) AddMsgInQueue(c, sErrorMsg, bDisplayAsterisk, iTabID);
    return bValid;
}
// Checks whether the textbox is a valid specific format (e.g., valid email address).
function IsTexboxValidStringFormat(thisObj, sFormat, sErrorMsg, bDisplayAsterisk, iTabID) {

    var c = (thisObj instanceof jQuery) ? thisObj : $('#' + thisObj);
    if (c.length == 0) return false;
    if (c.val().trim().length == 0) return true;

    ResetError(c);

    var val = c.val().trim();

    var bValid = true;

    if (sFormat == 'email') {
        bValid = IsValidEmail(val);
    }
    else if (sFormat == 'url') {
        bValid = IsValidURL(val);
    }
    else if (sFormat == 'us_phone') {
        bValid = IsValidUSPhoneNumber(val);
    }
    else if (sFormat == 'us_fax') {
        bValid = IsValidUSFaxNumber(val);
    }
    else if (sFormat == 'us_zip') {
        bValid = IsValidUSzipcode(val);
    }

    if (!bValid) AddMsgInQueue(c, sErrorMsg, bDisplayAsterisk, iTabID);
    return bValid;
}

// Checks whether an option has been selected from the drop down list.
function IsRegexMatched(thisObj, sPattern, sErrorMsg, bDisplayAsterisk, iTabID) {

    var c = (thisObj instanceof jQuery) ? thisObj : $('#' + thisObj);
    if (c.length == 0) return true;

    ResetError(c);

    var re = new RegExp(sPattern);
    if (!c.val().match(re)) {
        AddMsgInQueue(c, sErrorMsg, bDisplayAsterisk, iTabID);
        return false;
    }
    else {
        return true;
    }
}

function AddMsgInQueue(oCtrl, sErrorMsg, bDisplayAsterisk, iTabID) {

    if (oCtrl != null) {
        if (oCtrl.length == 0) return true;
        oCtrl.addClass('yellow-background');
        if (bDisplayAsterisk == true) {
            var err = oCtrl.next('span.validation-error');
            if (err.length == 0) { err = $('<span class="validation-error">*</span>').insertAfter(oCtrl); };
            err.attr("title", sErrorMsg);
            err.show();
        }
    }

    if (jQuery.trim(sErrorMsg).length > 0) {
        if (bDisplayAllErrors == true) {
            aErrorMsg.push(sErrorMsg);
        }
        else if (bIsValid) {
            aErrorMsg.push(sErrorMsg);
        }
    }

    if (bIsValid) {
        SetActiveTab(iTabID);
        cSetFocus = oCtrl;
        bIsValid = false;
    }
}

function ResetAllErrors() {
    bIsValid = true;
    if (aErrorMsg.length > 0) aErrorMsg.splice(0, aErrorMsg.length);
    cSetFocus = null;
    $('span.validation-error').hide();
    $('.yellow-background').removeClass('yellow-background');
}

function ResetError(c) {
    c.next('span.validation-error').hide();
    c.removeClass('yellow-background');
}

// Set the active tab (iTabID - The zero-based tab index.)
function SetActiveTab(iTabID) {
    if (tTabs === undefined) return;
    if (tTabs !== undefined && tTabs.length >= 0 && iTabID != null && parseInt(iTabID) >= 0) {
        tTabs.tabs("option", "selected", parseInt(iTabID));
    }
}



function ForceNumericInput(e, This, AllowDot, AllowMinus) {

    if (arguments.length == 1) {
        var s = arguments[0].value;
        // if "-" exists then it better be the 1st character
        var i = s.lastIndexOf("-");
        if (i == -1) {
            return true;
        }
        else if (i == 0) {
            return true;
        }
        else if (i > 0) {
            arguments[0].value = s.substring(0, i) + s.substring(i + 1);
        }
        return false;
    }

    var code;

    if (e.keyCode) //For IE
        code = e.keyCode;
    else if (e.Which)
        code = e.Which; // For FireFox
    else
        code = e.charCode; // Other Browser

    switch (code) {
        case 9:     // tab
        case 13:    // enter
        case 8:     // backspace
        case 37:    // left arrow
        case 39:    // right arrow
        case 46:    // delete
        case 35:    // end
        case 36:    // home
            return true;
    }

    if (code == 45)     // minus sign
    {
        if (AllowMinus == false) {
            return false;
        }

        // wait until the element has been updated to see if the minus is in the right spot
        setTimeout(function () { ForceNumericInput(This); }, 50);
        return true;
    }

    if (AllowDot && code == 46) {
        if (This.value.indexOf(".") >= 0) {
            // don't allow more than one dot
            return false;
        }
        return true;
    }

    // allow character of between 0 and 9
    if (code >= 48 && code <= 57) {
        return true;
    }

    return false;
}

// 8 - Backspace, 46-delete
function DisableKey(e, keyCode) {
    e = e || event;
    if (!e) { return true; }
    var code = e.keyCode || e.which || null;
    if (code) {
        return (code == keyCode) ? false : true;
    }
    return true;
}

//--------------------------------------------------------------------------------------
// AJAX API's
//--------------------------------------------------------------------------------------

// Function Name: SwitchToReadOnlyMode(iGroupID)
// Description: Switches all controls to read-only mode.
// Parameters:
//      iGroupID - The group ID of controls
//      bCancelChanges - A value indicating whether to cancel changes
function SwitchToReadOnlyMode(iGroupID, bCancelChanges) {
    if (IsEmpty(iGroupID)) iGroupID = -1;
    if (IsEmpty(bCancelChanges)) bCancelChanges = true;

    ResetAllErrors();
    HideMsg();

    var c;
    for (var index in aCtrls) {
        oInfo = aCtrls[index];

        if (oInfo.sCtrlType == 'lbl') {
            continue;
        }

        if (iGroupID > -1 && oInfo.iGroupID != iGroupID) {
            continue;
        }

        if (aCtrlGroups[oInfo.iGroupID] !== undefined && (aCtrlGroups[oInfo.iGroupID].bAllowToSwitchMode == false || aCtrlGroups[oInfo.iGroupID].sWorkMode == 'R')) {
            continue;
        }

        if (!IsNull(oInfo.oOtherProp) && !IsNull(oInfo.oOtherProp.bPreventWOChange) && oInfo.oOtherProp.bPreventWOChange == true) {
            continue;
        }

        if (oInfo.sCtrlType == 'chk' || oInfo.sCtrlType == 'rad') {
            $('#' + oInfo.sClientID).prop("disabled", true);

            if (bCancelChanges && !IsEmpty(oInfo.oOtherProp.bPrevState)) {
                $('#' + oInfo.sClientID).prop('checked', oInfo.oOtherProp.bPrevState);
            }
        }
        else if (oInfo.sCtrlType == 'rgbtn') {
            $('input[name=' + oInfo.sClientID + ']').prop("disabled", true);

            if (bCancelChanges && !IsEmpty(oInfo.oOtherProp.sPrevValue)) {
                $('input[name=' + sClientID + ']').each(function () {
                    if ($(this).val() == oInfo.oOtherProp.sPrevValue) {
                        $(this).prop('checked', true);
                    }
                    else {
                        $(this).prop('checked', false);
                    }
                });
            }
        }
        else if (oInfo.sCtrlType == 'ddl') {
            $('#' + oInfo.sClientID).hide();

            ResetError($('#' + oInfo.sClientID));
            c = $('#' + oInfo.oOtherProp.sClientIDR);
            c.removeClass('read-only');
            c.addClass('read-only');
            c.show();
            if ($.browser.msie && $.browser.version <= 7) { c.css({ 'float': 'none' }); }

            if (bCancelChanges) {
                if (!IsEmpty(oInfo.oOtherProp.sPrevValue) || !IsEmpty(oInfo.oOtherProp.sPrevText)) {
                    oInfo.oOtherProp.sValue = oInfo.oOtherProp.sPrevValue;
                    oInfo.oOtherProp.sText = oInfo.oOtherProp.sPrevText;

                    $('#' + oInfo.sClientID).val(oInfo.oOtherProp.sValue);

                    if (oInfo.oOtherProp.sDefaultSelValue !== undefined && oInfo.oOtherProp.sDefaultSelValue == oInfo.oOtherProp.sValue) {
                        $('#' + oInfo.oOtherProp.sClientIDR).val(oInfo.oOtherProp.sValue);
                    }
                    else {
                        $('#' + oInfo.oOtherProp.sClientIDR).val(oInfo.oOtherProp.sText);
                    }
                }
            }
            else {
                if (oInfo.oOtherProp.sDefaultSelValue !== undefined && oInfo.oOtherProp.sDefaultSelValue == $('#' + oInfo.sClientID).val()) {
                    $('#' + oInfo.oOtherProp.sClientIDR).val($('#' + oInfo.sClientID).val());
                }
                else {
                    $('#' + oInfo.oOtherProp.sClientIDR).val($('#' + oInfo.sClientID + ' option:selected').text());
                }
            }
        }
        else if (oInfo.sCtrlType == 'txt' || oInfo.sCtrlType == 'txt_auto') {
            c = $('#' + oInfo.sClientID);
            ResetError(c);
            c.prop("readonly", true);
            c.removeClass('read-only');
            c.addClass('read-only');
            if (c.hasClass('hasDatepicker')) {
                $(c).datepicker("disable");
                c.prop('disabled', false);
            }
            if (c.hasClass('hasTimepicker')) {
                $(c).timepicker("disable");
                c.prop('disabled', false);
            }

            if (bCancelChanges) {
                if (oInfo.sCtrlType == 'txt_auto') {
                    oInfo.oOtherProp.sValue = oInfo.oOtherProp.sPrevValue;
                    oInfo.oOtherProp.sText = oInfo.oOtherProp.sPrevText;
                    c.val(oInfo.oOtherProp.sText);
                }
                else {
                    oInfo.oOtherProp.sText = oInfo.oOtherProp.sPrevText;
                    c.val(oInfo.oOtherProp.sText);
                }
            }

            if (!IsEmpty(oInfo.oOtherProp.sInputMask)) {
                $(c).mask(oInfo.oOtherProp.sInputMask);
            }
        }
    }

    for (var gid in aCtrlGroups) {
        if (iGroupID > -1 && gid != iGroupID) continue;
        aCtrlGroups[gid].sWorkMode = 'R';
    }
};
// Function Name: SwitchToEditableMode(iGroupID)
// Description: Switches all controls to editable mode.
// Parameters:
//      iGroupID - The group ID of controls
function SwitchToEditableMode(iGroupID) {
    if (IsEmpty(iGroupID)) iGroupID = -1;

    var c;
    for (var index in aCtrls) {
        oInfo = aCtrls[index];

        if (iGroupID > -1 && oInfo.iGroupID != iGroupID) {
            continue;
        }

        if (oInfo.sCtrlType == 'lbl') {
            continue;
        }

        if (aCtrlGroups[oInfo.iGroupID] !== undefined && (aCtrlGroups[oInfo.iGroupID].bAllowToSwitchMode == false || aCtrlGroups[oInfo.iGroupID].sWorkMode == 'W')) {
            continue;
        }

        if (!IsNull(oInfo.oOtherProp) && !IsNull(oInfo.oOtherProp.bPreventWOChange) && oInfo.oOtherProp.bPreventWOChange == true) {
            continue;
        }

        if (oInfo.sCtrlType == 'chk' || oInfo.sCtrlType == 'rad') {
            $('#' + oInfo.sClientID).prop("disabled", false);
            oInfo.oOtherProp.bPrevState = GetValue(oInfo.sClientID, oInfo.sCtrlType, oInfo);
        }
        else if (oInfo.sCtrlType == 'rgbtn') {
            $('input[name=' + oInfo.sClientID + ']').prop("disabled", false);
            oInfo.oOtherProp.sPrevValue = GetValue(oInfo.sClientID, oInfo.sCtrlType, oInfo);
        }
        else if (oInfo.sCtrlType == 'ddl') {

            $('#' + oInfo.oOtherProp.sClientIDR).hide();
            if ($.browser.msie && $.browser.version <= 7) { $('#' + oInfo.oOtherProp.sClientIDR).css({ 'float': 'left' }); }

            c = $('#' + oInfo.sClientID);
            c.removeClass('read-only');
            c.show();

            oInfo.oOtherProp.sPrevValue = oInfo.oOtherProp.sValue;
            oInfo.oOtherProp.sPrevText = oInfo.oOtherProp.sText;

            if (IsDDLLoaded(index)) {
                c.val(oInfo.oOtherProp.sValue);
            }
            else if (oInfo.oOtherProp.bLoadOnDemand == true) {
                LoadDropDownList(oInfo.sClientID, oInfo.oOtherProp.sOnDemandUrl, GetDDLExtraParams(index), false,
                            oInfo.oOtherProp.sValue, oInfo.oOtherProp.sText, false, false,
                            -1, true, null);
            }
        }
        else if (oInfo.sCtrlType == 'txt' || oInfo.sCtrlType == 'txt_auto') {
            c = $('#' + oInfo.sClientID);
            c.prop("readonly", false);
            c.removeClass('read-only');
            if (c.hasClass('hasDatepicker')) {
                $(c).datepicker("enable");
            }
            if (c.hasClass('hasTimepicker')) {
                $(c).timepicker("enable");
            }

            if (oInfo.sCtrlType == 'txt_auto') {
                oInfo.oOtherProp.sPrevValue = oInfo.oOtherProp.sValue;
                oInfo.oOtherProp.sPrevText = oInfo.oOtherProp.sText;
            }
            else {
                oInfo.oOtherProp.sPrevText = c.val();
            }

            if (!IsEmpty(oInfo.oOtherProp.sInputMask)) {
                $(c).mask(oInfo.oOtherProp.sInputMask);
            }
        }
    }

    for (var gid in aCtrlGroups) {
        if (iGroupID > -1 && gid != iGroupID) continue;
        aCtrlGroups[gid].sWorkMode = 'W';
    }
};
// Function Name: SwitchToNewMode(iGroupID)
// Description: Switches all controls to new mode.
// Parameters:
//      iGroupID - The group ID of controls
function SwitchToNewMode(iGroupID) {
    if (IsEmpty(iGroupID)) iGroupID = -1;

    var c;
    for (var index in aCtrls) {
        oInfo = aCtrls[index];

        if (iGroupID > -1 && oInfo.iGroupID != iGroupID) {
            continue;
        }

        if (oInfo.sCtrlType == 'lbl') {
            continue;
        }

        if (aCtrlGroups[oInfo.iGroupID] !== undefined && (aCtrlGroups[oInfo.iGroupID].bAllowToSwitchMode == false || aCtrlGroups[oInfo.iGroupID].sWorkMode == 'A')) {
            continue;
        }

        if (!IsNull(oInfo.oOtherProp) && !IsNull(oInfo.oOtherProp.bPreventWOChange) && oInfo.oOtherProp.bPreventWOChange == true) {
            continue;
        }

        if (oInfo.sCtrlType == 'chk' || oInfo.sCtrlType == 'rad') {
            $('#' + oInfo.sClientID).prop("disabled", false);
        }
        else if (oInfo.sCtrlType == 'rgbtn') {
            $('input[name=' + oInfo.sClientID + ']').prop("disabled", false);
        }
        else if (oInfo.sCtrlType == 'ddl') {

            $('#' + oInfo.oOtherProp.sClientIDR).hide();
            c = $('#' + oInfo.sClientID);
            c.removeClass('read-only');
            c.show();

            if (IsDDLLoaded(index)) {
                c.val(oInfo.oOtherProp.sValue);
            }
            else if (oInfo.oOtherProp.bLoadOnDemand == true) {
                LoadDropDownList(oInfo.sClientID, oInfo.oOtherProp.sOnDemandUrl, GetDDLExtraParams(index), false,
                            oInfo.oOtherProp.sValue, oInfo.oOtherProp.sText, false, false,
                            -1, true, null);
            }
        }
        else if (oInfo.sCtrlType == 'txt' || oInfo.sCtrlType == 'txt_auto') {
            c = $('#' + oInfo.sClientID);
            c.prop("readonly", false);
            c.removeClass('read-only');
            if (c.hasClass('hasDatepicker')) {
                $(c).datepicker("enable");
            }
            if (c.hasClass('hasTimepicker')) {
                $(c).timepicker("enable");
            }

            if (!IsEmpty(oInfo.oOtherProp.sInputMask)) {
                $(c).mask(oInfo.oOtherProp.sInputMask);
            }
        }
    }

    for (var gid in aCtrlGroups) {
        if (iGroupID > -1 && gid != iGroupID) continue;
        aCtrlGroups[gid].sWorkMode = 'A';
    }
};



// Applies filter to a datatable based on some fields.
// Parameters:
//      iGroupID - The group ID of the controls to be loaded. Do not enter "-1". It should be a specific group ID.
//      aInputParams - The input parameters to passed in. This field is required if there is not field marked as primary key (PK).
//      iMsgManagerIndex - This is the idex of the message manager to display messages (errors).
//      bDisplayOverlay - True/False. Make it True if you want to display the processing overlay (e.g., Processing...Please wait.).
// Output: True - On success, False - On failure.
function ApplyFilter(iGroupID, aInputParams, iMsgManagerIndex, bDisplayOverlay) {
    try {
        if (IsEmpty(iGroupID) || iGroupID < 0) throw 'Error(JS): Invalid groupd ID.';
        if (IsEmpty(iMsgManagerIndex)) iMsgManagerIndex = -1;
        if (IsEmpty(bDisplayOverlay)) bDisplayOverlay = true;
        iGroupID = parseInt(iGroupID);
        iMsgManagerIndex = parseInt(iMsgManagerIndex);

        ResetAllErrors();
        HideMsg(iMsgManagerIndex);

        var oInfo;
        var sValue, sDataType, sCompOperator;
        var aFields = [];
        var aDataTypes = [];
        var aInputParams2 = [];
        var aGroups = {};
        var iCounter = 0;

        if (IsArray(aInputParams)) {
            jQuery.each(aInputParams, function (i, val) {
                aInputParams2.push(val);
            });
        }

        if (aCtrlGroups[iGroupID].bIsSearchGroup != true) throw 'Error(JS): You cannot search data for this group #' + iGroupID + ' because it is not declared as search group.';

        var sSearchHttpMethod = aCtrlGroups[iGroupID].sSearchHttpMethod;
        var sSearchURL = aCtrlGroups[iGroupID].sSearchURL;

        for (var index in aCtrls) {
            oInfo = aCtrls[index];

            if (oInfo.iGroupID != iGroupID) continue;

            aGroups[oInfo.iGroupID] = 1;

            // checkbox and radiobuttons.
            if (oInfo.sCtrlType == 'chk') {
                sValue = $('#' + oInfo.sClientID).is(':checked') ? '1' : '';
                sDataType = 's'
                sCompOperator = 'eq';
            }
            else if (oInfo.sCtrlType == 'rad') {
                sValue = $('#' + oInfo.sClientID).is(':checked');
                sDataType = 's'
                sCompOperator = 'eq';
            }
                // radio group buttons
            else if (oInfo.sCtrlType == 'rgbtn') {
                if ($('input[name=' + oInfo.sClientID + ']:checked').length <= 0) {
                    sValue = '';
                }
                else {
                    sValue = $('input[name=' + oInfo.sClientID + ']:checked').val();
                }
                sDataType = 's'
                sCompOperator = 'eq';
            }
            else if (oInfo.sCtrlType == 'ddl' || oInfo.sCtrlType == 'txt_auto') {
                sValue = oInfo.oOtherProp.sValue;
                sDataType = oInfo.oOtherProp.sDataType;
                sCompOperator = oInfo.oOtherProp.sCOperator;
            }
            else {
                sValue = $('#' + oInfo.sClientID).val();
                sDataType = oInfo.oOtherProp.sDataType;
                sCompOperator = oInfo.oOtherProp.sCOperator;
            }

            if (IsEmpty(sValue)) continue;

            aFields.push(oInfo.sCName);
            aDataTypes.push(sDataType + sCompOperator);

            //            if (oInfo.sCtrlType == 'ddl') {
            //                if (!IsEmpty(oInfo.oOtherProp.sColumnNameText)) {
            //                    aFields.push(oInfo.oOtherProp.sColumnNameText);
            //                }
            //            }
            //            else if (oInfo.sCtrlType == 'txt_auto') {
            //                if (!IsEmpty(oInfo.oOtherProp.sColumnNameValue)) {
            //                    aFields.push(oInfo.oOtherProp.sColumnNameValue);
            //                }
            //            }

            aInputParams2.push({ 'name': 'f' + iCounter, 'value': sValue });
            ++iCounter;
        }

        if (iCounter > 0) {
            aInputParams2.push({ 'name': 'l_fields', 'value': aFields.join('|') });
            aInputParams2.push({ 'name': 'l_dtco', 'value': aDataTypes.join('|') });
            aInputParams2.push({ 'name': 'ap_count', 'value': iCounter });
        }

        var tablesSubmitted = 0;
        for (var index in aDT) {
            if (aDT[index].iGroupID == iGroupID && aDT[index].sType == "jq-dt") {
                aDT[index].aParams = aInputParams2;
                ResetJDataTable(index);
                ++tablesSubmitted;
            }
        }

        if (tablesSubmitted == 0) throw "Error (JS): No datatable table to be re-loaded.";

        return true;
    }
    catch (err) {
        alert(err);
    }
}


// Removes the filter
// Parameters:
//      iGroupID - The group ID of the controls to be loaded. Do not enter "-1". It should be a specific group ID.
//      aInputParams - The input parameters to passed in. This field is required if there is not field marked as primary key (PK).
//      iMsgManagerIndex - This is the idex of the message manager to display messages (errors).
//      bDisplayOverlay - True/False. Make it True if you want to display the processing overlay (e.g., Processing...Please wait.).
// Output: True - On success, False - On failure.
function RemoveFilter(iGroupID, aInputParams, iMsgManagerIndex, bDisplayOverlay) {
    try {
        if (IsEmpty(iGroupID) || iGroupID < 0) throw 'Error(JS): Invalid groupd ID.';
        if (IsEmpty(iMsgManagerIndex)) iMsgManagerIndex = -1;
        if (IsEmpty(bDisplayOverlay)) bDisplayOverlay = true;
        iGroupID = parseInt(iGroupID);
        iMsgManagerIndex = parseInt(iMsgManagerIndex);

        ResetAllErrors();
        HideMsg(iMsgManagerIndex);

        var oInfo;
        var sName, sValue;
        var iCounter = 0;

        if (aCtrlGroups[iGroupID].bIsSearchGroup != true) throw 'Error(JS): You cannot remove filter for this group #' + iGroupID + ' because it is not declared as search group.';

        for (var index in aCtrls) {
            oInfo = aCtrls[index];

            if (oInfo.iGroupID != iGroupID) continue;

            if (oInfo.sCtrlType == 'chk' || oInfo.sCtrlType == 'rad') {
                $('#' + oInfo.sClientID).prop('checked', false);
            }
            else if (oInfo.sCtrlType == 'ddl') {
                oInfo.oOtherProp.sValue = '';
                if (!IsEmpty(oInfo.oOtherProp.sColumnNameText)) {
                    oInfo.oOtherProp.sText = '';
                }

                if (aCtrlGroups[oInfo.iGroupID].sWorkMode == 'R' && !IsEmpty(oInfo.oOtherProp.sColumnNameText)) {
                    if (oInfo.oOtherProp.sDefaultSelValue !== undefined && oInfo.oOtherProp.sDefaultSelValue == oInfo.oOtherProp.sValue) {
                        $('#' + oInfo.oOtherProp.sClientIDR).val(oInfo.oOtherProp.sValue);
                    }
                    else {
                        $('#' + oInfo.oOtherProp.sClientIDR).val(oInfo.oOtherProp.sText);
                    }
                }
                else {
                    if (IsDDLLoaded(index)) {
                        $('#' + oInfo.sClientID).val(oInfo.oOtherProp.sValue);
                        if (oInfo.oOtherProp.sDefaultSelValue !== undefined && oInfo.oOtherProp.sDefaultSelValue == oInfo.oOtherProp.sValue) {
                            $('#' + oInfo.oOtherProp.sClientIDR).val(oInfo.oOtherProp.sValue);
                        }
                        else {
                            $('#' + oInfo.oOtherProp.sClientIDR).val($('#' + oInfo.sClientID + ' option:selected').text());
                        }
                        oInfo.oOtherProp.sText = $('#' + oInfo.sClientID + ' option:selected').text();
                    }
                    else if (oInfo.oOtherProp.bLoadOnDemand == true) {
                        LoadDropDownList(oInfo.sClientID, oInfo.oOtherProp.sOnDemandUrl, GetDDLExtraParams(index), false,
                            oInfo.oOtherProp.sValue, oInfo.oOtherProp.sText, false, false,
                            -1, true, null);
                    }
                }
            }
            else if (oInfo.sCtrlType == 'txt_auto') {
                oInfo.oOtherProp.sText = '';
                oInfo.oOtherProp.sValue = '';
                $('#' + oInfo.sClientID).val('');
            }
            else {
                $('#' + oInfo.sClientID).val('');
            }

            ++iCounter;
        }

        var tablesSubmitted = 0;
        for (var index in aDT) {
            if (aDT[index].iGroupID == iGroupID && aDT[index].sType == "jq-dt") {
                aDT[index].aParams = aInputParams;
                ResetJDataTable(index);
                ++tablesSubmitted;
            }
        }

        if (tablesSubmitted == 0) throw "Error (JS): No datatable table to be re-loaded.";

        return true;

    }
    catch (err) {
        alert(err);
    }
}




// Load data from the server and populate the fields.
// Parameters:
//      iGroupID - The group ID of the controls to be loaded. If you want to load all controls (fields), then enter "-1".
//      aInputParams - The input parameters to passed in. This field is required if there is not field marked as primary key (PK).
//      iMsgManagerIndex - This is the idex of the message manager to display messages (errors).
//      bDisplayOverlay - True/False. Make it True if you want to display the processing overlay (e.g., Processing...Please wait.).
//
//      fnOnSuccess - (Optional) The function to be executed if the load process succeeds.
//      oOnSuccessParams - (Optional)The parameter to be passed to the "fnOnSuccess" function.
//      fnOnFailure - (Optional) The function to be executed if the load process fails.
//      oOnFailureParams - (Optional)The parameter to be passed to the "fnOnFailure" function.
// Output: True - On success, False - On failure.
function LoadFields(iGroupID, aInputParams, iMsgManagerIndex, bDisplayOverlay,
                        fnOnSuccess, oOnSuccessParams, fnOnFailure, oOnFailureParams) {
    try {
        if (IsEmpty(iGroupID)) iGroupID = -1;
        if (IsEmpty(iMsgManagerIndex)) iMsgManagerIndex = -1;
        if (IsEmpty(bDisplayOverlay)) bDisplayOverlay = true;
        iGroupID = parseInt(iGroupID);
        iMsgManagerIndex = parseInt(iMsgManagerIndex);

        ResetAllErrors();
        HideMsg(iMsgManagerIndex);

        var oInfo;
        var sName, sValue;
        var aFields = [];
        var aIndexes = [];
        var aPKs = [];
        var aInputParams2 = [];
        var aGroups = {};
        var pkCounter = 0;

        if (IsArray(aInputParams)) {
            jQuery.each(aInputParams, function (i, val) {
                aInputParams2.push(val);
            });
        }

        var sLoadHttpMethod = '';
        var sLoadURL = '';

        if (iGroupID > -1) {
            sLoadHttpMethod = aCtrlGroups[iGroupID].sLoadHttpMethod;
            sLoadURL = aCtrlGroups[iGroupID].sLoadURL;
        }

        for (var index in aCtrls) {
            oInfo = aCtrls[index];

            if (!oInfo.bIsAJAXParam) continue;
            if (!oInfo.bPK && iGroupID > -1 && oInfo.iGroupID != iGroupID) continue;
            if (oInfo.sCtrlType == 'fu' || oInfo.sCtrlType == 'img') continue;

            if (IsEmpty(aCtrlGroups[oInfo.iGroupID].sLoadHttpMethod)) {
                throw 'Error(JS): You cannot load group #' + oInfo.iGroupID + ' because it does not have the load HTTP method.';
            }
            else if (IsEmpty(aCtrlGroups[oInfo.iGroupID].sLoadURL)) {
                throw 'Error(JS): You cannot load group #' + oInfo.iGroupID + ' because it does not have the load source URL.';
            }

            if (IsEmpty(sLoadHttpMethod)) sLoadHttpMethod = aCtrlGroups[oInfo.iGroupID].sLoadHttpMethod;
            if (IsEmpty(sLoadURL)) sLoadURL = aCtrlGroups[oInfo.iGroupID].sLoadURL;

            if (iGroupID == -1) {
                if (sLoadHttpMethod != aCtrlGroups[oInfo.iGroupID].sLoadHttpMethod) {
                    throw 'Error(JS): You cannot load fields from different groups at once because they do not share the same load HTTP method.';
                }
                else if (sLoadURL != aCtrlGroups[oInfo.iGroupID].sLoadURL) {
                    throw 'Error(JS): You cannot load fields from different groups at once because they do not share the same load source URL.';
                }
            }

            aGroups[oInfo.iGroupID] = 1;

            aIndexes.push(index);
            sName = oInfo.sCName;

            aFields.push(sName);

            if (oInfo.sCtrlType == 'ddl') {
                if (!IsEmpty(oInfo.oOtherProp.sColumnNameText)) {
                    aFields.push(oInfo.oOtherProp.sColumnNameText);
                }
            }
            else if (oInfo.sCtrlType == 'txt_auto') {
                if (!IsEmpty(oInfo.oOtherProp.sColumnNameValue)) {
                    aFields.push(oInfo.oOtherProp.sColumnNameValue);
                }
            }

            if (oInfo.bPK == true) {

                // checkbox and radiobuttons.
                if (oInfo.sCtrlType == 'chk' || oInfo.sCtrlType == 'rad') {
                    sValue = $('#' + oInfo.sClientID).is(':checked');
                }
                    // radio group buttons
                else if (oInfo.sCtrlType == 'rgbtn') {
                    if ($('input[name=' + oInfo.sClientID + ']:checked').length <= 0) {
                        sValue = '';
                    }
                    else {
                        sValue = $('input[name=' + oInfo.sClientID + ']:checked').val();
                    }
                }
                else if (oInfo.sCtrlType == 'ddl' || oInfo.sCtrlType == 'txt_auto') {
                    sValue = oInfo.oOtherProp.sValue;
                }
                    //hyper link
                else if (oInfo.sCtrlType == 'hlink') {
                    sValue = $('#' + oInfo.sClientID).text();
                }
                    //others
                else {
                    sValue = $('#' + oInfo.sClientID).val();
                }

                if (IsEmpty(sValue)) throw 'Error(JS): The primary key field (ID: ' + oInfo.sClientID + ') cannot be empty.';

                aPKs.push(sName);
                aInputParams2.push({ 'name': 'pkf' + pkCounter, 'value': sValue });
                ++pkCounter;
            }
        }

        if (aInputParams2.length == 0) throw 'Error(JS): There is no field marked as primary key. You should either mark a field as PK or pass in some input parameters that will serve as primary key.';

        if (aIndexes.length > 0) {

            if (bDisplayOverlay == true) DisplayProcessingOverlay();

            aInputParams2.push({ 'name': 'l_pks', 'value': aPKs.join('|') });
            aInputParams2.push({ 'name': 'l_fields', 'value': aFields.join('|') });

            var aGroups2 = [];
            for (var gID in aGroups) {
                aGroups2.push(gID);
            }
            aInputParams2.push({ 'name': 'l_groups', 'value': aGroups2.join('|') });

            var oOnSuccessParams2 = new Object();
            oOnSuccessParams2.fnOnSuccess = fnOnSuccess;
            oOnSuccessParams2.oOnSuccessParams = oOnSuccessParams;
            oOnSuccessParams2.aIndexes = aIndexes;
            oOnSuccessParams2.bDisplayOverlay = bDisplayOverlay;
            oOnSuccessParams2.iMsgManagerIndex = iMsgManagerIndex;

            var oOnFailureParams2 = new Object();
            oOnFailureParams2.fnOnFailure = fnOnFailure;
            oOnFailureParams2.oOnFailureParams = oOnFailureParams;
            oOnFailureParams2.bDisplayOverlay = bDisplayOverlay;
            oOnFailureParams2.iMsgManagerIndex = iMsgManagerIndex;

            if (sLoadHttpMethod == 'POST') {
                SubmitAJAXPOSTRequest(sLoadURL, aInputParams2, iMsgManagerIndex, LoadFieldsOnSuccess, oOnSuccessParams2, LoadFieldsOnFailure, oOnFailureParams2);
            }
            else {
                SubmitAJAXGETRequest(sLoadURL, aInputParams2, iMsgManagerIndex, LoadFieldsOnSuccess, oOnSuccessParams2, LoadFieldsOnFailure, oOnFailureParams2);
            }
        }
        else {
            throw 'Error(JS): There is no control (field) to be loaded.';
        }

        return true;

    }
    catch (err) {
        alert(err);
    }
}

function LoadFieldsOnSuccess(res, parms) {
    if (parms.bDisplayOverlay == true) HideProcessingOverLay();

    var oInfo;
    var sName, sValue, index;

    for (var i in parms.aIndexes) {
        index = parms.aIndexes[i];
        oInfo = aCtrls[index];

        sName = !IsEmpty(oInfo.sCName) ? oInfo.sCName : oInfo.sClientID;
        if (res.aData[sName] === undefined) {
            throw 'Error(JS): The field is missing (' + sName + ').';
        }

        sValue = res.aData[sName] + '';

        if (oInfo.sCtrlType == 'chk' || oInfo.sCtrlType == 'rad') {
            $('#' + oInfo.sClientID).prop('checked', sValue.stringToBoolean());
        }
        else if (oInfo.sCtrlType == 'rgbtn') {
            $('input[name="' + oInfo.sClientID + '"]').filter('[value="' + sValue + '"]').prop('checked', true);
        }
        else if (oInfo.sCtrlType == 'ddl') {
            oInfo.oOtherProp.sValue = sValue;
            if (!IsEmpty(oInfo.oOtherProp.sColumnNameText)) {
                oInfo.oOtherProp.sText = res.aData[oInfo.oOtherProp.sColumnNameText] + '';
            }

            if (aCtrlGroups[oInfo.iGroupID].sWorkMode == 'R' && !IsEmpty(oInfo.oOtherProp.sColumnNameText)) {
                if (oInfo.oOtherProp.sDefaultSelValue !== undefined && oInfo.oOtherProp.sDefaultSelValue == oInfo.oOtherProp.sValue) {
                    $('#' + oInfo.oOtherProp.sClientIDR).val(oInfo.oOtherProp.sValue);
                }
                else {
                    $('#' + oInfo.oOtherProp.sClientIDR).val(oInfo.oOtherProp.sText);
                }
            }
            else {
                if (IsDDLLoaded(index)) {
                    $('#' + oInfo.sClientID).val(oInfo.oOtherProp.sValue);
                    if (oInfo.oOtherProp.sDefaultSelValue !== undefined && oInfo.oOtherProp.sDefaultSelValue == oInfo.oOtherProp.sValue) {
                        $('#' + oInfo.oOtherProp.sClientIDR).val(oInfo.oOtherProp.sValue);
                    }
                    else {
                        $('#' + oInfo.oOtherProp.sClientIDR).val($('#' + oInfo.sClientID + ' option:selected').text());
                    }
                    oInfo.oOtherProp.sText = $('#' + oInfo.sClientID + ' option:selected').text();
                }
                else if (oInfo.oOtherProp.bLoadOnDemand == true) {
                    LoadDropDownList(oInfo.sClientID, oInfo.oOtherProp.sOnDemandUrl, GetDDLExtraParams(index), false,
                            oInfo.oOtherProp.sValue, oInfo.oOtherProp.sText, false, false,
                            -1, true, null);
                }
            }
        }
        else if (oInfo.sCtrlType == 'txt_auto') {
            oInfo.oOtherProp.sText = sValue;
            oInfo.oOtherProp.sValue = res.aData[oInfo.oOtherProp.sColumnNameValue] + '';
            $('#' + oInfo.sClientID).val(sValue);
        }
        else if (oInfo.sCtrlType == 'img') {
            oInfo.oOtherProp.sImageName = sValue;
            $('#' + oInfo.sClientID).attr('src', oInfo.oOtherProp.sBaseUrl + sValue);
        }
        else if (oInfo.sCtrlType == 'lbl') {
            $('#' + oInfo.sClientID).html(sValue);
        }
            //hyper link
        else if (oInfo.sCtrlType == 'hlink') {
            if (!IsEmpty(oInfo.oOtherProp.NavigateColumnName)) {
                $('#' + oInfo.sClientID).attr("href", res.aData[oInfo.oOtherProp.NavigateColumnName] + '');
            }
            $('#' + oInfo.sClientID).text(sValue);
        }
        else {
            $('#' + oInfo.sClientID).val(sValue);
        }
    }

    if (IsFunction(parms.fnOnSuccess)) {
        var fnOnSuccess = parms.fnOnSuccess;
        fnOnSuccess(res, parms.oOnSuccessParams);
    }

    return;
};
function LoadFieldsOnFailure(iStatus, sMessage, parms) {
    if (parms.bDisplayOverlay == true) HideProcessingOverLay();

    if (IsFunction(parms.fnOnFailure)) {
        var fnOnFailure = parms.fnOnFailure;
        fnOnFailure(iStatus, sMessage, parms.oOnFailureParams);
    }
    else {
        DisplayMsg(parms.iMsgManagerIndex, 'error', sMessage, 'Loading Failed', null, null);
    }
};




// Load drop down list on demand via AJAX.
// Parameters:
//      - sClientID - The client ID of the drop down list.
//      - sSource - The URL of the web-method to populate the drop down list.
//      - aExtraParams - An array of parameters to be passed in to the web-method. The items in this array could be either fixed values or controls.
//                          For fixed values, the format will be:
//                                          aExtraParams.push({ 'type': 'value', 'ID': <the name of parameter>, 'value': <the value> });
//                          For controls, the format will be:
//                                          aExtraParams.push({ 'type': 'ctrl', 'ID': <the client ID of control> });
//      - bRefresh - True/False. Enter True if you want the drop down list to populate regardless. If False, the drop down list will populate only once.
//      - sAddValue & sAddText - The value and text to be displayed on the drop down list once it is populated.
//      - bKeepCurrentSelection - True/False. Enter True if you want the drop down list to keep the current selected values.
//                                              This applies only when reloading the drop down list and the sAddValue & sAddText parameters are null.
//      - bAddIfMissing - True/False. Enter True if you want the sAddValue & sAddText parameters to be added in drop down list if they are missing after reload.
//      - iMsgManagerIndex - The idex of the message manager to display messages (errors).
//      - bDisplayOverlay - True/False. Make it True if you want to display the processing overlay (e.g., Processing...Please wait.).
//      - fnFunction - (optional) The function to run when the loading process is completed.
function LoadDropDownList(sClientID, sSource, aExtraParams, bRefresh,
                            sAddValue, sAddText, bKeepCurrentSelection, bAddIfMissing,
                            iMsgManagerIndex, bDisplayOverlay, fnFunction) {

    var ddl = $('#' + sClientID); if (ddl.length <= 0) return;

    if (IsEmpty(iMsgManagerIndex)) iMsgManagerIndex = -1;
    if (IsEmpty(bDisplayOverlay)) bDisplayOverlay = true;
    if (IsEmpty(bKeepCurrentSelection)) bKeepCurrentSelection = false;
    if (IsEmpty(bAddIfMissing)) bAddIfMissing = false;

    var oDDL;
    if (aDDLList[sClientID] === undefined) {
        oDDL = new Object();
        oDDL.bIsLoaded = false;
        oDDL.bOptionGroup = false;
        oDDL.sLastMode = '';
        oDDL.sAddValue = null;
        oDDL.sAddText = null;
        oDDL.bIsValueAdded = false;
        oDDL.bDisplayOverlay = false;
        oDDL.aDependsOnCtrl = {};
        oDDL.bKeepCurrentSelection = false;
        oDDL.bAddIfMissing = false;
        oDDL.sIndex = GetControlIndex(sClientID);
        aDDLList[sClientID] = oDDL;
    }
    else {
        oDDL = aDDLList[sClientID];
        oDDL.bDisplayOverlay = bDisplayOverlay;
    }

    // Remove the old added option.
    if (oDDL.bIsValueAdded) {
        $("#" + sClientID + " option[value='" + oDDL.sAddValue + "']").remove();
        oDDL.bIsValueAdded = false;
    }

    oDDL.fnFunction = fnFunction;
    oDDL.sAddValue = sAddValue;
    oDDL.sAddText = sAddText;
    oDDL.bKeepCurrentSelection = bKeepCurrentSelection;
    oDDL.bAddIfMissing = bAddIfMissing;
    oDDL.bDisplayOverlay = bDisplayOverlay;

    if (!oDDL.bIsLoaded || bRefresh) {
        var aInputParams = [];
        aInputParams.push({ 'name': 'DDLID', 'value': sClientID });

        if (IsArray(aExtraParams)) {
            var ctrl, sVal, sCtrlIndex, oInfo;
            $.each(aExtraParams, function () {
                // Fixed value
                if (this.type == 'value') {
                    aInputParams.push({ 'name': this.ID, 'value': this.value });
                }
                    // Control
                else if (this.type == 'ctrl') {
                    sCtrlIndex = GetControlIndex(this.ID);
                    if (!IsEmpty(sCtrlIndex)) {
                        oInfo = aCtrls[sCtrlIndex];

                        sVal = GetValue(this.ID, oInfo.sCtrlType);
                        aInputParams.push({ 'name': oInfo.sCName, 'value': sVal });

                        if (oDDL.aDependsOnCtrl[sCtrlIndex] === undefined) {
                            ctrl = GetControl(this.ID, oInfo.sCtrlType);

                            $(ctrl).bind('change.SetVal2', function () {
                                LoadDropDownList(sClientID, sSource, aExtraParams, true,
                                                    '', '', true, false,
                                                    iMsgManagerIndex, bDisplayOverlay, fnFunction);
                            });

                            oDDL.aDependsOnCtrl[sCtrlIndex] = 1;
                        }
                    }
                }
                else if (this.name !== undefined && !IsEmpty(this.name)) {
                    aInputParams.push({ 'name': this.name, 'value': this.value });
                }
            });
        }

        var oPopulateParams = { 'sClientID': sClientID, 'iMsgManagerIndex': iMsgManagerIndex };

        SubmitAJAXGETRequest(sSource, aInputParams, iMsgManagerIndex, LoadDropDownListOnSuccess, oPopulateParams, LoadDropDownListOnFailure, oPopulateParams);

        if (oDDL.bDisplayOverlay) {
            AddPendingOperation();
            DisplayProcessingOverlay();
        }
    }
    else if (oDDL.sAddValue != null && oDDL.sAddText != null && (oDDL.sAddValue != '' || oDDL.sAddText != '')) {
        AssignDDLVal(sClientID, oDDL.sAddValue, oDDL.sAddText);
    }
};
function LoadDropDownListOnSuccess(res, oParams) {
    var oDDL = aDDLList[oParams.sClientID];

    if (res.iStatus == 1) {
        var ddl = $('#' + oParams.sClientID);
        if (ddl.length <= 0) return;

        var sCurrSelValue = ddl.val();
        var sCurrSelText = $('option:selected', ddl).text();

        $('#' + oParams.sClientID + ' >option,optgroup').remove();

        if (oDDL.bOptionGroup) {
            var optGrp;
            $.each(res.aaContent, function () {
                optGrp = $('<optgroup></optgroup>').appendTo(ddl);
                optGrp.attr('label', this.sGrpLabel);
                if (this.sGrpId != '') optGrp.attr('id', this.sGrpId);

                $.each(this.aaGrpContent, function (index, value) {
                    optGrp.append($('<option></option>').val(value[0]).html(value[1]));
                });
            });
        }
        else {
            $.each(res.aaContent, function (index, value) {
                ddl.append($('<option></option>').val(value[0]).html(value[1]));
            });
        }

        if (oDDL.sAddValue != null && oDDL.sAddText != null && (oDDL.sAddValue != '' || oDDL.sAddText != '')) {
            try {
                AssignDDLVal(oParams.sClientID, oDDL.sAddValue, oDDL.sAddText);
            }
            catch (ex) {
                setTimeout(function () { AssignDDLVal(oParams.sClientID, oDDL.sAddValue, oDDL.sAddText); }, 1);
            }
        }
        else if (oDDL.bKeepCurrentSelection == true && (sCurrSelValue != null && sCurrSelText != null && (sCurrSelValue != '' || sCurrSelText != ''))) {
            try {
                AssignDDLVal(oParams.sClientID, sCurrSelValue, sCurrSelText);
            }
            catch (ex) {
                setTimeout(function () { AssignDDLVal(oParams.sClientID, sCurrSelValue, sCurrSelText); }, 1);
            }
        }

        if (IsFunction(oDDL.fnFunction)) {
            setTimeout(oDDL.fnFunction, 100);
        }

        oDDL.bIsLoaded = true;
    }
    else {
        DisplayMsg(oParams.iMsgManagerIndex, 'result', res.sMessage, res.sTitle, null, null);
    }

    if (oDDL.bDisplayOverlay) {
        var iStillPending = RemovePendingOperation();
        if (iStillPending <= 0) HideProcessingOverLay();
    }
};
function LoadDropDownListOnFailure(iStatus, sMessage, oParams) {
    var oDDL = aDDLList[oParams.sClientID];

    if (oDDL.bDisplayOverlay == true) {
        var iStillPending = RemovePendingOperation();
        if (iStillPending <= 0) HideProcessingOverLay();
    }

    DisplayMsg(oParams.iMsgManagerIndex, 'error', sMessage, 'Loading Failed', null, null);
};
function AssignDDLVal(sClientID, sValue, sText) {
    var ddl = $('#' + sClientID);
    var oDDL = aDDLList[sClientID];

    if ($("option[value='" + sValue + "']", ddl).length != 0) {
        ddl.val(sValue);
        ddl.trigger('change.SetVal');
    }
    else if (oDDL.bAddIfMissing == true) {
        ddl.append($('<option></option>').val(sValue).html(sText));
        ddl.val(sValue);
        oDDL.bIsValueAdded = true;
        ddl.trigger('change.SetVal');
    }
};
function EmptyDropDown(sClientID) {
    var ddl = $('#' + sClientID); if (ddl.length <= 0) return;

    var oDDL;
    if (aDDLList[sClientID] !== undefined) {
        oDDL = aDDLList[sClientID];
        oDDL.bDisplayOverlay = false;
        oDDL.bIsLoaded = false;
    }

    $('#' + sClientID + ' >option,optgroup').remove();
};
function IsDDLLoaded(index) {
    var oInfo = aCtrls[index];

    if (oInfo.oOtherProp.bIsLoaded == true) {
        return true;
    }
    else if (aDDLList[oInfo.sClientID] !== undefined) {
        return aDDLList[oInfo.sClientID].bIsLoaded;
    }
    else {
        return false;
    }
};
function GetDDLExtraParams(index) {
    var oInfo = aCtrls[index];

    var aExtraParams = [];

    if (IsArray(oInfo.oOtherProp.aOnDemandParams)) {
        $.each(oInfo.oOtherProp.aOnDemandParams, function () {
            aInputParams.push(this);
        });
    }

    if (IsFunction(oInfo.oOtherProp.fnOnDemandParams)) {
        var fn = oInfo.oOtherProp.fnOnDemandParams;
        var ar = fn();
        if (IsArray(ar)) {
            $.each(ar, function () {
                aInputParams.push(this);
            });
        }
    }

    return aExtraParams;
}

var oTableParam = null;
var oTableParamCellID = null;
var oTableParamVal = '';

// Submits changes back to the server.
// Parameters:
//      iGroupID - The group ID of the controls. If you want to submit all controls (fields), then enter "-1".
//      aInputParams - The input parameters to passed in. This field is required if there is not field marked as primary key (PK).
//      iMsgManagerIndex - This is the idex of the message manager to display messages (errors).
//      bRunValidation - True/False. Make it True if you want to run the validation as well. Enter False if you want to skip the validation.
//      bDisplayOverlay - True/False. Make it True if you want to display the processing overlay (e.g., Processing...Please wait.).
//
//      fnOnSuccess - (Optional) The function to be executed if the submit process succeeds.
//      oOnSuccessParams - (Optional)The parameter to be passed to the "fnOnSuccess" function.
//      fnOnFailure - (Optional) The function to be executed if the submit process fails.
//      oOnFailureParams - (Optional)The parameter to be passed to the "fnOnFailure" function.
// Output: True - On success, False - On failure.
function SubmitChanges(iGroupID, aInputParams, iMsgManagerIndex, bRunValidation, bDisplayOverlay,
                        fnOnSuccess, oOnSuccessParams, fnOnFailure, oOnFailureParams) {

    try {
        if (IsEmpty(iGroupID)) iGroupID = -1;
        if (IsEmpty(iMsgManagerIndex)) iMsgManagerIndex = -1;
        if (IsEmpty(bRunValidation)) bRunValidation = true;
        if (IsEmpty(bDisplayOverlay)) bDisplayOverlay = true;

        iGroupID = parseInt(iGroupID);
        iMsgManagerIndex = parseInt(iMsgManagerIndex);

        if (iGroupID > -1) {
            if (aCtrlGroups[iGroupID].sWorkMode != 'A' && aCtrlGroups[iGroupID].sWorkMode != 'W') {
                throw 'Error(JS): You cannot submit changes for group #' + iGroupID + ' because this group is still in the read-only mode.';
            }
        }
        else {
            for (var iGroupID2 in aCtrlGroups) {
                if (aCtrlGroups[iGroupID2].sWorkMode != 'A' && aCtrlGroups[iGroupID2].sWorkMode != 'W') {
                    throw 'Error(JS): You cannot submit changes for group #' + iGroupID2 + ' because this group is still in the read-only mode.';
                }
            }
        }

        if (bRunValidation) {
            if (!ValidateAllControls(iGroupID, iMsgManagerIndex)) return false;
        }

        var oInfo;
        var sName, sValue;
        var aNames = [];
        var aInputParams2 = [];
        var aPKs = [];
        var counter = 0;
        var ipCounter = 0;
        var pkCounter = 0;
        var aGroups = {};

        if (IsArray(aInputParams)) {
            ipCounter = aInputParams.length;
            jQuery.each(aInputParams, function (i, val) {
                aInputParams2.push(val);
            });
        }

        var sSubmitHttpMethod = '';
        var sSubmitURL = '';

        if (iGroupID > -1) {
            sSubmitHttpMethod = aCtrlGroups[iGroupID].sSubmitHttpMethod;
            sSubmitURL = aCtrlGroups[iGroupID].sSubmitURL;
        }

        for (var index in aCtrls) {
            oInfo = aCtrls[index];

            if (!oInfo.bIsAJAXParam) {
                continue;
            }

            if (oInfo.sCtrlType == 'lbl') {
                continue;
            }

            if (!oInfo.bPK && iGroupID > -1 && oInfo.iGroupID != iGroupID) {
                continue;
            }

            if (IsEmpty(aCtrlGroups[oInfo.iGroupID].sSubmitHttpMethod)) {
                throw 'Error(JS): You cannot submit changes for group #' + oInfo.iGroupID + ' because it does not have the submit HTTP method.';
            }
            else if (IsEmpty(aCtrlGroups[oInfo.iGroupID].sSubmitURL)) {
                throw 'Error(JS): You cannot submit changes for group #' + oInfo.iGroupID + ' because it does not have the submit URL.';
            }

            if (IsEmpty(sSubmitHttpMethod)) sSubmitHttpMethod = aCtrlGroups[oInfo.iGroupID].sSubmitHttpMethod;
            if (IsEmpty(sSubmitURL)) sSubmitURL = aCtrlGroups[oInfo.iGroupID].sSubmitURL;

            if (iGroupID == -1) {
                if (sSubmitHttpMethod != aCtrlGroups[oInfo.iGroupID].sSubmitHttpMethod) {
                    throw 'Error(JS): You cannot submit changes for fields from different groups at once because they do not share the same submit HTTP method.';
                }
                else if (sSubmitURL != aCtrlGroups[oInfo.iGroupID].sSubmitURL) {
                    throw 'Error(JS): You cannot submit changes for fields from different groups at once because they do not share the same submit URL.';
                }
            }

            sName = oInfo.sCName;
            if (oInfo.sCtrlType == 'txt_auto') {
                if (!IsEmpty(oInfo.oOtherProp.sColumnNameValue)) {
                    sName = oInfo.oOtherProp.sColumnNameValue;
                }
            }

            sValue = GetValue(oInfo.sClientID, oInfo.sCtrlType, oInfo);

            if (oInfo.bPK) {
                aPKs.push(sName);
                aInputParams2.push({ 'name': 'pkf' + pkCounter, 'value': sValue });
                ++pkCounter;
            }
            else {
                aNames.push(sName);
                aInputParams2.push({ 'name': 'f' + counter, 'value': sValue });
                ++counter;
            }

            aGroups[oInfo.iGroupID] = 1;
        }

        var oTable, nNodes, oElement, aRowData, iRowID, oCol, oRow, bIsValid, bExitFunction;
        var aTables = [], aTablePKs = [], aTableOtherFields = [];
        bExitFunction = false;

        for (var index in aDT) {
            oInfo = aDT[index];
            if (oInfo.bIsAjaxParam && oInfo.sType == "jq-dt") {
                oTable = oInfo.oTable;
                nNodes = oTable.fnGetNodes();

                aTablePKs = oInfo.sPKFields.split('|');
                aTableOtherFields = oInfo.sOtherFields.split('|');

                if (aTablePKs.length == 0) throw 'Error(JS): You can not submit data from the datatable (' + oInfo.sTableID + ') because it dosn\'t have a primary key.';
                if (aTableOtherFields.length == 0) throw 'Error(JS): You can not submit data from the datatable (' + oInfo.sTableID + ') because it dosn\'t have fields to update.';

                iRowID = 0;

                $.each(nNodes, function () {
                    oRow = this;
                    aRowData = GetJDataTableRow($('td:first-child', oRow), index);

                    $.each(aTablePKs, function (i, cid) {
                        aInputParams2.push({ 'name': 'tf_' + index + '_' + iRowID + '_' + cid, 'value': aRowData[cid] });
                    });

                    $.each(aTableOtherFields, function (i, cid) {
                        if ($('.jt-ajax-param-' + cid, oRow).length > 0) {
                            oCol = $('.jt-ajax-param-' + cid, oRow);

                            if ($(oCol).hasClass('jt-ctrl-text')) {
                                if (bRunValidation) {
                                    ValidateControl($(oCol), null);
                                    bIsValid = IsPageValid(iMsgManagerIndex);
                                    if (!bIsValid) {
                                        bExitFunction = true;
                                        return false;
                                    }
                                }

                                sValue = $(oCol).val();
                            }
                            else if ($(oCol).hasClass('jt-ctrl-ddl')) {
                                if (bRunValidation) {
                                    ValidateControl($(oCol), null);
                                    bIsValid = IsPageValid(iMsgManagerIndex);
                                    if (!bIsValid) {
                                        bExitFunction = true;
                                        return;
                                    }
                                }

                                sValue = $(oCol).val();
                            }
                            else if ($(oCol).hasClass('jt-ctrl-chk')) {
                                sValue = $(oCol).is(':checked');
                            }

                            aInputParams2.push({ 'name': 'tf_' + index + '_' + iRowID + '_' + cid, 'value': sValue });
                        }
                    });

                    if (bExitFunction) return false;

                    ++iRowID;
                });

                aTables.push(oInfo.sTableID + '&' + aTablePKs.join(':') + '&' + aTableOtherFields.join(':') + '&' + iRowID + '&' + index);
            }
        }

        if (bExitFunction) return false;

        if (aNames.length == 0 && aPKs.length == 0 && aTables.length == 0) throw 'Error(JS): There is no field marked as primary key. You should either mark a field as PK or pass in some input parameters that will serve as primary key.';

        if (aInputParams2.length > 0) {

            if (aPKs.length > 0) {
                aInputParams2.push({ 'name': 'l_pks', 'value': aPKs.join('|') });
            }
            if (aNames.length > 0) {
                aInputParams2.push({ 'name': 'l_fields', 'value': aNames.join('|') });
            }

            var aGroups2 = [];
            for (var gID in aGroups) {
                aGroups2.push(gID);
            }
            if (aGroups2.length > 0) {
                aInputParams2.push({ 'name': 'l_groups', 'value': aGroups2.join('|') });
            }

            if (aTables.length > 0) {
                aInputParams2.push({ 'name': 'l_tables', 'value': aTables.join('|') });
            }

            if (bDisplayOverlay == true) DisplayProcessingOverlay();

            var oOnSuccessParams2 = new Object();
            oOnSuccessParams2.fnOnSuccess = fnOnSuccess;
            oOnSuccessParams2.oOnSuccessParams = oOnSuccessParams;
            oOnSuccessParams2.bDisplayOverlay = bDisplayOverlay;
            oOnSuccessParams2.iMsgManagerIndex = iMsgManagerIndex;

            var oOnFailureParams2 = new Object();
            oOnFailureParams2.fnOnFailure = fnOnFailure;
            oOnFailureParams2.oOnFailureParams = oOnFailureParams;
            oOnFailureParams2.bDisplayOverlay = bDisplayOverlay;
            oOnFailureParams2.iMsgManagerIndex = iMsgManagerIndex;

            if (sSubmitHttpMethod == 'POST') {
                SubmitAJAXPOSTRequest(sSubmitURL, aInputParams2, iMsgManagerIndex, SubmitChangesOnSuccess, oOnSuccessParams2, SubmitChangesOnFailure, oOnFailureParams2);
            }
            else {
                SubmitAJAXGETRequest(sSubmitURL, aInputParams2, iMsgManagerIndex, SubmitChangesOnSuccess, oOnSuccessParams2, SubmitChangesOnFailure, oOnFailureParams2);
            }
        }

        return true;
    }
    catch (err) {
        alert(err);
    }
};
function SubmitChangesOnSuccess(res, parms) {
    if (parms.bDisplayOverlay == true) HideProcessingOverLay();

    if (IsFunction(parms.fnOnSuccess)) {
        var fnOnSuccess = parms.fnOnSuccess;
        fnOnSuccess(res, parms.oOnSuccessParams);
    }
    else {
        DisplayMsg(parms.iMsgManagerIndex, 'result', res.sMessage, res.sTitle, null, null);
    }
};
function SubmitChangesOnFailure(iStatus, sMessage, parms) {
    if (parms.bDisplayOverlay == true) HideProcessingOverLay();

    if (IsFunction(parms.fnOnFailure)) {
        var fnOnFailure = parms.fnOnFailure;
        fnOnFailure(iStatus, sMessage, parms.oOnFailureParams);
    }
    else {
        DisplayMsg(parms.iMsgManagerIndex, 'error', sMessage, 'Submit Changes Failed', null, null);
    }
};

// Deletes a specific table record.
// Parameters:
//      tableID - The client ID of the table.
//      aPKFields - The list of primary key fields.
//      iMsgManagerIndex - This is the idex of the message manager to display messages (errors).
//      bDisplayOverlay - True/False. Make it True if you want to display the processing overlay (e.g., Processing...Please wait.).
//
//      fnOnSuccess - (Optional) The function to be executed if the load process succeeds.
//      oOnSuccessParams - (Optional)The parameter to be passed to the "fnOnSuccess" function.
//      fnOnFailure - (Optional) The function to be executed if the load process fails.
//      oOnFailureParams - (Optional)The parameter to be passed to the "fnOnFailure" function.
// Output: True - On success, False - On failure.
function DeleteTableRecord(thisObj, aPKFields, iMsgManagerIndex, bDisplayOverlay,
                        fnOnSuccess, oOnSuccessParams, fnOnFailure, oOnFailureParams) {
    var tIndex = GetTableIndex(thisObj);
    if (!IsArray(aPKFields)) aPKFields = [];
    aPKFields.push({ 'name': 'tIndex', 'value': tIndex });
    return DeleteRecord(aDT[tIndex].iGroupID, aPKFields, iMsgManagerIndex, bDisplayOverlay, fnOnSuccess, oOnSuccessParams, fnOnFailure, oOnFailureParams)
}



// Deletes the current record.
// Parameters:
//      iGroupID - The group ID of the controls to be loaded. Do not enter "-1". It should be a specific group ID.
//      aInputParams - The input parameters to passed in. This field is required if there is not field marked as primary key (PK).
//      iMsgManagerIndex - This is the idex of the message manager to display messages (errors).
//      bDisplayOverlay - True/False. Make it True if you want to display the processing overlay (e.g., Processing...Please wait.).
//
//      fnOnSuccess - (Optional) The function to be executed if the load process succeeds.
//      oOnSuccessParams - (Optional)The parameter to be passed to the "fnOnSuccess" function.
//      fnOnFailure - (Optional) The function to be executed if the load process fails.
//      oOnFailureParams - (Optional)The parameter to be passed to the "fnOnFailure" function.
// Output: True - On success, False - On failure.
function DeleteRecord(iGroupID, aInputParams, iMsgManagerIndex, bDisplayOverlay,
                        fnOnSuccess, oOnSuccessParams, fnOnFailure, oOnFailureParams) {
    try {
        if (IsEmpty(iGroupID)) iGroupID = -1;
        if (IsEmpty(iMsgManagerIndex)) iMsgManagerIndex = -1;
        if (IsEmpty(bDisplayOverlay)) bDisplayOverlay = true;
        iGroupID = parseInt(iGroupID);
        iMsgManagerIndex = parseInt(iMsgManagerIndex);

        ResetAllErrors();
        HideMsg(iMsgManagerIndex);

        var oInfo;
        var sName, sValue;
        var aPKs = [];
        var aInputParams2 = [];
        var pkCounter = 0;


        var sDeleteURL = aCtrlGroups[iGroupID].sDeleteURL;
        var sDeleteHttpMethod = aCtrlGroups[iGroupID].sDeleteHttpMethod;

        if (IsEmpty(sDeleteURL)) {
            throw 'Error(JS): You cannot delete record from the group #' + iGroupID + ' because it does not have the delete URL.';
        }
        if (IsEmpty(sDeleteHttpMethod)) {
            throw 'Error(JS): You cannot delete record from the group #' + iGroupID + ' because it does not have the delete HTTP method.';
        }

        for (var index in aCtrls) {
            oInfo = aCtrls[index];

            if (!oInfo.bIsAJAXParam) continue;
            if (!oInfo.bPK) continue;

            if (oInfo.iGroupID != iGroupID) continue;

            // checkbox and radiobuttons.
            if (oInfo.sCtrlType == 'chk' || oInfo.sCtrlType == 'rad') {
                sValue = $('#' + oInfo.sClientID).is(':checked');
            }
                // radio group buttons
            else if (oInfo.sCtrlType == 'rgbtn') {
                if ($('input[name=' + oInfo.sClientID + ']:checked').length <= 0) {
                    sValue = '';
                }
                else {
                    sValue = $('input[name=' + oInfo.sClientID + ']:checked').val();
                }
            }
            else if (oInfo.sCtrlType == 'ddl' || oInfo.sCtrlType == 'txt_auto') {
                sValue = oInfo.oOtherProp.sValue;
            }
            else {
                sValue = $('#' + oInfo.sClientID).val();
            }

            if (IsEmpty(sValue)) throw 'Error(JS): The primary key field (ID: ' + oInfo.sClientID + ') cannot be empty.';

            aPKs.push(oInfo.sCName);
            aInputParams2.push({ 'name': 'pkf' + pkCounter, 'value': sValue });
            ++pkCounter;
        }

        var tIndex = '';
        if (IsArray(aInputParams)) {
            jQuery.each(aInputParams, function (i, val) {
                if (val.name == 'tIndex') {
                    tIndex = val.value
                }
                else {
                    aPKs.push(val.name);
                    aInputParams2.push({ 'name': 'pkf' + pkCounter, 'value': val.value });
                    ++pkCounter;
                }
            });
        }

        if (aInputParams2.length == 0) throw 'Error(JS): There is no field marked as primary key. You should either mark a field as PK or pass in some input parameters that will serve as primary key.';

        if (bDisplayOverlay == true) DisplayProcessingOverlay();

        aInputParams2.push({ 'name': 'l_pks', 'value': aPKs.join('|') });
        aInputParams2.push({ 'name': 'l_groups', 'value': iGroupID });

        var oOnSuccessParams2 = new Object();
        oOnSuccessParams2.fnOnSuccess = fnOnSuccess;
        oOnSuccessParams2.oOnSuccessParams = oOnSuccessParams;
        oOnSuccessParams2.bDisplayOverlay = bDisplayOverlay;
        oOnSuccessParams2.iMsgManagerIndex = iMsgManagerIndex;
        oOnSuccessParams2.sTableIndex = tIndex;

        var oOnFailureParams2 = new Object();
        oOnFailureParams2.fnOnFailure = fnOnFailure;
        oOnFailureParams2.oOnFailureParams = oOnFailureParams;
        oOnFailureParams2.bDisplayOverlay = bDisplayOverlay;
        oOnFailureParams2.iMsgManagerIndex = iMsgManagerIndex;
        oOnSuccessParams2.sTableIndex = tIndex;

        if (sDeleteHttpMethod == 'POST') {
            SubmitAJAXPOSTRequest(sDeleteURL, aInputParams2, iMsgManagerIndex, DeleteRecordOnSuccess, oOnSuccessParams2, DeleteRecordOnFailure, oOnFailureParams2);
        }
        else {
            SubmitAJAXGETRequest(sDeleteURL, aInputParams2, iMsgManagerIndex, DeleteRecordOnSuccess, oOnSuccessParams2, DeleteRecordOnFailure, oOnFailureParams2);
        }

        return true;

    }
    catch (err) {
        alert(err);
    }
}
function DeleteRecordOnSuccess(res, parms) {
    if (parms.bDisplayOverlay == true) HideProcessingOverLay();

    if (IsFunction(parms.fnOnSuccess)) {
        var fnOnSuccess = parms.fnOnSuccess;
        fnOnSuccess(res, parms.oOnSuccessParams);
    }
    else {
        DisplayMsg(parms.iMsgManagerIndex, 'result', res.sMessage, res.sTitle, null, null);
    }

    if (!IsEmpty(parms.sTableIndex)) {
        RefreshJDataTable(parms.sTableIndex);
    }
};
function DeleteRecordOnFailure(iStatus, sMessage, parms) {
    if (parms.bDisplayOverlay == true) HideProcessingOverLay();

    if (IsFunction(parms.fnOnFailure)) {
        var fnOnFailure = parms.fnOnFailure;
        fnOnFailure(iStatus, sMessage, parms.oOnFailureParams);
    }
    else {
        DisplayMsg(parms.iMsgManagerIndex, 'error', sMessage, 'Delete Failed', null, null);
    }
};


// Clear fields.
function ClearFields(iGroupID) {

    try {
        if (IsEmpty(iGroupID)) iGroupID = -1;
        iGroupID = parseInt(iGroupID);

        if (iGroupID > -1) {
            if (aCtrlGroups[iGroupID].sWorkMode != 'A' && aCtrlGroups[iGroupID].sWorkMode != 'W') {
                throw 'Error(JS): You cannot clear fields for group #' + iGroupID + ' because this group is still in the read-only mode.';
            }
        }
        else {
            for (var iGroupID2 in aCtrlGroups) {
                if (aCtrlGroups[iGroupID2].sWorkMode != 'A' && aCtrlGroups[iGroupID2].sWorkMode != 'W') {
                    throw 'Error(JS): You cannot clear fields for group #' + iGroupID2 + ' because this group is still in the read-only mode.';
                }
            }
        }

        for (var i in parms.aIndexes) {
            index = parms.aIndexes[i];
            oInfo = aCtrls[index];

            if (iGroupID > -1 && oInfo.iGroupID != iGroupID) {
                continue;
            }

            sName = !IsEmpty(oInfo.sCName) ? oInfo.sCName : oInfo.sClientID;
            if (res.aData[sName] === undefined) {
                throw 'Error(JS): The field is missing (' + sName + ').';
            }

            sValue = '';

            if (oInfo.sCtrlType == 'chk' || oInfo.sCtrlType == 'rad') {
                $('#' + oInfo.sClientID).prop('checked', sValue.stringToBoolean());
            }
            else if (oInfo.sCtrlType == 'ddl') {
                oInfo.oOtherProp.sValue = "";
                if (!IsEmpty(oInfo.oOtherProp.sColumnNameText)) {
                    oInfo.oOtherProp.sText = "";
                }

                $('#' + oInfo.sClientID).val(oInfo.oOtherProp.sValue);
                if (oInfo.oOtherProp.sDefaultSelValue !== undefined && oInfo.oOtherProp.sDefaultSelValue == oInfo.oOtherProp.sValue) {
                    $('#' + oInfo.oOtherProp.sClientIDR).val(oInfo.oOtherProp.sValue);
                }
                else {
                    $('#' + oInfo.oOtherProp.sClientIDR).val($('#' + oInfo.sClientID + ' option:selected').text());
                }
            }
            else if (oInfo.sCtrlType == 'txt_auto') {
                oInfo.oOtherProp.sText = "";
                oInfo.oOtherProp.sValue = "";
                $('#' + oInfo.sClientID).val("");
            }
            else if (oInfo.sCtrlType == 'img') {
                oInfo.oOtherProp.sImageName = '';
                $('#' + oInfo.sClientID).attr('src', oInfo.oOtherProp.sNoImageURL);
            }
            else if (oInfo.sCtrlType == 'lbl') {
                $('#' + oInfo.sClientID).html('');
            }
            else {
                $('#' + oInfo.sClientID).val('');
            }
        }


        return true;
    }
    catch (err) {
        alert(err);
    }
};






function SubmitAJAXGETRequest(sSource, aInputParams, iMsgManagerIndex, fnOnSuccess, oOnSuccessParams, fnOnFailure, oOnFailureParams) {
    if (IsEmpty(iMsgManagerIndex)) iMsgManagerIndex = -1;
    iMsgManagerIndex = parseInt(iMsgManagerIndex);

    return $.ajax({
        type: 'GET',
        url: sSource,
        data: aInputParams,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        success: function (msg) {
            var res = msg.d;
            if (res.iStatus == 1) {
                if (IsFunction(fnOnSuccess)) {
                    fnOnSuccess(res, oOnSuccessParams);
                }
                else {
                    HideProcessingOverLay();
                    DisplayMsg(iMsgManagerIndex, 'result', res.sMessage, res.sTitle, null, null);
                }
            }
            else if (res.iStatus == 301) {
                if (!IsEmpty(res.sRedirectUrl)) {
                    RedirectPage(res.sRedirectUrl);
                }
                else {
                    throw 'Error(JS): The redirect URL is missing.';
                }
            }
            else if (res.iStatus == 401) {
                HideProcessingOverLay();
                if (IsEmpty(res.sRedirectUrl)) {
                    DisplayMsg(iMsgManagerIndex, 'error', 'Your session has expired due to inactivity. Please refresh the browser.', 'Session Expired', null, null);
                }
                else {
                    DisplayMsg(iMsgManagerIndex, 'error', 'Your session has expired due to inactivity. Please click <a href="#" onclick="TopWindow().RedirectPage(\'' + res.sRedirectUrl + '\')" >here</a> to re-login.', 'Session Expired', null, null);
                }
            }
            else {
                if (IsFunction(fnOnFailure)) {
                    fnOnFailure(res.iStatus, res.sMessage, oOnFailureParams);
                }
                else {
                    HideProcessingOverLay();
                    DisplayMsg(iMsgManagerIndex, 'error', res.sMessage, res.sTitle, null, null);
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (IsFunction(fnOnFailure)) {
                fnOnFailure(999, XMLHttpRequest.responseText, oOnFailureParams);
            }
            else {
                HideProcessingOverLay();
                DisplayMsg(iMsgManagerIndex, 'error', XMLHttpRequest.responseText, 'Error', null, null);
            }
        }
    });
}


function SubmitAJAXPOSTRequest(sSource, aInputParams, iMsgManagerIndex, fnOnSuccess, oOnSuccessParams, fnOnFailure, oOnFailureParams) {
    if (iMsgManagerIndex === undefined || iMsgManagerIndex == null || iMsgManagerIndex == '') iMsgManagerIndex = -1;
    iMsgManagerIndex = parseInt(iMsgManagerIndex);

    return $.ajax({
        type: 'POST',
        url: sSource,
        data: JSON.stringify({ 'parms': aInputParams }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        success: function (msg) {
            var res = msg.d;
            if (res.iStatus == 1) {
                if (IsFunction(fnOnSuccess)) {
                    fnOnSuccess(res, oOnSuccessParams);
                }
                else {
                    HideProcessingOverLay();
                    DisplayMsg(iMsgManagerIndex, 'result', res.sMessage, res.sTitle, null, null);
                }
            }
            else if (res.iStatus == 301) {
                if (!IsEmpty(res.sRedirectUrl)) {
                    RedirectPage(res.sRedirectUrl);
                }
                else {
                    throw 'Error(JS): The redirect URL is missing.';
                }
            }
            else if (res.iStatus == 401) {
                HideProcessingOverLay();
                if (IsEmpty(res.sRedirectUrl)) {
                    DisplayMsg(iMsgManagerIndex, 'error', 'Your session has expired due to inactivity. Please refresh the browser.', 'Session Expired', null, null);
                }
                else {
                    DisplayMsg(iMsgManagerIndex, 'error', 'Your session has expired due to inactivity. Please click <a href="#" onclick="TopWindow().RedirectPage(\'' + res.sRedirectUrl + '\')" >here</a> to re-login.', 'Session Expired', null, null);
                }
            }
            else {
                if (IsFunction(fnOnFailure)) {
                    fnOnFailure(res.iStatus, res.sMessage, oOnFailureParams);
                }
                else {
                    HideProcessingOverLay();
                    DisplayMsg(iMsgManagerIndex, 'error', res.sMessage, res.sTitle, null, null);
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (IsFunction(fnOnFailure)) {
                fnOnFailure(999, XMLHttpRequest.responseText, oOnFailureParams);
            }
            else {
                HideProcessingOverLay();
                DisplayMsg(iMsgManagerIndex, 'error', XMLHttpRequest.responseText, 'Error', null, null);
            }
        }
    });
}



//--------------------------------------------------------------------------------------
// Other functions.
//--------------------------------------------------------------------------------------
function RedirectPage(newUrl) {
    window.location.href = newUrl;
    return false;
}




function SetSearchBox(oBox, sDefaultText) {
    if (oBox.length <= 0) return;
    if (sDefaultText.length <= 0) return;
    if (oBox.val() == "") {
        oBox.addClass("search-box-passive");
        oBox.val(sDefaultText);
    }
    oBox.focus(function (e) {
        $(this).removeClass("search-box-passive");
        if ($(this).val() == sDefaultText) $(this).val("");
    });
    oBox.blur(function (e) {
        if ($(this).val() == "") {
            $(this).addClass("search-box-passive");
            $(this).val(sDefaultText);
        }
    });
}

function SetSearchBox_by_ID(sId, sDefaultText) {
    return SetSearchBox($('#' + sId), sDefaultText);
}

function ConvertBytes(sVal) {
    return sVal;
}
function FormatBit(sVal, sTrueValue, sFalseValue) {
    if (IsEmpty(sVal)) return sVal;
    sVal = sVal + '';
    return sVal.stringToBoolean() ? sTrueValue : sFalseValue;
}
function FormatLongDesc(sVal, iMaxChars) {
    return sVal;
}

function AddQueryStringParam(sUrl, sName, sValue) {
    if (sUrl.indexOf('?') >= 0) {
        sUrl += '&' + sName + '=' + sValue;
    }
    else {
        sUrl += '?' + sName + '=' + sValue;
    }

    return sUrl;
}

function SetSelectCheckboxes(sChkAllID, sChkName) {
    $('#' + sChkAllID).click(function () { $('input:checkbox[name="' + sChkName + '"]').prop('checked', $(this).is(':checked')); $('input:checkbox[name="' + sChkName + '"]').trigger('change'); });

    $('input:checkbox[name="' + sChkName + '"]').click(function () {
        $('#' + sChkAllID).prop('checked', true);
        $('input:checkbox[name="' + sChkName + '"]').each(function () {
            if (!$(this).is(':checked')) {
                $('#' + sChkAllID).prop('checked', false);
                return;
            }
        });
    });

    $('#' + sChkAllID).prop('checked', true);
    $('input:checkbox[name="' + sChkName + '"]').each(function () {
        if (!$(this).is(':checked')) {
            $('#' + sChkAllID).prop('checked', false);
            return;
        }
    });
}

// Downloads file from the server.
// Parameters:
//      sUrl - The url of the file to be downloaded.
//      sTableID - The ID of the JQ data table.
function DownloadFile(sUrl, sTableID) {
    if (!IsEmpty(sTableID)) {
        var oInfo = GetTableObjectReferenceByID(sTableID);
        if (oInfo != null) {
            sUrl = AddQueryStringParam(sUrl, '_df', '1');
            sUrl = AddQueryStringParam(sUrl, 'iDisplayStart', '0');
            sUrl = AddQueryStringParam(sUrl, 'iDisplayLength', '-1');

            sUrl = AddQueryStringParam(sUrl, 'FilterCond', oInfo.sFilterCond);
            sUrl = AddQueryStringParam(sUrl, 'SortCond', oInfo.sSortCond);
            sUrl = AddQueryStringParam(sUrl, 'sFCritID', oInfo.sFCritID);
            sUrl = AddQueryStringParam(sUrl, 'sTableID', oInfo.sTableID);
            sUrl = AddQueryStringParam(sUrl, 'FromExport', 1);
        }
    }

    var iframe = $("#download_file");
    if (iframe.length <= 0) {
        iframe = $('<iframe id="download_file" style="display:none;"></iframe>').appendTo('body');
    }

    iframe.attr('src', sUrl);

    return false;
}

function AddJQTableFilterAndSortConditions(sUrl, sTableID) {

    if (!IsEmpty(sTableID)) {
        var oInfo = GetTableObjectReferenceByID(sTableID);

        if (oInfo != null) {
            sUrl = AddQueryStringParam(sUrl, 'FilterCond', oInfo.sFilterCond);
            sUrl = AddQueryStringParam(sUrl, 'SortCond', oInfo.sSortCond);
        }
    }

    return sUrl;
}

var oRepeaterParams = {};
function AddRepeaterParam(sClientID, iIndexID, ct, oOParams) {
    if (oRepeaterParams[sClientID + '-' + iIndexID] === undefined || oRepeaterParams[sClientID + '-' + iIndexID] == null) oRepeaterParams[sClientID + '-' + iIndexID] = [];
    oRepeaterParams[sClientID + '-' + iIndexID].push({ 'ct': ct, 'op': oOParams });
}

function LoadRepeater(sClientID, iMsgManagerIndex, aExtraParams, bDisplayOverlay) {
    var oTable = GetTable(sClientID);
    if (IsEmpty(iMsgManagerIndex)) iMsgManagerIndex = -1;
    if (IsEmpty(bDisplayOverlay)) bDisplayOverlay = false;

    var oParams = { 'sClientID': sClientID, 'iMsgManagerIndex': iMsgManagerIndex, 'bDisplayOverlay': bDisplayOverlay };

    var aInputParams = [];
    aInputParams.push({ 'name': '_rpt', 'value': 1 });
    aInputParams.push({ 'name': 'iDisplayStart', 'value': 0 });
    aInputParams.push({ 'name': 'iDisplayLength', 'value': 500 });

    if (IsArray(aExtraParams)) {
        $.each(aExtraParams, function () {
            aInputParams.push({ 'name': this.name, 'value': this.value });
        });
    }

    if (bDisplayOverlay == true) DisplayProcessingOverlay();

    SubmitAJAXGETRequest(oTable.sAjaxSource, aInputParams, oParams.iMsgManagerIndex, LoadRepeaterOnSuccess, oParams, LoadRepeaterOnFailure, oParams);

    return true;
}

function LoadRepeaterOnSuccess(oRes, oParams) {
    var bDisplayOverlay = oParams.bDisplayOverlay;
    var sID = oParams.sClientID;
    if (IsEmpty(sID)) {
        if (bDisplayOverlay) HideProcessingOverLay();
        return false;
    }

    var aaData = oRes.aaData;
    if (!IsArray(aaData)) {
        if (bDisplayOverlay) HideProcessingOverLay();
        return false;
    }

    var repBody = $('#' + sID + '_body');
    if (repBody.length <= 0) {
        if (bDisplayOverlay) HideProcessingOverLay();
        return false;
    }

    var itemTempl = $('#' + sID + '_tmpl');
    if (itemTempl.length <= 0) {
        if (bDisplayOverlay) HideProcessingOverLay();
        return false;
    }

    var sepTempl = $('#' + sID + '_sep');

    var oTable = GetTable(sID);
    var rowNo = 0;
    repBody.empty();

    var oNewRow, oElement, oNewSepTempl, aRepParams, sParamName;

    $.each(aaData, function (i, aRow) {
        if (sepTempl.length > 0 && rowNo > 0) {
            oNewSepTempl = sepTempl.clone().appendTo(repBody);
            oNewSepTempl.attr('id', oNewSepTempl.attr('id').replace('_sep', '') + '_sep_' + i);
            oNewSepTempl.show();
        }

        oNewRow = itemTempl.clone().appendTo(repBody);
        oNewRow.attr('id', oNewRow.attr('id').replace('_tmpl', '') + '_row_' + i);

        $.each(aRow, function (j, sCell) {
            aRepParams = oRepeaterParams[sID + '-' + j];
            if (aRepParams === undefined || aRepParams == null) return;

            $.each(aRepParams, function (k, oParam) {

                if (oParam.ct == 'label') {
                    oElement = $('.jq-rep-label-' + j, oNewRow);
                    if (oElement.length > 0) {
                        oElement.html(sCell);
                        $(oElement).each(function (index) {
                            $(this).attr('id', $(this).attr('id') + '_' + i + '_' + j + '_' + index);
                        });
                    }
                }
                else if (oParam.ct == 'text') {
                    oElement = $('.jq-rep-text-' + j, oNewRow);
                    if (oElement.length > 0) {
                        oElement.val(sCell);
                        $(oElement).each(function (index) {
                            $(this).attr('id', $(this).attr('id') + '_' + i + '_' + j + '_' + index);
                        });
                    }
                }
                else if (oParam.ct == 'a') {
                    if (oParam.op.pt == 'qstring') {
                        oElement = $('a.jq-rep-a-' + oParam.op.pn + j, oNewRow);
                        if (oElement.length > 0) {
                            $(oElement).each(function (index) {
                                $(this).attr('href', AddQueryStringParam($(this).attr('href'), oParam.op.pn, escape(sCell)));
                                $(this).attr('id', $(this).attr('id') + '_' + i + '_' + j + '_' + index);
                            });
                        }
                    }
                    else if (oParam.op.pt == 'value') {
                        oElement = $('a.jq-rep-a-' + j, oNewRow);
                        if (oElement.length > 0) {
                            oElement.html(sCell);
                            $(oElement).each(function (index) {
                                $(this).attr('id', $(this).attr('id') + '_' + i + '_' + j + '_' + index);
                            });
                        }
                    }
                }

            });
        });

        oNewRow.show();

        ++rowNo;
    });

    if (bDisplayOverlay) HideProcessingOverLay();

    return true;
}

function LoadRepeaterOnFailure(iStatus, sMessage, oParams) {
    var bDisplayOverlay = oParams.bDisplayOverlay;
    if (bDisplayOverlay) HideProcessingOverLay();

    DisplayMsg(oParams.iMsgManagerIndex, 'error', sMessage, 'Loading Failed', null, null);
};

function DeleteImage(thisObj, sImgID) {
    var oInfo = aCtrls[GetControlIndex(sImgID)];
    if (oInfo.oOtherProp.bDeleteImage && !IsEmpty(oInfo.oOtherProp.sImageName)) {
        oInfo.oOtherProp.sImageName = '';
        $('#' + sImgID).attr('src', oInfo.oOtherProp.sNoImageURL);
        $(thisObj).hide();
    }
}

$.fn.showControl = function () {
    $(this).removeClass('no-required');
    $(this).show();
}

$.fn.hideControl = function () {
    $(this).addClass('no-required');
    $(this).hide();
}

// Submits changes back to the server.
// Parameters:
//      iGroupID - The group ID of the controls. If you want to submit all controls (fields), then enter "-1".
//      aInputParams - The input parameters to passed in. This field is required if there is not field marked as primary key (PK).
//      iMsgManagerIndex - This is the idex of the message manager to display messages (errors).
//      bRunValidation - True/False. Make it True if you want to run the validation as well. Enter False if you want to skip the validation.
//      bDisplayOverlay - True/False. Make it True if you want to display the processing overlay (e.g., Processing...Please wait.).
//
//      fnOnSuccess - (Optional) The function to be executed if the submit process succeeds.
//      oOnSuccessParams - (Optional)The parameter to be passed to the "fnOnSuccess" function.
//      fnOnFailure - (Optional) The function to be executed if the submit process fails.
//      oOnFailureParams - (Optional)The parameter to be passed to the "fnOnFailure" function.
// Output: True - On success, False - On failure.
function ValidateAllControlsWithTables(iGroupID, aInputParams, iMsgManagerIndex, bRunValidation, bDisplayOverlay,
                        fnOnSuccess, oOnSuccessParams, fnOnFailure, oOnFailureParams) {

    try {
        if (IsEmpty(iGroupID)) iGroupID = -1;
        if (IsEmpty(iMsgManagerIndex)) iMsgManagerIndex = -1;
        if (IsEmpty(bRunValidation)) bRunValidation = true;
        if (IsEmpty(bDisplayOverlay)) bDisplayOverlay = true;

        iGroupID = parseInt(iGroupID);
        iMsgManagerIndex = parseInt(iMsgManagerIndex);

        if (iGroupID > -1) {
            if (aCtrlGroups[iGroupID].sWorkMode != 'A' && aCtrlGroups[iGroupID].sWorkMode != 'W') {
                throw 'Error(JS): You cannot submit changes for group #' + iGroupID + ' because this group is still in the read-only mode.';
            }
        }
        else {
            for (var iGroupID2 in aCtrlGroups) {
                if (aCtrlGroups[iGroupID2].sWorkMode != 'A' && aCtrlGroups[iGroupID2].sWorkMode != 'W') {
                    throw 'Error(JS): You cannot submit changes for group #' + iGroupID2 + ' because this group is still in the read-only mode.';
                }
            }
        }

        if (bRunValidation) {
            if (!ValidateAllControls(iGroupID, iMsgManagerIndex)) return false;
        }

        var oInfo;
        var sName, sValue;
        var aNames = [];
        var aInputParams2 = [];
        var aPKs = [];
        var counter = 0;
        var ipCounter = 0;
        var pkCounter = 0;
        var aGroups = {};

        if (IsArray(aInputParams)) {
            ipCounter = aInputParams.length;
            jQuery.each(aInputParams, function (i, val) {
                aInputParams2.push(val);
            });
        }

        var sSubmitHttpMethod = '';
        var sSubmitURL = '';

        if (iGroupID > -1) {
            sSubmitHttpMethod = aCtrlGroups[iGroupID].sSubmitHttpMethod;
            sSubmitURL = aCtrlGroups[iGroupID].sSubmitURL;
        }

        for (var index in aCtrls) {
            oInfo = aCtrls[index];

            if (!oInfo.bIsAJAXParam) {
                continue;
            }

            if (oInfo.sCtrlType == 'lbl') {
                continue;
            }

            if (!oInfo.bPK && iGroupID > -1 && oInfo.iGroupID != iGroupID) {
                continue;
            }

            if (IsEmpty(aCtrlGroups[oInfo.iGroupID].sSubmitHttpMethod)) {
                throw 'Error(JS): You cannot submit changes for group #' + oInfo.iGroupID + ' because it does not have the submit HTTP method.';
            }
            else if (IsEmpty(aCtrlGroups[oInfo.iGroupID].sSubmitURL)) {
                throw 'Error(JS): You cannot submit changes for group #' + oInfo.iGroupID + ' because it does not have the submit URL.';
            }

            if (IsEmpty(sSubmitHttpMethod)) sSubmitHttpMethod = aCtrlGroups[oInfo.iGroupID].sSubmitHttpMethod;
            if (IsEmpty(sSubmitURL)) sSubmitURL = aCtrlGroups[oInfo.iGroupID].sSubmitURL;

            if (iGroupID == -1) {
                if (sSubmitHttpMethod != aCtrlGroups[oInfo.iGroupID].sSubmitHttpMethod) {
                    throw 'Error(JS): You cannot submit changes for fields from different groups at once because they do not share the same submit HTTP method.';
                }
                else if (sSubmitURL != aCtrlGroups[oInfo.iGroupID].sSubmitURL) {
                    throw 'Error(JS): You cannot submit changes for fields from different groups at once because they do not share the same submit URL.';
                }
            }

            sName = oInfo.sCName;
            if (oInfo.sCtrlType == 'txt_auto') {
                if (!IsEmpty(oInfo.oOtherProp.sColumnNameValue)) {
                    sName = oInfo.oOtherProp.sColumnNameValue;
                }
            }

            sValue = GetValue(oInfo.sClientID, oInfo.sCtrlType, oInfo);

            if (oInfo.bPK) {
                aPKs.push(sName);
                aInputParams2.push({ 'name': 'pkf' + pkCounter, 'value': sValue });
                ++pkCounter;
            }
            else {
                aNames.push(sName);
                aInputParams2.push({ 'name': 'f' + counter, 'value': sValue });
                ++counter;
            }

            aGroups[oInfo.iGroupID] = 1;
        }

        var oTable, nNodes, oElement, aRowData, iRowID, oCol, oRow, bIsValid, bExitFunction;
        var aTables = [], aTablePKs = [], aTableOtherFields = [];
        bExitFunction = false;

        for (var index in aDT) {
            oInfo = aDT[index];
            if (oInfo.bIsAjaxParam && oInfo.sType == "jq-dt") {
                oTable = oInfo.oTable;
                nNodes = oTable.fnGetNodes();

                aTablePKs = oInfo.sPKFields.split('|');
                aTableOtherFields = oInfo.sOtherFields.split('|');

                if (aTablePKs.length == 0) throw 'Error(JS): You can not submit data from the datatable (' + oInfo.sTableID + ') because it dosn\'t have a primary key.';
                if (aTableOtherFields.length == 0) throw 'Error(JS): You can not submit data from the datatable (' + oInfo.sTableID + ') because it dosn\'t have fields to update.';

                iRowID = 0;

                $.each(nNodes, function () {
                    oRow = this;
                    aRowData = GetJDataTableRow($('td:first-child', oRow), index);

                    $.each(aTablePKs, function (i, cid) {
                        aInputParams2.push({ 'name': 'tf_' + index + '_' + iRowID + '_' + cid, 'value': aRowData[cid] });
                    });

                    $.each(aTableOtherFields, function (i, cid) {
                        if ($('.jt-ajax-param-' + cid, oRow).length > 0) {
                            oCol = $('.jt-ajax-param-' + cid, oRow);

                            if ($(oCol).hasClass('jt-ctrl-text')) {
                                if (bRunValidation) {
                                    ValidateControl($(oCol), null);
                                    bIsValid = IsPageValid(iMsgManagerIndex);
                                    if (!bIsValid) {
                                        bExitFunction = true;
                                        return false;
                                    }
                                }

                                sValue = $(oCol).val();
                            }
                            else if ($(oCol).hasClass('jt-ctrl-ddl')) {
                                if (bRunValidation) {
                                    ValidateControl($(oCol), null);
                                    bIsValid = IsPageValid(iMsgManagerIndex);
                                    if (!bIsValid) {
                                        bExitFunction = true;
                                        return;
                                    }
                                }

                                sValue = $(oCol).val();
                            }
                            else if ($(oCol).hasClass('jt-ctrl-chk')) {
                                sValue = $(oCol).is(':checked');
                            }

                            aInputParams2.push({ 'name': 'tf_' + index + '_' + iRowID + '_' + cid, 'value': sValue });
                        }
                    });

                    if (bExitFunction) return false;

                    ++iRowID;
                });

                aTables.push(oInfo.sTableID + '&' + aTablePKs.join(':') + '&' + aTableOtherFields.join(':') + '&' + iRowID + '&' + index);
            }
        }

        if (bExitFunction) return false;

        if (aNames.length == 0 && aPKs.length == 0 && aTables.length == 0) throw 'Error(JS): There is no field marked as primary key. You should either mark a field as PK or pass in some input parameters that will serve as primary key.';

        return true;
    }
    catch (err) {
        alert(err);
    }
};