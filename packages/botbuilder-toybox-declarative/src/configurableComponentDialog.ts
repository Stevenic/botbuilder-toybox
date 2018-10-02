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
    dialogs?: DialogConfiguration[];

    /**
     * (Optional) initial dialog id.
     */
    initialDialogId?: string;
} 

export class ConfigurableComponentDialog extends ComponentDialog {

    public configure(config: ComponentDialogConfiguration, factory: TypeFactory): this {
        this.onConfigure(config, factory);
        return this;
    }

    protected onConfigure(config: ComponentDialogConfiguration, factory: TypeFactory): void {
        if (config.initialDialogId) {
            this.initialDialogId = config.initialDialogId;
        }
    }

    protected configureDialogs(config: ComponentDialogConfiguration, factory: TypeFactory): void {
        if (config.dialogs) {
            config.dialogs.forEach((child) => this.onConfigureDialog(child, factory));
        }
    }

    protected onConfigureDialog(config: DialogConfiguration, factory: TypeFactory): void {
        // Find existing dialog
        let dialog = this.findDialog(config.id);
        if (dialog) {
            // Try to configure existing dialog
            if (typeof (dialog as any).configure === 'function') {
                (dialog as any).configure(config);
            }
        } else if (config.type) {
            // Create and add new dialog
            dialog = factory.create(config) as Dialog;
            this.addDialog(dialog);
        } else {
            throw new Error(`ConfigurableComponentDialog.onConfigureDialog(): can't find dialog with an id of '${config.id}'.`);
        }
    }
}
