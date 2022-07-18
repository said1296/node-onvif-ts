import { OnvifServiceBase, OnvifServiceBaseConfigs } from './service-base';
import { Result } from './soap';
import { ConfigurationTokenParams, ProfileTokenParams } from './service-media';
export declare class OnvifServicePtz extends OnvifServiceBase {
    constructor(configs: OnvifServicePtzConfigs);
    getNodes(): Promise<Result>;
    getNode(params: NodeTokenParams): Promise<Result>;
    getConfigurations(): Promise<Result>;
    getConfiguration(params: ConfigurationTokenParams): Promise<Result>;
    getCompatibleConfigurations(params: ProfileTokenParams): Promise<Result>;
    getConfigurationOptions(params: ConfigurationTokenParams): Promise<Result>;
    setConfiguration(params: SetPTZConfigurationParams): Promise<Result>;
    getStatus(params: ProfileTokenParams): Promise<Result>;
    continuousMove(params: ContinuousMoveParams): Promise<Result>;
    absoluteMove(params: AbsoluteMoveParams): Promise<Result>;
    relativeMove(params: RelativeMoveParams): Promise<Result>;
    stop(params: StopParams): Promise<Result>;
    gotoHomePosition(params: GotoHomePositionParams): Promise<Result>;
    setHomePosition(params: ProfileTokenParams): Promise<Result>;
    setPreset(params: SetPresetParams): Promise<Result>;
    getPresets(params: ProfileTokenParams): Promise<Result>;
    gotoPreset(params: GotoPresetParams): Promise<Result>;
    removePreset(params: RemovePresetParams): Promise<Result>;
}
export interface OnvifServicePtzConfigs extends OnvifServiceBaseConfigs {
    timeDiff: number;
}
export interface NodeTokenParams {
    NodeToken: string;
}
export interface ContinuousMoveParams {
    ProfileToken: string;
    Velocity: {
        x?: number;
        y?: number;
        z?: number;
    };
    Timeout?: number;
}
export interface AbsoluteMoveParams {
    ProfileToken: string;
    Position: {
        x: number;
        y: number;
        z: number;
    };
    Speed?: {
        x?: number;
        y?: number;
        z?: number;
    };
}
export interface RelativeMoveParams {
    ProfileToken: string;
    Translation: {
        x: number;
        y: number;
        z: number;
    };
    Speed?: {
        x?: number;
        y?: number;
        z?: number;
    };
}
export interface StopParams {
    ProfileToken: string;
    PanTilt?: boolean;
    Zoom?: boolean;
}
export interface GotoHomePositionParams {
    ProfileToken: string;
    Speed?: number;
}
export declare type SetPresetParams = {
    ProfileToken: string;
} & ({
    PresetToken: string;
} | {
    PresetName: string;
});
export interface GotoPresetParams {
    ProfileToken: string;
    PresetToken: string;
    Speed?: {
        x: number;
        y: number;
        z: number;
    };
}
export interface RemovePresetParams {
    ProfileToken: string;
    PresetToken: string;
}
export declare type SetPTZConfigurationParams = {
    ConfigurationToken: string;
    Name: string;
    MoveRamp?: number;
    PresetRamp?: number;
    PresetTourRamp?: number;
    NodeToken: string;
    DefaultAbsolutePantTiltPositionSpace?: string;
    DefaultAbsoluteZoomPositionSpace?: string;
    DefaultRelativePanTiltTranslationSpace?: string;
    DefaultRelativeZoomTranslationSpace?: string;
    DefaultContinuousPanTiltVelocitySpace?: string;
    DefaultContinuousZoomVelocitySpace?: string;
    DefaultPTZSpeed?: {
        PanTilt?: {
            space?: string;
            x: number;
            y: number;
        };
        Zoom?: {
            x: number;
            space?: string;
        };
    };
    DefaultPTZTimeout?: string;
    PanTiltLimits?: {
        Range: {
            URI: string;
            XRange: {
                Min?: number;
                Max?: number;
            };
            YRange: {
                Min?: number;
                Max?: number;
            };
        };
    };
    ZoomLimits?: {
        Range: {
            URI: string;
            XRange: {
                Min?: number;
                Max?: number;
            };
        };
    };
    Extension?: {
        PTControlDirection?: {
            EFlip?: {
                Mode: 'OFF' | 'ON' | 'Extended';
            };
            Reverse?: {
                Mode: 'OFF' | 'ON' | 'AUTO' | 'Extended';
            };
        };
    };
};
