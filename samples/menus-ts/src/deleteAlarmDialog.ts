import { DialogContainer, ChoicePrompt, ConfirmPrompt, FoundChoice } from 'botbuilder-dialogs';
import { ReadWriteFragment } from 'botbuilder-toybox-memories';
import { UserState } from 'botbuilder';

import { Alarm } from './models';
import { MenuContext } from './menus';

export class DeleteAlarmDialog extends DialogContainer<any, any, MenuContext> {
    constructor(alarmsList: ReadWriteFragment<Alarm[]>) {
        super('deleteAlarm');

        this.dialogs.add('deleteAlarm', [
            async function (dc) {
                // Divert to appropriate dialog
                const alarms = await alarmsList.get(dc.context);
                if (alarms.length > 1) {
                    await dc.begin('deleteAlarmMulti');
                } else if (alarms.length === 1) {
                    await dc.begin('deleteAlarmSingle');
                } else {
                    await dc.context.sendActivity(`No alarms set to delete.`);
                    await dc.end();
                }
            } 
        ]);
        
        this.dialogs.add('deleteAlarmMulti', [
            async function (dc) {
                // Show cancel menu
                await dc.context.menus.showMenu('cancel');

                // Compute list of choices based on alarm titles
                const alarms = await alarmsList.get(dc.context);
                const choices = alarms.map((value) => value.title);
        
                // Prompt user for choice (force use of "list" style)
                const prompt = `Which alarm would you like to delete? Say "cancel" to quit.`;
                await dc.prompt('choicePrompt', prompt, choices);
            },
            async function (dc, choice: FoundChoice) {
                // Hide menu
                await dc.context.menus.hideMenu();

                // Delete alarm by position
                const alarms = await alarmsList.get(dc.context);
                if (choice.index < alarms.length) { alarms.splice(choice.index, 1) }
        
                // Notify user of delete
                await dc.context.sendActivity(`Deleted "${choice.value}" alarm.`);
                await dc.end();
            }
        ]);
        
        this.dialogs.add('deleteAlarmSingle', [
            async function (dc) {
                // Show cancel menu
                await dc.context.menus.showMenu('cancel');

                // Confirm delete
                const alarms = await alarmsList.get(dc.context);
                const alarm = alarms[0];
                await dc.prompt('confirmPrompt', `Are you sure you want to delete the "${alarm.title}" alarm?`);
            },
            async function (dc, confirm: boolean) {
                // Hide menu
                await dc.context.menus.hideMenu();

                // Delete alarm
                if (confirm) {
                    alarmsList.forget(dc.context);
                    await dc.context.sendActivity(`alarm deleted...`);
                } else {
                    await dc.context.sendActivity(`ok...`);
                }
                await dc.end();
            }
        ]);
        
        this.dialogs.add('choicePrompt', new ChoicePrompt());
        this.dialogs.add('confirmPrompt', new ConfirmPrompt());
    }
}