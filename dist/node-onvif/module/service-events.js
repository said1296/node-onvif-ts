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
exports.OnvifServiceEvents = void 0;
var service_base_1 = require("./service-base");
var soap_1 = require("./soap");
var OnvifServiceEvents = /** @class */ (function (_super) {
    __extends(OnvifServiceEvents, _super);
    function OnvifServiceEvents(configs) {
        var _this = this;
        var xaddr = configs.xaddr, user = configs.user, pass = configs.pass, timeDiff = configs.timeDiff;
        _this = _super.call(this, { xaddr: xaddr, user: user, pass: pass }) || this;
        _this.timeDiff = timeDiff;
        _this.namespaceAttrList = [
            'xmlns:wsa="http://www.w3.org/2005/08/addressing"',
            'xmlns:tev="http://www.onvif.org/ver10/events/wsdl"'
        ];
        return _this;
    }
    OnvifServiceEvents.prototype.getEventProperties = function () {
        var soapBody = '<tev:GetEventProperties/>';
        var soap = this.createRequestSoap(soapBody);
        return soap_1.requestCommand(this.oxaddr, 'GetEventProperties', soap);
    };
    return OnvifServiceEvents;
}(service_base_1.OnvifServiceBase));
exports.OnvifServiceEvents = OnvifServiceEvents;
//# sourceMappingURL=service-events.js.map