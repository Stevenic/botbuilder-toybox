import { StatePropertyAccessor, MessageFactory } from 'botbuilder';
import { WaterfallDialog, WaterfallStepContext, PromptValidatorContext, DateTimeResolution } from 'botbuilder-dialogs';
import { ConfigurableComponentDialog, ConfigurableTextPrompt, ConfigurableDateTimePrompt, TypeFactory, ComponentDialogConfiguration } from 'botbuilder-toybox-declarative';
import * as moment from 'moment';
import { Alarm } from './models';

export interface AddAlarmDialogConfiguration extends ComponentDialogConfiguration {
    titlePrompt?: string,
    timePrompt?: string;
    timeRetryPrompt?: string;
}

export class AddAlarmDialog extends ConfigurableComponentDialog {
    private titlePrompt = new ConfigurableTextPrompt('titlePrompt', {
        prompt: MessageFactory.text(`What would you like to call your alarm?`)
    });
    
    private timePrompt = new ConfigurableDateTimePrompt('timePrompt', {
        prompt: MessageFactory.text(`What time would you like to set the alarm for?`),
        retryPrompt: MessageFactory.text(`Please enter a valid time in the future like "tomorrow at 9am".`)
    }, this.timePromptValidation.bind(this));

    constructor(dialogId: string, private alarmsList: StatePropertyAccessor<Alarm[]>) {
        super(dialogId);

        // Add control flow
        this.addDialog(new WaterfallDialog('start', [
            this.timePromptStep.bind(this),
            this.timePromptStep.bind(this),
            this.setAlarmStep.bind(this)
        ]));

        // Add prompts
        this.addDialog(this.titlePrompt);
        this.addDialog(this.timePrompt);
    }

    protected onConfigure(config: AddAlarmDialogConfiguration) {
        super.onConfigure(config);
        if (config.titlePrompt) {
            this.titlePrompt.configure({ prompt: MessageFactory.text(config.titlePrompt) });
        }
        if (config.timePrompt) {
            this.timePrompt.configure({ prompt: MessageFactory.text(config.timePrompt) });
        }
        if (config.timeRetryPrompt) {
            this.timePrompt.configure({ prompt: MessageFactory.text(config.timeRetryPrompt) });
        }
    }

    private async titlePromptStep(step: WaterfallStepContext) {
        // Prompt for title
        return await step.beginDialog('titlePrompt');
    }

    private async timePromptStep(step: WaterfallStepContext) {
        // Save title
        step.values['title'] = step.result;

        // Prompt for time
        return await step.beginDialog('timePrompt');
    }

    private async setAlarmStep(step: WaterfallStepContext) {
        // Save time
        step.values['time'] = new Date(step.result[0].value).toISOString();

        // Set alarm
        const alarms = await this.alarmsList.get(step.context, []);
        alarms.push(step.values as Alarm);

        // Confirm to user
        await step.context.sendActivity(`Your alarm named "${step.values['title']}" is set for "${moment(step.values['time']).format("ddd, MMM Do, h:mm a")}".`);
        return await step.endDialog();
    }

    private timePromptValidation(prompt: PromptValidatorContext<DateTimeResolution[]>): boolean {
        if (prompt.recognized.succeeded) {
            const values = prompt.recognized.value;
            if (values[0].type === 'datetime') {
                const value = new Date(values[0].value);
                if (value.getTime() > new Date().getTime()) { 
                    return true; 
                }
            }
        }
        return false;
    }
}
TypeFactory.register('AddAlarmDialog', (config: ComponentDialogConfiguration) => {
    // Get alarms list
    const alarmsList = TypeFactory.create({ type: 'AlarmsListProperty' }) as StatePropertyAccessor<Alarm[]>;

    // Create and configure dialog
    const dialog = new AddAlarmDialog(config.id, alarmsList);
    return dialog.configure(config);
});

const dialog = TypeFactory.create({
    type: 'AddAlarmDialog',
    id: 'addAlarm',
    titlePrompt: 'What should we call your alarm?'
});
