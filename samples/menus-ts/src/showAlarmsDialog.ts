import { DialogContainer } from 'botbuilder-dialogs';
import { ReadOnlyFragment } from 'botbuilder-toybox-memories';
import { UserState } from 'botbuilder';
import * as moment from 'moment';

import { Alarm } from './models';
import { MenuContext } from './menus';

export class ShowAlarmsDialog extends DialogContainer<any, any, MenuContext> {
    constructor(alarmsList: ReadOnlyFragment<Alarm[]>) {
        super('showAlarms');

        this.dialogs.add('showAlarms', [
            async function (dc) {
                let msg = `No alarms found.`;
                const alarms = await alarmsList.get(dc.context);
                if (alarms.length > 0) {
                    msg = `**Current Alarms**\n\n`;
                    let connector = '';
                    alarms.forEach((alarm) => {
                        msg += connector + `- ${alarm.title} (${moment(alarm.time).format("ddd, MMM Do, h:mm a")})`;
                        connector = '\n';
                    });
                }
                await dc.context.sendActivity(msg);
                await dc.end();
            }
        ]);
    }
}