import { Tinode } from './tinode';
import { Subject } from 'rxjs';
export declare class LargeFileHelper {
    private authToken;
    private tinode;
    private apiKey;
    private msgId;
    private xhr;
    private toResolve;
    private toReject;
    onProgress: Subject<any>;
    onSuccess: Subject<any>;
    onFailure: Subject<any>;
    constructor(tinode: Tinode);
    /**
     * Start uploading the file to a non-default endpoint.
     * @param baseUrl alternative base URL of upload server.
     * @param file to upload
     */
    private uploadWithBaseUrl;
    upload(file: File): Promise<any>;
    download(relativeUrl: string, filename: string, mimetype: string): Promise<unknown>;
    cancel(): void;
    getId(): string;
}
