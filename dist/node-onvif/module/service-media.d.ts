import { OnvifServiceBase, OnvifServiceBaseConfigs } from './service-base';
import { Result } from './soap';
export declare class OnvifServiceMedia extends OnvifServiceBase {
    constructor(configs: OnvifServiceMediaConfigs);
    getStreamUri(params: GetStreamUriParams): Promise<Result>;
    getVideoEncoderConfigurations(): Promise<Result>;
    getVideoEncoderConfiguration(params: ConfigurationTokenParams): Promise<Result>;
    addVideoEncoderConfiguration(params: ProfileAndConfigurationTokenParams): Promise<Result>;
    getCompatibleVideoEncoderConfigurations(params: ProfileTokenParams): Promise<Result>;
    getVideoEncoderConfigurationOptions(params: ProfileAndConfigurationTokenOptionalParams): Promise<Result>;
    removeVideoEncoderConfiguration(params: ProfileTokenParams): Promise<Result>;
    setVideoEncoderConfiguration(params: SetVideoEncoderConfigurationParams): Promise<Result>;
    getGuaranteedNumberOfVideoEncoderInstances(params: ConfigurationTokenParams): Promise<Result>;
    getProfiles(): Promise<Result>;
    getProfile(params: ProfileTokenParams): Promise<Result>;
    createProfile(params: CreateProfileParams): Promise<Result>;
    deleteProfile(params: ProfileTokenParams): Promise<Result>;
    getVideoSources(): Promise<Result>;
    getVideoSourceConfiguration(params: ConfigurationTokenParams): Promise<Result>;
    getVideoSourceConfigurations(): Promise<Result>;
    addVideoSourceConfiguration(params: ProfileAndConfigurationTokenParams): Promise<Result>;
    getCompatibleVideoSourceConfigurations(params: ProfileTokenParams): Promise<Result>;
    getVideoSourceConfigurationOptions(params: ProfileAndConfigurationTokenOptionalParams): Promise<Result>;
    removeVideoSourceConfiguration(params: ProfileTokenParams): Promise<Result>;
    setVideoSourceConfiguration(params: SetVideoSourceConfigurationParams): Promise<Result>;
    getMetadataConfiguration(params: ConfigurationTokenParams): Promise<Result>;
    getMetadataConfigurations(): Promise<Result>;
    addMetadataConfiguration(params: ProfileAndConfigurationTokenParams): Promise<Result>;
    getCompatibleMetadataConfigurations(params: ProfileTokenParams): Promise<Result>;
    getMetadataConfigurationOptions(params: ProfileAndConfigurationTokenOptionalParams): Promise<Result>;
    removeMetadataConfiguration(params: ProfileTokenParams): Promise<Result>;
    setMetadataConfiguration(params: SetMetadataConfigurationParams): Promise<Result>;
    getAudioSources(): Promise<Result>;
    getAudioSourceConfiguration(params: ConfigurationTokenParams): Promise<Result>;
    getAudioSourceConfigurations(): Promise<Result>;
    addAudioSourceConfiguration(params: ProfileAndConfigurationTokenParams): Promise<Result>;
    getCompatibleAudioSourceConfigurations(params: ProfileTokenParams): Promise<Result>;
    getAudioSourceConfigurationOptions(params: ProfileAndConfigurationTokenOptionalParams): Promise<Result>;
    removeAudioSourceConfiguration(params: ProfileTokenParams): Promise<Result>;
    setAudioSourceConfiguration(params: SetAudioSourceConfigurationParams): Promise<Result>;
    getAudioEncoderConfiguration(params: ConfigurationTokenParams): Promise<Result>;
    getAudioEncoderConfigurations(): Promise<Result>;
    addAudioEncoderConfiguration(params: ProfileAndConfigurationTokenParams): Promise<Result>;
    getCompatibleAudioEncoderConfigurations(params: ProfileTokenParams): Promise<Result>;
    getAudioEncoderConfigurationOptions(params: ProfileAndConfigurationTokenOptionalParams): Promise<Result>;
    removeAudioEncoderConfiguration(params: ProfileTokenParams): Promise<Result>;
    setAudioEncoderConfiguration(params: SetAudioEncoderConfigurationParams): Promise<Result>;
    startMulticastStreaming(params: ProfileTokenParams): Promise<Result>;
    stopMulticastStreaming(params: ProfileTokenParams): Promise<Result>;
    getSnapshotUri(params: ProfileTokenParams): Promise<Result>;
    addPTZConfiguration(params: ProfileAndConfigurationTokenParams): Promise<Result>;
    removePTZConfiguration(params: ProfileTokenParams): Promise<Result>;
}
export interface OnvifServiceMediaConfigs extends OnvifServiceBaseConfigs {
    timeDiff: number;
}
export interface ConfigurationTokenParams {
    ConfigurationToken: string;
}
export interface ProfileAndConfigurationTokenOptionalParams {
    ProfileToken?: string;
    ConfigurationToken?: string;
}
export interface GetStreamUriParams {
    ProfileToken: string;
    Protocol: 'UDP' | 'HTTP' | 'RTSP';
}
export interface ProfileTokenParams {
    ProfileToken: string;
}
export interface CreateProfileParams {
    Name: string;
    Token?: string;
}
export interface ProfileAndConfigurationTokenParams {
    ProfileToken: string;
    ConfigurationToken: string;
}
export declare type Config = {
    Name: string;
    Type: string;
    Parameters: {
        SimpleItem?: {
            Name: string;
            Value: number | boolean | string;
        }[];
        ElementItem?: {
            Name: string;
        }[];
        Position: boolean;
    };
};
export declare type SetVideoEncoderConfigurationParams = {
    ConfigurationToken: string;
    Name: string;
    Encoding: 'JPEG' | 'MPEG4' | 'H264';
    Resolution: {
        Width: number;
        Height: number;
    };
    Quality: number;
    RateControl?: {
        FrameRateLimit: number;
        EncodingInterval: number;
        BitrateLimit: number;
    };
} & ({
    MPEG4: {
        GovLength: number;
        Mpeg4Profile: 'SP' | 'ASP';
    };
} | {
    H264: {
        GovLength: number;
        H264Profile: 'Baseline' | 'Main' | 'Extended' | 'High';
    };
});
export interface SetVideoSourceConfigurationParams {
    ConfigurationToken: string;
    Name: string;
    ViewMode?: ViewModeEnumerator;
    SourceToken: string;
    Bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    Extension?: {
        Rotate?: {
            Mode: 'OFF' | 'ON' | 'AUTO';
            Degree?: number;
        };
        Extension?: {
            LensDescription?: {
                FocalLength?: number;
                Offset: {
                    x?: number;
                    y?: number;
                };
                Projection: {
                    Angle: number;
                    Radius: number;
                    Transmittance?: number;
                };
                XFactor: number;
            };
            SceneOrientation?: {
                Mode: 'MANUAL' | 'AUTO';
                Orientation?: string;
            };
        };
    };
}
export declare enum ViewModeEnumerator {
    Fisheye = "Fisheye",
    Panorama360 = "360Panorama",
    Panorama180 = "180Panorama",
    Quad = "Quad",
    Original = "Original",
    LeftHalf = "LeftHalf",
    RightHalf = "RightHalf",
    Dewarp = "Dewarp"
}
export declare type SetMetadataConfigurationParams = {
    ConfigurationToken: string;
    Name: string;
    CompressionType?: 'None' | 'GZIP' | 'EXI';
    GeoLocation?: boolean;
    ShapePolygon?: boolean;
    PTZStatus?: {
        Status: boolean;
        Position: boolean;
    };
    Analytics?: boolean;
    AnalyticsEngineConfiguration?: {
        AnalyticsModule?: Config[];
    };
};
export declare type SetAudioSourceConfigurationParams = {
    ConfigurationToken: string;
    Name: string;
    SourceToken: string;
};
export declare type SetAudioEncoderConfigurationParams = {
    ConfigurationToken: string;
    Name: string;
    Encoding: 'G711' | 'G726' | 'AAC';
    Bitrate: number;
    SampleRate: number;
};
