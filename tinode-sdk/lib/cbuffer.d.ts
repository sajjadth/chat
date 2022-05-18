/**
 * In-memory sorted cache of objects.
 */
export declare class CBuffer {
    private compare;
    private unique;
    private buffer;
    constructor(compare: CallableFunction, unique: boolean);
    /**
     * Get an element at the given position.
     * @param at - Position to fetch from.
     */
    getAt(at: number): any;
    /**
     * Convenience method for getting the last element of the buffer.
     */
    getLast(): any;
    /**
     * Add new element(s) to the buffer. Variadic: takes one or more arguments. If an array is passed as a single
     * argument, its elements are inserted individually.
     */
    put(...values: any[]): void;
    /**
     * Remove element at the given position.
     * @param at - Position to delete at.
     */
    delAt(at: number): any;
    /**
     * Remove elements between two positions.
     * @param before - Position to delete to (exclusive).
     * @param since - Position to delete from (inclusive).
     */
    delRange(since: number, before: number): any[];
    /**
     * Return the number of elements the buffer holds.
     */
    length(): number;
    /**
     * Reset the buffer discarding all elements
     */
    reset(): void;
    /**
     * Apply given function `callback` to all elements of the buffer.
     * @param callback - Function to call for each element.
     * @param startIdx - Optional index to start iterating from (inclusive).
     * @param beforeIdx - Optional index to stop iterating before (exclusive).
     * @param context - calling context (i.e. value of 'this' in callback)
     */
    forEach(callback: CallableFunction, startIdx?: number, beforeIdx?: number, context?: any): void;
    /**
     * Find element in buffer using buffer's comparison function.
     * @param elem - element to find.
     * @param nearest - when true and exact match is not found, return the nearest element (insertion point).
     */
    find(elem: any, nearest?: boolean): number;
}
