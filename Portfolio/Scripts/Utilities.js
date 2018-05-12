

function getIEVersion()
    // Returns the version of Windows Internet Explorer or a -1
    // (indicating the use of another browser).
{
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}



var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

if (!Object.size) {
    Object.size = function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };
}

function ForceNumericInput(e, obj, allowDecimal, allowNegative) {
    var key;
    var isCtrl = false;
    var keychar;
    var reg;
    if (window.event) {
        key = e.keyCode;
        isCtrl = window.event.ctrlKey
    }
    else if (e.which) {
        key = e.which;
        isCtrl = e.ctrlKey;
    }

    if (isNaN(key)) return true;

    keychar = String.fromCharCode(key);

    // check for backspace or delete, or if Ctrl was pressed
    if (key == 8 || isCtrl) {
        return true;
    }

    reg = /\d/;
    var isFirstN = allowNegative ? keychar == '-' && obj.value.indexOf('-') == -1 : false;
    var isFirstD = allowDecimal ? keychar == '.' && obj.value.indexOf('.') == -1 : false;
    var isFirstC = allowDecimal ? keychar == ',' && obj.value.indexOf(',') == -1 : false;
    return isFirstN || isFirstD || isFirstC || reg.test(keychar);
}

function IsMeReadOnly(b) {
    var a = $(b);
    if (a.length <= 0) {
        return false
    }
    if (a.attr('readonly')) {
        return true
    }
    return false
}
function IsMeDisabled(b) {
    var a = $(b);
    if (a.length <= 0) {
        return false
    }
    if (a.is(':disabled')) {
        return true
    }
    return false
}


// Start - Prototype functions
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
    }
};

if (!String.prototype.ltrim) {
    String.prototype.ltrim = function () {
        return this.replace(/^\s+/, "");
    }
};

if (!String.prototype.rtrim) {
    String.prototype.rtrim = function () {
        return this.replace(/\s+$/, "");
    }
};

if (!String.prototype.removeDoubleSpaces) {
    String.prototype.removeDoubleSpaces = function () {
        return this.replace(/\s+/g, " ");
    }
};

if (!String.prototype.containsStr) {
    String.prototype.containsStr = function (str) {
        if (this.indexOf(str) >= 0) { return true; }
        else { return false; }
    }
};

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (str) {
        return this.indexOf(str) == 0;
    };
};

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.lastIndexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
};

if (!String.prototype.padLeft) {
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
};

if (!String.prototype.padRight) {
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
};

if (!String.prototype.stringToBoolean) {
    String.prototype.stringToBoolean = function () {
        switch (this.toLowerCase()) {
            case "true": case "yes": case "1": return true;
            case "false": case "no": case "0": case null: return false;
            default: return Boolean(this);
        }
    }
};

function String2Boolean(val) {
    val = val + '';
    return val.stringToBoolean();
}


