import { AccessModeFlags } from './constants';
/**
 * Helper class for handling access mode.
 */
export declare class AccessMode {
    private given;
    private want;
    mode: number;
    constructor(acs?: any);
    /**
     * Parse string into an access mode value.
     * @param mode - Permission string
     */
    static decode(mode: string | number): number;
    /**
     * Convert numeric representation of the access mode into a string.
     * @param val - Permission number
     */
    static encode(val: number): string;
    /**
     * Update numeric representation of access mode with the new value. The value
     * is one of the following:
     *   - a string starting with '+' or '-' then the bits to add or remove, e.g. '+R-W' or '-PS'.
     *   - a new value of access mode
     * @param val - access mode value to update.
     * @param upd - update to apply to val.
     */
    static update(val: number, upd: string): number;
    /**
     * Bits present in a1 but missing in a2.
     * @param a1 - access mode to subtract from.
     * @param a2 - access mode to subtract.
     */
    static diff(a1: number | string, a2: number | string): number;
    static checkFlag(val: AccessMode, side: string, flag: AccessModeFlags): boolean;
    /**
     * Assign value to 'mode'.
     * @param mode - either a string representation of the access mode or a set of bits.
     */
    setMode(mode: string | number): AccessMode;
    /**
     * Update 'mode' value.
     * @param update - string representation of the changes to apply to access mode.
     */
    updateMode(update: string): AccessMode;
    /**
     * Get 'mode' value as a string.
     */
    getMode(): string;
    /**
     * Assign 'given' value.
     * @param given  - either a string representation of the access mode or a set of bits.
     */
    setGiven(given: string | number): AccessMode;
    /**
     * Update 'given' value.
     * @param update - string representation of the changes to apply to access mode.
     */
    updateGiven(update: string): AccessMode;
    /**
     * Get 'given' value as a string.
     */
    getGiven(): string;
    /**
     * Assign 'want' value.
     * @param want - either a string representation of the access mode or a set of bits.
     */
    setWant(want: string | number): AccessMode;
    /**
     * Update 'want' value.
     * @param update - string representation of the changes to apply to access mode.
     */
    updateWant(update: string): AccessMode;
    /**
     * Get 'want' value as a string.
     */
    getWant(): string;
    /**
     * Get permissions present in 'want' but missing in 'given'.
     */
    getMissing(): string;
    /**
     * Get permissions present in 'given' but missing in 'want'.
     */
    getExcessive(): string;
    /**
     * Update 'want', 'give', and 'mode' values.
     * @param val - new access mode value.
     */
    updateAll(val: AccessMode): AccessMode;
    /**
     * Check if Owner (O) flag is set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isOwner(side: string): boolean;
    /**
     * Check if Presence (P) flag is set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isPresencer(side?: string): boolean;
    /**
     * Check if Presence (P) flag is NOT set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isMuted(side: string): boolean;
    /**
     * Check if Presence (P) flag is NOT set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isJoiner(side: string): boolean;
    /**
     * Check if Reader (R) flag is set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isReader(side: string): boolean;
    /**
     * Check if Writer (W) flag is set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isWriter(side: string): boolean;
    /**
     * Check if Approver (A) flag is set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isApprover(side: string): boolean;
    /**
     * Check if either one of Owner (O) or Approver (A) flags is set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isAdmin(side: string): boolean;
    /**
     * Check if either one of Owner (O), Approver (A), or Sharer (S) flags is set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isSharer(side: string): boolean;
    /**
     * Check if Deleter (D) flag is set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isDeleter(side: string): boolean;
    /**
     * Custom formatter
     */
    toString(): string;
    jsonHelper(): {
        mode: string;
        given: string;
        want: string;
    };
}
