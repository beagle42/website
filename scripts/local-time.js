// Local times script
// Version 1.0.0
// (18/1/2023)

// Requires math.js, astro.js and general-clocks.js

// For Local Time

function getLocalTimes() {
	var now = new Date();
	// Calculations
	var GMTdec = now.getUTCHours() / 24 + now.getUTCMinutes() / 1440 + now.getUTCSeconds() / 86400 + now.getUTCMilliseconds() / 86400000; // Greenwich mean time in decimal form
	var JD0 = JulianDate(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate()); // Julian date at midnight UTC
	var JD = JD0 + GMTdec; // Julian date now
	var decHours = GMTdec * 24;
	var GSTdec = GST(decHours, JD0) / 24; // Greenwich sidereal time in decimal form
	var sun = Sun(JD);
	var GATdec = mod(GSTdec - (sun.eq.RA / 360) + 0.5, 1); // Greenwich apparent time in decimal form
	return {GMTdec: GMTdec, GSTdec: GSTdec, GATdec: GATdec};
}
function localTimeOutputs(TIMEdec, whichHour, useLeadingZero, useSecond) {
	// Extract values
	var HOUR24 = TIMEdec * 24;
	var intHOUR24 = floor(HOUR24);
	var intHOUR12 = mod(intHOUR24 - 1, 12) + 1;
	var ARVO = intHOUR24 >= 12;
	var MINUTE = (HOUR24 - intHOUR24) * 60;
	var intMINUTE = floor(MINUTE);
	var intSECOND = floor((MINUTE - intMINUTE) * 60);
	// Create digital clock output string
	var digital = "";
	var displayHourDigits = intHOUR12;
	if (whichHour === 2) {
		displayHourDigits = intHOUR24;
	}
	displayHourDigits = zero(displayHourDigits, !useLeadingZero);
	digital += displayHourDigits + ":" + zero(intMINUTE);
	if (useSecond) {
		digital += ":" + zero(intSECOND);
	}
	if (whichHour === 0 || whichHour === 3) {
		digital += ' <span class="smallcaps">';
		if (!ARVO) {
			digital += "a";
		} else {
			digital += "p";
		}
		digital += "m</span>";
	}
	return {digital: digital, HOUR24: HOUR24, MINUTE: MINUTE, intSECOND: intSECOND};
}
function displayLongitude(longitude) {
	var roundedLong = roundTo(longitude, 4);
	var result = abs(roundedLong) + "&deg;"
	if (roundedLong === 0 || abs(roundedLong) === 180) {
		// Lol nope
	} else if (roundedLong > 0) {
		result += "E";
	} else if (roundedLong < 0) {
		result += "W";
	}
	return result;
}
var success = function (position) {
	setValue("long", roundTo(position.coords.longitude, 4));
}
var auto = function () {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success);
	} else { 
		alert("Sorry, couldn't find your location.");
	}
}
var autoZone = function () {
	if (checked("autoZone")) {
		document.getElementById("zone").disabled = true;
	} else {
		document.getElementById("zone").disabled = false;
	}
}