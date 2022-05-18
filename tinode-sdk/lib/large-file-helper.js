"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LargeFileHelper = void 0;
const utilities_1 = require("./utilities");
const constants_1 = require("./constants");
const rxjs_1 = require("rxjs");
class LargeFileHelper {
    constructor(tinode) {
        this.apiKey = '';
        this.msgId = '';
        this.xhr = utilities_1.NetworkProviders.XMLHTTPRequest;
        this.onProgress = new rxjs_1.Subject();
        this.onSuccess = new rxjs_1.Subject();
        this.onFailure = new rxjs_1.Subject();
        this.tinode = tinode;
        this.authToken = this.tinode.authToken;
        this.apiKey = this.tinode.connectionConfig.APIKey;
        this.msgId = tinode.getNextUniqueId();
    }
    /**
     * Start uploading the file to a non-default endpoint.
     * @param baseUrl alternative base URL of upload server.
     * @param file to upload
     */
    uploadWithBaseUrl(baseUrl, file) {
        if (!this.authToken) {
            throw new Error('Must authenticate first');
        }
        const instance = this;
        // Validate and create url
        let url = '/v' + constants_1.AppInfo.PROTOCOL_VERSION + '/file/u/';
        if (baseUrl) {
            if (baseUrl.indexOf('http://') === 0 || baseUrl.indexOf('https://') === 0) {
                url = baseUrl + url;
            }
            else {
                throw new Error('Invalid base URL "' + baseUrl + '"');
            }
        }
        instance.xhr.open('POST', url, true);
        instance.xhr.setRequestHeader('X-Tinode-APIKey', instance.apiKey);
        instance.xhr.setRequestHeader('X-Tinode-Auth', 'Token ' + instance.authToken.token);
        const result = new Promise((resolve, reject) => {
            this.toResolve = resolve;
            this.toReject = reject;
        });
        this.xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                instance.onProgress.next(e.loaded / e.total);
            }
        };
        this.xhr.onload = () => {
            const temp = this;
            let pkt;
            try {
                pkt = JSON.parse(temp.response, utilities_1.Utilities.jsonParseHelper);
            }
            catch (err) {
                this.tinode.logger('ERROR: Invalid server response in LargeFileHelper', temp.response);
                pkt = {
                    ctrl: {
                        code: temp.status,
                        text: temp.statusText
                    }
                };
            }
            if (temp.status >= 200 && temp.status < 300) {
                if (instance.toResolve) {
                    instance.toResolve(pkt.ctrl.params.url);
                }
                instance.onSuccess.next(pkt.ctrl);
            }
            else if (temp.status >= 400) {
                if (instance.toReject) {
                    instance.toReject(new Error(pkt.ctrl.text + ' (' + pkt.ctrl.code + ')'));
                }
                instance.onFailure.next(pkt.ctrl);
            }
            else {
                instance.tinode.logger('ERROR: Unexpected server response status', temp.status, temp.response);
            }
        };
        this.xhr.onerror = (e) => {
            if (instance.toReject) {
                instance.toReject(new Error('failed'));
            }
            instance.onFailure.next(null);
        };
        this.xhr.onabort = (e) => {
            if (instance.toReject) {
                instance.toReject(new Error('failed'));
            }
            instance.onFailure.next(null);
        };
        try {
            const form = new FormData();
            form.append('file', file);
            form.set('id', this.msgId);
            this.xhr.send(form);
        }
        catch (err) {
            if (instance.toReject) {
                instance.toReject(new Error(err));
            }
            this.onFailure.next(null);
        }
        return result;
    }
    upload(file) {
        return this.uploadWithBaseUrl(undefined, file);
    }
    download(relativeUrl, filename, mimetype) {
        if (/^\s*([a-z][a-z0-9+.-]*:|\/\/)/im.test(relativeUrl)) {
            throw new Error('The URL "' + relativeUrl + '" must be relative, not absolute');
        }
        if (!this.authToken) {
            throw new Error('Must authenticate first');
        }
        const instance = this;
        this.xhr.open('GET', relativeUrl, true);
        this.xhr.setRequestHeader('X-Tinode-APIKey', this.apiKey);
        this.xhr.setRequestHeader('X-Tinode-Auth', 'Token ' + this.authToken.token);
        this.xhr.responseType = 'blob';
        this.xhr.onprogress = (e) => {
            if (instance.onProgress) {
                // Passing e.loaded instead of e.loaded/e.total because e.total
                // is always 0 with gzip compression enabled by the server.
                instance.onProgress.next(e.loaded);
            }
        };
        const result = new Promise((resolve, reject) => {
            this.toResolve = resolve;
            this.toReject = reject;
        });
        // The blob needs to be saved as file. There is no known way to
        // save the blob as file other than to fake a click on an <a href... download=...>.
        this.xhr.onload = () => {
            const temp = this;
            if (temp.status === 200) {
                const link = document.createElement('a');
                // URL.createObjectURL is not available in non-browser environment. This call will fail.
                link.href = window.URL.createObjectURL(new Blob([temp.response], {
                    type: mimetype
                }));
                link.style.display = 'none';
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(link.href);
                if (instance.toResolve) {
                    instance.toResolve();
                }
            }
            else if (temp.status >= 400 && instance.toReject) {
                // The this.responseText is undefined, must use this.response which is a blob.
                // Need to convert this.response to JSON. The blob can only be accessed by the
                // FileReader.
                const reader = new FileReader();
                reader.onload = () => {
                    const tempOnload = this;
                    try {
                        const pkt = JSON.parse(tempOnload.result, utilities_1.Utilities.jsonParseHelper);
                        instance.toReject(new Error(pkt.ctrl.text + ' (' + pkt.ctrl.code + ')'));
                    }
                    catch (err) {
                        instance.tinode.logger('ERROR: Invalid server response in LargeFileHelper', tempOnload.result);
                        instance.toReject(err);
                    }
                };
                reader.readAsText(temp.response);
            }
        };
        this.xhr.onerror = (e) => {
            if (instance.toReject) {
                instance.toReject(new Error('failed'));
            }
        };
        this.xhr.onabort = () => {
            if (instance.toReject) {
                instance.toReject(null);
            }
        };
        try {
            this.xhr.send();
        }
        catch (err) {
            if (this.toReject) {
                this.toReject(err);
            }
        }
        return result;
    }
    cancel() {
        if (this.xhr && this.xhr.readyState < 4) {
            this.xhr.abort();
        }
    }
    getId() {
        return this.msgId;
    }
}
exports.LargeFileHelper = LargeFileHelper;
