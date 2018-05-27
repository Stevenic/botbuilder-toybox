export interface PruneOptions {
    nullMembers?: boolean;
    emptyArrays?: boolean;
    emptyStrings?: boolean;
}
export declare function processNode(node: any, prune: PruneOptions): boolean;
