import { TurnContext } from 'botbuilder';
import { Menu, MergeStyle, MenuManager, DialogSet, MenuContext } from 'botbuilder-toybox-controls';

export function createAlarmMenu(name: string, dialogs: DialogSet): Menu {
    const menu = new Menu(name, {
        isDefaultMenu: true,
        showAsButton: true, 
        mergeStyle: MergeStyle.left,
        buttonTitleOrChoice: { title: '🗃️', value: 'menu' }
    });
    menu.addChoice('add alarm', (context) => beginDialog(context, dialogs, 'addAlarm'))
        .addChoice('delete alarm', (context) => beginDialog(context, dialogs, 'deleteAlarm'))
        .addChoice('show alarms', (context) => beginDialog(context, dialogs, 'showAlarms'));
    return menu;
}

export function createCancelMenu(name: string, dialogs: DialogSet): Menu {
    const menu = new Menu(name, { 
        mergeStyle: MergeStyle.right,
        hideAfterClick: true
    });
    menu.addChoice('cancel', async (context) => {
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
