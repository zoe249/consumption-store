const config = require('../config.js')
import Vue from 'vue'

export default (params) => {

	// 请求方式，
	let method = ''
	if (!params.method) { // 默认 GET
		method = 'GET'
	} else {
		method = params.method
	}

	// 请求头信息
	let header = {
		storeType: uni.getStorageSync('storeInfo') ? uni.getStorageSync('storeInfo').storeType : ''
	}
	if (!params.header) {
		header = {
			...header,
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		}
	} else {
		header = {
			...header,
			...params.header
		}
	}

	return new Promise((resoLve, rejext) => {

		// 拼接 url
		let url = config.protocol + config.host + params.url
		// 拼接token
		let Authorization = ''
		if (!params.token) {
			Authorization =  uni.getStorageSync('token') ? 'Bearer' + ' ' + uni.getStorageSync('token') : ''
		}

		if (params.isToken == 0) {
			header = { ...header
			}
		} else {
			header = { ...header,
				Authorization
			}
		}

		uni.request({
			url,
			data: params.data,
			method,
			header,
			success(res) {
				resoLve(res)
				// console.log('------------------------------- start -------------------------------');
				// console.log('请求报文：' + url, ": \n", params)
				// console.log('响应报文：' + url, ": \n", res)
				// console.log('-------------------------------- end --------------------------------');
				// console.log('请求报文：' + url, ": \n", JSON.stringify(params, null, '\t'))
				// console.log('响应报文：' + url, ": \n", JSON.stringify(res, null, '\t'))
			},
			fail(err) {
				rejext(err) 
				console.log('------------------------------- start -------------------------------');
				console.log('（报错）请求报文：' + url, ": \n", params)
				console.log('（报错）响应报文：' + url, ": \n", err)
				console.log('-------------------------------- end --------------------------------');
				// console.log('请求报文：' + url, ": \n", JSON.stringify(params, null, '\t'))
				// console.log('响应报文：' + url, ": \n", JSON.stringify(err, null, '\t'))
			}
		})

	})

}
