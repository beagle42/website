// General clocks script
// Version 1.0.0
// (11/1/2023)

var romanNumerals = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "XXII", "XXIII", "XXIV"];
var listOfNumbers = function (n, noZero=false) {
	var result = [];
	for (var i = 0; i < n; i++) {
		var m = i;
		if (noZero && i === 0) {
			m = n;
		}
		result[i] = m;
	}
	return result;
}
var polarToCart = function (r, a) { // Angle clockwise from vertically up. Cartesian with inverted y-axis.
	return {x: r * sin(a), y: -1 * r * cos(a)};
}
var roundTo = function (x, n) {
	return round(x * (10 ** n)) / (10 ** n);
}
var zero = function (n, space=false) {
	var x = n.toString();
	var ch = "0";
	if (space) {
		ch = '<span class="whiteText">0</span>';
	}
	if (x < 10) {
		x = ch + x;
	}
	return x;
}
var arrayToRoman = function (arr) {
	var result = [];
	for (var i = 0; i < arr.length; i++) {
		result.push(romanNumerals[arr[i]]);
	}
	return result;
}
var checked = function (id) {
	return document.getElementById(id).checked;
}
var getValue = function (id) {
	return Number(document.getElementById(id).value);
}
var drawClockFace = function (ctx, r, NoOfMinor, majorEvery, numbersArray, numberSize, font, numbersRadius, rotateNumbers) {
	// Clockface
	ctx.strokeStyle = "#444444";
	ctx.fillStyle = "#f0f0f0";
	ctx.lineWidth = r / 100;
	ctx.beginPath();
	ctx.arc(0, 0, r, 0, TwoPi);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(0, 0, r, 0, TwoPi);
	ctx.stroke();
	ctx.fillStyle = "#444444";
	// Minute/hour markers
	for (var i = 0; i < NoOfMinor; i++) {
		var dotSize = 1 / 100;
		if (i % majorEvery === 0) {
			dotSize = 1 / 60;
		}
		var pos = polarToCart(r * 0.97, i * 360 / NoOfMinor);
		ctx.beginPath();
		ctx.arc(pos.x, pos.y, r * dotSize, 0, TwoPi);
		ctx.fill();
	}
	// Numbers
	ctx.font = (numberSize * r) + "px " + font;
	for (var i = 0; i < numbersArray.length; i++) {
		var pos = {x: 0, y: -1 * numbersRadius * r};
		var a = i * 360 / numbersArray.length;
		if (!rotateNumbers) {
			pos = polarToCart(numbersRadius * r, a);
		}
		ctx.fillText(numbersArray[i].toString(), pos.x, pos.y);
		if (rotateNumbers) {
			ctx.rotate(TwoPi / numbersArray.length);
		}
	}
}
var drawClockHands = function (ctx, r, h, m, s, showSecond) {
	ctx.strokeStyle = "#000000";
	ctx.fillStyle = "#000000";
	ctx.lineCap = "round";
	// Hour hand
	ctx.lineWidth = r / 20;
	var pos = polarToCart(0.5 * r, h);
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(pos.x, pos.y);
	ctx.stroke();
	// Minute hand
	pos = polarToCart(0.9 * r, m);
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(pos.x, pos.y);
	ctx.stroke();
	// Second 
	if (showSecond) {
		ctx.lineWidth = r / 50;
		pos = polarToCart(0.9 * r, s);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(pos.x, pos.y);
		ctx.stroke();
	}
	// Centre
	ctx.beginPath();
	ctx.arc(0, 0, r / 20, 0, TwoPi);
	ctx.fill();
}
function start() {
	canvas = document.getElementById("clock");
	ctx = canvas.getContext("2d");
	var useableHeight = window.innerHeight - 160;
	var useableWidth = window.innerWidth;
	var boxWidth = min(useableHeight, useableWidth / 2);
	var digitalBoxTop = 0;
	var optionsBoxTop = boxWidth / 2;
	var pageWidth = 2 * boxWidth;
	if (useableHeight >= 3 / 2 * useableWidth) {
		boxWidth = useableWidth;
		digitalBoxTop = boxWidth;
		optionsBoxTop = boxWidth * 3 / 2;
		pageWidth = boxWidth;
	}
	document.getElementById("page").style.width = pageWidth + "px";
	document.getElementById("digitalbox").style.top = digitalBoxTop + "px";
	document.getElementById("optionsbox").style.top = optionsBoxTop + "px";
	document.querySelector(':root').style.setProperty('--box-width', boxWidth + "px");
	canvas.width = boxWidth;
	canvas.height = canvas.width;
	ctx.translate(canvas.width / 2, canvas.height / 2);
	r = canvas.width * 0.45;
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	run();
}