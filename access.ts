import { BaseListTypeInfo, ListOperationAccessControl } from "@keystone-6/core/types";

export type Operation = 'create' | 'query' | 'update' | 'delete';

export const isAuthenticated = <T extends Operation, D extends BaseListTypeInfo>(): ListOperationAccessControl<T, D> => 
    ({ session, context, listKey, operation }) => !!session?.data.name;
