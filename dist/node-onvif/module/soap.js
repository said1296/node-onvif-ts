"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequestSoap = exports.requestCommand = exports.parse = void 0;
var xml2js_1 = require("xml2js");
var mHttp = require("http");
var crypto_1 = require("crypto");
var mHtml = require("html");
var HTTP_TIMEOUT = 3000; // ms
function parse(soap) {
    return xml2js_1.parseStringPromise(soap, {
        explicitRoot: false,
        explicitArray: false,
        ignoreAttrs: false,
        tagNameProcessors: [
            function (name) {
                var m = name.match(/^([^\:]+)\:([^\:]+)$/);
                return m ? m[2] : name;
            }
        ]
    });
}
exports.parse = parse;
function requestCommand(oxaddr, methodName, soap) {
    return new Promise(function (resolve, reject) {
        var xml = '';
        request(oxaddr, soap).then(function (res) {
            xml = res;
            return parse(res);
        }).then(function (result) {
            var fault = getFaultReason(result);
            if (fault) {
                reject(new Error(fault));
            }
            else {
                var parsed = parseResponseResult(methodName, result);
                if (parsed) {
                    resolve({
                        soap: xml,
                        formatted: mHtml.prettyPrint(xml, { indent_size: 2 }),
                        converted: result,
                        data: parsed
                    });
                }
                else {
                    reject(new Error('The device seems to not support the ' + methodName + '() method.'));
                }
            }
        }).catch(function (err) { return reject(err); });
    });
}
exports.requestCommand = requestCommand;
function createRequestSoap(params) {
    var soap = '';
    soap += '<?xml version="1.0" encoding="UTF-8"?>';
    soap += '<s:Envelope';
    soap += '  xmlns:s="http://www.w3.org/2003/05/soap-envelope"';
    if (params.xmlns) {
        params.xmlns.forEach(function (ns) {
            soap += ' ' + ns;
        });
    }
    soap += '>';
    soap += '<s:Header>';
    if (params.user) {
        soap += createSoapUserToken(params.diff, params.user, params.pass);
    }
    soap += '</s:Header>';
    soap += '<s:Body>' + params.body + '</s:Body>';
    soap += '</s:Envelope>';
    soap = soap.replace(/\>\s+\</g, '><');
    return soap;
}
exports.createRequestSoap = createRequestSoap;
function request(oxaddr, soap) {
    return new Promise(function (resolve, reject) {
        var opts = {
            protocol: oxaddr.protocol,
            hostname: oxaddr.hostname,
            port: oxaddr.port || 80,
            path: oxaddr.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/soap+xml; charset=utf-8;',
                'Content-Length': Buffer.byteLength(soap)
            }
        };
        var req = mHttp.request(opts, function (res) {
            res.setEncoding('utf8');
            var xml = '';
            res.on('data', function (chunk) {
                xml += chunk;
            });
            res.on('end', function () {
                if (req) {
                    req.removeAllListeners('error');
                    req.removeAllListeners('timeout');
                    req = null;
                }
                if (res) {
                    res.removeAllListeners('data');
                    res.removeAllListeners('end');
                }
                if (res.statusCode === 200) {
                    resolve(xml);
                }
                else {
                    var err_1 = new Error(res.statusCode + ' ' + res.statusMessage);
                    var code_1 = res.statusCode;
                    var text_1 = res.statusMessage;
                    if (xml) {
                        parse(xml).then(function (parsed) {
                            var _a, _b, _c;
                            var msg = (_c = (_b = (_a = parsed.Body) === null || _a === void 0 ? void 0 : _a.Fault) === null || _b === void 0 ? void 0 : _b.Reason) === null || _c === void 0 ? void 0 : _c.Text;
                            if (typeof (msg) === 'object') {
                                msg = msg._;
                            }
                            if (msg) {
                                reject(new Error(code_1 + ' ' + text_1 + '-' + msg));
                            }
                            else {
                                reject(err_1);
                            }
                        }).catch(function (error) {
                            reject(error);
                        });
                    }
                    else {
                        reject(err_1);
                    }
                }
                res = null;
            });
        });
        req.setTimeout(HTTP_TIMEOUT);
        req.on('timeout', function () {
            req.destroy();
        });
        req.on('error', function (err) {
            req.removeAllListeners('error');
            req.removeAllListeners('timeout');
            req = null;
            reject(new Error('Network Error: ' + (err ? err.message : '')));
        });
        req.write(soap, 'utf8');
        req.end();
    });
}
function getFaultReason(r) {
    try {
        var reasonEl = r.Body.Fault.Reason;
        if (reasonEl.Text) {
            return reasonEl.Text;
        }
        var codeEl = r.Body.Fault.Code;
        if (codeEl.Value) {
            var reason = codeEl.Value;
            var subcodeEl = codeEl.Subcode;
            if (subcodeEl.Value) {
                reason += ' ' + subcodeEl.Value;
            }
            return reason;
        }
        return '';
    }
    catch (e) {
        return '';
    }
}
function parseResponseResult(methodName, res) {
    var s0 = res.Body;
    if (!s0) {
        return null;
    }
    if ((methodName + 'Response') in s0) {
        return s0;
    }
    return null;
}
function createSoapUserToken(diff, user, pass) {
    if (!diff) {
        diff = 0;
    }
    if (!pass) {
        pass = '';
    }
    var date = (new Date(Date.now() + diff)).toISOString();
    var nonceBuffer = createNonce(16);
    var nonceBase64 = nonceBuffer.toString('base64');
    var shasum = crypto_1.createHash('sha1');
    shasum.update(Buffer.concat([nonceBuffer, Buffer.from(date), Buffer.from(pass)]));
    var digest = shasum.digest('base64');
    return "<Security s:mustUnderstand=\"1\" xmlns=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">\n        <UsernameToken>\n            <Username>" + user + "</Username>\n            <Password Type=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest\">" + digest + "</Password>\n            <Nonce EncodingType=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary\">" + nonceBase64 + "</Nonce>\n            <Created xmlns=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\">" + date + "</Created>\n        </UsernameToken>\n    </Security>";
}
function createNonce(digit) {
    var nonce = Buffer.alloc(digit);
    for (var i = 0; i < digit; i++) {
        nonce.writeUInt8(Math.floor(Math.random() * 256), i);
    }
    return nonce;
}
//# sourceMappingURL=soap.js.map