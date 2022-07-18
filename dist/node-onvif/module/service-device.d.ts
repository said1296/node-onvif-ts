import { Result } from './soap';
import { OnvifServiceBase, OnvifServiceBaseConfigs } from './service-base';
export declare class OnvifServiceDevice extends OnvifServiceBase {
    constructor(configs: OnvifServiceBaseConfigs);
    getTimeDiff(): number;
    private fixTimeDiff;
    getCapabilities(): Promise<Result>;
    getWsdlUrl(): Promise<Result>;
    getDiscoveryMode(): Promise<Result>;
    getScopes(): Promise<Result>;
    setScopes(params: {
        Scopes: string[];
    }): Promise<Result>;
    addScopes(params: {
        Scopes: string[];
    }): Promise<Result>;
    removeScopes(params: {
        Scopes: string[];
    }): Promise<Result>;
    getHostname(): Promise<Result>;
    setHostname(params: {
        Name: string;
    }): Promise<Result>;
    getDNS(): Promise<Result>;
    setDNS(params: SetDNSParams): Promise<Result>;
    getNetworkInterfaces(): Promise<Result>;
    getNetworkProtocols(): Promise<Result>;
    setNetworkProtocols(params: SetNetworkProtocolsParams): Promise<Result>;
    getNetworkDefaultGateway(): Promise<Result>;
    setNetworkDefaultGateway(params: SetNetworkDefaultGatewayParams): Promise<Result>;
    getDeviceInformation(): Promise<Result>;
    getSystemDateAndTime(): Promise<Result>;
    setSystemDateAndTime(params: SetSystemDateAndTimeParams): Promise<Result>;
    reboot(): Promise<Result>;
    getUsers(): Promise<Result>;
    createUser(params: CreateUserParams): Promise<Result>;
    deleteUser(params: DeleteUserParams): Promise<Result>;
    setUser(params: SetUserParams): Promise<Result>;
    getRelayOutputs(): Promise<Result>;
    getNTP(): Promise<Result>;
    setNTP(params: SetNTPParams): Promise<Result>;
    getDynamicDNS(): Promise<Result>;
    getZeroConfiguration(): Promise<Result>;
    getIPAddressFilter(): Promise<Result>;
    setIPAddressFilter(params: SetIPAddressFilterParams): Promise<Result>;
    getServices(params: {
        IncludeCapability: boolean;
    }): Promise<Result>;
    getServiceCapabilities(): Promise<Result>;
}
export declare type IPAddress = {
    Type: 'IPv4';
    IPv4Address: string;
} | {
    Type: 'IPv6';
    IPv6Address: string;
};
export interface SetIPAddressFilterParams {
    Type: 'Allow' | 'Deny';
    IPv4Address: {
        Address: string;
        PrefixLength: number;
    }[];
}
export interface SetNTPParams {
    FromDHCP: boolean;
    NTPManual?: IPAddress | {
        Type: 'DNS';
        DNS: string;
    };
}
export interface SetUserParams {
    User: {
        Username: string;
        Password?: string;
        UserLevel: 'Administrator' | 'Operator' | 'User' | 'Anonymous';
    }[];
}
export interface DeleteUserParams {
    User: {
        Username: string;
    }[];
}
export interface CreateUserParams {
    User: {
        Username: string;
        Password: string;
        UserLevel: 'Administrator' | 'Operator' | 'User' | 'Anonymous';
    }[];
}
export interface SetSystemDateAndTimeParams {
    DateTimeType: 'NTP' | 'Manual';
    DaylightSavings: boolean;
    TimeZone?: string;
    UTCDateTime?: Date;
}
export interface SetNetworkDefaultGatewayParams {
    NetworkGateway: ({
        IPv4Address?: string;
    } | {
        IPv6Address?: string;
    })[];
}
export declare type NetworkProtocol = {
    Name: 'HTTP' | 'HTTPS' | 'RTSP';
} & ({
    Enabled: boolean;
} | {
    Port: number;
});
export interface SetNetworkProtocolsParams {
    NetworkProtocols: NetworkProtocol[];
}
export interface SetDNSParams {
    FromDHCP?: boolean;
    SearchDomain?: string[];
    DNSManual?: IPAddress[];
}
