import { DialogContainer, TextPrompt } from 'botbuilder-dialogs';
import { Profile } from './models';

export class CreateProfileControl extends DialogContainer<Profile> {
    constructor() {
        super('fillProfile');

        this.dialogs.add('fillProfile', [
            async function(dc) {
                dc.activeDialog.state.profile = {};
                await dc.prompt('namePrompt', `What is your name?`);
            },
            async function(dc, name: string) {
                const profile = dc.activeDialog.state.profile as Profile;
                profile.name = name;
                await dc.prompt('emailPrompt', `What is your email address?`);
            },
            async function(dc, email: string) {
                const profile = dc.activeDialog.state.profile as Profile;
                profile.email = email;
                await dc.end(profile);
            }
        ]);

        this.dialogs.add('namePrompt', new TextPrompt());

        this.dialogs.add('emailPrompt', new TextPrompt(async (context, value) => {
            const matched = EMAIL_REGEX.exec(value); 
            if (matched) {
                return matched[1];
            } else {
                await context.sendActivity(`Please enter a valid email address like "bob@example.com".`);
                return undefined;
            }
        }));
    }
}

const EMAIL_REGEX = /([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})/i;