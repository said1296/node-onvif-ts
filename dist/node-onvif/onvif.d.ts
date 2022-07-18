export interface Probe {
    urn: string;
    name: string;
    hardware: string;
    location: string;
    types: string[];
    xaddrs: string[];
    scopes: string[];
}
export declare function startDiscovery(callback: (probe: Probe, error?: any) => void): void;
export declare function startProbe(): Promise<Probe[]>;
export declare function stopDiscovery(): Promise<void>;
