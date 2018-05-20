import { DialogContainer, TextPrompt, DatetimePrompt } from 'botbuilder-dialogs';
import { ReadWriteFragment } from 'botbuilder-toybox-memories';
import { UserState } from 'botbuilder';
import * as moment from 'moment';

import { Alarm } from './models';
import { MenuContext } from './menus';

export class AddAlarmDialog extends DialogContainer<any, any, MenuContext> {
    constructor(alarmsList: ReadWriteFragment<Alarm[]>) {
        super('addAlarm');

        this.dialogs.add('addAlarm', [
            async function (dc) {
                // Show cancel menu
                await dc.context.menus.showMenu('cancel');

                // Initialize temp alarm and prompt for title
                dc.activeDialog.state = {} as Alarm;
                await dc.prompt('titlePrompt', `What would you like to call your alarm?`);
            },
            async function (dc, title: string) {
                // Save alarm title and prompt for time
                const alarm = dc.activeDialog.state as Alarm;
                alarm.title = title;
                await dc.prompt('timePrompt', `What time would you like to set the "${alarm.title}" alarm for?`);
            },
            async function (dc, time: Date) {
                // Hide menu
                await dc.context.menus.hideMenu();
                
                // Save alarm time
                const alarm = dc.activeDialog.state as Alarm;
                alarm.time = time.toISOString();
        
                // Alarm completed so set alarm.
                const alarms = await alarmsList.get(dc.context);
                alarms.push(alarm);
                
                // Confirm to user
                await dc.context.sendActivity(`Your alarm named "${alarm.title}" is set for "${moment(alarm.time).format("ddd, MMM Do, h:mm a")}".`);
                await dc.end();
            }
        ]);
        
        this.dialogs.add('titlePrompt', new TextPrompt(async (context, value) => {
            if (!value || value.length < 3) {
                await context.sendActivity(`Title should be at least 3 characters long.`);
                return undefined;
            } else {
                return value.trim();
            }
        }));
        
        this.dialogs.add('timePrompt', new DatetimePrompt(async (context, values) => {
            try {
                if (!Array.isArray(values) || values.length < 0) { throw new Error('missing time') }
                if (values[0].type !== 'datetime') { throw new Error('unsupported type') }
                const value = new Date(values[0].value);
                if (value.getTime() < new Date().getTime()) { throw new Error('in the past') }
                return value;
            } catch (err) {
                await context.sendActivity(`Please enter a valid time in the future like "tomorrow at 9am" or say "cancel".`);
                return undefined;
            }
        }));
    }
}