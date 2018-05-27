/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Middleware, ActivityTypes, Activity } from 'botbuilder';
import { ReadWriteFragment } from 'botbuilder-toybox-memories';
import { Menu } from './menu';
import { MenuManager, MenuMap, MenuContext } from './menuManager';

export class ManageMenus implements Middleware {
    private readonly menus: MenuMap = {};

    constructor(private menuState: ReadWriteFragment<object>, ...menus: Menu[]) { 
        // Ensure all menu names unique and only one default menu exists
        let defaultMenu = '';
        menus.forEach((m) => {
            if (m.settings.isDefaultMenu) {
                if (defaultMenu.length > 0) { throw new Error(`ManageMenus: can't add default menu named '${m.name}' because a default menu name '${defaultMenu}' has already been added.`) }
                defaultMenu = m.name;
            }
            if (this.menus.hasOwnProperty(m.name)) { throw new Error(`ManageMenus: duplicate menu named '${m.name}' detected.`) }
            this.menus[m.name] = m;
        });
    }

    /** @private */
    public async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
        // Extend context object with menu manager
        const manager = new MenuManager(context as MenuContext, this.menuState, this.menus);
        Object.defineProperty(context, 'menus', {
            get() { return manager; }
        });

        // Listen for outgoing messages to augment with suggested actions
        context.onSendActivities(async (context, activities, next) => {
            // Find last message being sent
            let lastMsg: Partial<Activity>|undefined;
            activities.forEach((a) => {
                if (a.type === ActivityTypes.Message) { lastMsg = a }
            });

            // Append actions to last message
            if (lastMsg) {
                await manager.appendSuggestedActions(lastMsg);
            }

            // Deliver activities
            return await next();
        });

        // Recognize any invoked menu commands
        if (context.activity.type === ActivityTypes.Message) {
            await manager.recognizeUtterance(next);
        } else {
            await next();
        }
    }
}