Number.prototype.FormatNumber = function (decimals, add_commas) {
    var res = this.toFixed(parseInt(decimals));

    if (add_commas) {

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




String.prototype.parseDate = function (dateFormat) {
    if (IsEmpty(this)) return null;
    return moment(this, dateFormat).toDate();
}
function ParseDate(dateFormat, dateString) {
    if (IsEmpty(dateString)) return null;
    return moment(dateString, dateFormat).toDate();
}
Date.prototype.formatDate = function (dateFormat) {
    if (IsEmpty(this)) return null;
    return moment(this).format(dateFormat);
}
function FormatDate(dateFormat, dateObject) {
    if (IsEmpty(dateObject)) return null;
    return moment(dateObject).format(dateFormat);
}


//30/05/2013 01:22:59 AM
String.prototype.parseDateTime = function (dateFormat, timeFormat) {
    if (IsEmpty(this)) return null;
    return moment(this, (dateFormat + ' ' + timeFormat).trim()).toDate();
}
function ParseDateTime(dateFormat, timeFormat, dateTimeString) {
    if (IsEmpty(dateTimeString)) return null;
    return moment(dateTimeString, (dateFormat + ' ' + timeFormat).trim()).toDate();
}
Date.prototype.formatDateTime = function (dateFormat, timeFormat) {
    if (IsEmpty(this)) return null;
    return moment(this).format((dateFormat + ' ' + timeFormat).trim());
}
function FormatDateTime(dateFormat, timeFormat, dateTimeObject) {
    if (IsEmpty(dateTimeObject)) return null;
    return moment(dateTimeObject).format((dateFormat + ' ' + timeFormat).trim());
}

function FormatDateTime2(dateFormat, timeFormat, dateTimeObject) {
    if (IsEmpty(dateTimeObject)) return '';
    if (!(dateTimeObject instanceof Date) && !isNaN(dateTimeObject.valueOf())) return ''; // Check Is param value is date or not.

    dateTimeObject = new Date(dateTimeObject);

    if (!IsEmpty(dateFormat)) {

        var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        var longDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        /*
		|	symbol			|		Value						|
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			yyyy/YYYY				4 digit year
			yy/YY					2 digit year
			mmmm/MMMM				Long Months (Ex: January)
			mmm/MMM					Short Months (Ex: Jan)
			mm/MM					01 - 12
			m/M						1 - 12
			dd						01 - 31
			d						1 - 31
			DD						Long Days (Ex: Sunday)
			D						Short Days (Ex: Sun)
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		
		*/

        dateFormat = dateFormat.replace(/yyyy/i, dateTimeObject.getFullYear());
        dateFormat = dateFormat.replace(/yy/i, dateTimeObject.getFullYear().toString().slice(2));
        dateFormat = dateFormat.replace(/mmmm/i, longMonths[dateTimeObject.getMonth()]);
        dateFormat = dateFormat.replace(/mmm/i, shortMonths[dateTimeObject.getMonth()]);
        dateFormat = dateFormat.replace(/mm/i, (dateTimeObject.getMonth() + 1).toString().padLeft(2, '0'));
        dateFormat = dateFormat.replace(/m/i, (dateTimeObject.getMonth() + 1));
        dateFormat = dateFormat.replace('dd', (dateTimeObject.getDate()).toString().padLeft(2, '0'));
        dateFormat = dateFormat.replace('d', dateTimeObject.getDate());
        dateFormat = dateFormat.replace('DD', longDays[dateTimeObject.getDay()]);
        dateFormat = dateFormat.replace('D', shortDays[dateTimeObject.getDay()]);
    }

    if (!IsEmpty(timeFormat)) {
        /*
		|	symbol			|		Value									|
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			hh						12-hours format (00-11)
			h						12-hours format (0-11)
			HH						24-hours format (00-23)
			HH						24-hours format (0-23)
			mm						Minutes (00-59)
			m						Minutes (0-59)
			ss						Seconds (00-59)
			s						Seconds (0-59)
			sss						Milli Seconds (000-999)
			tt 						Lowercase 'am' and 'pm'
			t 						Lowercase short 'am' (a) and 'pm' (p)
			TT 						Uppercase AM and PM
			T 						Uppercase short AM (A) and PM (P)				
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		
		*/

        var hour = dateTimeObject.getHours();
        hour = hour <= 12 ? (hour == 0 ? 12 : hour) : hour - 12;

        timeFormat = timeFormat.replace('hh', hour.toString().padLeft(2, '0'));
        timeFormat = timeFormat.replace('h', hour);
        timeFormat = timeFormat.replace('HH', dateTimeObject.getHours().toString().padLeft(2, '0'));
        timeFormat = timeFormat.replace('H', dateTimeObject.getHours());
        timeFormat = timeFormat.replace('mm', dateTimeObject.getMinutes().toString().padLeft(2, '0'));
        timeFormat = timeFormat.replace('m', dateTimeObject.getMinutes());
        timeFormat = timeFormat.replace('ss', dateTimeObject.getSeconds().toString().padLeft(2, '0'));
        timeFormat = timeFormat.replace('s', dateTimeObject.getSeconds());
        timeFormat = timeFormat.replace('sss', dateTimeObject.getMilliseconds());
        timeFormat = timeFormat.replace('tt', (dateTimeObject.getHours() < 12 ? "am" : "pm"));
        timeFormat = timeFormat.replace('t', (dateTimeObject.getHours() < 12 ? "a" : "p"));
        timeFormat = timeFormat.replace('TT', (dateTimeObject.getHours() < 12 ? "AM" : "PM"));
        timeFormat = timeFormat.replace('T', (dateTimeObject.getHours() < 12 ? "A" : "P"));
    }

    return dateFormat + " " + timeFormat;

};

function ConvertDateTime2TimeObject(date) {
    return {
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        millisec: date.getMilliseconds(),
        timezone: date.getTimezoneOffset()
    }
}

String.prototype.parseTime = function (timeFormat) {
    if (IsEmpty(this)) return null;
    return moment(this, timeFormat).toDate();
}
function ParseTime(timeFormat, sTime) {
    if (IsEmpty(sTime)) return null;
    return moment(sTime, timeFormat).toDate();
}
Date.prototype.formatTime = function (timeFormat) {
    if (IsEmpty(this)) return null;
    return moment(this).format(timeFormat);
}
function FormatTime(timeFormat, dateObject) {
    if (IsEmpty(dateObject)) return null;
    return moment(dateObject).format(timeFormat);
}


function SanetizeDateTimes(aContent) {

    var obj;

    for (var i = 0; i < aContent.length; ++i) {
        if (IsEmpty(aContent[i].value)) continue;

        obj = $('#' + aContent[i].name);

        aContent[i].value = SanetizeDateTimeValue(obj, aContent[i].value);
    }

    return aContent;
}



function SanetizeDateTimeValue(obj, value) {

    var dateFormat, timeFormat, sysdateFormat, systimeFormat, date, dateTime, time, datetimeFormat, convertToUtc;

    var value2 = value;
    if (IsEmpty(value2)) return value2;


    if (obj.length > 0 && obj.hasClass('date')) {
        dateFormat = $(obj).data("date-format");
        sysdateFormat = $(obj).data("sysdate-format");

        if (!IsEmpty(sysdateFormat)) {
            date = ParseDate(dateFormat, value2);
            value2 = FormatDate(sysdateFormat, date);
        }
    }
    else if (obj.length > 0 && obj.hasClass('date-time')) {
        dateFormat = $(obj).data("date-format");
        timeFormat = $(obj).data("time-format");
        convertToUtc = COALESCE($(obj).data("convert-to-utc"), false);

        sysdateFormat = $(obj).data("sysdate-format");
        systimeFormat = $(obj).data("systime-format");

        if (!IsEmpty(sysdateFormat) || !IsEmpty(systimeFormat)) {

            if (IsEmpty(sysdateFormat)) {
                sysdateFormat = dateFormat;
            }
            if (IsEmpty(systimeFormat)) {
                systimeFormat = timeFormat;
            }

            dateTime = ParseDateTime(dateFormat, timeFormat, value2);

            if (convertToUtc == true) {
                dateTime = LocalTimeToUTC(dateTime);
            }

            value2 = FormatDateTime(sysdateFormat, systimeFormat, dateTime);
        }
        else {
            if (convertToUtc == true) {
                dateTime = ParseDateTime(dateFormat, timeFormat, value2);
                dateTime = LocalTimeToUTC(dateTime);
                //dateTime = new Date(dateTime.getUTCFullYear(), dateTime.getUTCMonth(), dateTime.getUTCDate(), dateTime.getUTCHours(), dateTime.getUTCMinutes(), dateTime.getUTCSeconds());
                value2 = FormatDateTime(dateFormat, timeFormat, dateTime);
            }
        }
    }
    else if (obj.length > 0 && obj.hasClass('time')) {
        dateFormat = $(obj).data("date-format");
        timeFormat = $(obj).data("time-format");

        sysdateFormat = $(obj).data("sysdate-format");
        systimeFormat = $(obj).data("systime-format");

        if (!IsEmpty(sysdateFormat) || !IsEmpty(systimeFormat)) {
            if (IsEmpty(sysdateFormat)) {
                sysdateFormat = dateFormat;
            }
            if (IsEmpty(systimeFormat)) {
                systimeFormat = timeFormat;
            }

            dateTime = ParseTime(timeFormat, value2);
            value2 = FormatDateTime(sysdateFormat, systimeFormat, dateTime);
        }
    }


    return value2;
}


function FormatBit(bValue, sTrueValue, sFalseValue) {
    if (bValue == null) return bValue;
    bValue = String(bValue).toLowerCase();

    if (bValue === 'true') {
        return sTrueValue;
    }
    else if (bValue === 'false') {
        return sFalseValue;
    }
    else {
        return bValue;
    }
}





function IsArray(obj) {
    return obj !== undefined && obj != null && obj instanceof Array;
};
function IsEmpty(obj) {
    return obj === undefined || obj == null || jQuery.trim(String(obj)).length == 0;
};
function COALESCE(obj, val) {
    if (IsEmpty(obj)) {
        return val;
    }
    else {
        return obj;
    }
}
function IsObject(obj) {
    return obj !== undefined && obj != null;
};
function IsFunction(obj) {
    return obj !== undefined && obj != null && typeof obj == 'function';
};

// End - Prototype functions







// START - Set/Read cookies
// Set a cookie through on client.
function setCookie(c_name, value, expiredays, path) {
    var path2 = ';path=' + (!IsEmpty(path) ? path : '/');
    var expires2 = '';
    if (!IsEmpty(expiredays) && expiredays != 0) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        expires2 = ';expires=' + exdate.toUTCString();
    }
    document.cookie = c_name + "=" + escape(value) + path2 + expires2;
}
// Read a cookie from client.
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}
// this deletes the cookie when called
function DeleteCookie(c_name, path) {
    var path2 = ';path=' + (!IsEmpty(path) ? path : '/');
    if (getCookie(c_name) != "") {
        document.cookie = c_name + "=" + "" + path2 + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
    }
}
// Compatibility for browsers that do not support localStorage.
if (!window.localStorage) {
    window.localStorage = {
        getItem: function (sKey) {
            if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
            return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
        },
        key: function (nKeyId) {
            return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
        },
        setItem: function (sKey, sValue) {
            if (!sKey) { return; }
            document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
            this.length = document.cookie.match(/\=/g).length;
        },
        length: 0,
        removeItem: function (sKey) {
            if (!sKey || !this.hasOwnProperty(sKey)) { return; }
            document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            this.length--;
        },
        hasOwnProperty: function (sKey) {
            return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        }
    };
    window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
}

