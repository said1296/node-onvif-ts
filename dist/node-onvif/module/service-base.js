"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnvifServiceBase = void 0;
var soap_1 = require("./soap");
var OnvifServiceBase = /** @class */ (function () {
    function OnvifServiceBase(_a) {
        var xaddr = _a.xaddr, user = _a.user, pass = _a.pass;
        this.xaddr = '';
        this.user = '';
        this.pass = '';
        this.xaddr = xaddr;
        this.user = user || '';
        this.pass = pass || '';
        this.oxaddr = new URL(this.xaddr);
        if (this.user) {
            this.oxaddr.username = this.user;
            this.oxaddr.password = this.pass;
        }
        this.timeDiff = 0;
    }
    OnvifServiceBase.prototype.createRequestSoap = function (body, withoutUser) {
        if (withoutUser === void 0) { withoutUser = false; }
        return withoutUser
            ? soap_1.createRequestSoap({
                body: body,
                xmlns: this.namespaceAttrList,
                diff: this.timeDiff,
            })
            : soap_1.createRequestSoap({
                body: body,
                xmlns: this.namespaceAttrList,
                diff: this.timeDiff,
                user: this.user,
                pass: this.pass,
            });
    };
    OnvifServiceBase.prototype.setAuth = function (user, pass) {
        this.user = user;
        this.pass = pass;
        if (this.user) {
            this.oxaddr.username = this.user;
            this.oxaddr.password = this.pass;
        }
        else {
            this.oxaddr.username = null;
            this.oxaddr.password = null;
        }
    };
    return OnvifServiceBase;
}());
exports.OnvifServiceBase = OnvifServiceBase;
//# sourceMappingURL=service-base.js.map