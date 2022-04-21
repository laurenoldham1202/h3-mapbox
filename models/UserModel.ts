import { PrefsModel } from "./PrefsModel";

export interface UserModel {
	userId: string,
	username: string ,
	firstName: string,
	lastName: string,
	fullName: string,
	roles: string[],
	prefs: PrefsModel,
	anonymous: boolean
};
