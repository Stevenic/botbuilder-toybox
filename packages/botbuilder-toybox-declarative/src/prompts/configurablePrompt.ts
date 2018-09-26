/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { ComponentDialog, PromptOptions, Dialog, WaterfallDialog } from 'botbuilder-dialogs';
import { DialogConfiguration } from '../configurableComponentDialog';

export interface PromptConfiguration extends DialogConfiguration, PromptOptions {

}

export class ConfigurablePrompt extends ComponentDialog {
    private options: PromptOptions;

    constructor(dialogId: string, prompt: Dialog, options?: PromptOptions) {
        super(dialogId);

        this.options = Object.assign({}, options);
        
        this.addDialog(new WaterfallDialog('start:' + prompt.id, [
            async (step) => {
                const options = Object.assign({}, this.options, step.options);
                return step.replaceDialog(prompt.id, options);
            } 
        ]))
        this.addDialog(prompt);
    }

    public configure(config: Partial<PromptConfiguration>): this {
        this.options = Object.assign({}, this.options, config);
        return this;
    }
}