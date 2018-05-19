import { DialogContainer, TextPrompt } from 'botbuilder-dialogs';
import { Profile } from './models';

export class ChangeNameControl extends DialogContainer<Profile, Profile> {
    constructor() {
        super('updateProfile');

        this.dialogs.add('updateProfile', [
            async function(dc, profile: Profile) {
                dc.activeDialog.state.profile = profile || {};
                await dc.prompt('namePrompt', `What is your new name?`);
            },
            async function(dc, name: string) {
                const profile = dc.activeDialog.state.profile as Profile;
                profile.name = name;
                await dc.end(profile);
            }
        ]);

        this.dialogs.add('namePrompt', new TextPrompt());
    }
}
