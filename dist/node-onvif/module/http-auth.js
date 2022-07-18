"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnvifHttpAuth = void 0;
var mHttp = require("http");
var mHttps = require("https");
var crypto_1 = require("crypto");
var OnvifHttpAuth = /** @class */ (function () {
    function OnvifHttpAuth() {
        this.user = '';
        this.pass = '';
        this.method = '';
        this.path = '';
        this.nonceCount = 0;
    }
    OnvifHttpAuth.prototype.request = function (options, callback) {
        var _this = this;
        this.options = options;
        var http = (options && options.protocol === 'https:') ? mHttps : mHttp;
        if (options.auth) {
            var pair = options.auth.split(':');
            this.user = pair[0];
            this.pass = pair[1];
        }
        if (options.method) {
            this.method = options.method.toUpperCase();
        }
        else {
            this.method = 'GET';
        }
        if (options.path) {
            this.path = options.path;
        }
        return http.request(options, function (res) {
            if (res.statusCode === 401 && res.headers['www-authenticate']) {
                if (res.headers['www-authenticate'].match(/Digest realm/)) {
                    _this.handleHttpDigest(http, res, callback);
                }
                else {
                    callback(res);
                }
            }
            else {
                callback(res);
            }
        });
    };
    OnvifHttpAuth.prototype.handleHttpDigest = function (http, res, callback) {
        var o = this.parseAuthHeader(res.headers['www-authenticate']);
        if (!this.options.headers) {
            this.options.headers = {};
        }
        this.options.headers.Authorization = this.createAuthReqHeaderValue(o);
        http.request(this.options, callback).end();
    };
    OnvifHttpAuth.prototype.parseAuthHeader = function (h) {
        var o = {};
        h.split(/,\s*/).forEach(function (s) {
            var pair = s.split('=');
            var k = pair[0];
            var v = pair.slice(1).join('=');
            if (!k || !v) {
                return;
            }
            v = v.replace(/^\"/, '');
            v = v.replace(/\"$/, '');
            o[k] = v;
        });
        if (!o.algorithm) { // workaround for DBPOWER
            o.algorithm = 'MD5';
        }
        return o;
    };
    OnvifHttpAuth.prototype.createAuthReqHeaderValue = function (o) {
        var ha1 = this.createHash(o.algorithm, [this.user, o['Digest realm'], this.pass].join(':'));
        var ha2 = this.createHash(o.algorithm, [this.method, this.path].join(':'));
        var cnonce = this.createCnonce(8);
        this.nonceCount++;
        var nc = ('0000000' + this.nonceCount.toString(16)).slice(-8);
        var response = this.createHash(o.algorithm, [ha1, o.nonce, nc, cnonce, o.qop, ha2].join(':'));
        return 'Digest' + [
            'username="' + this.user + '"',
            'realm="' + o['Digest realm'] + '"',
            'nonce="' + o.nonce + '"',
            'uri="' + this.path + '"',
            'algorithm=' + o.algorithm,
            'qop=' + o.qop,
            'nc=' + nc,
            'cnonce="' + cnonce + '"',
            'response="' + response + '"'
        ].join(', ');
    };
    OnvifHttpAuth.prototype.createHash = function (algo, data) {
        var hash = algo === 'MD5' ? crypto_1.createHash('MD5') : crypto_1.createHash('sha256');
        hash.update(data, 'utf8');
        return hash.digest('hex');
    };
    OnvifHttpAuth.prototype.createCnonce = function (digit) {
        var nonce = Buffer.alloc(digit);
        Array(digit).fill(0).forEach(function (_, i) {
            nonce.writeUInt8(Math.floor(Math.random() * 256), i);
        });
        return nonce.toString('hex');
    };
    return OnvifHttpAuth;
}());
exports.OnvifHttpAuth = OnvifHttpAuth;
//# sourceMappingURL=http-auth.js.map