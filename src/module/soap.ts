import { parseStringPromise } from 'xml2js';
import * as mHttp from 'http';
import {createHash} from 'crypto';
import * as mHtml from 'html';

interface Oxaddr {
    protocol: string | null;
    hostname?: string | null;
    port?: number | string | null;
    path?: string | null;
}

export interface Command {
    soap: string;
    formatted: string;
    converted: any;
    data: any;
}


const HTTP_TIMEOUT = 3000; // ms

export function parse(soap: string) {
    return parseStringPromise(soap, {
        explicitRoot: false,
        explicitArray: false,
        ignoreAttrs: false,
        tagNameProcessors: [
            (name) => {
                const m = name.match(/^([^\:]+)\:([^\:]+)$/);
                return m ? m[2] : name;
            }
        ]
    });
}

export function requestCommand(oxaddr: Oxaddr, methodName: string, soap: string) {
    return new Promise<Command>((resolve, reject) => {
        let xml = '';
        request(oxaddr, soap).then((res) => {
            xml = res;
            return parse(res);
        }).then((result) => {
            const fault = getFaultReason(result);
            if (fault) {
                reject(new Error(fault));
            } else {
                const parsed = parseResponseResult(methodName, result);
                if(parsed) {
                    resolve({
                        soap     : xml,
                        formatted: mHtml.prettyPrint(xml, {indent_size: 2}),
                        converted: result,
                        data: parsed
                    });
                } else {
                    reject(new Error('The device seems to not support the ' + methodName + '() method.'));
                }
            }
        }).catch((err) => reject(err));
    });
}

interface SoapParams {
    xmlns?: string[];
    diff?: number;
    user?: string;
    pass?: string;
    body: string;
}

export function createRequestSoap(params: SoapParams) {
        let soap = '';
        soap += '<?xml version="1.0" encoding="UTF-8"?>';
        soap += '<s:Envelope';
        soap += '  xmlns:s="http://www.w3.org/2003/05/soap-envelope"';
        if(params.xmlns) {
            params.xmlns.forEach((ns) => {
                soap += ' ' + ns;
            });
        }
        soap += '>';
        soap += '<s:Header>';
        if(params.user) {
            soap += createSoapUserToken(params.diff, params.user, params.pass);
        }
        soap += '</s:Header>';
        soap += '<s:Body>' + params.body + '</s:Body>';
        soap += '</s:Envelope>';

        soap = soap.replace(/\>\s+\</g, '><');
        return soap;
    }

function request(oxaddr: Oxaddr, soap: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let req = mHttp.request(
                {
                    protocol: oxaddr.protocol,
                    hostname: oxaddr.hostname,
                    port: oxaddr.port || 80,
                    path: oxaddr.path,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/soap+xml; charset=utf-8;',
                        'Content-Length': Buffer.byteLength(soap)
                    }
                },
                (res) => {
                    res.setEncoding('utf-8');
                    let xml = '';
                    res.on('data', (chunk) => {
                        xml += chunk;
                    });

                    res.on('end', () => {
                        if (req) {
                            req.removeAllListeners('error');
                            req.removeAllListeners('timeout');
                            req = null;
                        }
                        if (res) {
                            res.removeAllListeners('data');
                            res.removeAllListeners('end');
                        }
                        if (res.statusCode === 200 ) {
                            resolve(xml);
                        } else {
                            const err = new Error(res.statusCode + ' ' + res.statusMessage);
                            const code = res.statusCode;
                            const text = res.statusMessage;
                            if (xml) {
                                parse(xml).then((parsed) => {
                                    let msg = parsed.Body?.Fault?.Reason?.Text;
                                    if (typeof(msg) === 'object') {
                                        msg = msg._;
                                    }
                                    if (msg) {
                                        reject(new Error(code + ' ' + text + '-' + msg));
                                    } else {
                                        reject(err);
                                    }
                                }).catch((error) => {
                                    reject(error);
                                });
                            } else {
                                reject(err);
                            }
                        }
                        res = null;
                    });
                });
                req.setTimeout(HTTP_TIMEOUT);

                req.on('timeout', () => {
                    req.abort();
                });

                req.on('error', (err) => {
                    req.removeAllListeners('error');
                    req.removeAllListeners('timeout');
                    req = null;
                    reject(new Error('Network Error: ' + (err ? err.message : '')));
                });

                req.write(soap, 'utf8');
                req.end();
        });
    }

function getFaultReason(r: any): string {
        try {
            const reasonEl = r.Body.Fault.Reason;
            if (reasonEl.Text) {
                return reasonEl.Text;
            }
            const codeEl = r.Body.Fault.Code;
			if(codeEl.Value) {
				let reason = codeEl.Value;
				const subcodeEl = codeEl.Subcode;
				if(subcodeEl.Value) {
					reason += ' ' + subcodeEl.Value;
                }
                return reason;
            }
            return '';
        } catch(e) {
            return '';
        }

    }

function parseResponseResult(methodName: string, res: any) {
        const s0 = res.Body;
        if (!s0) {
            return null;
        }
        if ((methodName + 'Response') in s0) {
            return s0;
        }
        return null;
    }

function createSoapUserToken(diff: number, user: string, pass: string) {
        if (!diff) { diff = 0;}
        if (!pass) { pass = '';}
        const date = (new Date(Date.now() + diff)).toISOString();
        const nonceBuffer = createNonce(16);
        const nonceBase64 = nonceBuffer.toString('base64');
        const shasum = createHash('sha1');

        shasum.update(Buffer.concat([nonceBuffer, new Buffer(date), new Buffer(pass)]));
        const digest = shasum.digest('base64');
        return `<Security s:mustUnderstand="1" xmlns="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
            <UsernameToken>
                <Username>${user}</Username>
                <Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">${digest}</Password>
                <Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">${nonceBase64}</Nonce>
                <Created xmlns="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">${date}</Created>
            </UsernameToken>
        </Security>`;
    }

function createNonce(digit: number) {
    const nonce = new Buffer(digit);
    for(let i = 0; i < digit; i++) {
        nonce.writeUInt8(Math.floor(Math.random() * 256), i);
    }
    return nonce;
}

    function getTypeOfValue(value: any) {
        if (value === undefined) {
            return 'undefined';
        }

        if (value === null) {
            return 'null';
        }

        if (Array.isArray(value)) {
            return 'array';
        }

        const t = typeof(value);
        if (t === 'boolean') {
            return t;
        }

        if (t === 'string') {
            return t;
        }

        if (t === 'number') {
            if (value % 1 === 0) {
                return 'integer';
            }

            return 'float';
        }

        if (t === 'object') {
            if (Object.toString.call(value) === '[object Object]') {
                return 'object';
            }
        }

        return 'unknown';
    }

export function isInvalidValue(value: any, type: string, allowEmpty: boolean = false): string {
    const vt = getTypeOfValue(value);
    if (type === 'float') {
        if(!vt.match(/^(float|integer)$/)) {
            return 'The type of the value must be "' + type + '".';
        }
    } else {
        if(vt !== type) {
            return 'The type of the value must be "' + type + '".';
        }
    }

    if(!allowEmpty) {
        if(vt === 'array' && value.length === 0) {
            return 'The value must not be an empty array.';
        } else if(vt === 'string' && value === '') {
            return 'The value must not be an empty string.';
        }
    }
    if(typeof(value) === 'string') {
        if(value.match(/[^\x20-\x7e]/)) {
            return 'The value must consist of ascii characters.';
        }
        if(value.match(/[\<\>]/)) {
            return 'Invalid characters were found in the value ("<", ">")';
        }
    }
}