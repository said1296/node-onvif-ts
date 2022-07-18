"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopDiscovery = exports.startProbe = exports.startDiscovery = void 0;
var dgram_1 = require("dgram");
var crypto_1 = require("crypto");
var soap_1 = require("./module/soap");
var DISCOVERY_RETRY_MAX = 3;
var DISCOVERY_WAIT = 3000;
var DISCOVERY_INTERVAL = 150;
var MULTICAST_ADDRESS = '239.255.255.250';
var PORT = 3702;
var discoveryIntervalTimer = null;
var discoveryWaitTimer = null;
var udp = null;
var devices = {};
function startDiscovery(callback) {
    startProbe().then(function (list) {
        var execCallback = function () {
            var d = list.shift();
            if (d) {
                callback(d);
                setTimeout(function () {
                    execCallback();
                }, 100);
            }
        };
        execCallback();
    }).catch(function (error) {
        callback(null, error);
    });
}
exports.startDiscovery = startDiscovery;
function startProbe() {
    return new Promise(function (resolve, reject) {
        devices = {};
        udp = dgram_1.createSocket('udp4');
        udp.once('error', function (error) {
            console.log(error);
            reject(error);
        });
        udp.on('message', function (buf) {
            soap_1.parse(buf.toString()).then(function (res) {
                var urn;
                var xaddrs = [];
                var scopes = [];
                var types = [];
                try {
                    var probeMatch = res.Body.ProbeMatches.ProbeMatch;
                    urn = probeMatch.EndpointReference.Address;
                    xaddrs = probeMatch.XAddrs.split(/\s+/);
                    if (typeof (probeMatch.Scopes) === 'string') {
                        scopes = probeMatch.Scopes.split(/\s+/);
                    }
                    else if (typeof (probeMatch.Scopes) === 'object' && typeof (probeMatch.Scopes._) === 'string') {
                        scopes = probeMatch.Scopes._.split(/\s+/);
                    }
                    // modified to support Pelco cameras
                    if (typeof (probeMatch.Types) === 'string') {
                        types = probeMatch.Types.split(/\s+/);
                    }
                    else if (typeof (probeMatch.Types) === 'object' && typeof (probeMatch.Types._) === 'string') {
                        types = probeMatch.Types._.split(/\s+/);
                    }
                }
                catch (e) {
                    return;
                }
                if (urn && xaddrs.length > 0 && scopes.length > 0) {
                    if (!devices[urn]) {
                        var name_1 = '';
                        var hardware_1 = '';
                        var location_1 = '';
                        scopes.forEach(function (s) {
                            if (s.indexOf('onvif://www.onvif.org/hardware/') === 0) {
                                hardware_1 = s.split('/').pop();
                            }
                            else if (s.indexOf('onvif://www.onvif.org/location/') === 0) {
                                location_1 = s.split('/').pop();
                            }
                            else if (s.indexOf('onvif://www.onvif.org/name/') === 0) {
                                name_1 = s.split('/').pop();
                                name_1 = name_1.replace(/_/g, ' ');
                            }
                        });
                        var probe = {
                            urn: urn,
                            name: name_1,
                            hardware: hardware_1,
                            location: location_1,
                            types: types,
                            xaddrs: xaddrs,
                            scopes: scopes
                        };
                        devices[urn] = probe;
                    }
                }
            }).catch(function (error) {
                // Do nothing.
                console.log(error);
            });
        });
        udp.bind(function () {
            udp.removeAllListeners('error');
            sendProbe().catch(function (e) { reject(e); });
            discoveryIntervalTimer = setTimeout(function () {
                stopProbe().then(function () {
                    resolve(Object.values(devices));
                }).catch(function (err) {
                    reject(err);
                });
            }, DISCOVERY_WAIT);
        });
    });
}
exports.startProbe = startProbe;
function sendProbe() {
    var soapTmpl = '';
    soapTmpl += '<?xml version="1.0" encoding="UTF-8"?>';
    soapTmpl += '<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing">';
    soapTmpl += '  <s:Header>';
    soapTmpl += '    <a:Action s:mustUnderstand="1">http://schemas.xmlsoap.org/ws/2005/04/discovery/Probe</a:Action>';
    soapTmpl += '    <a:MessageID>uuid:__uuid__</a:MessageID>';
    soapTmpl += '    <a:ReplyTo>';
    soapTmpl += '      <a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address>';
    soapTmpl += '    </a:ReplyTo>';
    soapTmpl += '    <a:To s:mustUnderstand="1">urn:schemas-xmlsoap-org:ws:2005:04:discovery</a:To>';
    soapTmpl += '  </s:Header>';
    soapTmpl += '  <s:Body>';
    soapTmpl += '    <Probe xmlns="http://schemas.xmlsoap.org/ws/2005/04/discovery">';
    soapTmpl += '      <d:Types xmlns:d="http://schemas.xmlsoap.org/ws/2005/04/discovery" xmlns:dp0="http://www.onvif.org/ver10/network/wsdl">dp0:__type__</d:Types>';
    soapTmpl += '    </Probe>';
    soapTmpl += '  </s:Body>';
    soapTmpl += '</s:Envelope>';
    soapTmpl = soapTmpl.replace(/\>\s+\</g, '><');
    soapTmpl = soapTmpl.replace(/\s+/, ' ');
    var soapSet = ['NetworkVideoTransmitter', 'Device', 'NetworkVideoDisplay'].map(function (type) {
        var s = soapTmpl;
        s = s.replace('__type__', type);
        s = s.replace('__uuid__', createUuidV4());
        return s;
    });
    var soapList = [];
    Array(DISCOVERY_RETRY_MAX).fill(0).forEach(function () {
        soapSet.forEach(function (s) {
            soapList.push(s);
        });
    });
    return new Promise(function (resolve, reject) {
        if (!udp) {
            reject(new Error('No UDP connection is available. The init() method might not be called yet.'));
        }
        var send = function () {
            var soap = soapList.shift();
            if (soap) {
                var buf = Buffer.from(soap, 'utf8');
                udp.send(buf, 0, buf.length, PORT, MULTICAST_ADDRESS, function () {
                    discoveryIntervalTimer = setTimeout(function () {
                        send();
                    }, DISCOVERY_INTERVAL);
                });
            }
            else {
                resolve();
            }
        };
        send();
    });
}
function createUuidV4() {
    var clist = crypto_1.randomBytes(16).toString('hex').toLowerCase().split('');
    clist[12] = '4';
    // tslint:disable-next-line: no-bitwise
    clist[16] = (parseInt(clist[16], 16) & 3 | 8).toString(16);
    var m = clist.join('').match(/^(.{8})(.{4})(.{4})(.{4})(.{12})/);
    var uuid = [m[1], m[2], m[3], m[4], m[5]].join('-');
    // uuid = uuid;
    return uuid;
}
function stopDiscovery() {
    return stopProbe();
}
exports.stopDiscovery = stopDiscovery;
function stopProbe() {
    if (discoveryIntervalTimer !== null) {
        clearTimeout(discoveryIntervalTimer);
        discoveryIntervalTimer = null;
    }
    if (discoveryWaitTimer !== null) {
        clearTimeout(discoveryWaitTimer);
        discoveryWaitTimer = null;
    }
    return new Promise(function (resolve) {
        if (udp) {
            udp.close(function () {
                udp.unref();
                udp = null;
                resolve();
            });
        }
        else {
            resolve();
        }
    });
}
//# sourceMappingURL=onvif.js.map