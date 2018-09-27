import { ActivityTypes, Activity } from 'botbuilder';
import { DialogContext, DialogTurnResult, DialogTurnStatus } from 'botbuilder-dialogs';
import { ConfigurableComponentDialog, TypeFactory, ComponentDialogConfiguration } from 'botbuilder-toybox-declarative';

export interface MainDialogConfiguration extends ComponentDialogConfiguration {
    interruptions: MainDialogInterruption[];
    fallbackMessage?: string|Partial<Activity>;
}

export interface MainDialogInterruption {
    pattern: string;
    flags?: string;
    dialogId: string;
    options?: object;
}

export class MainDialog extends ConfigurableComponentDialog {
    private readonly interuptions: CachedMainDialogInterruption[] = [];
    private fallbackMessage?: string|Partial<Activity>;

    public addInterruption(interruption: MainDialogInterruption): this {
        const cached = Object.assign({}, interruption) as CachedMainDialogInterruption;
        cached.expression = new RegExp(cached.pattern, cached.flags || 'i');
        this.interuptions.push(cached);
        return this;
    }

    protected onConfigure(config: MainDialogConfiguration) {
        super.onConfigure(config);

        // Add child dialogs
        this.configureDialogs(config);

        // Add interruptions
        config.interruptions.forEach(interruption => this.addInterruption(interruption));

        // Set fallback message
        this.fallbackMessage = config.fallbackMessage;
    }

    protected onBeginDialog(dc: DialogContext, options: any): Promise<DialogTurnResult> {
        return this.onRunTurn(dc);
    }

    protected onContinueDialog(dc: DialogContext): Promise<DialogTurnResult> {
        return this.onRunTurn(dc);
    }

    protected async onRunTurn(dc: DialogContext): Promise<DialogTurnResult> {
        // Perform interruption
        const isMessage = dc.context.activity.type === ActivityTypes.Message;
        if (isMessage) {
            const utterance = dc.context.activity.text;
            for(let i = 0; i < this.interuptions.length; i++) {
                const cached = this.interuptions[i];
                const matched = cached.expression.exec(utterance);
                if (matched) {
                    await dc.cancelAllDialogs();
                    return await dc.beginDialog(cached.dialogId, cached.options);
                }
            }
        }

        // Continue execution of current dialog
        let result = await dc.continueDialog();

        // Send fallback message as needed
        if (result.status === DialogTurnStatus.empty && isMessage && this.fallbackMessage) {
            await dc.context.sendActivity(this.fallbackMessage);
        }
        return result;
    }
}
TypeFactory.register('MainDialog', (config: ComponentDialogConfiguration) => {
    const dialog = new MainDialog(config.id);
    return dialog.configure(config);
});

interface CachedMainDialogInterruption extends MainDialogInterruption {
    expression: RegExp;
}
