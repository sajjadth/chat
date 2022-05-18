"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessMode = void 0;
const constants_1 = require("./constants");
/**
 * Helper class for handling access mode.
 */
class AccessMode {
    constructor(acs) {
        if (acs) {
            this.given = typeof acs.given === 'number' ? acs.given : AccessMode.decode(acs.given);
            this.want = typeof acs.want === 'number' ? acs.want : AccessMode.decode(acs.want);
            if (acs.mode) {
                if (typeof acs.mode === 'number') {
                    this.mode = acs.mode;
                }
                else {
                    this.mode = AccessMode.decode(acs.mode);
                }
            }
            else {
                this.mode = this.given & this.want;
            }
        }
    }
    /**
     * Parse string into an access mode value.
     * @param mode - Permission string
     */
    static decode(mode) {
        if (!mode) {
            return null;
        }
        else if (typeof mode === 'number') {
            return mode & constants_1.AccessModePermissionsBITMASK;
        }
        else if (mode === 'N' || mode === 'n') {
            return constants_1.AccessModeFlags.NONE;
        }
        const bitmask = {
            J: constants_1.AccessModeFlags.JOIN,
            R: constants_1.AccessModeFlags.READ,
            W: constants_1.AccessModeFlags.WRITE,
            P: constants_1.AccessModeFlags.PRES,
            A: constants_1.AccessModeFlags.APPROVE,
            S: constants_1.AccessModeFlags.SHARE,
            D: constants_1.AccessModeFlags.DELETE,
            O: constants_1.AccessModeFlags.OWNER,
        };
        let m0 = constants_1.AccessModeFlags.NONE;
        for (let i = 0; i < mode.length; i++) {
            const bit = bitmask[mode.charAt(i).toUpperCase()];
            if (!bit) {
                // Unrecognized bit, skip.
                continue;
            }
            m0 |= bit;
        }
        return m0;
    }
    /**
     * Convert numeric representation of the access mode into a string.
     * @param val - Permission number
     */
    static encode(val) {
        if (val === null || val === constants_1.AccessModeFlags.INVALID) {
            return null;
        }
        else if (val === constants_1.AccessModeFlags.NONE) {
            return 'N';
        }
        const bitmask = ['J', 'R', 'W', 'P', 'A', 'S', 'D', 'O'];
        let res = '';
        for (let i = 0; i < bitmask.length; i++) {
            if ((val & (1 << i)) !== 0) {
                res = res + bitmask[i];
            }
        }
        return res;
    }
    /**
     * Update numeric representation of access mode with the new value. The value
     * is one of the following:
     *   - a string starting with '+' or '-' then the bits to add or remove, e.g. '+R-W' or '-PS'.
     *   - a new value of access mode
     * @param val - access mode value to update.
     * @param upd - update to apply to val.
     */
    static update(val, upd) {
        if (!upd || typeof upd !== 'string') {
            return val;
        }
        let action = upd.charAt(0);
        if (action === '+' || action === '-') {
            let val0 = val;
            // Split delta-string like '+ABC-DEF+Z' into an array of parts including + and -.
            const parts = upd.split(/([-+])/);
            // Starting iteration from 1 because String.split() creates an array with the first empty element.
            // Iterating by 2 because we parse pairs +/- then data.
            for (let i = 1; i < parts.length - 1; i += 2) {
                action = parts[i];
                const m0 = AccessMode.decode(parts[i + 1]);
                if (m0 === constants_1.AccessModeFlags.INVALID) {
                    return val;
                }
                if (m0 == null) {
                    continue;
                }
                if (action === '+') {
                    val0 |= m0;
                }
                else if (action === '-') {
                    val0 &= ~m0;
                }
            }
            val = val0;
        }
        else {
            // The string is an explicit new value 'ABC' rather than delta.
            const val0 = AccessMode.decode(upd);
            if (val0 !== constants_1.AccessModeFlags.INVALID) {
                val = val0;
            }
        }
        return val;
    }
    /**
     * Bits present in a1 but missing in a2.
     * @param a1 - access mode to subtract from.
     * @param a2 - access mode to subtract.
     */
    static diff(a1, a2) {
        a1 = AccessMode.decode(a1);
        a2 = AccessMode.decode(a2);
        if (a1 === constants_1.AccessModeFlags.INVALID || a2 === constants_1.AccessModeFlags.INVALID) {
            return constants_1.AccessModeFlags.INVALID;
        }
        return a1 & ~a2;
    }
    static checkFlag(val, side, flag) {
        side = side || 'mode';
        if (['given', 'want', 'mode'].filter((s) => s === side).length) {
            return ((val[side] & flag) !== 0);
        }
        throw new Error('Invalid AccessMode component "' + side + '"');
    }
    /**
     * Assign value to 'mode'.
     * @param mode - either a string representation of the access mode or a set of bits.
     */
    setMode(mode) {
        this.mode = AccessMode.decode(mode);
        return this;
    }
    /**
     * Update 'mode' value.
     * @param update - string representation of the changes to apply to access mode.
     */
    updateMode(update) {
        this.mode = AccessMode.update(this.mode, update);
        return this;
    }
    /**
     * Get 'mode' value as a string.
     */
    getMode() {
        return AccessMode.encode(this.mode);
    }
    /**
     * Assign 'given' value.
     * @param given  - either a string representation of the access mode or a set of bits.
     */
    setGiven(given) {
        this.given = AccessMode.decode(given);
        return this;
    }
    /**
     * Update 'given' value.
     * @param update - string representation of the changes to apply to access mode.
     */
    updateGiven(update) {
        this.given = AccessMode.update(this.given, update);
        return this;
    }
    /**
     * Get 'given' value as a string.
     */
    getGiven() {
        return AccessMode.encode(this.given);
    }
    /**
     * Assign 'want' value.
     * @param want - either a string representation of the access mode or a set of bits.
     */
    setWant(want) {
        this.want = AccessMode.decode(want);
        return this;
    }
    /**
     * Update 'want' value.
     * @param update - string representation of the changes to apply to access mode.
     */
    updateWant(update) {
        this.want = AccessMode.update(this.want, update);
        return this;
    }
    /**
     * Get 'want' value as a string.
     */
    getWant() {
        return AccessMode.encode(this.want);
    }
    /**
     * Get permissions present in 'want' but missing in 'given'.
     */
    getMissing() {
        return AccessMode.encode(this.want & ~this.given);
    }
    /**
     * Get permissions present in 'given' but missing in 'want'.
     */
    getExcessive() {
        return AccessMode.encode(this.given & ~this.want);
    }
    /**
     * Update 'want', 'give', and 'mode' values.
     * @param val - new access mode value.
     */
    updateAll(val) {
        if (val) {
            this.updateGiven(val.getGiven());
            this.updateWant(val.getWant());
            this.mode = this.given & this.want;
        }
        return this;
    }
    /**
     * Check if Owner (O) flag is set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isOwner(side) {
        return AccessMode.checkFlag(this, side, constants_1.AccessModeFlags.OWNER);
    }
    /**
     * Check if Presence (P) flag is set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isPresencer(side) {
        return AccessMode.checkFlag(this, side, constants_1.AccessModeFlags.PRES);
    }
    /**
     * Check if Presence (P) flag is NOT set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isMuted(side) {
        return !this.isPresencer(side);
    }
    /**
     * Check if Presence (P) flag is NOT set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isJoiner(side) {
        return AccessMode.checkFlag(this, side, constants_1.AccessModeFlags.JOIN);
    }
    /**
     * Check if Reader (R) flag is set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isReader(side) {
        return AccessMode.checkFlag(this, side, constants_1.AccessModeFlags.READ);
    }
    /**
     * Check if Writer (W) flag is set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isWriter(side) {
        return AccessMode.checkFlag(this, side, constants_1.AccessModeFlags.WRITE);
    }
    /**
     * Check if Approver (A) flag is set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isApprover(side) {
        return AccessMode.checkFlag(this, side, constants_1.AccessModeFlags.APPROVE);
    }
    /**
     * Check if either one of Owner (O) or Approver (A) flags is set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isAdmin(side) {
        return this.isOwner(side) || this.isApprover(side);
    }
    /**
     * Check if either one of Owner (O), Approver (A), or Sharer (S) flags is set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isSharer(side) {
        return this.isAdmin(side) || AccessMode.checkFlag(this, side, constants_1.AccessModeFlags.SHARE);
    }
    /**
     * Check if Deleter (D) flag is set.
     * @param side - which permission to check: given, want, mode; default: mode.
     */
    isDeleter(side) {
        return AccessMode.checkFlag(this, side, constants_1.AccessModeFlags.DELETE);
    }
    /**
     * Custom formatter
     */
    toString() {
        return '{"mode": "' + AccessMode.encode(this.mode) +
            '", "given": "' + AccessMode.encode(this.given) +
            '", "want": "' + AccessMode.encode(this.want) + '"}';
    }
    jsonHelper() {
        return {
            mode: AccessMode.encode(this.mode),
            given: AccessMode.encode(this.given),
            want: AccessMode.encode(this.want)
        };
    }
}
exports.AccessMode = AccessMode;
