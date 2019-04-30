import { IPoint, ISingleHostConfig } from 'influx';
export declare const MacStatOptions: ISingleHostConfig;
export declare function MacStatusToInflux(macstats: any): IPoint;
