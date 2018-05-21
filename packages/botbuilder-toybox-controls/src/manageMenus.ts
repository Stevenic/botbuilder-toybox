/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { TurnContext, Middleware, ActivityTypes, Activity } from 'botbuilder';
import { ReadWriteFragment } from 'botbuilder-toybox-memories';
import { Menu, MenuStyle } from './menu';
import { MenuManager, MenuMap } from './menuManager';

export class ManageMenus implements Middleware {
    private readonly menus: MenuMap = {};

    constructor(private menuState: ReadWriteFragment<object>, ...menus: Menu[]) { 
        // Ensure all menu names unique
        let hasDefault = false;
        menus.forEach((m) => {
            const style = m.settings.menuStyle;
            const isDefault = style === MenuStyle.defaultMenu || style === MenuStyle.defaultButton;
            if (this.menus.hasOwnProperty(m.name)) { throw new Error(`ManageMenus: duplicate menu named '${m.name}' detected.`) }
            if (isDefault && hasDefault) { throw new Error(`ManageMenus: only one default menu allowed.`) }
            hasDefault = isDefault;
            this.menus[m.name] = m;
        });
    }

    /** @private */
    public async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
        // Extend context object with menu manager
        const manager = new MenuManager(context, this.menuState, this.menus);
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