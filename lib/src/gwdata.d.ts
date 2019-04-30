import { IPoint, ISingleHostConfig } from 'influx';
export declare const GWStatOptions: ISingleHostConfig;
export declare function GwStatusToInflux(gwstats: any): IPoint;
