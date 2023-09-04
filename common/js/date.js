/* 时间戳转换成日期格式 */

function parseTime(dateTimestamp, cFormat) {
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let timeDate
	if (dateTimestamp !== null) {
		timeDate = new Date(parseInt(dateTimestamp))
		const formatObj = {
			y: timeDate.getFullYear(),
			m: timeDate.getMonth() + 1,
			d: timeDate.getDate(),
			h: timeDate.getHours(),
			i: timeDate.getMinutes(),
			s: timeDate.getSeconds(),
			a: timeDate.getDay()
		}
		const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
			const value = formatObj[key]
			return value.toString().padStart(2, '0')
		})
		return time_str
	}
}

/* 获取今日日期 */
function getDateTime(time) {
	var date = new Date()
	if (time) date = new Date(time)
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	month = month < 10 ? '0' + month : month
	let day = date.getDate()
	day = day < 10 ? '0' + day : day
	let hour = date.getHours()
	hour = hour < 10 ? '0' + hour : hour
	let minute = date.getMinutes()
	minute = minute < 10 ? '0' + minute : minute
	let week = date.getDay()
	var startDate = year + '-' + month + '-' + day
	var endDate = year + '-' + month + '-' + day
	var updateTime = `${hour}:${minute}`
	let timeDate = {
		startDate,
		endDate,
		updateTime
	}
	return timeDate
}


/* 获取本周日期 */
function getWeekDate() {
	//按周日为一周的最后一天计算
	var date = new Date()
	//今天是这周的第几天
	var today = date.getDay()
	//上周日距离今天的天数（负数表示）
	var stepSunDay = -today + 1
	// 如果今天是周日
	if (today == 0) {
		stepSunDay = -7;
	}
	// 周一距离今天的天数（负数表示）
	var stepMonday = 7 - today;
	var time = date.getTime()
	var monday = new Date(time + stepSunDay * 24 * 3600 * 1000)
	var sunday = new Date(time + stepMonday * 24 * 3600 * 1000)
	//本周一的日期 （起始日期）
	var startDate = transferDate(monday) // 日期变换
	//本周日的日期 （结束日期）
	var endDate = transferDate(sunday) // 日期变换
	let timeDate = {
		startDate,
		endDate
	}
	return timeDate
}


/* 获取本月日期 */
function getMonthDate() {
	// 获取当前月的第一天
	var start = new Date()
	start.setDate(1)
	// 获取当前月的最后一天
	var date = new Date()
	var currentMonth = date.getMonth()
	var nextMonth = ++currentMonth
	var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
	var oneDay = 1000 * 60 * 60 * 24
	var end = new Date(nextMonthFirstDay - oneDay)
	var startDate = transferDate(start) // 日期变换
	var endDate = transferDate(end) // 日期变换
	let timeDate = {
		startDate,
		endDate
	}
	return timeDate
}


/* 日期转换 */
function transferDate(date) {
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	month = month < 10 ? '0' + month : month
	let day = date.getDate()
	day = day < 10 ? '0' + day : day
	var dateString = year + '-' + month + '-' + day
	return dateString
}

module.exports = {
	parseTime,
	getDateTime,
	getWeekDate,
	getMonthDate
}
