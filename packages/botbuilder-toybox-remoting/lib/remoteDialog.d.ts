/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Activity } from 'botbuilder-core';
import { DialogContext, Dialog, DialogTurnResult } from 'botbuilder-dialogs';
/**
 * :package: **botbuilder-toybox-controls**
 *
 * Settings used to configure a `RemoteDialog` instance.
 */
export interface RemoteDialogSettings {
    /**
     * (Optional) additional headers to assign for the outgoing request sent to the remote server.
     *
     * ## Remarks
     * This can be used to pass things like service access tokens if needed.
     */
    outgoingHeaders?: object;
}
/**
 *
 */
export declare type UrlFactory = (context: TurnContext) => string;
/**
 * :package: **botbuilder-toybox-controls**
 */
export declare class RemoteDialog extends Dialog {
    protected remoteUrl: string | UrlFactory;
    protected readonly settings: RemoteDialogSettings;
    /**
     * Creates a new RemoteDialog instance.
     */
    constructor(dialogId: string, remoteUrl: string | UrlFactory, settings?: RemoteDialogSettings);
    /** @private */
    beginDialog(dc: DialogContext, options?: any): Promise<DialogTurnResult>;
    /** @private */
    continueDialog(dc: DialogContext): Promise<DialogTurnResult>;
    protected onForwardActivity(context: TurnContext, activity: Partial<Activity>, remoteUrl: string): Promise<Partial<Activity>[]>;
    private forwardActivity;
}
