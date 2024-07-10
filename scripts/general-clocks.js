// General clocks script
// (13/1/2023)
// Version 1.1.0
// (10/7/2024)

// Requires math.js

// For Decimal Time and Local Time

var handsColour = "#000000";
var backgroundColour = "#f0f0f0";
var numeralsColour = "#444444";

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
var drawMarkers = function (ctx, r, R, NoOfMinor, majorEvery, dotSize) {
	for (var i = 0; i < NoOfMinor; i++) {
		var dotSize = 1 / 100;
		if (i % majorEvery === 0) {
			dotSize = 1 / 60;
		}
		var pos = polarToCart(R * r, i * 360 / NoOfMinor);
		ctx.beginPath();
		ctx.arc(pos.x, pos.y, r * dotSize, 0, TwoPi);
		ctx.fill();
	}
}
var drawClockFace = function (ctx, r, NoOfMinor, majorEvery, numbersArray, numberSize, font, numbersRadius, rotateNumbers) {
	// Clockface
	ctx.strokeStyle = numeralsColour;
	ctx.fillStyle = backgroundColour;
	ctx.lineWidth = r / 100;
	ctx.beginPath();
	ctx.arc(0, 0, r, 0, TwoPi);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(0, 0, r, 0, TwoPi);
	ctx.stroke();
	ctx.fillStyle = numeralsColour;
	// Minute/hour markers
	drawMarkers(ctx, r, 0.97, NoOfMinor, majorEvery);
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
var drawHand = function (ctx, r, length, baseWidth, endWidth, angle) {
	var b = r * baseWidth / 2;
	var e = r * endWidth / 2;
	var l = r * length;
	ctx.rotate(rad(angle));
	ctx.beginPath();
	ctx.moveTo(-1 * b, 0);
	ctx.lineTo(b, 0);
	ctx.lineTo(e, -1 * l);
	var alpha = Math.atan((b - e) / l);
	ctx.arc(0, -1 * l + e * Math.tan(alpha), e / Math.cos(alpha), -1 * alpha, Pi + alpha, true);
	ctx.closePath();
	ctx.fill();
	ctx.rotate(-1 * rad(angle));
}
var drawClockHands = function (ctx, r, h, m, s, showSecond) {
	ctx.strokeStyle = handsColour;
	ctx.fillStyle = handsColour;
	ctx.lineCap = "round";
	// Hour hand
		// ctx.lineWidth = r / 20;
		// var pos = polarToCart(0.55 * r, h);
		// ctx.beginPath();
		// ctx.moveTo(0, 0);
		// ctx.lineTo(pos.x, pos.y);
		// ctx.stroke();
	drawHand(ctx, r, 0.6, 0.08, 0.03, h);
	// Minute hand
		// ctx.lineWidth = r / 20;
		// pos = polarToCart(0.9 * r, m);
		// ctx.beginPath();
		// ctx.moveTo(0, 0);
		// ctx.lineTo(pos.x, pos.y);
		// ctx.stroke();
	drawHand(ctx, r, 0.9, 0.07, 0.03, m);
	// Second 
	if (showSecond) {
		ctx.lineWidth = r * 0.02;
		pos = polarToCart(0.9 * r, s);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(pos.x, pos.y);
		ctx.stroke();
	}
	// Centre
	ctx.beginPath();
	ctx.arc(0, 0, r * 0.05, 0, TwoPi);
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
	if (useableHeight > useableWidth) {
		boxWidth = useableHeight / 2;
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