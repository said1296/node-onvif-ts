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
exports.ViewModeEnumerator = exports.OnvifServiceMedia = void 0;
var service_base_1 = require("./service-base");
var soap_1 = require("./soap");
var OnvifServiceMedia = /** @class */ (function (_super) {
    __extends(OnvifServiceMedia, _super);
    function OnvifServiceMedia(configs) {
        var _this = this;
        var xaddr = configs.xaddr, user = configs.user, pass = configs.pass, timeDiff = configs.timeDiff;
        _this = _super.call(this, { xaddr: xaddr, user: user, pass: pass }) || this;
        _this.timeDiff = timeDiff;
        _this.namespaceAttrList = [
            'xmlns:trt="http://www.onvif.org/ver10/media/wsdl"',
            'xmlns:tt="http://www.onvif.org/ver10/schema"'
        ];
        return _this;
    }
    OnvifServiceMedia.prototype.getStreamUri = function (params) {
        var soapBody = '';
        soapBody += '<trt:GetStreamUri>';
        soapBody += '<trt:StreamSetup>';
        soapBody += '<tt:Stream>RTP-Unicast</tt:Stream>';
        soapBody += '<tt:Transport>';
        soapBody += '<tt:Protocol>' + params.Protocol + '</tt:Protocol>';
        soapBody += '</tt:Transport>';
        soapBody += '</trt:StreamSetup>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '</trt:GetStreamUri>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetStreamUri', soap);
    };
    OnvifServiceMedia.prototype.getVideoEncoderConfigurations = function () {
        var soapBody = '<trt:GetVideoEncoderConfigurations/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetVideoEncoderConfigurations', soap);
    };
    OnvifServiceMedia.prototype.getVideoEncoderConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:GetVideoEncoderConfiguration>';
        soapBody += '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        soapBody += '</trt:GetVideoEncoderConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetVideoEncoderConfiguration', soap);
    };
    OnvifServiceMedia.prototype.addVideoEncoderConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:AddVideoEncoderConfiguration>';
        soapBody += '<trt:ProfileToken>' + params['ProfileToken'] + '</trt:ProfileToken>';
        soapBody += '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        soapBody += '</trt:AddVideoEncoderConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'AddVideoEncoderConfiguration', soap);
    };
    OnvifServiceMedia.prototype.getCompatibleVideoEncoderConfigurations = function (params) {
        var soapBody = '';
        soapBody += '<trt:GetCompatibleVideoEncoderConfigurations>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '</trt:GetCompatibleVideoEncoderConfigurations>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetCompatibleVideoEncoderConfigurations', soap);
    };
    OnvifServiceMedia.prototype.getVideoEncoderConfigurationOptions = function (params) {
        var soapBody = '';
        soapBody += '<trt:GetVideoEncoderConfigurationOptions>';
        if (params.ProfileToken) {
            soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        }
        if (params.ConfigurationToken) {
            soapBody += '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        }
        soapBody += '</trt:GetVideoEncoderConfigurationOptions>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetVideoEncoderConfigurationOptions', soap);
    };
    OnvifServiceMedia.prototype.removeVideoEncoderConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:RemoveVideoEncoderConfiguration>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '</trt:RemoveVideoEncoderConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'RemoveVideoEncoderConfiguration', soap);
    };
    OnvifServiceMedia.prototype.setVideoEncoderConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:SetVideoEncoderConfiguration>';
        soapBody += '<trt:Configuration token = "' + params.ConfigurationToken + '"';
        soapBody += ' GuaranteedFrameRate = "false">';
        soapBody += '<tt:Name>' + params.Name + '</tt:Name>';
        soapBody += '<tt:UseCount>0</tt:UseCount>';
        soapBody += '<tt:Encoding>' + params.Encoding + '</tt:Encoding>';
        soapBody += '<tt:Resolution>';
        soapBody += '<tt:Width>' + params.Resolution.Width + '</tt:Width>';
        soapBody += '<tt:Height>' + params.Resolution.Height + '</tt:Height>';
        soapBody += '</tt:Resolution>';
        soapBody += '<tt:Quality>' + params.Quality + '</tt:Quality>';
        if (params.RateControl) {
            soapBody += '<tt:RateControl>';
            soapBody += '<tt:FrameRateLimit>' + params.RateControl.FrameRateLimit + '</tt:FrameRateLimit>';
            soapBody += '<tt:EncodingInterval>' + params.RateControl.EncodingInterval + '</tt:EncodingInterval>';
            soapBody += '<tt:BitrateLimit>' + params.RateControl.BitrateLimit + '</tt:BitrateLimit>';
            soapBody += '</tt:RateControl>';
        }
        if ('MPEG4' in params) {
            soapBody += '<tt:MPEG4>';
            soapBody += '<tt:GovLength>' + params.MPEG4.GovLength + '</tt:GovLength>';
            soapBody += '<tt:Mpeg4Profile>';
            soapBody += params.MPEG4.Mpeg4Profile;
            soapBody += '</tt:Mpeg4Profile>';
            soapBody += '</tt:MPEG4>';
        }
        if ('H264' in params) {
            soapBody += '<tt:H264>';
            soapBody += '<tt:GovLength>' + params.H264.GovLength + '</tt:GovLength>';
            soapBody += '<tt:H264Profile>';
            soapBody += params.H264.H264Profile;
            soapBody += '</tt:H264Profile>';
            soapBody += '</tt:H264>';
        }
        soapBody += '<tt:Multicast>';
        soapBody += '<tt:Address>';
        soapBody += '<tt:Type>IPv4</tt:Type>';
        soapBody += '<tt:IPv4Address>0.0.0.0</tt:IPv4Address>';
        soapBody += '<tt:IPv6Address></tt:IPv6Address>';
        soapBody += '</tt:Address>';
        soapBody += '<tt:Port>0</tt:Port>';
        soapBody += '<tt:TTL>5</tt:TTL>';
        soapBody += '<tt:AutoStart>false</tt:AutoStart>';
        soapBody += '</tt:Multicast>';
        soapBody += '<tt:SessionTimeout>PT60S</tt:SessionTimeout>';
        soapBody += '</trt:Configuration>';
        soapBody += '<trt:ForcePersistence>true</trt:ForcePersistence>';
        soapBody += '</trt:SetVideoEncoderConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'SetVideoEncoderConfiguration', soap);
    };
    OnvifServiceMedia.prototype.getGuaranteedNumberOfVideoEncoderInstances = function (params) {
        var soapBody = '';
        soapBody += '<trt:GetGuaranteedNumberOfVideoEncoderInstances>';
        soapBody += '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        soapBody += '</trt:GetGuaranteedNumberOfVideoEncoderInstances>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetGuaranteedNumberOfVideoEncoderInstances', soap);
    };
    OnvifServiceMedia.prototype.getProfiles = function () {
        var soapBody = '<trt:GetProfiles/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetProfiles', soap);
    };
    OnvifServiceMedia.prototype.getProfile = function (params) {
        var soapBody = '';
        soapBody += '<trt:GetProfile>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '</trt:GetProfile>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetProfile', soap);
    };
    OnvifServiceMedia.prototype.createProfile = function (params) {
        var soapBody = '';
        soapBody += '<trt:CreateProfile>';
        soapBody += '<trt:Name>' + params.Name + '</trt:Name>';
        if (params.Token) {
            soapBody += '<trt:Token>' + params.Token + '</trt:Token>';
        }
        soapBody += '</trt:CreateProfile>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'CreateProfile', soap);
    };
    OnvifServiceMedia.prototype.deleteProfile = function (params) {
        var soapBody = '';
        soapBody += '<trt:DeleteProfile>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '</trt:DeleteProfile>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'DeleteProfile', soap);
    };
    OnvifServiceMedia.prototype.getVideoSources = function () {
        var soapBody = '<trt:GetVideoSources/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetVideoSources', soap);
    };
    OnvifServiceMedia.prototype.getVideoSourceConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:GetVideoSourceConfiguration>';
        soapBody += '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        soapBody += '</trt:GetVideoSourceConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetVideoSourceConfiguration', soap);
    };
    OnvifServiceMedia.prototype.getVideoSourceConfigurations = function () {
        var soapBody = '<trt:GetVideoSourceConfigurations/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetVideoSourceConfigurations', soap);
    };
    OnvifServiceMedia.prototype.addVideoSourceConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:AddVideoSourceConfiguration>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        soapBody += '</trt:AddVideoSourceConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'AddVideoSourceConfiguration', soap);
    };
    OnvifServiceMedia.prototype.getCompatibleVideoSourceConfigurations = function (params) {
        var soapBody = '';
        soapBody += '<trt:GetCompatibleVideoSourceConfigurations>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '</trt:GetCompatibleVideoSourceConfigurations>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetCompatibleVideoSourceConfigurations', soap);
    };
    OnvifServiceMedia.prototype.getVideoSourceConfigurationOptions = function (params) {
        var soapBody = '';
        soapBody += '<trt:GetVideoSourceConfigurationOptions>';
        if (params.ProfileToken) {
            soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        }
        if (params.ConfigurationToken) {
            soapBody += '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        }
        soapBody += '</trt:GetVideoSourceConfigurationOptions>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetVideoSourceConfigurationOptions', soap);
    };
    OnvifServiceMedia.prototype.removeVideoSourceConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:RemoveVideoSourceConfiguration>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '</trt:RemoveVideoSourceConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'RemoveVideoSourceConfiguration', soap);
    };
    OnvifServiceMedia.prototype.setVideoSourceConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:SetVideoSourceConfiguration>';
        soapBody += '<trt:Configuration token = "' + params.ConfigurationToken + '"';
        soapBody += '>';
        soapBody += '<tt:Name>' + params.Name + '</tt:Name>';
        soapBody += '<tt:UseCount>0</tt:UseCount>';
        soapBody += '<tt:SourceToken>' + params.SourceToken + '</tt:SourceToken>';
        soapBody += '<tt:Bounds';
        soapBody += ' x = "' + params.Bounds.x + '"';
        soapBody += ' y = "' + params.Bounds.y + '"';
        soapBody += ' width = "' + params.Bounds.width + '"';
        soapBody += ' height = "' + params.Bounds.height + '"';
        soapBody += '></tt:Bounds>';
        if (params.Extension) {
            soapBody += '<tt:Extension>';
            if (params.Extension.Rotate) {
                soapBody += '<tt:Rotate>';
                soapBody += '<tt:Mode>' + params.Extension.Rotate.Mode + '</tt:Mode>';
                if (typeof params.Extension.Rotate.Degree === 'number') {
                    soapBody += '<tt:Degree>' + params.Extension.Rotate.Degree + '</tt:Degree>';
                }
                soapBody += '</tt:Rotate>';
            }
            if (params.Extension.Extension) {
                soapBody += '<tt:Extension>';
                if (params.Extension.Extension.LensDescription) {
                    soapBody += '<tt:LensDescription';
                    if (typeof params.Extension.Extension.LensDescription.FocalLength === 'number')
                        soapBody += ' FocalLength = "' + params.Extension.Extension.LensDescription.FocalLength + '"';
                    soapBody += '>';
                    soapBody += '<tt:Offset';
                    if (typeof params.Extension.Extension.LensDescription.Offset.x === 'number')
                        soapBody += ' x = "' + params.Extension.Extension.LensDescription.Offset.x + '"';
                    if (typeof params.Extension.Extension.LensDescription.Offset.y === 'number')
                        soapBody += ' y = "' + params.Extension.Extension.LensDescription.Offset.y + '"';
                    soapBody += '></tt:Offset>';
                    soapBody += '<tt:Projection>';
                    soapBody += '<tt:Angle>' + params.Extension.Extension.LensDescription.Projection.Angle + '</tt:Angle>';
                    soapBody += '<tt:Radius>' + params.Extension.Extension.LensDescription.Projection.Radius + '</tt:Radius>';
                    if (typeof params.Extension.Extension.LensDescription.Projection.Transmittance === 'number') {
                        soapBody += '<tt:Transmittance>' + params.Extension.Extension.LensDescription.Projection.Transmittance + '</tt:Transmittance>';
                    }
                    soapBody += '</tt:Projection>';
                    soapBody += '<tt:XFactor>' + params.Extension.Extension.LensDescription.XFactor + '</tt:XFactor>';
                    soapBody += '</tt:LensDescription>';
                }
                if (params.Extension.Extension.SceneOrientation) {
                    soapBody += '<tt:SceneOrientation>';
                    soapBody += '<tt:Mode>' + params.Extension.Extension.SceneOrientation.Mode + '</tt:Mode>';
                    if (params.Extension.Extension.SceneOrientation.Orientation) {
                        soapBody += '<tt:Orientation>' + params.Extension.Extension.SceneOrientation.Orientation + '</tt:Orientation>';
                    }
                    soapBody += '</tt:SceneOrientation>';
                }
                soapBody += '</tt:Extension>';
            }
            soapBody += '</tt:Extension>';
        }
        soapBody += '</trt:Configuration>';
        soapBody += '<trt:ForcePersistence>true</trt:ForcePersistence>';
        soapBody += '</trt:SetVideoSourceConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'SetVideoSourceConfiguration', soap);
    };
    OnvifServiceMedia.prototype.getMetadataConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:GetMetadataConfiguration>';
        soapBody += '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        soapBody += '</trt:GetMetadataConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetMetadataConfiguration', soap);
    };
    OnvifServiceMedia.prototype.getMetadataConfigurations = function () {
        var soapBody = '<trt:GetMetadataConfigurations/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetMetadataConfigurations', soap);
    };
    OnvifServiceMedia.prototype.addMetadataConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:AddMetadataConfiguration>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        soapBody += '</trt:AddMetadataConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'AddMetadataConfiguration', soap);
    };
    OnvifServiceMedia.prototype.getCompatibleMetadataConfigurations = function (params) {
        var soapBody = '';
        soapBody += '<trt:GetCompatibleMetadataConfigurations>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '</trt:GetCompatibleMetadataConfigurations>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetCompatibleMetadataConfigurations', soap);
    };
    OnvifServiceMedia.prototype.getMetadataConfigurationOptions = function (params) {
        var soapBody = '';
        soapBody += '<trt:GetMetadataConfigurationOptions>';
        if (params.ProfileToken) {
            soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        }
        if (params.ConfigurationToken) {
            soapBody += '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        }
        soapBody += '</trt:GetMetadataConfigurationOptions>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetMetadataConfigurationOptions', soap);
    };
    OnvifServiceMedia.prototype.removeMetadataConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:RemoveMetadataConfiguration>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '</trt:RemoveMetadataConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'RemoveMetadataConfiguration', soap);
    };
    OnvifServiceMedia.prototype.setMetadataConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:SetMetadataConfiguration>';
        soapBody += '<trt:Configuration token = "' + params.ConfigurationToken + '"';
        if (params.CompressionType)
            soapBody += ' CompressionType = "' + params.CompressionType + '"';
        if (typeof params.GeoLocation === 'boolean')
            soapBody += ' GeoLocation = "' + params.GeoLocation + '"';
        if (typeof params.ShapePolygon === 'boolean')
            soapBody += ' ShapePolygon = "' + params.ShapePolygon + '"';
        soapBody += '>';
        soapBody += '<tt:Name>' + params.Name + '</tt:Name>';
        soapBody += '<tt:UseCount>0</tt:UseCount>';
        if (params.PTZStatus) {
            soapBody += '<tt:PTZStatus>';
            soapBody += '<tt:Status>' + params.PTZStatus.Status + '</tt:Status>';
            soapBody += '<tt:Position>' + params.PTZStatus.Position + '</tt:Position>';
            soapBody += '</tt:PTZStatus>';
        }
        if (typeof params.Analytics === 'boolean')
            soapBody += '<tt:Analytics>' + params.Analytics + '</tt:Analytics>';
        soapBody += '<tt:Multicast>';
        soapBody += '<tt:Address>';
        soapBody += '<tt:Type>IPv4</tt:Type>';
        soapBody += '<tt:IPv4Address>0.0.0.0</tt:IPv4Address>';
        soapBody += '<tt:IPv6Address></tt:IPv6Address>';
        soapBody += '</tt:Address>';
        soapBody += '<tt:Port>0</tt:Port>';
        soapBody += '<tt:TTL>5</tt:TTL>';
        soapBody += '<tt:AutoStart>false</tt:AutoStart>';
        soapBody += '</tt:Multicast>';
        soapBody += '<tt:SessionTimeout>PT60S</tt:SessionTimeout>';
        if (params.AnalyticsEngineConfiguration) {
            soapBody += '<tt:AnalyticsEngineConfiguration>';
            if (params.AnalyticsEngineConfiguration.AnalyticsModule) {
                soapBody += '<tt:AnalyticsModule>';
                params.AnalyticsEngineConfiguration.AnalyticsModule.forEach(function (o) {
                    soapBody += '<tt:Name>' + o.Name + '</tt:Name>';
                    soapBody += '<tt:Type>' + o.Type + '</tt:Type>';
                    soapBody += '<tt:Parameters>';
                    o.Parameters.SimpleItem.forEach(function (si) {
                        soapBody += '<tt:SimpleItem Name = "' + si.Name + '"';
                        soapBody += ' Value = "' + si.Value + '"';
                        soapBody += '></tt:SimpleItem>';
                    });
                    o.Parameters.ElementItem.forEach(function (ei) {
                        soapBody += '<tt:ElementItem Name = "' + ei.Name + '"';
                        soapBody += '></tt:ElementItem>';
                    });
                    soapBody += '</tt:Parameters>';
                });
                soapBody += '</tt:AnalyticsModule>';
            }
            soapBody += '</tt:AnalyticsEngineConfiguration>';
        }
        soapBody += '</trt:Configuration>';
        soapBody += '<trt:ForcePersistence>true</trt:ForcePersistence>';
        soapBody += '</trt:SetMetadataConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'SetMetadataConfiguration', soap);
    };
    OnvifServiceMedia.prototype.getAudioSources = function () {
        var soapBody = '<trt:GetAudioSources/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetAudioSources', soap);
    };
    OnvifServiceMedia.prototype.getAudioSourceConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:GetAudioSourceConfiguration>';
        soapBody += '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        soapBody += '</trt:GetAudioSourceConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetAudioSourceConfiguration', soap);
    };
    OnvifServiceMedia.prototype.getAudioSourceConfigurations = function () {
        var soapBody = '<trt:GetAudioSourceConfigurations/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetAudioSourceConfigurations', soap);
    };
    OnvifServiceMedia.prototype.addAudioSourceConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:AddAudioSourceConfiguration>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        soapBody += '</trt:AddAudioSourceConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'AddAudioSourceConfiguration', soap);
    };
    OnvifServiceMedia.prototype.getCompatibleAudioSourceConfigurations = function (params) {
        var soapBody = '';
        soapBody += '<trt:GetCompatibleAudioSourceConfigurations>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '</trt:GetCompatibleAudioSourceConfigurations>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetCompatibleAudioSourceConfigurations', soap);
    };
    OnvifServiceMedia.prototype.getAudioSourceConfigurationOptions = function (params) {
        var soapBody = '';
        soapBody += '<trt:GetAudioSourceConfigurationOptions>';
        if (params.ProfileToken) {
            soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        }
        if (params.ConfigurationToken) {
            soapBody += '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        }
        soapBody += '</trt:GetAudioSourceConfigurationOptions>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetAudioSourceConfigurationOptions', soap);
    };
    OnvifServiceMedia.prototype.removeAudioSourceConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:RemoveAudioSourceConfiguration>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '</trt:RemoveAudioSourceConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'RemoveAudioSourceConfiguration', soap);
    };
    OnvifServiceMedia.prototype.setAudioSourceConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:SetAudioSourceConfiguration>';
        soapBody += '<trt:Configuration token = "' + params.ConfigurationToken + '"';
        soapBody += '>';
        soapBody += '<tt:Name>' + params.Name + '</tt:Name>';
        soapBody += '<tt:UseCount>0</tt:UseCount>';
        soapBody += '<tt:SourceToken>' + params.SourceToken + '</tt:SourceToken>';
        soapBody += '</trt:Configuration>';
        soapBody += '<trt:ForcePersistence>true</trt:ForcePersistence>';
        soapBody += '</trt:SetAudioSourceConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'SetAudioSourceConfiguration', soap);
    };
    OnvifServiceMedia.prototype.getAudioEncoderConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:GetAudioEncoderConfiguration>';
        soapBody += '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        soapBody += '</trt:GetAudioEncoderConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetAudioEncoderConfiguration', soap);
    };
    OnvifServiceMedia.prototype.getAudioEncoderConfigurations = function () {
        var soapBody = '<trt:GetAudioEncoderConfigurations/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetAudioEncoderConfigurations', soap);
    };
    OnvifServiceMedia.prototype.addAudioEncoderConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:AddAudioEncoderConfiguration>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        soapBody += '</trt:AddAudioEncoderConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'AddAudioEncoderConfiguration', soap);
    };
    OnvifServiceMedia.prototype.getCompatibleAudioEncoderConfigurations = function (params) {
        var soapBody = '';
        soapBody += '<trt:GetCompatibleAudioEncoderConfigurations>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '</trt:GetCompatibleAudioEncoderConfigurations>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetCompatibleAudioEncoderConfigurations', soap);
    };
    OnvifServiceMedia.prototype.getAudioEncoderConfigurationOptions = function (params) {
        var soapBody = '';
        soapBody += '<trt:GetAudioEncoderConfigurationOptions>';
        if (params.ProfileToken) {
            soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        }
        if (params.ConfigurationToken) {
            soapBody += '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        }
        soapBody += '</trt:GetAudioEncoderConfigurationOptions>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetAudioEncoderConfigurationOptions', soap);
    };
    OnvifServiceMedia.prototype.removeAudioEncoderConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:RemoveAudioEncoderConfiguration>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '</trt:RemoveAudioEncoderConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'RemoveAudioEncoderConfiguration', soap);
    };
    OnvifServiceMedia.prototype.setAudioEncoderConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:SetAudioEncoderConfiguration>';
        soapBody += '<trt:Configuration token = "' + params.ConfigurationToken + '"';
        soapBody += '>';
        soapBody += '<tt:Name>' + params.Name + '</tt:Name>';
        soapBody += '<tt:UseCount>0</tt:UseCount>';
        soapBody += '<tt:Encoding>' + params.Encoding + '</tt:Encoding>';
        soapBody += '<tt:Bitrate>' + params.Bitrate + '</tt:Bitrate>';
        soapBody += '<tt:SampleRate>' + params.SampleRate + '</tt:SampleRate>';
        soapBody += '<tt:Multicast>';
        soapBody += '<tt:Address>';
        soapBody += '<tt:Type>IPv4</tt:Type>';
        soapBody += '<tt:IPv4Address>0.0.0.0</tt:IPv4Address>';
        soapBody += '<tt:IPv6Address></tt:IPv6Address>';
        soapBody += '</tt:Address>';
        soapBody += '<tt:Port>0</tt:Port>';
        soapBody += '<tt:TTL>5</tt:TTL>';
        soapBody += '<tt:AutoStart>false</tt:AutoStart>';
        soapBody += '</tt:Multicast>';
        soapBody += '<tt:SessionTimeout>PT60S</tt:SessionTimeout>';
        soapBody += '</trt:Configuration>';
        soapBody += '<trt:ForcePersistence>true</trt:ForcePersistence>';
        soapBody += '</trt:SetAudioEncoderConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'SetAudioEncoderConfiguration', soap);
    };
    OnvifServiceMedia.prototype.startMulticastStreaming = function (params) {
        var soapBody = '';
        soapBody += '<trt:StartMulticastStreaming>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '</trt:StartMulticastStreaming>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'StartMulticastStreaming', soap);
    };
    OnvifServiceMedia.prototype.stopMulticastStreaming = function (params) {
        var soapBody = '';
        soapBody += '<trt:StopMulticastStreaming>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '</trt:StopMulticastStreaming>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'StopMulticastStreaming', soap);
    };
    OnvifServiceMedia.prototype.getSnapshotUri = function (params) {
        var soapBody = '';
        soapBody += '<trt:GetSnapshotUri>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '</trt:GetSnapshotUri>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetSnapshotUri', soap);
    };
    OnvifServiceMedia.prototype.addPTZConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:AddPTZConfiguration>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '<trt:ConfigurationToken>' + params.ConfigurationToken + '</trt:ConfigurationToken>';
        soapBody += '</trt:AddPTZConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'AddPTZConfiguration', soap);
    };
    OnvifServiceMedia.prototype.removePTZConfiguration = function (params) {
        var soapBody = '';
        soapBody += '<trt:RemovePTZConfiguration>';
        soapBody += '<trt:ProfileToken>' + params.ProfileToken + '</trt:ProfileToken>';
        soapBody += '</trt:RemovePTZConfiguration>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'RemovePTZConfiguration', soap);
    };
    return OnvifServiceMedia;
}(service_base_1.OnvifServiceBase));
exports.OnvifServiceMedia = OnvifServiceMedia;
var ViewModeEnumerator;
(function (ViewModeEnumerator) {
    ViewModeEnumerator["Fisheye"] = "Fisheye";
    ViewModeEnumerator["Panorama360"] = "360Panorama";
    ViewModeEnumerator["Panorama180"] = "180Panorama";
    ViewModeEnumerator["Quad"] = "Quad";
    ViewModeEnumerator["Original"] = "Original";
    ViewModeEnumerator["LeftHalf"] = "LeftHalf";
    ViewModeEnumerator["RightHalf"] = "RightHalf";
    ViewModeEnumerator["Dewarp"] = "Dewarp";
})(ViewModeEnumerator = exports.ViewModeEnumerator || (exports.ViewModeEnumerator = {}));
//# sourceMappingURL=service-media.js.map