function SetCache(key, data) {
    window.localStorage.setItem(key, data);
};
function GetCache(key) {
    return window.localStorage.getItem(key);
};
function DeleteCache(key) {
    window.localStorage.removeItem(key);
};



// END - Set/Read cookies



function ConvertBytes(bytes) {
    if (bytes == null || bytes == '') return bytes;
    var result = 0;
    if (bytes >= 1099511627776) {
        result = bytes / 1099511627776;
        return result.FormatNumber(1, true) + " TB";
    }
    else if (bytes >= 1073741824) {
        result = bytes / 1073741824;
        return result.FormatNumber(1, true) + " GB";
    }
    else if (bytes >= 1048576) {
        result = bytes / 1048576;
        return result.FormatNumber(1, true) + " MB";
    }
    else if (bytes >= 1024) {
        result = bytes / 1024;
        return result.FormatNumber(1, true) + " KB";
    }
    else if (bytes > 0) {
        result = parseInt(bytes);
        return result.FormatNumber(0, true) + " Bytes";
    }
    else {
        return result.FormatNumber(1, true);
    }
}



// Enable/Disable element.
function DisableDropDownList(sID, ddlDisable) {
    if (ddlDisable) {
        $('#' + sID).parent().find(".dropdown-toggle").removeAttr('data-toggle');
    }
    else {
        $('#' + sID).parent().find(".dropdown-toggle").attr('data-toggle', 'dropdown');
    }
}

