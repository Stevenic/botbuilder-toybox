/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Activity } from 'botbuilder';
import { DialogContext, Dialog } from 'botbuilder-dialogs';
/**
 * :package: **botbuilder-toybox-controls**
 *
 * Settings used to configure a `RemoteDialog` instance.
 */
export interface RemoteDialogSettings {
    /**
     * (Optional) additional headers to assign for the outgoing request sent to the remote server.
     * This can be used to pass things like service access tokens if needed.
     */
    outgoingHeaders?: object;
}
/**
 *
 */
export declare type UrlFactory<C extends TurnContext = TurnContext> = (context: C) => string;
/**
 * :package: **botbuilder-toybox-controls**
 *
 * @param C Type of context object passed to the controls ListPager.
 */
export declare class RemoteDialog<C extends TurnContext> extends Dialog<C> {
    protected remoteUrl: string | UrlFactory;
    protected readonly settings: RemoteDialogSettings;
    /**
     * Creates a new RemoteControl instance.
     */
    constructor(remoteUrl: string | UrlFactory, settings?: RemoteDialogSettings);
    /** @private */
    dialogBegin(dc: DialogContext<C>, args?: any): Promise<any>;
    /** @private */
    dialogContinue(dc: DialogContext<C>): Promise<any>;
    protected onForwardActivity(context: C, activity: Partial<Activity>, remoteUrl: string): Promise<Partial<Activity>[]>;
    private forwardActivity(dc, activity, remoteUrl);
}
