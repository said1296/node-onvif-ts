export interface Result {
    soap: string;
    formatted: string;
    converted: any;
    data: any;
}
export declare function parse(soap: string): Promise<any>;
export declare function requestCommand(oxaddr: URL, methodName: string, soap: string): Promise<Result>;
interface SoapParams {
    xmlns?: string[];
    diff?: number;
    user?: string;
    pass?: string;
    body: string;
}
export declare function createRequestSoap(params: SoapParams): string;
export {};
