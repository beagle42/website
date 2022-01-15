//The 'Holidays Engine'.

//Lists of dates
var ChineseNY = [[1,2,2022], [22,1,2023], [10,2,2024], [29,1,2025], [17,2,2026], [6,2,2027]];
var ChineseAnimals = ["&#128018;", "&#128019;", "&#128021;", "&#128022;", "&#128000;", "&#128002;", "&#128005;", "&#128007;", "&#128009;", "&#128013;", "&#128014;", "&#128016;"];
var AutumnE = [[21,3,2022], [21,3,2023], [20,3,2024], [20,3,2025], [21,3,2026], [21,3,2027], [20,3,2028], [20,3,2029], [20,3,2030]];
var WinterS = [[21,6,2022], [22,6,2023], [21,6,2024], [21,6,2025], [21,6,2026], [22,6,2027], [21,6,2028], [21,6,2029], [21,6,2030]];
var SpringE = [[23,9,2022], [23,9,2023], [22,9,2024], [23,9,2025], [23,9,2026], [23,9,2027], [22,9,2028], [23,9,2029], [23,9,2030]];
var SummerS = [[22,12,2021], [22,12,2022], [22,12,2023], [21,12,2024], [22,12,2025], [22,12,2026], [22,12,2027], [21,12,2028], [22,12,2029], [22,12,2030]];
var Diwali = [[23, 10, 2022]];
var Ramadan = [2459673, 2460088, 2460381, 2460736, 2461090];
var EidalFitr = [2459703, 2460057, 2460411, 2460766, 2461120];
var EidalAdha = [2459771, 2460125, 2460479, 2460834, 2461188];
var Mawlid = [2459861, 2460215, 2460570, 2460924, 2461279];
//Maths
var floor = Math.floor;
var mod = function (num, p) {
	var n = num;
	if (n < 0) {
		n = p - (-1 * n) % p;
	}
	return n % p;
}
//Calendrical functions
var GregToJD = function (D, M, Y) {
	if (M <= 2) {
		Y--;
		M += 12;
	}
	var A = floor(Y / 100);
	var B = floor(A / 4);
	var C = 2 - A + B;
	var E = floor(365.25 * (Y + 4716));
	var F = floor(30.6001 * (M + 1));
	return C + D + E + F - 1524.5 + 0.5;
}
var EasterJD = function (Y) {
	var a = floor(Y / 19);
	var b = floor(Y / 100);
	var c = floor(b / 4);
	var d = floor((b + 7) / 25);
	var e = (b + 7) % 25;
	var f = floor(e / 3);
	var g = floor(e / 24);
	var h = (19 * Y - a + b - c - 8 * d - f + g + 17) % 30;
	var i = floor(h / 29);
	var j = Y % 19;
	var k = floor(h / 28);
	var l = floor(j / 11);
	var m = h - i - l * (k - i);
	var n = floor(Y / 4);
	var o = (6 * (Y + n - b + c + m) + 4) % 7;
	var p = m + o + 22;
	var q = floor(p / 32);
	var day = p - 31 * q;
	var month = 3 + q;
	return GregToJD(day, month, Y);
}
var DomLetter = function (Y) {
	var a = floor(Y / 4);
	var b = floor(a / 25);
	var c = floor(b / 4);
	return mod(6 * (Y + a - b + c), 7);
}
var isHebrewLeap = function (Y) {
	var nt = mod(Y, 19);
	var result = false;
	if (nt === 3 || nt === 6 || nt === 8 || nt === 11 || nt === 14 || nt === 17 || nt === 0) {
		var result = true;
	}
	return result;
}
var partsPerLun = 765433;
var partsPerDay = 25920;
var partsPerWeek = 7 * partsPerDay;
var meanDaysPerYear = partsPerLun / partsPerDay * 235 / 19;
var HebrewEpoch = 2450723 * partsPerDay + 23889; // molad Tishrei of 5758 AM.
var HebrewNewYear = function (Y) {
	var y = Y - 5758;
	var a = floor(y / 19);
	var b = mod(y, 19) + 1;
	var L = a * 235;
	for (var i = 1; i < b; i++) {
		L += 12;
		if (isHebrewLeap(i)) {
			L++;
		}
	}
	var P = L * partsPerLun;
	var molad = HebrewEpoch + P;
	var moladDay = floor(molad / partsPerDay);
	var moladParts = mod(molad, partsPerDay);
	var moladWeekDay = mod(moladDay, 7); // 0 = Monday.
	var resultDay = moladDay;
	if (moladParts >= partsPerDay / 2 || (isHebrewLeap(Y - 1) && moladWeekDay === 0 && moladParts >= 10309)) {
		resultDay++;
	} else if (!isHebrewLeap(Y) && moladWeekDay === 1 && moladParts >= 3444) {
		resultDay += 2;
	}
	var resultWeekDay = mod(resultDay, 7);
	if (resultWeekDay === 6 || resultWeekDay === 2 || resultWeekDay === 4) {
		resultDay++;
	}
	return resultDay;
}
var HebrewMonthLength = function (m, len) { // Tishrei = 0, Adar I = 5
	var result = 30;
	if (m === 3 || m === 6 || m === 8 || m === 10 || m === 12 || (m === 1 && len % 10 != 5) || (m === 2 && len % 10 === 3)) {
		result--;
	}
	if (m === 5 && len < 380) {
		result = 0;
	}
	return result;
}
var JDToHebrew = function (JD) {
	var guess = floor((JD - 347614) / meanDaysPerYear);
	var ny = HebrewNewYear(guess);
	var ny2 = HebrewNewYear(guess + 1);
	var j = 0;
	while ((JD < ny || JD >= ny2) && j < 1000) {
		if (JD < ny) {
			ny2 = ny;
			guess--;
			ny = HebrewNewYear(guess);
		} else {
			ny = ny2;
			guess++;
			ny2 = HebrewNewYear(guess + 1);
		}
		j++;
	}
	var y = guess;
	var len = ny2 - ny;
	var T = JD - ny;
	var i = 0;
	while (T >= HebrewMonthLength(i, len) && i < 100) {
		T -= HebrewMonthLength(i, len);
		i++;
	}
	var m = (i + 6) % 13 + 1;
	return {d: T + 1, m: m, y: y, isShort: len % 10 === 3};
}
var monthLengths = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var JDToJul = function (JD) {
	var diff = 1721058;
	var T = mod(JD - diff, 4 * 365 + 1);
	var yearLength = function (x) {
		var result = 365;
		if (x % 4 === 0) {
			result++;
		}
		return result;
	}
	var mL = function (x, y) {
		var result = monthLengths[x];
		if (yearLength(y) === 366 && x === 2) {
			result = 29;
		}
		return result;
	}
	var j = 0;
	while (T - yearLength(j) >= 0) {
		T -= yearLength(j);
		j++;
	}
	var Y = floor((JD - diff) / (4 * 365 + 1)) * 4 + j;
	var k = 1;
	while (T - mL(k, j) >= 0) {
		T -= mL(k, j);
		k++;
	}
	return {d: T + 1, m: k, y: Y};
}
var JulianEaster = function (Y) {
	var a = mod(Y, 19);
	var b = floor(Y / 4)
	var c = (19 * a + 14) % 30;
	var d = (6 * (Y + b + c) + 6) % 7;
	var e = 22 + c + d;
	var f = floor(e / 32);
	return {d: e - 31 * f, m: 3 + f};
}
//Object thingy
var Hol = function (name, date, message, colour1 = "NA", colour2 = "NA", colour3 = "#000000") {
	this.name = name;
	this.date = date;
	this.message = message;
	this.colour1 = colour1;
	this.colour2 = colour2;
	this.colour3 = colour3;
}
//Shorthand
var isDate = function (d, m) {
	return function (D) {
		return D.d === d && D.m === m;
	}
}
var afterEaster = function (a) {
	return function (D) {
		return D.Easter + a === D.JD;
	}
}
var isInList = function (list) {
	return function (D) {
		var result = false;
		for (var j = 0; j < list.length; j++) {
			if (list[j][0] === D.d && list[j][1] === D.m && list[j][2] === D.y) {
				result = true;
			}
		}
		return result;
	}
}
var isInSunsetJDList = function (list) {
	return function (D) {
		var result = false;
		for (var j = 0; j < list.length; j++) {
			if (list[j] === D.sunsetJD) {
				result = true;
			}
		}
		return result;
	}
}
var isHebrewDate = function (d, m) { //1 = Nisan, 12 = Adar I, 13 = Adar II
	return function (D) {
		return D.Hebrew.d === d && D.Hebrew.m === m;
	}
}
var img = function (src, size = "1.6em") {
	return '<img src="images/' + src + '" style="height: ' + size + '">';
}
//Misc.
var ChristmasEve = ["&#127850;&#129371;", "&#127877;", "&#129420;"];
//List of holidays
var Holidays = [
	new Hol(
		"New Year's Day",
		isDate(1, 1),
		"&#127878;<br>Happy New Year!<br>&#127881;",
		"#000066", "#000066", "#FFD700"
	),
	new Hol(
		"New Year's Eve",
		isDate(31, 12),
		"&#127879; &#127881;",
		"#000066", "#000066", "#C0C0C0"
	),
	new Hol(
		"Australia Day",
		isDate(26, 1),
		"&#127462;&#127482;",
		"#FFCD00", "#00843D", "#00843D"
	),
	new Hol(
		"Christmas Eve",
		isDate(24, 12),
		"&#127876;<br>" + ChristmasEve[floor(Math.random() * 3)],
		"#009900", "#ee0000"
	),
	new Hol(
		"Christmas Day",
		isDate(25, 12),
		"&#127876;<br>Merry Christmas!<br>&#127873;",
		"#ee0000", "#009900"
	),
	new Hol(
		"Boxing Day",
		isDate(26, 12),
		"&#128230;",
		"#007700", "#cc0000"
	),
	new Hol(
		"Good Friday",
		afterEaster(-2),
		'<span style="font-family:Symbols">&#10013;</span>',
		"rgb(224, 176, 255)", "#000000",
	),
	new Hol(
		"Easter (Holy) Saturday",
		afterEaster(-1),
		"&#128007;",
		"#00ff7f", "#00b359"
	),
	new Hol(
		"ANZAC Day & Easter Sunday",
		function (D) {
			return D.d === 25 && D.m === 4 && D.JD === D.Easter;
		},
		img("rosemary.png") + img("poppy.png", "1em") + '<br>&#128035;',
		"#00b359", "#303030"
	),
	new Hol(
		"ANZAC Day",
		isDate(25, 4),
		img("rosemary.png") + img("poppy.png", "1em"),
		"#303030", "#303030", "#a88924"
	),
	new Hol(
		"Easter Sunday",
		afterEaster(0),
		"&#128035;<br>Happy Easter!",
		"#faf884", "#00b359"
	),
	new Hol(
		"Easter Monday",
		afterEaster(1),
		"&#128036;",
		"#89cff0", "#1a93cb"
	),
	new Hol(
		"Autumn Equinox",
		isInList(AutumnE),
		"&#127810;"
	),
	new Hol(
		"Winter Solstice",
		isInList(WinterS),
		"&#10052;"
	),
	new Hol(
		"Spring Equinox",
		isInList(SpringE),
		"&#127799;"
	),
	new Hol(
		"Summer Solstice",
		isInList(SummerS),
		"&#9728;"
	),
	new Hol(
		"Twelfth Night",
		isDate(5, 1),
		"&#11088;"
	),
	new Hol(
		"Epiphany",
		isDate(6, 1),
		"&#127775;"
	),
	new Hol(
		"Candlemas & Groundhog Day",
		isDate(2, 2),
		"&#128367;"
	),
	new Hol(
		"Valentine's Day",
		isDate(14, 2),
		"&#10084;"
	),
	new Hol(
		"Pi Day",
		isDate(14, 3),
		'<span style="font-family: Times, serif; font-size: 1.5em">&#960;</span>'
	),
	new Hol(
		"Shrove Tuesday",
		afterEaster(-47),
		"&#129374;"
	),
	new Hol(
		"Ash Wednesday",
		afterEaster(-46),
		'<span style="color:#4d4d4d">&#10010;</span>'
	),
	new Hol(
		"St. Patrick's Day",
		isDate(17, 3),
		"&#9752;"
	),
	new Hol(
		"Palm Sunday",
		afterEaster(-7),
		"&#127796;"
	),
	new Hol(
		"Maundy Thursday",
		afterEaster(-3),
		"&#127838;&#127863;"
	),
	new Hol(
		"Labour Day",
		function (D) {
			return D.m === 5 && D.d === mod(D.DL, 7) + 1;
		},
		"&#128736;"
	),
	new Hol(
		"Mother's Day",
		function (D) {
			return D.m === 5 && D.d === mod(D.DL + 6, 7) + 8;
		},
		"&#128144;",
		"#ff99cc", "#4da6ff"
	),
	new Hol(
		"Ascension Day",
		afterEaster(39),
		"&#9925;"
	),
	new Hol(
		"Queensland Day",
		isDate(6, 6),
		img("qld-flag.png"),
		"#73182C", "#73182C", "#ffffff"
	),
	new Hol(
		"Queen's Birthday (National)",
		function (D) {
			return D.m === 6 && D.d === mod(D.DL + 4, 7) + 8;
		},
		img("crown.png", "1em")
	),
	new Hol(
		"Pentecost / Whitsunday",
		afterEaster(49),
		"&#128330;"
	),
	new Hol(
		"Father's Day",
		function (D) {
			return D.m === 9 && D.d === mod(D.DL + 2, 7) + 1;
		},
		"&#128144;",
		"#4da6ff", "#ff99cc"
	),
	new Hol(
		"National Flag Day",
		isDate(3, 9),
		img("flag.png") + " &nbsp; " + img("red-ensign.png"),
		"#00008B", "#ff0000", "#ffffff"
	),
	new Hol(
		"Queen's Birthday (Qld.)",
		function (D) {
			return D.m === 10 && D.d === mod(D.DL + 1, 7) + 1;
		},
		img("crown.png")
	),
	new Hol(
		"Halloween",
		isDate(31, 10),
		"&#127875;",
		"#ffa500", "#000000"
	),
	new Hol(
		"All Saints' Day",
		isDate(1, 11),
		"&#10013;&#9770;&#128329;&#9784;&#9775;&#10017;&#9766;",
	),
	new Hol(
		"All Souls' Day",
		isDate(2, 11),
		"&#128128;",
	),
	new Hol(
		"Remembrance Day",
		isDate(11, 11),
		img("poppy.png"),
		"#303030", "#303030", "#a88924"
	),
	new Hol(
		"Advent Sunday",
		function (D) {
			var result = false;
			if ((D.m === 11 && D.d === mod(D.DL + 6, 7) + 27) || (D.m === 12 && D.d === mod(D.DL + 6, 7) - 3)) {
				result = true;
			}
			return result;
		},
		"&#127876;<br>&#128367;&#128367;&#128367;&#128367;"
	),
	new Hol(
		"St. Nicholas' Day",
		isDate(6, 12),
		"&#127877;"
	),
	new Hol(
		"United Nations Day",
		isDate(24, 10),
		img("un-flag.png")
	),
	new Hol(
		"Commonwealth Day",
		function (D) {
			return D.m === 3 && D.d === mod(D.DL + 5, 7) + 8;
		},
		img("commonwealth-flag.png")
	),
	new Hol(
		"Hanukkah",
		function (D) {
			return (D.Hebrew.d >= 25 && D.Hebrew.m === 9) || ((D.Hebrew.d <= 2 || (D.Hebrew.d === 3 && D.Hebrew.isShort)) && D.Hebrew.m === 10);
		},
		"&#128334;"
	),
	new Hol(
		"Chinese New Year",
		isInList(ChineseNY),
		"&#129511;"
	),
	new Hol(
		"Orthodox Easter Sunday",
		function (D) {
			return D.Julian.d === D.JulianEaster.d && D.Julian.m === D.JulianEaster.m;
		},
		img("egg.png", "1em")//'<span style="font-family: Emoji; color: #C8102E">&#129370;</span>',
	),
	new Hol(
		"Diwali",
		isInList(Diwali),
		"&#129684;"
	),
	new Hol(
		"Rosh Hashanah",
		isHebrewDate(1, 7),
		"&#127822;&#127855;"
	),
	new Hol(
		"Yom Kippur",
		isHebrewDate(10, 7),
		"&#10017;"
	),
	new Hol(
		"Purim",
		isHebrewDate(14, 13),
		"&#127922;"
	),
	new Hol(
		"Passover",
		isHebrewDate(15, 1),
		"&#128017;"
	),
	new Hol(
		"Shavuot",
		isHebrewDate(6, 3),
		"&#127806;"
	),
	new Hol(
		"Sukkot",
		isHebrewDate(15, 7),
		"&#127819;"
	),
	new Hol(
		"NAIDOC Week",
		function (D) {
			var a = mod(D.DL + 1, 7) + 1;
			return D.m === 7 && D.d >= a && D.d <= a + 7;;
		},
		img("aboriginal-flag.png") + " &nbsp; " + img("islander-flag.png")
	),
	new Hol(
		"First of Ramadan",
		isInSunsetJDList(Ramadan),
		"&#9770;"
	),
	new Hol(
		"Eid al-Fitr",
		isInSunsetJDList(EidalFitr),
		"&#9770;"
	),
	new Hol(
		"Eid al-Fitr",
		isInSunsetJDList(EidalAdha),
		"&#9770;"
	),
	new Hol(
		"Mawlid",
		isInSunsetJDList(Mawlid),
		"&#9770;"
	),
	new Hol(
		"Christmas season",
		function (D) {
			return D.m === 12 && D.d < 25;
		},
		"&#127876;"
	)
];
//The main event
var holiday = function (d, m, y, h = 12) {
	var D = {d: d, m: m, y: y, h: h};
	D.JD = GregToJD(D.d, D.m, D.y);
	D.Easter = EasterJD(D.y);
	D.DL = DomLetter(D.y);
	D.sunsetJD = D.JD;
	if (D.h >= 18) {
		D.sunsetJD++;
	}
	D.Hebrew = JDToHebrew(D.sunsetJD);
	D.Julian = JDToJul(D.JD);
	D.JulianEaster = JulianEaster(D.Julian.y);
	var i = 0;
	while (i < Holidays.length && !Holidays[i].date(D)) {
		i++;
	}
	return i;
}