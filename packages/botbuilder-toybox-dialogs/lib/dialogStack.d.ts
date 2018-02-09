/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
export interface DialogInstance<T extends Object = {}> {
    /** ID of the dialog this instance is for. */
    id: string;
    /** The instances persisted state. */
    state: T;
}
