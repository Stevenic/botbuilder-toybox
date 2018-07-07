"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
class DialogContainer extends botbuilder_dialogs_1.Dialog {
    /**
     * Creates a new `DialogContainer` instance.
     * @param initialDialogId ID of the dialog, within the containers dialog set, that should be started anytime an instance of the `DialogContainer` is started.
     * @param dialogs (Optional) set of existing dialogs the container should use. If omitted an empty set will be created.
     */
    constructor(initialDialogId, dialogs) {
        super();
        this.initialDialogId = initialDialogId;
        this.dialogs = dialogs || new botbuilder_dialogs_1.DialogSet();
    }
    dialogBegin(dc, dialogArgs) {
        // Start the dialogs entry point dialog.
        let result;
        const cdc = new botbuilder_dialogs_1.DialogContext(this.dialogs, dc.context, dc.activeDialog.state, (r) => { result = r; });
        return this.onDialogBegin(cdc, this.initialDialogId, dialogArgs).then(() => {
            // End if the dialogs dialog ends.
            if (!cdc.activeDialog) {
                return dc.end(result);
            }
        });
    }
    dialogContinue(dc) {
        // Continue dialogs dialog stack.
        let result;
        const cdc = new botbuilder_dialogs_1.DialogContext(this.dialogs, dc.context, dc.activeDialog.state, (r) => { result = r; });
        return this.onDialogContinue(cdc).then(() => {
            // End if the dialogs dialog ends.
            if (!cdc.activeDialog) {
                return dc.end(result);
            }
        });
    }
    onDialogBegin(dc, dialogId, dialogArgs) {
        return dc.begin(dialogId, dialogArgs);
    }
    onDialogContinue(dc) {
        return dc.continue();
    }
}
exports.DialogContainer = DialogContainer;
//# sourceMappingURL=dialogContainer.js.map