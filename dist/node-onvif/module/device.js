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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnvifDevice = void 0;
var events_1 = require("events");
var service_events_1 = require("./service-events");
var service_media_1 = require("./service-media");
var service_ptz_1 = require("./service-ptz");
var service_device_1 = require("./service-device");
var http_auth_1 = require("./http-auth");
var OnvifDevice = /** @class */ (function (_super) {
    __extends(OnvifDevice, _super);
    function OnvifDevice(configs) {
        var _this = _super.call(this) || this;
        _this.address = '';
        _this.xaddr = '';
        _this.user = '';
        _this.pass = '';
        _this.keepAddr = false;
        _this.lastResponse = null; // for debug
        _this.timeDiff = 0;
        _this.information = null;
        _this.profileList = [];
        _this.currentProfile = null;
        _this.ptzMoving = false;
        if (('xaddr' in configs) && (configs.xaddr)) {
            _this.xaddr = configs.xaddr;
            var ourl = new URL(_this.xaddr);
            _this.address = ourl.hostname;
        }
        else if (('address' in configs) && (configs.address)) {
            _this.keepAddr = true;
            _this.address = configs.address;
            _this.xaddr = 'http://' + _this.address + '/onvif/device_service';
        }
        _this.user = configs.user || '';
        _this.pass = configs.pass || '';
        _this.oxaddr = new URL(_this.xaddr);
        if (_this.user) {
            _this.oxaddr.username = _this.user;
            _this.oxaddr.password = _this.pass;
        }
        _this.services = {
            device: new service_device_1.OnvifServiceDevice({ xaddr: _this.xaddr, user: _this.user, pass: _this.pass }),
            events: null,
            media: null,
            ptz: null
        };
        return _this;
    }
    OnvifDevice.prototype.getInformation = function () {
        if (this.information) {
            return this.information;
        }
        return null;
    };
    OnvifDevice.prototype.getCurrentProfile = function () {
        if (this.currentProfile) {
            return this.currentProfile;
        }
        return null;
    };
    OnvifDevice.prototype.getProfileList = function () {
        return this.profileList;
    };
    OnvifDevice.prototype.changeProfile = function (index) {
        if (typeof (index) === 'number') {
            try {
                var p = this.profileList[index];
                if (p) {
                    this.currentProfile = p;
                    return p;
                }
                return null;
            }
            catch (e) {
                return null;
            }
        }
        var newProfiles = this.profileList.filter(function (v) { return v.token === index; });
        if (newProfiles.length === 0) {
            return null;
        }
        this.currentProfile = newProfiles[0];
        return this.currentProfile;
    };
    OnvifDevice.prototype.getUdpStreamUrl = function () {
        var _a;
        if (!this.currentProfile) {
            return '';
        }
        var url = (_a = this.currentProfile.stream) === null || _a === void 0 ? void 0 : _a.udp;
        return url ? url : '';
    };
    OnvifDevice.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSystemDateAndTime()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getCapabilities()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getDeviceInformation()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.mediaGetProfiles()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.mediaGetStreamUri()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.mediaGetSnapshotUri()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, this.getInformation()];
                }
            });
        });
    };
    OnvifDevice.prototype.fetchSnapshot = function () {
        var _this = this;
        if (!this.currentProfile) {
            return Promise.reject(new Error('No media profile is selected'));
        }
        if (!this.currentProfile.snapshot) {
            return Promise.reject(new Error('The device does not support snaphost or you have not authorized by the device'));
        }
        return new Promise(function (resolve, reject) {
            var ourl = new URL(_this.currentProfile.snapshot);
            var options = {
                protocol: ourl.protocol,
                auth: _this.user + ':' + _this.pass,
                hostname: ourl.hostname,
                port: ourl.port || 80,
                path: ourl.pathname + ourl.search,
                method: 'GET',
            };
            var req = (new http_auth_1.OnvifHttpAuth()).request(options, function (res) {
                var bufferList = [];
                res.on('data', function (buf) {
                    bufferList.push(buf);
                });
                res.on('end', function () {
                    if (res.statusCode === 200) {
                        var buffer = Buffer.concat(bufferList);
                        var ct = res.headers['content-type'];
                        if (!ct) {
                            ct = 'image/jpeg';
                        }
                        if (ct.match(/image\//)) {
                            resolve({ headers: res.headers, body: buffer });
                        }
                        else if (ct.match(/^text\//)) {
                            reject(new Error(buffer.toString()));
                        }
                        else {
                            reject(new Error('Unexpected data:' + ct));
                        }
                    }
                });
                req.on('error', function (error) {
                    reject(error);
                });
            });
            req.on('error', function (error) {
                reject(error);
            });
            req.end();
        });
    };
    OnvifDevice.prototype.ptzMove = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var x, y, z, timeout, p;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.currentProfile) {
                            return [2 /*return*/, Promise.reject(new Error('No media profile is selected'))];
                        }
                        if (!this.services.ptz) {
                            return [2 /*return*/, Promise.reject(new Error('The device does not support PTZ'))];
                        }
                        x = params.speed.x || 0;
                        y = params.speed.y || 0;
                        z = params.speed.z || 0;
                        timeout = params.timeout || 1;
                        p = {
                            ProfileToken: this.currentProfile.token,
                            Velocity: { x: x, y: y, z: z },
                            Timeout: timeout,
                        };
                        this.ptzMoving = true;
                        return [4 /*yield*/, this.services.ptz.continuousMove(p)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OnvifDevice.prototype.ptzStop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var p;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.currentProfile) {
                            return [2 /*return*/, Promise.reject(new Error('No media profile is selected'))];
                        }
                        if (!this.services.ptz) {
                            return [2 /*return*/, Promise.reject(new Error('The device does not support PTZ'))];
                        }
                        this.ptzMoving = false;
                        p = {
                            ProfileToken: this.currentProfile.token,
                            PanTilt: true,
                            Zoom: true,
                        };
                        return [4 /*yield*/, this.services.ptz.stop(p)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OnvifDevice.prototype.setAuth = function (user, pass) {
        var _a, _b, _c, _d;
        this.user = user || '';
        this.pass = pass || '';
        if (this.user) {
            this.oxaddr.username = this.user;
            this.oxaddr.password = this.pass;
        }
        (_a = this.services.device) === null || _a === void 0 ? void 0 : _a.setAuth(user, pass);
        (_b = this.services.events) === null || _b === void 0 ? void 0 : _b.setAuth(user, pass);
        (_c = this.services.media) === null || _c === void 0 ? void 0 : _c.setAuth(user, pass);
        (_d = this.services.ptz) === null || _d === void 0 ? void 0 : _d.setAuth(user, pass);
    };
    OnvifDevice.prototype.getSystemDateAndTime = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.services.device.getSystemDateAndTime()];
                    case 1:
                        _a.sent();
                        this.timeDiff = this.services.device.getTimeDiff();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OnvifDevice.prototype.getCapabilities = function () {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var res, e_2, c, eventsXaddr, mediaXaddr, ptzXaddr;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.services.device.getCapabilities()];
                    case 1:
                        res = _f.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _f.sent();
                        throw new Error('Failed to initialize the device: ' + e_2.toString());
                    case 3:
                        this.lastResponse = res;
                        c = (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.GetCapabilitiesResponse) === null || _b === void 0 ? void 0 : _b.Capabilities;
                        if (!c) {
                            throw new Error('Failed to initialize the device: No capabilities were found.');
                        }
                        eventsXaddr = (_c = c.Events) === null || _c === void 0 ? void 0 : _c.XAddr;
                        if (eventsXaddr) {
                            this.services.events = new service_events_1.OnvifServiceEvents({
                                xaddr: this.getXaddr(eventsXaddr),
                                timeDiff: this.timeDiff,
                                user: this.user,
                                pass: this.pass,
                            });
                        }
                        mediaXaddr = (_d = c.Media) === null || _d === void 0 ? void 0 : _d.XAddr;
                        if (mediaXaddr) {
                            this.services.media = new service_media_1.OnvifServiceMedia({
                                xaddr: this.getXaddr(mediaXaddr),
                                timeDiff: this.timeDiff,
                                user: this.user,
                                pass: this.pass,
                            });
                        }
                        ptzXaddr = (_e = c.PTZ) === null || _e === void 0 ? void 0 : _e.XAddr;
                        if (ptzXaddr) {
                            this.services.ptz = new service_ptz_1.OnvifServicePtz({
                                xaddr: this.getXaddr(ptzXaddr),
                                timeDiff: this.timeDiff,
                                user: this.user,
                                pass: this.pass,
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    OnvifDevice.prototype.getDeviceInformation = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.services.device.getDeviceInformation()];
                    case 1:
                        res = _b.sent();
                        this.information = (_a = res.data) === null || _a === void 0 ? void 0 : _a.GetDeviceInformationResponse;
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _b.sent();
                        throw new Error('Failed to initialize the device: ' + e_3.toString());
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OnvifDevice.prototype.mediaGetProfiles = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var res, rawProfiles, profiles, e_4;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.services.media.getProfiles()];
                    case 1:
                        res = _c.sent();
                        this.lastResponse = res;
                        rawProfiles = (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.GetProfilesResponse) === null || _b === void 0 ? void 0 : _b.Profiles;
                        if (!rawProfiles) {
                            throw new Error('Failed to initialize the device: The targeted device does not have any media profiles.');
                        }
                        profiles = [].concat(rawProfiles);
                        profiles.forEach(function (p) {
                            var _a, _b, _c, _d, _e;
                            var profile = {
                                token: ((_a = p.$) === null || _a === void 0 ? void 0 : _a.token) || '',
                                name: p.Name || '',
                                snapshot: '',
                                video: {
                                    source: null,
                                    encoder: null,
                                },
                                audio: {
                                    source: null,
                                    encoder: null,
                                },
                                stream: {
                                    udp: '',
                                    http: '',
                                    rtsp: '',
                                },
                                ptz: {
                                    range: {
                                        x: { min: 0, max: 0 },
                                        y: { min: 0, max: 0 },
                                        z: { min: 0, max: 0 },
                                    }
                                }
                            };
                            if (p.VideoSourceConfiguration) {
                                profile.video.source = {
                                    token: ((_b = p.VideoSourceConfiguration.$) === null || _b === void 0 ? void 0 : _b.token) || '',
                                    name: p.VideoSourceConfiguration.Name || '',
                                    bounds: {
                                        width: parseInt(p.VideoSourceConfiguration.Bounds.$.width, 10),
                                        height: parseInt(p.VideoSourceConfiguration.Bounds.$.height, 10),
                                        x: parseInt(p.VideoSourceConfiguration.Bounds.$.x, 10),
                                        y: parseInt(p.VideoSourceConfiguration.Bounds.$.y, 10)
                                    }
                                };
                            }
                            if (p.VideoEncoderConfiguration) {
                                profile.video.encoder = {
                                    token: (_c = p.VideoEncoderConfiguration.$) === null || _c === void 0 ? void 0 : _c.token,
                                    name: p.VideoEncoderConfiguration.Name,
                                    resolution: {
                                        width: parseInt(p.VideoEncoderConfiguration.Resolution.Width, 10),
                                        height: parseInt(p.VideoEncoderConfiguration.Resolution.Height, 10),
                                    },
                                    quality: parseInt(p.VideoEncoderConfiguration.Quality, 10),
                                    framerate: parseInt(p.VideoEncoderConfiguration.RateControl.FrameRateLimit, 10),
                                    bitrate: parseInt(p.VideoEncoderConfiguration.RateControl.BitrateLimit, 10),
                                    encoding: p.VideoEncoderConfiguration.Encoding
                                };
                            }
                            if (p.AudioSourceConfiguration) {
                                profile.audio.source = {
                                    token: ((_d = p.AudioSourceConfiguration.$) === null || _d === void 0 ? void 0 : _d.token) || '',
                                    name: p.AudioSourceConfiguration.Name || '',
                                };
                            }
                            if (p.AudioEncoderConfiguration) {
                                profile.audio.encoder = {
                                    token: ((_e = p.AudioEncoderConfiguration.$) === null || _e === void 0 ? void 0 : _e.token) || '',
                                    name: p.AudioEncoderConfiguration.Name,
                                    bitrate: parseInt(p.AudioEncoderConfiguration.Bitrate, 10),
                                    samplerate: parseInt(p.AudioEncoderConfiguration.SampleRate, 10),
                                    encoding: p.AudioEncoderConfiguration.Encoding
                                };
                            }
                            if (p.PTZConfiguration) {
                                try {
                                    var r = p.PTZConfiguration.PanTiltLimits.Range;
                                    var xr = r.XRange;
                                    var x = profile.ptz.range.x;
                                    x.min = parseFloat(xr.Min);
                                    x.max = parseFloat(xr.Max);
                                }
                                catch (e) { }
                                try {
                                    var r = p.PTZConfiguration.PanTiltLimits.Range;
                                    var yr = r.YRange;
                                    var y = profile.ptz.range.y;
                                    y.min = parseFloat(yr.Min);
                                    y.max = parseFloat(yr.Max);
                                }
                                catch (e) { }
                                try {
                                    var r = p.PTZConfiguration.ZoomLimits.Range;
                                    var zr = r.XRange;
                                    var z = profile.ptz.range.z;
                                    z.min = parseFloat(zr.Min);
                                    z.max = parseFloat(zr.Max);
                                }
                                catch (e) { }
                            }
                            _this.profileList.push(profile);
                            if (!_this.currentProfile) {
                                _this.currentProfile = profile;
                            }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _c.sent();
                        throw new Error('Failed to initialize the device: ' + e_4.toString());
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OnvifDevice.prototype.mediaGetStreamUri = function () {
        return __awaiter(this, void 0, void 0, function () {
            var protocolList, index, _i, _a, profile, _b, protocolList_1, protocol, params, res, uri, e_5;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        protocolList = ['UDP', 'HTTP', 'RTSP'];
                        index = 0;
                        _i = 0, _a = this.profileList;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 9];
                        profile = _a[_i];
                        if (!profile) {
                            ++index;
                            return [3 /*break*/, 8];
                        }
                        _b = 0, protocolList_1 = protocolList;
                        _c.label = 2;
                    case 2:
                        if (!(_b < protocolList_1.length)) return [3 /*break*/, 7];
                        protocol = protocolList_1[_b];
                        params = {
                            ProfileToken: profile.token,
                            Protocol: protocol
                        };
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.services.media.getStreamUri(params)];
                    case 4:
                        res = _c.sent();
                        this.lastResponse = res;
                        uri = res.data.GetStreamUriResponse.MediaUri.Uri;
                        uri = this.getUri(uri);
                        switch (protocol) {
                            case 'HTTP':
                                this.profileList[index].stream.http = uri;
                                break;
                            case 'RTSP':
                                this.profileList[index].stream.rtsp = uri;
                                break;
                            case 'UDP':
                                this.profileList[index].stream.udp = uri;
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        e_5 = _c.sent();
                        console.log(e_5);
                        return [3 /*break*/, 6];
                    case 6:
                        _b++;
                        return [3 /*break*/, 2];
                    case 7:
                        ++index;
                        _c.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 1];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    OnvifDevice.prototype.mediaGetSnapshotUri = function () {
        return __awaiter(this, void 0, void 0, function () {
            var index, _i, _a, profile, params, result, snapshotUri, e_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        index = 0;
                        _i = 0, _a = this.profileList;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        profile = _a[_i];
                        if (!profile) {
                            ++index;
                            return [3 /*break*/, 6];
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        params = { ProfileToken: profile.token };
                        return [4 /*yield*/, this.services.media.getSnapshotUri(params)];
                    case 3:
                        result = _b.sent();
                        this.lastResponse = result;
                        snapshotUri = result.data.GetSnapshotUriResponse.MediaUri.Uri;
                        snapshotUri = this.getSnapshotUri(snapshotUri);
                        this.profileList[index].snapshot = snapshotUri;
                        return [3 /*break*/, 5];
                    case 4:
                        e_6 = _b.sent();
                        console.log(e_6);
                        return [3 /*break*/, 5];
                    case 5:
                        ++index;
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    OnvifDevice.prototype.getXaddr = function (directXaddr) {
        if (!this.keepAddr) {
            return directXaddr;
        }
        var address = new URL(directXaddr);
        var path = address.pathname + address.search;
        var xaddr = 'http://' + this.address + path;
        return xaddr;
    };
    OnvifDevice.prototype.getUri = function (directUri) {
        var directuri = '';
        if (typeof (directUri) === 'object' && directUri._) {
            directuri = directUri._;
        }
        else if (typeof (directUri) === 'string') {
            directuri = directUri;
        }
        if (!this.keepAddr)
            return directuri;
        var base = new URL('http://' + this.address);
        var parts = new URL(directuri);
        base.pathname = base.pathname === '/' ? parts.pathname : base.pathname + parts.pathname;
        base.search = parts.search;
        return base.href;
    };
    OnvifDevice.prototype.getSnapshotUri = function (directUri) {
        var directuri = '';
        if (typeof (directUri) === 'object' && directUri._) {
            directuri = directUri._;
        }
        else if (typeof (directUri) === 'string') {
            directuri = directUri;
        }
        if (!this.keepAddr)
            return directuri;
        var base = new URL('http://' + this.address);
        var parts = new URL(directuri);
        base.protocol = parts.protocol;
        base.pathname = base.pathname === '/' ? parts.pathname : base.pathname + parts.pathname;
        base.search = parts.search;
        return base.href;
    };
    return OnvifDevice;
}(events_1.EventEmitter));
exports.OnvifDevice = OnvifDevice;
//# sourceMappingURL=device.js.map