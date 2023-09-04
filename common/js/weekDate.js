//设置周下拉框
function setweekOption(year) { //传入年份,字符串类型年份,'2020'
	year = new Date(year).getFullYear()
	let days = getDay(year || new Date().getFullYear())
	// console.log(days)
	let weeks = {};
	for (let i = 0; i < days.length; i++) {
		let weeksKeyLen = Object.keys(weeks).length;
		let daySplit = days[i].split('_');
		if (weeks[weeksKeyLen] === undefined) {
			weeks[weeksKeyLen + 1] = [daySplit[0]]
		} else {
			if (daySplit[1] == '1') {
				weeks[weeksKeyLen + 1] = [daySplit[0]]
			} else {
				weeks[weeksKeyLen].push(daySplit[0])
			}
		}
	}
	let option = []
	let weeksKeyLen = Object.keys(weeks).length;
	for (let i = 1; i < weeksKeyLen + 1; i++) {
		let obj = {};
		obj.year = year
		obj.week = i + "周"
		obj.md = weeks[i][0] + '-' + weeks[i][weeks[i].length - 1]
		obj.s = year + '-' + weeks[i][0]
		obj.e = year + '-' + weeks[i][weeks[i].length - 1]
		obj.estamp = new Date(obj.e).getTime()
		obj.sstamp = new Date(obj.s).getTime()

		obj.text = "第" + i + "周" + '(' + weeks[i][0] + '-' + weeks[i][weeks[i].length - 1] + ')';
		obj.value = i;
		option.push(obj)

	}
	return option;
}
function getDay(year) {
	let dates = [];
	for (let i = 1; i <= 12; i++) {
		for (let j = 1; j <= new Date(year, i, 0).getDate(); j++) {
			dates.push(formatNumber(i) + '-' + formatNumber(j) + '_' + new Date([year, formatNumber(i), formatNumber(j)]
				.join('-')).getDay()) //返回当年所有日期（带星期数）
		}
	}
	return dates;
}
function formatNumber(n) {
	return n.toString().length > 1 ? n : '0' + n
}

module.exports = {
	setweekOption,
	getDay,
	formatNumber
}