// Enable/Disable dropdownlist.
function DisableElement_by_ID(sID, bDisable) {
    DisableElement($('#' + sID), bDisable);
}

function DisableElement(thisObj, bDisable) {
    if (bDisable) {
        $(thisObj).prop('disabled', true);
        $(thisObj).addClass('disabled-element');
    }
    else {
        $(thisObj).prop('disabled', false);
        $(thisObj).removeClass('disabled-element');
    }
}
function DisableElement2(thisObj, bDisable) {
    if (bDisable) {
        $(thisObj).prop('disabled', true);
    }
    else {
        $(thisObj).prop('disabled', false);
    }
}


function ReadOnlyElement(sID, bStatus) {
    return ReadOnlyElement2($('#' + sID), bStatus);
}
function ReadOnlyElement2(thisObj, bStatus) {
    var e = $(thisObj);
    if (e.is("select")) {
        $('#' + e.attr('id') + '_read_only').remove();
        if (bStatus) {
            //var txt = $('<input id="' + e.attr('id') + '_read_only" type="text" />').insertAfter(e);
            //txt.prop('readonly', true);
            //var txtClass = GetCtrlOtherOption(e.attr('id'), 'TxtCssClass');
            //if (!IsEmpty(txtClass)) {
            //    txt.addClass(txtClass);
            //}
            //else {
            //    txt.attr('class', e.attr('class'));
            //}
            //txt.addClass('readonly-element');
            //if (!IsEmpty(e.val())) txt.val($('option:selected', e).text());
            //e.hide();

            setTimeout(function () {
                $('div.bootstrap-select button[data-id="' + e.attr('id') + '"] + div.dropdown-menu').hide();
                $('div.bootstrap-select button[data-id="' + e.attr('id') + '"]').attr("tabindex", "-1");
            }, 250);
        }
        else {
            //e.show();
            $('div.bootstrap-select button[data-id="' + e.attr('id') + '"]').removeAttr("tabindex");
            $('div.bootstrap-select button[data-id="' + e.attr('id') + '"] + div.dropdown-menu').show();
        }
    }
    else {
        if (bStatus) {
            e.attr("tabindex", "-1");
            e.prop('readonly', true);
            e.addClass('readonly-element');
        }
        else {
            e.removeAttr("tabindex");
            e.prop('readonly', false);
            e.removeClass('readonly-element');
        }
    }
}

function DisplayContent(sID, bDisplay) {
    if (bDisplay) {
        $('#' + sID).show();
        $('#' + sID).css('visibility', 'visible');
    }
    else {
        $('#' + sID).hide();
        $('#' + sID).css('visibility', 'hidden');
    }
}




function SetSearchBox(oBox, sDefaultText, bIsAutocomplete, jqGo) {
    if (oBox.length <= 0) return;
    if (sDefaultText.length <= 0) return;
    if (IsEmpty(bIsAutocomplete)) bIsAutocomplete = false;
    if (oBox.val() == "") {
        oBox.addClass("search-box-passive");
        oBox.val(sDefaultText);
    }

    oBox.unbind('.SearchBox');

    oBox.bind('focus.SearchBox', function (e) {
        $(this).removeClass("search-box-passive");
        if ($(this).val() == sDefaultText) $(this).val("");
    });

    oBox.bind('blur.SearchBox', function (e) {
        if (bIsAutocomplete) {
            if (IsEmpty(GetTextBoxValue($(this)))) {
                $(this).addClass("search-box-passive");
                SetAutocompleteTextBoxValue($(this), '', sDefaultText);
            }
        }
        else {
            if (IsEmpty($(this).val())) {
                $(this).addClass("search-box-passive");
                $(this).val(sDefaultText);
            }
        }
    });

    if (jqGo) {
        oBox.bind('keypress.SearchBox', function (e) {
            if (e.keyCode == 13) {
                $(jqGo).trigger('click');
            }
        });
    }
}
function SetSearchBox_by_ID(sId, sDefaultText) {
    return SetSearchBox($('#' + sId), sDefaultText);
}



