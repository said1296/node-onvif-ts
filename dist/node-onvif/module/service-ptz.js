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
exports.OnvifServicePtz = void 0;
var service_base_1 = require("./service-base");
var soap_1 = require("./soap");
var OnvifServicePtz = /** @class */ (function (_super) {
    __extends(OnvifServicePtz, _super);
    function OnvifServicePtz(configs) {
        var _this = this;
        var xaddr = configs.xaddr, user = configs.user, pass = configs.pass, timeDiff = configs.timeDiff;
        _this = _super.call(this, { xaddr: xaddr, user: user, pass: pass }) || this;
        _this.timeDiff = timeDiff;
        _this.namespaceAttrList = [
            'xmlns:ter="http://www.onvif.org/ver10/error"',
            'xmlns:xs="http://www.w3.org/2001/XMLSchema"',
            'xmlns:tt="http://www.onvif.org/ver10/schema"',
            'xmlns:tptz="http://www.onvif.org/ver20/ptz/wsdl"'
        ];
        return _this;
    }
    OnvifServicePtz.prototype.getNodes = function () {
        var soapBody = '<tptz:GetNodes />';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetNodes', soap).then(function (result) {
            var _a, _b;
            var d = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.GetNodesResponse) === null || _b === void 0 ? void 0 : _b.PTZNode;
            if (d && !Array.isArray(d)) {
                result.data.GetNodesResponse.PTZNode = [d];
            }
            return result;
        });
    };
    OnvifServicePtz.prototype.getNode = function (params) {
        var soapBody = '';
        soapBody += '<tptz:GetNode>';
        soapBody += '<tptz:NodeToken>' + params.NodeToken + '</tptz:NodeToken>';
        soapBody += '</tptz:GetNode>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetNode', soap);
    };
    OnvifServicePtz.prototype.getConfigurations = function () {
        var soapBody = '<tptz:GetConfigurations />';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetConfigurations', soap).then(function (result) {
            var _a, _b;
            var d = (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.GetConfigurationsResponse) === null || _b === void 0 ? void 0 : _b.PTZConfiguration;
            if (d && !Array.isArray(d)) {
                result.data.GetConfigurationsResponse.PTZConfiguration = [d];
            }
            return result;
        });
    };
    OnvifServicePtz.prototype.getConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<tptz:GetConfiguration>';
        soapBody += '<tptz:PTZConfigurationToken>' + params.ConfigurationToken + '</tptz:PTZConfigurationToken>';
        soapBody += '</tptz:GetConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetConfiguration', soap);
    };
    OnvifServicePtz.prototype.getCompatibleConfigurations = function (params) {
        var soapBody = '';
        soapBody += '<tptz:GetCompatibleConfigurations>';
        soapBody += '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
        soapBody += '</tptz:GetCompatibleConfigurations>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetCompatibleConfigurations', soap);
    };
    OnvifServicePtz.prototype.getConfigurationOptions = function (params) {
        var soapBody = '';
        soapBody += '<tptz:GetConfigurationOptions>';
        soapBody += '<tptz:ConfigurationToken>' + params.ConfigurationToken + '</tptz:ConfigurationToken>';
        soapBody += '</tptz:GetConfigurationOptions>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetConfigurationOptions', soap);
    };
    OnvifServicePtz.prototype.setConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<tptz:SetConfiguration>';
        soapBody += '<tptz:PTZConfiguration token = "' + params.ConfigurationToken + '"';
        if (typeof params.MoveRamp === 'number')
            soapBody += ' MoveRamp = "' + params.MoveRamp + '"';
        if (typeof params.PresetRamp === 'number')
            soapBody += ' PresetRamp = "' + params.PresetRamp + '"';
        if (typeof params.PresetTourRamp === 'number')
            soapBody += ' PresetTourRamp = "' + params.PresetTourRamp + '"';
        soapBody += '>';
        soapBody += '<tt:Name>' + params.Name + '</tt:Name>';
        soapBody += '<tt:UseCount>0</tt:UseCount>';
        soapBody += '<tt:NodeToken>' + params.NodeToken + '</tt:NodeToken>';
        if (params.DefaultAbsolutePantTiltPositionSpace)
            soapBody += '<tt:DefaultAbsolutePantTiltPositionSpace>' + params.DefaultAbsolutePantTiltPositionSpace + '</tt:DefaultAbsolutePantTiltPositionSpace>';
        if (params.DefaultAbsoluteZoomPositionSpace)
            soapBody += '<tt:DefaultAbsoluteZoomPositionSpace>' + params.DefaultAbsoluteZoomPositionSpace + '</tt:DefaultAbsoluteZoomPositionSpace>';
        if (params.DefaultRelativePanTiltTranslationSpace)
            soapBody += '<tt:DefaultRelativePanTiltTranslationSpace>' + params.DefaultRelativePanTiltTranslationSpace + '</tt:DefaultRelativePanTiltTranslationSpace>';
        if (params.DefaultRelativeZoomTranslationSpace)
            soapBody += '<tt:DefaultRelativeZoomTranslationSpace>' + params.DefaultRelativeZoomTranslationSpace + '</tt:DefaultRelativeZoomTranslationSpace>';
        if (params.DefaultContinuousPanTiltVelocitySpace)
            soapBody += '<tt:DefaultContinuousPanTiltVelocitySpace>' + params.DefaultContinuousPanTiltVelocitySpace + '</tt:DefaultContinuousPanTiltVelocitySpace>';
        if (params.DefaultContinuousZoomVelocitySpace)
            soapBody += '<tt:DefaultContinuousZoomVelocitySpace>' + params.DefaultContinuousZoomVelocitySpace + '</tt:DefaultContinuousZoomVelocitySpace>';
        if (params.DefaultPTZSpeed) {
            soapBody += '<tt:DefaultPTZSpeed>';
            if (params.DefaultPTZSpeed.PanTilt) {
                soapBody += '<tt:PanTilt';
                if (params.DefaultPTZSpeed.PanTilt.space) {
                    soapBody += ' space = "' + params.DefaultPTZSpeed.PanTilt.space + '"';
                }
                soapBody += ' x = "' + params.DefaultPTZSpeed.PanTilt.x + '"';
                soapBody += ' y = "' + params.DefaultPTZSpeed.PanTilt.y + '"';
                soapBody += '></tt:PanTilt>';
            }
            if (params.DefaultPTZSpeed.Zoom) {
                soapBody += '<tt:Zoom';
                if (params.DefaultPTZSpeed.Zoom.space) {
                    soapBody += ' space = "' + params.DefaultPTZSpeed.Zoom.space + '"';
                }
                soapBody += ' x = "' + params.DefaultPTZSpeed.Zoom.x + '"';
                soapBody += '></tt:Zoom>';
            }
            soapBody += '</tt:DefaultPTZSpeed>';
        }
        if (params.DefaultPTZTimeout)
            soapBody += '<tt:DefaultPTZTimeout>' + params.DefaultPTZTimeout + '</tt:DefaultPTZTimeout>';
        if (params.PanTiltLimits) {
            soapBody += '<tt:PanTiltLimits>';
            soapBody += '<tt:Range>';
            soapBody += '<tt:URI>' + params.PanTiltLimits.Range.URI + '</tt:URI>';
            soapBody += '<tt:XRange>';
            soapBody += '<tt:Min>' + (typeof params.PanTiltLimits.Range.XRange.Min === 'number' ? params.PanTiltLimits.Range.XRange.Min : '-INF') + '</tt:Min>';
            soapBody += '<tt:Max>' + (typeof params.PanTiltLimits.Range.XRange.Max === 'number' ? params.PanTiltLimits.Range.XRange.Max : '+INF') + '</tt:Max>';
            soapBody += '</tt:XRange>';
            soapBody += '<tt:YRange>';
            soapBody += '<tt:Min>' + (typeof params.PanTiltLimits.Range.YRange.Min === 'number' ? params.PanTiltLimits.Range.YRange.Min : '-INF') + '</tt:Min>';
            soapBody += '<tt:Max>' + (typeof params.PanTiltLimits.Range.YRange.Max === 'number' ? params.PanTiltLimits.Range.YRange.Max : '+INF') + '</tt:Max>';
            soapBody += '</tt:YRange>';
            soapBody += '</tt:Range>';
            soapBody += '</tt:PanTiltLimits>';
        }
        if (params.ZoomLimits) {
            soapBody += '<tt:ZoomLimits>';
            soapBody += '<tt:Range>';
            soapBody += '<tt:URI>' + params.ZoomLimits.Range.URI + '</tt:URI>';
            soapBody += '<tt:XRange>';
            soapBody += '<tt:Min>' + (typeof params.ZoomLimits.Range.XRange.Min === 'number' ? params.ZoomLimits.Range.XRange.Min : '-INF') + '</tt:Min>';
            soapBody += '<tt:Max>' + (typeof params.ZoomLimits.Range.XRange.Max === 'number' ? params.ZoomLimits.Range.XRange.Max : '+INF') + '</tt:Max>';
            soapBody += '</tt:XRange>';
            soapBody += '</tt:Range>';
            soapBody += '</tt:ZoomLimits>';
        }
        if (params.Extension) {
            soapBody += '<tt:Extension>';
            if (params.Extension.PTControlDirection) {
                soapBody += '<tt:PTControlDirection>';
                if (params.Extension.PTControlDirection.EFlip) {
                    soapBody += '<tt:EFlip>';
                    soapBody += '<tt:Mode>' + params.Extension.PTControlDirection.EFlip.Mode + '</tt:Mode>';
                    soapBody += '</tt:EFlip>';
                }
                if (params.Extension.PTControlDirection.Reverse) {
                    soapBody += '<tt:Reverse>';
                    soapBody += '<tt:Mode>' + params.Extension.PTControlDirection.Reverse.Mode + '</tt:Mode>';
                    soapBody += '</tt:Reverse>';
                }
                soapBody += '</tt:PTControlDirection>';
            }
            soapBody += '</tt:Extension>';
        }
        soapBody += '</tptz:PTZConfiguration>';
        soapBody += '<tptz:ForcePersistence>true</tptz:ForcePersistence>';
        soapBody += '</tptz:SetConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'SetConfiguration', soap);
    };
    OnvifServicePtz.prototype.getStatus = function (params) {
        var soapBody = '';
        soapBody += '<tptz:GetStatus>';
        soapBody += '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
        soapBody += '</tptz:GetStatus>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetStatus', soap);
    };
    OnvifServicePtz.prototype.continuousMove = function (params) {
        var soapBody = '';
        soapBody += '<tptz:ContinuousMove>';
        soapBody += '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
        soapBody += '<tptz:Velocity>';
        if (params.Velocity.x && params.Velocity.y) {
            soapBody += '<tt:PanTilt x="' + params.Velocity.x + '" y="' + params.Velocity.y + '"></tt:PanTilt>';
        }
        if (params.Velocity.z) {
            soapBody += '<tt:Zoom x="' + params.Velocity.z + '"></tt:Zoom>';
        }
        soapBody += '</tptz:Velocity>';
        if (params.Timeout) {
            soapBody += '<tptz:Timeout>PT' + params.Timeout + 'S</tptz:Timeout>';
        }
        soapBody += '</tptz:ContinuousMove>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'ContinuousMove', soap);
    };
    OnvifServicePtz.prototype.absoluteMove = function (params) {
        var soapBody = '';
        soapBody += '<tptz:AbsoluteMove>';
        soapBody += '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
        soapBody += '<tptz:Position>';
        soapBody += '<tt:PanTilt x="' + params.Position.x + '" y="' + params.Position.y + '" />';
        soapBody += '<tt:Zoom x="' + params.Position.z + '"/>';
        soapBody += '</tptz:Position>';
        if (params.Speed) {
            soapBody += '<tptz:Speed>';
            if (params.Speed.x && params.Speed.y) {
                soapBody += '<tt:PanTilt x="' + params.Speed.x + '" y="' + params.Speed.y + '" />';
            }
            if (params.Speed.z) {
                soapBody += '<tt:Zoom x="' + params.Speed.z + '"/>';
            }
            soapBody += '</tptz:Speed>';
        }
        soapBody += '</tptz:AbsoluteMove>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'AbsoluteMove', soap);
    };
    OnvifServicePtz.prototype.relativeMove = function (params) {
        var soapBody = '';
        soapBody += '<tptz:RelativeMove>';
        soapBody += '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
        soapBody += '<tptz:Translation>';
        soapBody += '<tt:PanTilt x="' + params.Translation.x + '" y="' + params.Translation.y + '" />';
        soapBody += '<tt:Zoom x="' + params.Translation.z + '"/>';
        soapBody += '</tptz:Translation>';
        if (params.Speed) {
            soapBody += '<tptz:Speed>';
            if (params.Speed.x && params.Speed.y) {
                soapBody += '<tt:PanTilt x="' + params.Speed.x + '" y="' + params.Speed.y + '" />';
            }
            if (params.Speed.z) {
                soapBody += '<tt:Zoom x="' + params.Speed.z + '"/>';
            }
            soapBody += '</tptz:Speed>';
        }
        soapBody += '</tptz:RelativeMove>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'RelativeMove', soap);
    };
    OnvifServicePtz.prototype.stop = function (params) {
        var soapBody = '';
        soapBody += '<tptz:Stop>';
        soapBody += '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
        if (params.PanTilt) {
            soapBody += '<tptz:PanTilt>' + params.PanTilt + '</tptz:PanTilt>';
        }
        if (params.Zoom) {
            soapBody += '<tptz:Zoom>' + params.Zoom + '</tptz:Zoom>';
        }
        soapBody += '</tptz:Stop>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'Stop', soap);
    };
    OnvifServicePtz.prototype.gotoHomePosition = function (params) {
        var soapBody = '';
        soapBody += '<tptz:GotoHomePosition>';
        soapBody += '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
        if (params.Speed) {
            soapBody += '<tptz:Speed>' + params.Speed + '</tptz:Speed>';
        }
        soapBody += '</tptz:GotoHomePosition>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GotoHomePosition', soap);
    };
    OnvifServicePtz.prototype.setHomePosition = function (params) {
        var soapBody = '';
        soapBody += '<tptz:SetHomePosition>';
        soapBody += '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
        soapBody += '</tptz:SetHomePosition>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'SetHomePosition', soap);
    };
    OnvifServicePtz.prototype.setPreset = function (params) {
        var soapBody = '';
        soapBody += '<tptz:SetPreset>';
        soapBody += '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
        if ('PresetToken' in params) {
            soapBody += '<tptz:PresetToken>' + params.PresetToken + '</tptz:PresetToken>';
        }
        if ('PresetName' in params) {
            soapBody += '<tptz:PresetName>' + params.PresetName + '</tptz:PresetName>';
        }
        soapBody += '</tptz:SetPreset>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'SetPreset', soap);
    };
    OnvifServicePtz.prototype.getPresets = function (params) {
        var soapBody = '';
        soapBody += '<tptz:GetPresets>';
        soapBody += '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
        soapBody += '</tptz:GetPresets>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetPresets', soap);
    };
    OnvifServicePtz.prototype.gotoPreset = function (params) {
        var soapBody = '';
        soapBody += '<tptz:GotoPreset>';
        soapBody += '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
        soapBody += '<tptz:PresetToken>' + params.PresetToken + '</tptz:PresetToken>';
        if (params.Speed) {
            soapBody += '<tptz:Speed>';
            if (params.Speed.x && params.Speed.y) {
                soapBody += '<tt:PanTilt x="' + params.Speed.x + '" y="' + params.Speed.y + '" />';
            }
            if (params.Speed.z) {
                soapBody += '<tt:Zoom x="' + params.Speed.z + '"/>';
            }
            soapBody += '</tptz:Speed>';
        }
        soapBody += '</tptz:GotoPreset>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GotoPreset', soap);
    };
    OnvifServicePtz.prototype.removePreset = function (params) {
        var soapBody = '';
        soapBody += '<tptz:RemovePreset>';
        soapBody += '<tptz:ProfileToken>' + params.ProfileToken + '</tptz:ProfileToken>';
        soapBody += '<tptz:PresetToken>' + params.PresetToken + '</tptz:PresetToken>';
        soapBody += '</tptz:RemovePreset>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'RemovePreset', soap);
    };
    return OnvifServicePtz;
}(service_base_1.OnvifServiceBase));
exports.OnvifServicePtz = OnvifServicePtz;
//# sourceMappingURL=service-ptz.js.map