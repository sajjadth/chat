import { SetParams } from '../models/set-params';
import { Tinode } from '../tinode';
import { Topic } from './topic';
export declare class TopicFnd extends Topic {
    contacts: any;
    constructor(tinode: Tinode);
    processMetaSub(subs: any[]): void;
    publish(): Promise<never>;
    setMeta(params: SetParams): any;
    getContacts(): any;
}