// Disable BackSpace key for a given input box.
function DisableBackSpace(id) {
    $('#' + id).keydown(function (event) {
        if (event.keyCode == '8') {
            event.preventDefault();
            return false;
        }
    }).keypress(function (event) {
        if (event.keyCode == '8') {
            event.preventDefault();
            return false;
        }
    });
}


function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}



function GetRelativeUrl(sUrl) {
    if (!IsEmpty(basePath) && sUrl.startsWith('~/')) {
        sUrl = sUrl.replace('~/', basePath);
    }
    return sUrl;
}


function AppendParamsToURL(sUrl, sParams) {
    return sUrl + (((/\?/.test(sUrl)) ? '&' : '?') + sParams);
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
function AddUniqueQueryStringParam(sUrl, sName, sValue) {
    var aArr = []
    aArr = ConvertQueryStringParamsToArray(sUrl, aArr)

    sUrl = UrlRemoveQueryStringParams(sUrl);

    var bParamIncluded = false;
    var sQSParams = '';

    for (var i = 0; i < aArr.length; i++) {
        var oParam = aArr[i];

        if (sQSParams != '') sQSParams += '&';

        if (aArr[i].name == sName) {
            sQSParams += sName + '=' + sValue;
            bParamIncluded = true;
        }
        else {
            sQSParams += aArr[i].name + '=' + aArr[i].value;
        }
    }

    if (!bParamIncluded) {
        if (sQSParams != '') sQSParams += '&';
        sQSParams += sName + '=' + sValue;
    }

    if (!IsEmpty(sQSParams)) sUrl += '?' + sQSParams

    return sUrl;
}

function UrlRemoveQueryStringParams(sUrl) {
    if (sUrl && sUrl.indexOf('?') >= 0) {
        sUrl = sUrl.substring(0, sUrl.indexOf('?'));
    }
    return sUrl;
}
function ConvertQueryStringParamsToArray(sUrl, aArr) {
    if (sUrl && sUrl.indexOf('?') >= 0) {
        if (!IsArray(aArr)) aArr = [];
        var sParams = sUrl.substring(sUrl.indexOf('?') + 1);
        var aParams = sParams.split('&');
        var aParams2;
        for (var i = 0; i < aParams.length; i++) {
            aParams2 = aParams[i].split('=');
            aArr.push({ 'name': aParams2[0], 'value': aParams2[1] });
        }
    }
    return aArr;
}

function GetQueryStringParamValue(sUrl, sName) {
    if (sUrl && sUrl.indexOf('?') >= 0) {
        var sParams = sUrl.substring(sUrl.indexOf('?') + 1);
        var aParams = sParams.split('&');
        var aParams2;
        for (var i = 0; i < aParams.length; i++) {
            aParams2 = aParams[i].split('=');
            if (aParams2[0] == sName) {
                return aParams2[1];
            }
        }
    }
    return null;
}

// Refreshes the current page.
function RefreshPage(status) {
    try {
        if (typeof window.MyRefreshPage == 'function') {
            MyRefreshPage(status);
        }
        else {
            window.location.replace(unescape(location.href).replace(/#$/g, ""));
        }
    }
    catch (err) {
        window.location.replace(unescape(location.href).replace(/#$/g, ""));
        //window.location.replace(unescape(window.location.pathname));
    }
}

// Redirect Page
function RedirectPage(newUrl) {
    window.location.href = newUrl;
    return false;
}

function CloseBrowserPage() {
    window.opener = self;
    window.close();
}


function TopWindow() {
    var win = self;
    while (win.parent != win) {
        win = win.parent;
    }
    return win;
}




function SortHashKeys(oInput) {
    var keys = [];
    for (var key in oInput) {
        keys.push(key);
    }
    keys.sort();

    return keys;
}


function getFunction(code, argNames) {
    var fn = window, parts = (code || "").split(".");
    while (fn && parts.length) {
        fn = fn[parts.shift()];
    }

    if (typeof (fn) === "function") {
        return fn;
    }

    argNames.push(code);
    return Function.constructor.apply(null, argNames);
}

function runFunction(fnName, args, args2, args3, args4, args5, args6) {
    if (typeof (fnName) === "function") {
        return fnName(args, args2, args3, args4, args5, args6);
    }

    var fn = window, parts = (fnName || "").split(".");
    while (fn && parts.length) {
        fn = fn[parts.shift()];
    }

    if (typeof (fn) === "function") {
        return fn(args, args2, args3, args4, args5, args6);
    }
    else {
        return null;
    }
}




function NewGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};


function GetUnmaskedNumericValue(thisObj, sValue) {
    if ($(thisObj).hasClass('inputmask') && String2Boolean(COALESCE($(thisObj).data('group'), false)) == true) {
        sValue = sValue.replace(new RegExp(COALESCE($(thisObj).data('group-separator'), ''), 'g'), '');
    }
    return sValue;
}

function LoadTree(id, url, params, dataValueField, dataTextField, OnSuccess, OnError) {
    SubmitGETAJAXRequest(
            url,
            params,
            function (data, xhr) {
                html = "<option value=''></option>";
                $(data).each(function () {
                    html += "<option value='" + this[dataValueField] + "'>" + this[dataTextField] + "</option>";
                });
                $('#' + id).html(html);
                //$('#' + id).selectpicker('refresh');
            },
            function (data) {
                if (OnError != null && jQuery.isFunction(OnError)) {
                    OnError(data);
                }
                else {
                    DisplayMsg(data.ErrorMessage, 'error', 'Error: ' + data.ErrorStatus, null, { MsgDialogMode: 'popup' });
                }
            },
            null
        );
};

var ddlDefaultOpetions = {
    hasEmptyOption: true
};

function LoadDropDown(id, url, params, includeGroups, dataValueField, dataTextField, dataGroupField, OnSuccess, OnError, oOptions) {
    oOptions = (oOptions) ? oOptions : {};
    var oOptions2 = $.extend({}, oOptions);
    oOptions = $.extend({}, ddlDefaultOpetions, oOptions);

    var includeGroups = includeGroups || false;

    SubmitGETAJAXRequest(
            url,
            params,
            function (data, xhr) {
                if (includeGroups === true) {
                    var currentGroup = "";
                    var html = "<optgroup label=''><option value=''></option></optgroup>";
                    $(data).each(function () {
                        var text = this[dataTextField];
                        var value = this[dataValueField];
                        var group = this[dataGroupField];

                        if (group !== currentGroup) {
                            if (currentGroup !== "") {
                                html += "</optgroup>";
                            }
                            currentGroup = group;
                            html += "<optgroup label='" + group + "'>";
                        }
                        html += ("<option value='" + value + "'>" + text + "</option>");
                    });
                    html += "</optgroup>";
                }
                else {

                    if (oOptions.hasEmptyOption == true) {
                        html = "<option value=''></option>";
                    }

                    $(data).each(function () {
                        html += "<option value='" + this[dataValueField] + "'>" + this[dataTextField] + "</option>";
                    });
                }

                var ddl = (id instanceof jQuery || id instanceof HTMLElement) ? $(id) : $('#' + id);

                ddl.html(html);
                ddl.selectpicker('refresh');

                if (OnSuccess != null && jQuery.isFunction(OnSuccess)) {
                    OnSuccess();
                }
            },
            function (data) {
                if (OnError != null && jQuery.isFunction(OnError)) {
                    OnError(data);
                }
                else {
                    DisplayMsg(data.ErrorMessage, 'error', 'Error: ' + data.ErrorStatus, null, { MsgDialogMode: 'popup' });
                }
            },
            null
        );
};

/*
Return the element within the same dialog window as thisObj.
This is important when you have two elements with the same name: one in parent window and the second one in dialog window.
*/
function GetElementWithinWindow(thisObj, id) {
    var dlgIndx = GetMyDialogIndex(thisObj);
    if (!IsEmpty(dlgIndx)) {
        return $('#' + dlgIndx).find(id);
    }
    else {
        return $(id);
    }
}
function GetElementWithinWindowByIndex(dlgIndx, id) {
    if (!IsEmpty(dlgIndx)) {
        return $('#' + dlgIndx).find(id);
    }
    else {
        return $(id);
    }
}

function SetDDLValue(id, value) {
    var ddl = (id instanceof jQuery || id instanceof HTMLElement) ? $(id) : $('#' + id);
    ddl.val(value);
    ddl.selectpicker('refresh');
}
function EmptyDDL(id) {
    var ddl = (id instanceof jQuery || id instanceof HTMLElement) ? $(id) : $('#' + id);
    ddl.empty();
    ddl.selectpicker('refresh');
}


var dateISO = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.,]\d+)?Z/i;
var dateNet = /\/Date\((\d+)(?:-\d+)?\)\//i;
var dateNumeric = /\d+/i;

function ConvertJSONToDateTime(d) {
    if (IsEmpty(d)) return null;
    if (d instanceof Date) return d;

    //EnterLog('LOG (utilities_ui.js): ConvertJSONToDateTime (d2: ' + d + ')');
    //return new Date(parseInt(d.replace(/[^0-9 +]/g, '')));

    if (dateISO.test(d)) {
        //EnterLog('LOG (utilities_ui.js): ConvertJSONToDateTime (ISO: ' + d + ')');
        return new Date(d);
    }

    if (dateNet.test(d)) {
        //EnterLog('LOG (utilities_ui.js): ConvertJSONToDateTime (NET: ' + d + ')');
        return new Date(parseInt(dateNet.exec(d)[1], 10));
    }

    if (dateNumeric.test(d)) {
        //EnterLog('LOG (utilities_ui.js): ConvertJSONToDateTime (Numeric: ' + d + ')');
        return new Date(parseInt(d));
    }

    //EnterLog('LOG (utilities_ui.js): ConvertJSONToDateTime (NULL: ' + d + ')');

    return null;
};
function UTCToLocalTime(d) {

    //EnterLog('LOG (utilities_ui.js): UTCToLocalTime (d0: ' + d + ')');

    if (IsEmpty(d)) return '';

    //EnterLog('LOG (utilities_ui.js): UTCToLocalTime (d0: ' + d + ')');

    if (!(d instanceof Date)) d = ConvertJSONToDateTime(d);

    if (IsEmpty(d)) return null;

    //EnterLog('LOG (utilities_ui.js): UTCToLocalTime (d2: ' + d + ')');

    var timeOffsetInMinues = (GetUTCToLocalTimeDifference());

    //EnterLog('LOG (utilities_ui.js): UTCToLocalTime (timeOffsetInMinues: ' + timeOffsetInMinues + ')');
    d.setMinutes(d.getMinutes() + timeOffsetInMinues);

    //EnterLog('LOG (utilities_ui.js): UTCToLocalTime (d4: ' + d + ')');
    return d;
};
function LocalTimeToUTC(d) {

    //EnterLog('LOG (utilities_ui.js): LocalTimeToUTC (d0: ' + d + ')');

    if (IsEmpty(d)) return '';

    //EnterLog('LOG (utilities_ui.js): LocalTimeToUTC (d0: ' + d + ')');

    if (!(d instanceof Date)) d = ConvertJSONToDateTime(d);

    if (IsEmpty(d)) return null;

    //EnterLog('LOG (utilities_ui.js): LocalTimeToUTC (d2: ' + d + ')');

    var timeOffsetInMinues = (GetUTCToLocalTimeDifference());

    //EnterLog('LOG (utilities_ui.js): LocalTimeToUTC (timeOffsetInMinues: ' + timeOffsetInMinues + ')');
    d.setMinutes(d.getMinutes() - timeOffsetInMinues);

    //EnterLog('LOG (utilities_ui.js): LocalTimeToUTC (d4: ' + d + ')');
    return d;
};

// Returns the time difference in minutes.
function GetUTCToLocalTimeDifference() {
    return -(new Date()).getTimezoneOffset();
};


function OpenUrlWithConfirmation(url, target, message, title) {
    DisplayConfirmation(message, title, '', function () {
        window.open(url, target);
    }, '', null, null);

    return false;
};



function IsTexboxNumeric(d, b, m, j, k, e, g, f) {
    var h = GetControl(d, b);
    if (h.length == 0) {
        return false
    }
    if (h.val().trim().length == 0) {
        return true
    }
    if (bSkipMessages) {
        h.removeClass('yellow-background')
    }
    var a = h.val().trim().replace(/\,/g, '');
    var l = true;
    if (l && !IsNumber(a)) {
        l = false
    }
    if (l && !j && !IsInteger(a)) {
        l = false
    }
    if (l && !k && !IsPositiveNumberOrZero(a)) {
        l = false
    }
    if (l && !e && (parseInt(a) == 0)) {
        l = false
    }
    if (!l) {
        _AddErrorMsg(h, m, g, f, bDisplayAllErrors)
    }
    return l
}

function DisableElementsInContainer(containerID, bDisable) {
    var $container = $('#' + containerID);
    if ($container.length == 0) return;
    var $elements = $container.find('input, select, textarea, div.jq-file-upload').not('input[type=hidden],.skip-disable-elements');
    if ($elements.length == 0) return;
    $elements.each(function () {
        var $el = $(this);
        if (!IsEmpty($el.attr('id'))) {
            if ($el.attr('id').startsWith('bootstrap-duallistbox-nonselected-list') || $el.attr('id').startsWith('bootstrap-duallistbox-selected-list')) return;
        }
        else { return; }
        if ($el.attr('type') == 'radio' || $el.attr('type') == 'checkbox') {
            $el.prop('disabled', bDisable);
        }
        else if ($el.hasClass('bs-select')) {
            $el.prop('disabled', bDisable);
            $el.selectpicker('refresh');
        }
        else if ($el.hasClass('date-time') || $el.hasClass('date') || $el.hasClass('time')) {
            $el.prop('disabled', bDisable);
            if (bDisable) {
                $el.next('span.add-on').hide();
                $el.parent().filter('.input-group').removeClass('input-group').addClass('input-group1');
            }
            else {
                $el.next('span.add-on').show();
                $el.parent().filter('.input-group1').removeClass('input-group1').addClass('input-group');
            }
        }
        else {
            $el.prop('disabled', bDisable);
        }
    });
    if (bDisable) {
        $('#btnConfirm').hide();
    } else {
        $('#btnConfirm').show();
    }
};


/*
Sets the value of drop down lists.
*/
function SetDropDownValue(thisObj, value) {
    $(thisObj).val(value);

    if ($(thisObj).hasClass('bs-select')) {
        $(thisObj).selectpicker('render');
    }
};


/*
Sets the value of drop down lists. If the value does not exist, it adds it.
*/
function SetOrAddDropDownValue(thisObj, value, text) {
    var autoComplete = $(thisObj).data("auto-complete");

    var elementExists = $(thisObj).find('option[value="' + value + '"]').length > 0;

    if (autoComplete == true && !elementExists) {
        $(thisObj).append($("<option></option>").attr("value", value).text(text));
        elementExists = true;
    }

    if (elementExists) {
        SetDropDownValue(thisObj, text);
    }
};


/*
Sets the value of checkboxes.
*/
function SetCheckboxValue(thisObj, value) {

    if ($(thisObj).hasClass('bs-checkbox')) {
        if (value == true || String2Boolean(value) == true) {
            if (!$(thisObj).is(':checked')) {
                $(thisObj).checkbox('click');
            }
        }
        else {
            if ($(thisObj).is(':checked')) {
                $(thisObj).checkbox('click');
            }
        }
    }
    else {
        $(thisObj).prop('checked', (value == true || String2Boolean(value) == true));
    }

};



/*
Sets the value of only auto-complete fields.
*/
function SetAutocompleteTextBoxValue(thisObj, value, text) {
    var type = $(thisObj).attr('type');

    if ($(thisObj).hasClass('autocomplete')) {

        var listHasValue = false;
        var list = $(thisObj).data('list');

        var valuecontrolid = $(thisObj).data('valuecontrolid');

        if (!IsEmpty(valuecontrolid)) {
            if ($.isArray(list)) {
                listHasValue = list.indexOf(text) > -1;
            }

            if (listHasValue == false) {
                list = [];
                if (!IsEmpty(text)) {
                    list.push(text);
                }
                $(thisObj).data('list', list);
            }

            $('#' + valuecontrolid).val(value);
            $(thisObj).val(text);

            if (IsEmpty(text)) {
                $(thisObj).data('empty', '1');
            }
            else {
                $(thisObj).data('empty', '');
            }
        }
        else {
            if ($.isArray(list)) {
                listHasValue = list.indexOf(value) > -1;
            }

            if (listHasValue == false) {
                list = [];
                list.push(value);
                $(thisObj).data('list', list);
            }

            $(thisObj).val(value);

            if (IsEmpty(value)) {
                $(thisObj).data('empty', '1');
            }
            else {
                $(thisObj).data('empty', '');
            }
        }

    }
    else if ($(thisObj).hasClass('bs-select') && $(thisObj).data("auto-complete") == true) {
        SetOrAddDropDownValue(thisObj, value, text);
    }
    else {
        $(thisObj).val(value);
    }

}

/*
Sets the value of any element.
*/
function SetElementValue(thisObj, value, text) {

    var type = $(thisObj).attr('type');

    if ($(thisObj).hasClass('autocomplete') || $(thisObj).data("auto-complete") == true) {
        SetAutocompleteTextBoxValue(thisObj, value, text);
    }
    else if ($(thisObj).hasClass('bs-select') || $(thisObj).is('select')) {
        SetDropDownValue(thisObj, value);
    }
    else if (type == 'checkbox') {
        SetCheckboxValue(thisObj, value);
    }
    else if (type == 'radio') {
        $(thisObj).prop('checked', sValue);
    }
    else {
        $(thisObj).val(value);
    }

};




/*
Gets the value of any element. It returns an object with two propertiesL: value and text
*/
function GetElementValue(thisObj) {

    var type = $(thisObj).attr('type');

    if ($(thisObj).hasClass('autocomplete')) {
        var valuecontrolid = $(thisObj).data('valuecontrolid');

        if (!IsEmpty(valuecontrolid)) {
            return { value: $('#' + valuecontrolid).val(), text: $(thisObj).val() };
        }
        else {
            return {
                value: $(thisObj).val(), text: $(thisObj).val()
            };
        }
    }
    else if ($(thisObj).hasClass('bs-select') || $(thisObj).is('select')) {
        return { value: $(thisObj).val(), text: $(thisObj).find("option:selected").text() };
    }
    else if (type == 'checkbox') {
        return { value: $(thisObj).is(':checked'), text: $(thisObj).is(':checked') };
    }
    else if (type == 'radio') {
        return { value: $(thisObj).is(':checked'), text: $(thisObj).is(':checked') };
    }
    else {
        return { value: $(thisObj).val(), text: $(thisObj).val() };
    }

}


function ShowLogOnScreen(logMessage) {
    var msg = $('#TempLogMsg');
    if (msg.length == 0) {
        msg = $('<div id="TempLogMsg"></div>').appendTo('body');
    }
    else {
        //msg.append('<hr />');
    }
    
    msg.append('<div>' + logMessage + '</div>');
}
