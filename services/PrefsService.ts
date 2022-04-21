import axios from 'axios'

export default async(prefsUrl:string, userId:string) => {
    return axios.get(prefsUrl, {
		params: {
			userId: userId,
		},
	})
    .then((res) => {
		return res.data
    })
	.catch((err) => {
		console.log(err)
	})
}
