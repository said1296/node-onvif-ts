/// <reference types="node" />
import { EventEmitter } from 'events';
import { OnvifServiceEvents } from './service-events';
import { OnvifServiceMedia } from './service-media';
import { OnvifServicePtz } from './service-ptz';
import { OnvifServiceDevice } from './service-device';
import { IncomingHttpHeaders } from 'http';
export interface Information {
    Manufacturer: string;
    Model: string;
    FirmwareVersion: string;
    SerialNumber: string;
    HardwareId: string;
}
export declare class OnvifDevice extends EventEmitter {
    address: string;
    services: Services;
    private xaddr;
    private user;
    private pass;
    private oxaddr;
    private keepAddr;
    private lastResponse;
    private timeDiff;
    private information;
    private profileList;
    private currentProfile;
    private ptzMoving;
    constructor(configs: OnvifDeviceConfigs);
    getInformation(): Information;
    getCurrentProfile(): Profile;
    getProfileList(): Profile[];
    changeProfile(index: number | string): Profile | null;
    getUdpStreamUrl(): string;
    init(): Promise<Information>;
    fetchSnapshot(): Promise<Snapshot>;
    ptzMove(params: PtzMoveParams): Promise<void>;
    ptzStop(): Promise<void>;
    setAuth(user: string, pass: string): void;
    private getSystemDateAndTime;
    private getCapabilities;
    private getDeviceInformation;
    private mediaGetProfiles;
    private mediaGetStreamUri;
    private mediaGetSnapshotUri;
    private getXaddr;
    private getUri;
    private getSnapshotUri;
}
export interface Snapshot {
    headers: IncomingHttpHeaders;
    body: Buffer;
}
export declare type OnvifDeviceConfigs = ({
    xaddr: string;
} | {
    address: string;
}) & {
    user?: string;
    pass?: string;
};
export interface Profile {
    name: string;
    token: string;
    stream: {
        udp: string;
        http: string;
        rtsp: string;
    };
    snapshot: string;
    video: {
        source: VideoSource;
        encoder: VideoEncoder;
    };
    audio: {
        source: AudioSource;
        encoder: AudioEncoder;
    };
    ptz: {
        range: {
            x: {
                min: number;
                max: number;
            };
            y: {
                min: number;
                max: number;
            };
            z: {
                min: number;
                max: number;
            };
        };
    };
}
export interface VideoSource {
    token: string;
    name: string;
    bounds: {
        width: number;
        height: number;
        x: number;
        y: number;
    };
}
export interface VideoEncoder {
    token: string;
    name: string;
    resolution: {
        width: number;
        height: number;
    };
    quality: number;
    framerate: number;
    bitrate: number;
    encoding: string;
}
export interface AudioSource {
    token: string;
    name: string;
}
export interface AudioEncoder {
    token: string;
    name: string;
    bitrate: number;
    samplerate: number;
    encoding: string;
}
export interface PtzMoveParams {
    speed: {
        x: number;
        y: number;
        z: number;
    };
    timeout?: number;
}
interface Services {
    device: OnvifServiceDevice | null;
    events: OnvifServiceEvents | null;
    media: OnvifServiceMedia | null;
    ptz: OnvifServicePtz | null;
}
export {};
