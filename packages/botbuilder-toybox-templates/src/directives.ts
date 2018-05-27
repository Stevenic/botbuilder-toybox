/**
 * @module botbuilder-toybox
 */
/** Licensed under the MIT License. */
import { getValue } from './path';

export interface PruneOptions {
    nullMembers?: boolean;
    emptyArrays?: boolean;
    emptyStrings?: boolean;
}

export function processNode(node: any, prune: PruneOptions): boolean {
    if (Array.isArray(node)) {
        // Process array members
        for (let i = node.length - 1; i >= 0; i--) {
            const value = node[i];
            if ((prune.nullMembers && (value === undefined || value === null)) ||
                !processNode(value, prune)) {
                // Remove array member
                node.splice(i, 1);
            }
        }

        // Prune out the array if it's now empty
        if (prune.emptyArrays && node.length == 0) {
            return false;
        }
    } else if (typeof node === 'object') {
        // Process object members
        let conditions: string[] = [];
        for (const key in node) {
            const value = node[key];
            if (key === '@prune') {
                // Clone and update pruning options
                prune = Object.assign({}, prune, value);
                delete node[key];
            } else if (key === '@if') {
                // Defer processing of condition until after the entire node and
                // children have been evaluated.
                conditions.push(value);
                delete node[key];
            } else {
                // Prune members
                if (prune.nullMembers && (value === undefined || value === null)) {
                    delete node[key];
                } else if (prune.emptyStrings && typeof value === 'string' && value.trim().length == 0) {
                    delete node[key];
                } else if (prune.emptyArrays && Array.isArray(value) && value.length == 0) {
                    delete node[key];
                } else if (!processNode(value, prune)) {
                    // @if condition failed so prune it.
                    delete node[key];
                }
            }
        }

        // Process @if conditions
        // - multiple @if conditions are AND'ed
        for (let i = 0; i < conditions.length; i++) {
            if (!getValue(node, conditions[i])) {
                return false;
            }
        }
    }
    return true;
}