export declare class OnvifServiceBase {
    protected xaddr: string;
    protected user: string;
    protected pass: string;
    protected oxaddr: URL;
    protected timeDiff: number;
    protected namespaceAttrList: string[];
    constructor({ xaddr, user, pass }: OnvifServiceBaseConfigs);
    protected createRequestSoap(body: string, withoutUser?: boolean): string;
    setAuth(user: string, pass: string): void;
}
export interface OnvifServiceBaseConfigs {
    xaddr: string;
    user?: string;
    pass?: string;
}
