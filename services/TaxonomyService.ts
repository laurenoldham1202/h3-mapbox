import axios from 'axios'

export default async(baseUrl:string, key:string, speciesCodes:string, locale:string) => {
	if (speciesCodes.length) {
		return axios.get(baseUrl + 'ref/taxonomy/ebird', {
			params: {
				species: speciesCodes,
				locale: locale,
				fmt: 'json'
			},
			headers: { 'X-eBirdApiToken': key },
		})
		.then((res) => {
			return res.data
		})
		.catch((err) => {
			console.log(err)
		})
	}
}
