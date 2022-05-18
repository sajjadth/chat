import { DefAcs } from './defacs';
export interface SetDesc {
    defacs?: DefAcs;
    public?: any;
    private?: any;
    acs?: any;
    updated?: any;
    noForwarding?: boolean;
    seq?: number;
    read?: any;
    recv?: any;
    touched?: any;
}
export interface SetSub {
    user?: string;
    mode?: string;
    info?: any;
    noForwarding?: boolean;
    topic?: string;
    acs?: any;
    updated?: any;
    deleted?: any;
}
export interface SetParams {
    desc?: SetDesc;
    sub?: SetSub;
    tags?: any;
    cred?: any;
}
