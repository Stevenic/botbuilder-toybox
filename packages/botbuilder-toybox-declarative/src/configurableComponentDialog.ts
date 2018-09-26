/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { ComponentDialog, Dialog } from 'botbuilder-dialogs';
import { TypeFactory, TypeConfiguration } from './typeFactory';

export interface DialogConfiguration extends TypeConfiguration {
    /**
     * Unique ID of the dialog.
     */
    id: string;
}

export interface ComponentDialogConfiguration extends DialogConfiguration {
    /**
     * Components collection of child dialogs.
     */
    dialogs: DialogConfiguration[];

    /**
     * (Optional) initial dialog id.
     */
    initialDialogId?: string;
} 

export class ConfigurableComponentDialog extends ComponentDialog {

    public configure(config: ComponentDialogConfiguration): this {
        this.onConfigure(config);
        return this;
    }

    protected onConfigure(config: ComponentDialogConfiguration): void {
        config.dialogs.forEach((child) => this.onConfigureChild(child));
        if (config.initialDialogId) {
            this.initialDialogId = config.initialDialogId;
        }
    }

    protected onConfigureChild(config: DialogConfiguration): void {
        // Find existing dialog
        let dialog = this.findDialog(config.id);
        if (dialog) {
            // Try to configure existing dialog
            if (typeof (dialog as any).configure === 'function') {
                (dialog as any).configure(config);
            }
        } else {
            // Create and add new dialog
            dialog = TypeFactory.create(config) as Dialog;
            this.addDialog(dialog);
        }
    }
}
