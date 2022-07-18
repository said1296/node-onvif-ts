"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnvifServiceDevice = void 0;
var soap_1 = require("./soap");
var service_base_1 = require("./service-base");
var OnvifServiceDevice = /** @class */ (function (_super) {
    __extends(OnvifServiceDevice, _super);
    function OnvifServiceDevice(configs) {
        var _this = _super.call(this, configs) || this;
        _this.namespaceAttrList = [
            'xmlns:tds="http://www.onvif.org/ver10/device/wsdl"',
            'xmlns:tt="http://www.onvif.org/ver10/schema"'
        ];
        return _this;
    }
    OnvifServiceDevice.prototype.getTimeDiff = function () {
        return this.timeDiff;
    };
    OnvifServiceDevice.prototype.fixTimeDiff = function (date) {
        if (date) {
            var deviceTime = date.getTime();
            var myTime = (new Date()).getTime();
            this.timeDiff = deviceTime - myTime;
        }
    };
    OnvifServiceDevice.prototype.getCapabilities = function () {
        var soapBody = '';
        soapBody += '<tds:GetCapabilities>';
        soapBody += '  <tds:Category>All</tds:Category>';
        soapBody += '</tds:GetCapabilities>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetCapabilities', soap);
    };
    OnvifServiceDevice.prototype.getWsdlUrl = function () {
        var soapBody = '<tds:GetWsdlUrl/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetWsdlUrl', soap);
    };
    OnvifServiceDevice.prototype.getDiscoveryMode = function () {
        var soapBody = '<tds:GetDiscoveryMode/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetDiscoveryMode', soap);
    };
    OnvifServiceDevice.prototype.getScopes = function () {
        var soapBody = '<tds:GetScopes/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetScopes', soap);
    };
    OnvifServiceDevice.prototype.setScopes = function (params) {
        var soapBody = '<tds:SetScopes>';
        params.Scopes.forEach(function (s) {
            soapBody += '<tds:Scopes>' + s + '</tds:Scopes>';
        });
        soapBody += '</tds:SetScopes>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'SetScopes', soap);
    };
    OnvifServiceDevice.prototype.addScopes = function (params) {
        var soapBody = '<tds:AddScopes>';
        params.Scopes.forEach(function (s) {
            soapBody += '<tds:ScopeItem>' + s + '</tds:ScopeItem>';
        });
        soapBody += '</tds:AddScopes>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'AddScopes', soap);
    };
    OnvifServiceDevice.prototype.removeScopes = function (params) {
        var soapBody = '<tds:RemoveScopes>';
        params.Scopes.forEach(function (s) {
            soapBody += '<tds:ScopeItem>' + s + '</tds:ScopeItem>';
        });
        soapBody += '</tds:RemoveScopes>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'RemoveScopes', soap);
    };
    OnvifServiceDevice.prototype.getHostname = function () {
        var soapBody = '<tds:GetHostname/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetHostname', soap);
    };
    OnvifServiceDevice.prototype.setHostname = function (params) {
        var soapBody = '<tds:SetHostname>';
        soapBody += '<tds:Name>' + params.Name + '</tds:Name>';
        soapBody += '</tds:SetHostname>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'SetHostname', soap);
    };
    OnvifServiceDevice.prototype.getDNS = function () {
        var soapBody = '<tds:GetDNS/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetDNS', soap).then(function (result) {
            var di = result.data.DNSInformation;
            if (!di.SearchDomain) {
                di.SearchDomain = [];
            }
            else if (!Array.isArray(di.SearchDomain)) {
                di.SearchDomain = [di.SearchDomain];
            }
            if (!di.DNSManual) {
                di.DNSManual = [];
            }
            else if (!Array.isArray(di.DNSManual)) {
                di.DNSManual = [di.DNSManual];
            }
            return result;
        });
    };
    OnvifServiceDevice.prototype.setDNS = function (params) {
        var soapBody = '<tds:SetDNS>';
        if (params.FromDHCP) {
            soapBody += "<tds:FromDHCP>" + params.FromDHCP + "</tds:FromDHCP>";
        }
        if (params.SearchDomain) {
            params.SearchDomain.forEach(function (s) {
                soapBody += "<tds:SearchDomain>" + s + "</tds:SearchDomain>";
            });
        }
        if (params.DNSManual) {
            soapBody += '<tds:DNSManual>';
            params.DNSManual.forEach(function (o) {
                soapBody += "<tt:Type>" + o.Type + "</tt:Type>";
                if (o.Type === 'IPv4') {
                    soapBody += '<tt:IPv4Address>' + o.IPv4Address + '</tt:IPv4Address>';
                }
                else {
                    soapBody += '<tt:IPv6Address>' + o.IPv6Address + '</tt:IPv6Address>';
                }
            });
            soapBody += '</tds:DNSManual>';
        }
        soapBody += '</tds:SetDNS>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'SetDNS', soap);
    };
    OnvifServiceDevice.prototype.getNetworkInterfaces = function () {
        var soapBody = '<tds:GetNetworkInterfaces/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetNetworkInterfaces', soap);
    };
    OnvifServiceDevice.prototype.getNetworkProtocols = function () {
        var soapBody = '<tds:GetNetworkProtocols/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetNetworkProtocols', soap);
    };
    OnvifServiceDevice.prototype.setNetworkProtocols = function (params) {
        var soapBody = '';
        soapBody += '<tds:SetNetworkProtocols>';
        params.NetworkProtocols.forEach(function (o) {
            soapBody += '<tds:NetworkProtocols>';
            soapBody += "<tt:Name>" + o.Name + "</tt:Name>";
            if ('Enabled' in o) {
                soapBody += "<tt:Enabled>" + o.Enabled + "</tt:Enabled>";
            }
            if ('Port' in o) {
                soapBody += "<tt:Port>" + o.Port + "</tt:Port>";
            }
            soapBody += '</tds:NetworkProtocols>';
        });
        soapBody += '</tds:SetNetworkProtocols>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'SetNetworkProtocols', soap);
    };
    OnvifServiceDevice.prototype.getNetworkDefaultGateway = function () {
        var soapBody = '<tds:GetNetworkDefaultGateway/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetNetworkDefaultGateway', soap);
    };
    OnvifServiceDevice.prototype.setNetworkDefaultGateway = function (params) {
        var soapBody = '<tds:SetNetworkDefaultGateway>';
        params.NetworkGateway.forEach(function (o) {
            if ('IPv4Address' in o) {
                soapBody += "<tds:IPv4Address>" + o.IPv4Address + "</tds:IPv4Address>";
            }
            else if ('IPv6Address' in o) {
                soapBody += "<tds:IPv6Address>" + o.IPv6Address + "</tds:IPv6Address>";
            }
        });
        soapBody += '</tds:SetNetworkDefaultGateway>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'SetNetworkDefaultGateway', soap);
    };
    OnvifServiceDevice.prototype.getDeviceInformation = function () {
        var soapBody = '<tds:GetDeviceInformation/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetDeviceInformation', soap);
    };
    OnvifServiceDevice.prototype.getSystemDateAndTime = function () {
        var _this = this;
        var soapBody = '<tds:GetSystemDateAndTime/>';
        return new Promise(function (resolve, reject) {
            var soap = _this.createRequestSoap(soapBody, true);
            soap_1.requestCommand(_this.oxaddr, 'GetSystemDateAndTime', soap)
                .then(function (result) {
                var parsed = parseGetSystemDateAndTime(result.converted);
                _this.fixTimeDiff(parsed === null || parsed === void 0 ? void 0 : parsed.date);
                return resolve(result);
            })
                .catch(function (error) {
                var newSoap = _this.createRequestSoap(soapBody);
                soap_1.requestCommand(_this.oxaddr, 'GetSystemDateAndTime', newSoap)
                    .then(function (result) {
                    var parsed = parseGetSystemDateAndTime(result.converted);
                    _this.fixTimeDiff(parsed === null || parsed === void 0 ? void 0 : parsed.date);
                    return resolve(result);
                })
                    .catch(function (err) { return reject(err); });
            });
        });
    };
    OnvifServiceDevice.prototype.setSystemDateAndTime = function (params) {
        if (!params.TimeZone.match(/^[A-Z]{3}\-?\d{1,2}([A-Z]{3,4})?$/)) {
            return Promise.reject(new Error('The "TimeZone" property must be a string representing a time zone which is defined in POSIX 1003.1.'));
        }
        var soapBody = '';
        soapBody += '<tds:SetSystemDateAndTime>';
        soapBody += '<tds:DateTimeType>' + params.DateTimeType + '</tds:DateTimeType>';
        soapBody += '<tds:DaylightSavings>' + params.DaylightSavings + '</tds:DaylightSavings>';
        if (params.TimeZone) {
            soapBody += '<tds:TimeZone>';
            soapBody += '<tt:TZ>' + params.TimeZone + '</tt:TZ>';
            soapBody += '</tds:TimeZone>';
        }
        if (params.UTCDateTime) {
            var dt = params.UTCDateTime;
            soapBody += '<tds:UTCDateTime>';
            soapBody += '<tt:Time>';
            soapBody += '<tt:Hour>' + dt.getUTCHours() + '</tt:Hour>';
            soapBody += '<tt:Minute>' + dt.getUTCMinutes() + '</tt:Minute>';
            soapBody += '<tt:Second>' + dt.getUTCSeconds() + '</tt:Second>';
            soapBody += '</tt:Time>';
            soapBody += '<tt:Date>';
            soapBody += '<tt:Year>' + dt.getUTCFullYear() + '</tt:Year>';
            soapBody += '<tt:Month>' + (dt.getUTCMonth() + 1) + '</tt:Month>';
            soapBody += '<tt:Day>' + dt.getUTCDate() + '</tt:Day>';
            soapBody += '</tt:Date>';
            soapBody += '</tds:UTCDateTime>';
        }
        soapBody += '</tds:SetSystemDateAndTime>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'SetSystemDateAndTime', soap);
    };
    OnvifServiceDevice.prototype.reboot = function () {
        var soapBody = '<tds:SytemReboot/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'SystemReboot', soap);
    };
    OnvifServiceDevice.prototype.getUsers = function () {
        var soapBody = '<tds:GetUsers/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetUsers', soap).then(function (result) {
            var _a, _b;
            var d = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.GetUsersResponse) === null || _b === void 0 ? void 0 : _b.User;
            if (d && !Array.isArray(d)) {
                result.data.GetUsersResponse.User = [d];
            }
            return result;
        });
    };
    OnvifServiceDevice.prototype.createUser = function (params) {
        var soapBody = '<tds:CreateUsers>';
        params.User.forEach(function (u) {
            soapBody += '<tds:User>';
            soapBody += "<tt:Username>" + u.Username + "</tt:Username>";
            soapBody += "<tt:Password>" + u.Password + "</tt:Password>";
            soapBody += "<tt:UserLevel>" + u.UserLevel + "</tt:UserLevel>";
            soapBody += '</tds:User>';
        });
        soapBody += '</tds:CreateUsers>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'CreateUsers', soap);
    };
    OnvifServiceDevice.prototype.deleteUser = function (params) {
        var soapBody = '<tds:DeleteUsers>';
        params.User.forEach(function (u) {
            soapBody += "<tds:Username>" + u.Username + "</tds:Username>";
        });
        soapBody += '</tds:DeleteUsers>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'DeleteUsers', soap);
    };
    OnvifServiceDevice.prototype.setUser = function (params) {
        var soapBody = '<tds:SetUser>';
        params.User.forEach(function (u) {
            soapBody += '<tds:User>';
            soapBody += "<tt:Username>" + u.Username + "</tt:Username>";
            if (u.Password) {
                soapBody += "<tt:Password>" + u.Password + "</tt:Password>";
            }
            soapBody += "<tt:UserLevel>" + u.UserLevel + "<tt:UserLevel>";
            soapBody += '</tds:User>';
        });
        soapBody += '</tds:SetUser>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'SetUser', soap);
    };
    OnvifServiceDevice.prototype.getRelayOutputs = function () {
        var soapBody = '<tds:GetRelayOutputs/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetRelayOutputs', soap);
    };
    OnvifServiceDevice.prototype.getNTP = function () {
        var soapBody = '<tds:GetNTP/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetNTP', soap);
    };
    OnvifServiceDevice.prototype.setNTP = function (params) {
        var soapBody = '<tds:SetNTP>';
        soapBody += "<tds:FromDHCP>" + params.FromDHCP + "</tds:FromDHCP>";
        if (params.NTPManual) {
            var manual = params.NTPManual;
            soapBody += '<tds:NTPManual>';
            soapBody += "<tt:Type>" + manual.Type + "</tt:Type>";
            if (manual.Type === 'IPv4') {
                soapBody += "<tt:IPv4Address>" + manual.IPv4Address + "</tt:IPv4Address>";
            }
            else if (manual.Type === 'IPv6') {
                soapBody += "<tt:IPv6Address>" + manual.IPv6Address + "</tt:IPv6Address>";
            }
            else {
                soapBody += "<tt:DNS>" + manual.DNS + "</tt:DNS>";
            }
            soapBody += '</tds:NTPManual>';
        }
        soapBody += '</tds:SetNTP>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'SetNTP', soap);
    };
    OnvifServiceDevice.prototype.getDynamicDNS = function () {
        var soapBody = '<tds:GetDynamicDNS/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetDynamicDNS', soap);
    };
    OnvifServiceDevice.prototype.getZeroConfiguration = function () {
        var soapBody = '<tds:GetZeroConfiguration/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetZeroConfiguration', soap);
    };
    OnvifServiceDevice.prototype.getIPAddressFilter = function () {
        var soapBody = '<tds:GetIPAddressFilter/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetIPAddressFilter', soap);
    };
    OnvifServiceDevice.prototype.setIPAddressFilter = function (params) {
        params.IPv4Address.forEach(function (e) {
            if (!e.Address.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
                return Promise.reject(new Error('The "Address" property was invalid as a IPv4 address.'));
            }
        });
        var soapBody = '';
        soapBody += '<tds:SetIPAddressFilter>';
        soapBody += '<tds:IPAddressFilter>';
        soapBody += '<tt:Type>' + params.Type + '</tt:Type>';
        params.IPv4Address.forEach(function (o) {
            soapBody += '<tt:IPv4Address>';
            soapBody += '<tt:Address>' + o.Address + '</tt:Address>';
            soapBody += '<tt:PrefixLength>' + o.PrefixLength + '</tt:PrefixLength>';
            soapBody += '</tt:IPv4Address>';
        });
        soapBody += '</tds:IPAddressFilter>';
        soapBody += '</tds:SetIPAddressFilter>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'SetIPAddressFilter', soap);
    };
    OnvifServiceDevice.prototype.getServices = function (params) {
        var soapBody = '';
        soapBody += '<tds:GetServices>';
        soapBody += '<tds:IncludeCapability>' + params.IncludeCapability + '</tds:IncludeCapability>';
        soapBody += '</tds:GetServices>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetServices', soap);
    };
    OnvifServiceDevice.prototype.getServiceCapabilities = function () {
        var soapBody = '<tds:GetServiceCapabilities/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetServiceCapabilities', soap);
    };
    return OnvifServiceDevice;
}(service_base_1.OnvifServiceBase));
exports.OnvifServiceDevice = OnvifServiceDevice;
function parseGetSystemDateAndTime(s) {
    var _a, _b, _c;
    var s2 = (_b = (_a = s.Body) === null || _a === void 0 ? void 0 : _a.GetSystemDateAndTimeResponse) === null || _b === void 0 ? void 0 : _b.SystemDateAndTime;
    if (!s2) {
        return null;
    }
    var type = s2.DateTimeType || '';
    var dst = null;
    if (s2.DaylightSavings) {
        dst = s2.DaylightSavings === 'true';
    }
    var tz = ((_c = s2.TimeZone) === null || _c === void 0 ? void 0 : _c.TZ) || '';
    var date = null;
    if (s2.UTCDateTime) {
        var udt = s2.UTCDateTime;
        var t = udt.Time;
        var d = udt.Date;
        if (t && d && t.Hour && t.Minute && t.Second && d.Year && d.Month && d.Day) {
            date = new Date();
            date.setUTCFullYear(parseInt(d.Year, 10));
            date.setUTCMonth(parseInt(d.Month, 10) - 1);
            date.setUTCDate(parseInt(d.Day, 10));
            date.setUTCHours(parseInt(t.Hour, 10));
            date.setUTCMinutes(parseInt(t.Minute, 10));
            date.setUTCSeconds(parseInt(t.Second, 10));
        }
    }
    return { type: type, dst: dst, tz: tz, date: date };
}
//# sourceMappingURL=service-device.js.map