import axios from 'axios'
import { RoleModel } from '~/models/RoleModel'

export default async(rolesUrl:string, userId:string, projId:string, count:number) => {
    return axios.get(rolesUrl, {
		params: {
			userId: userId,
			size: count,
			projId: projId,
			enabled: true,
			current: true,
		},
	})
    .then((res) => {
		return res.data.content.map((role:RoleModel) => {
			return role.authGroup
		})
    })
	.catch((err) => {
		console.log(err)
	})
}
