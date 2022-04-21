export interface RoleModel {
    id: string,
    projId: string,
    userId: string,
    beginDt: string
    endDt: string | null,
    authGroup: string,
    authVal1: string | null,
    authVal2: string | null,
    authVal3: string | null,
    authVal4: string | null,
    createUserId: string,
    createDt: string,
    editUserId: string,
    editDt: string,
    enabled: boolean,
    notes: string | null
};
