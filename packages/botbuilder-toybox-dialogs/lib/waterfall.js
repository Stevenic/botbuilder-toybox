"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Waterfall {
    constructor(steps) {
        this.steps = (steps || []).slice(0);
    }
    beginDialog(context, args) {
        context.dialog.step = 0;
        return this.runStep(context, args);
    }
    resumeDialog(context, result) {
        context.dialog.step += 1;
        return this.runStep(context, result);
    }
    runStep(context, result) {
        try {
            const step = context.dialog.step;
            if (step >= 0 && step < this.steps.length) {
                // Execute step
                return Promise.resolve(this.steps[step](context, result, (r) => {
                    context.dialog.step += 1;
                    return this.runStep(context, r);
                }));
            }
            else {
                // End of waterfall so just return to parent
                return context.endDialog();
            }
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
}
exports.Waterfall = Waterfall;
//# sourceMappingURL=waterfall.js.map