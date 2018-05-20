import { TurnContext } from 'botbuilder';
import { Menu, MenuStyle, MenuManager, DialogSet } from 'botbuilder-toybox-controls';

export function createAlarmMenu(name: string, dialogs: DialogSet): Menu {
    const menu = new Menu<MenuContext>(name, { style: MenuStyle.defaultMenu });
    menu.addChoice('add alarm', (context) => beginDialog(context, dialogs, 'addAlarm'))
        .addChoice('delete alarm', (context) => beginDialog(context, dialogs, 'deleteAlarm'))
        .addChoice('show alarms', (context) => beginDialog(context, dialogs, 'showAlarms'));
    return menu;
}

export function createCancelMenu(name: string, dialogs: DialogSet): Menu {
    const menu = new Menu<MenuContext>(name);
    menu.addChoice('cancel', async (context) => {
        await context.menus.hideMenu();
        const dc = await dialogs.createContext(context);
        await dc.context.sendActivity(`Ok... Cancelled.`);
        await dc.endAll();
    });
    return menu;
}

async function beginDialog(context: MenuContext, dialogs: DialogSet, dialogId: string, dialogArgs?: any): Promise<void> {
    await context.menus.hideMenu();
    const dc = await dialogs.createContext(context);
    await dc.endAll().begin(dialogId, dialogArgs);
}

export interface MenuContext extends TurnContext {
    menus: MenuManager;    
}