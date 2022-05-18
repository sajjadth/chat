/**
 * Stores needed network providers to use in app
 */
export declare const NetworkProviders: {
    WebSocket: any;
    XMLHTTPRequest: any;
};
export declare let CTextDecoder: any;
export declare let CTextEncoder: any;
export declare class Utilities {
    private static getBase64Code;
    private static bytesToBase64;
    private static base64ToBytes;
    /**
     * Converts string to bytes and uses `bytesToBase64` to encode
     * @param str - input string
     * @param encoder - text encoder
     */
    static base64encode(str: string, encoder?: any): string;
    /**
     * Converts string to bytes and uses `bytesToBase64` to encode
     * @param str - input base64
     * @param decoder - text decoder
     */
    static base64decode(str: string, decoder?: any): string;
    /**
     * If using this lib is nodejs, you must initialize ws and xmlhttprequest
     * @param ws - WebSocket
     * @param xmlhttprequest - XMLHttpRequest
     */
    static initializeNetworkProviders(ws?: any, xmlhttprequest?: any): void;
    static pad(val: number, sp?: number): string;
    /**
     * RFC3339 formatter of Date
     * @param date - Input date object
     */
    static rfc3339DateString(date: Date): string;
    /**
     * Recursively merge src own properties to dst.
     * Array and Date objects are shallow-copied.
     * @param dst - Destination object
     * @param src - Source object
     * @param ignore Ignore properties where ignore[property] is true.
     */
    static mergeObj(dst: any, src: any, ignore?: boolean): any;
    /**
     * Update object stored in a cache. Returns updated value.
     */
    static mergeToCache(cache: any, key: string, newValue: any, ignore?: boolean): any;
    static stringToDate(obj: any): void;
    /**
     * JSON stringify helper - pre-processor for JSON.stringify
     */
    static jsonBuildHelper(key: any, val: any): any;
    /**
     * Strips all values from an object of they evaluate to false or if their name starts with '_'.
     */
    static simplify(obj: any): any;
    /**
     * Trim whitespace, strip empty and duplicate elements elements.
     * If the result is an empty array, add a single element "\u2421" (Unicode Del character).
     * @param arr - array value
     */
    static normalizeArray(arr: string[]): any[];
    /**
     * Attempt to convert date strings to objects.
     */
    static jsonParseHelper(key: string, val: any): any;
    /**
     * Trims very long strings (encoded images) to make logged packets more readable.
     */
    static jsonLoggerHelper(key: string, val: any): any;
    /**
     * Parse browser user agent to extract browser name and version.
     */
    static getBrowserInfo(ua: string, product: string): string;
    static findNearest(elem: any, arr: any[], exact: boolean, compare?: CallableFunction): {
        idx: number;
        exact: boolean;
    } | {
        idx: number;
        exact?: undefined;
    };
    /**
     * Insert element into a sorted array.
     */
    static insertSorted(elem: any, arr: any[], unique: boolean, compare?: CallableFunction): any[];
    /**
     * Helper function for creating an endpoint URL
     */
    static makeBaseUrl(host: string, protocol: 'http' | 'https' | 'ws' | 'wss', apiKey: string): any;
    static log(text: string, ...args: any[]): void;
    /**
     *  Helper method to package account credential.
     * @param meth - validation method or object with validation data.
     * @param val - validation value (e.g. email or phone number).
     * @param params - validation parameters.
     * @param resp - validation response.
     */
    static credential(meth: any, val: string, params: any, resp: string): {
        meth: any;
        val: string;
        resp: string;
        params: any;
    }[];
    /**
     * Determine topic type from topic's name: grp, p2p, me, fnd.
     * @param name - Name of the topic to test.
     */
    static topicType(name: string): any;
    static isNewGroupTopicName(name: string): boolean;
    /**
     *  Check if the given string represents NULL value.
     * @param str - string to check for null value.
     */
    static isNullValue(str: string): boolean;
    /**
     * Check if the topic name is a name of a channel.
     * @param name Topic name
     */
    static isChannelTopicName(name: string): boolean;
    /**
     * Check if the topic name is a p2p topic name.
     * @param name Topic name
     */
    static isP2PTopicName(name: string): boolean;
}
