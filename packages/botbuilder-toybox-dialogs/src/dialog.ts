/**
 * @module botbuilder-toybox-dialogs
 */
/** Licensed under the MIT License. */
import { Promiseable } from 'botbuilder';
import { DialogContext } from './dialogContext';

export interface Dialog<T extends Object = {}> {
    beginDialog(context: DialogContext<T>, args?: any): Promiseable<void>;
    continueDialog?(context: DialogContext<T>): Promiseable<void>;
    resumeDialog?(context: DialogContext<T>, result?: any): Promiseable<void>;
}