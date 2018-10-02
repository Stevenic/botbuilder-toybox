/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { DialogTurnResult } from 'botbuilder-dialogs';
import { ActionContext } from '../actionContext';

export abstract class ActionHandler {
    private _expectedSlots: string[] = [];
    private _changedSlots: string[] = [];
    private _requiredSlots: string[] = [];
    private _onlyOnce: boolean = false;

    public abstract onRun(action: ActionContext): Promise<DialogTurnResult>;

    public onResume(action: ActionContext): Promise<boolean> {
        return Promise.resolve(false);
    }

    public get expectedSlots(): string[] {
        return this._expectedSlots;
    }

    public get changedSlots(): string[] {
        return this._changedSlots;
    }

    public get requiredSlots(): string[] {
        return this._requiredSlots;
    }

    public get onlyOnce(): boolean {
        return this._onlyOnce;
    }
    
    public expects(...slots: string[]): this {
        this._expectedSlots = slots;
        return this;
    }

    public whenChanged(...slots: string[]): this {
        this._changedSlots = slots;
        return this;
    }

    public requires(...slots: string[]): this {
        this._requiredSlots = slots;
        return this;
    }

    public runOnce(flag = true) {
        this._onlyOnce = flag;
        return this;
    }
}

