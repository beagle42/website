// Astronomical script
// Version 1.0.0
// (18/1/2023)

// Requires math.js

var planets = [];
var Planet = function (name, T, eps, po, e, a, i, leo, thet_0, v_0, symbol, colour, radius) {
	this.name = name;
	this.T = T;
	this.eps = eps;
	this.po = po;
	this.e = e;
	this.a = a;
	this.i = i;
	this.leo = leo;
	this.thet_0 = thet_0;
	this.v_0 = v_0;
	this.colour = colour;
	this.radius = radius;
	this.symbol = symbol;
}
planets[0] = new Planet("Mercury", 0.24085, 75.5671, 77.612, 0.205627, 0.387098, 7.0051, 48.449, 6.74, -0.42, "\u263f", "#808080", 2.5);
planets[1] = new Planet("Venus", 0.615207, 272.30044, 131.54, 0.006812, 0.723329, 3.3947, 76.769, 16.92, -4.4, "\u2640", "#ffcc00", 3);
var earth = new Planet("Earth", 0.999996, 99.556772, 103.2055, 0.016671, 0.999985);
planets[2] = new Planet("Mars", 1.880765, 109.09646, 336.217, 0.093348, 1.523689, 1.8497, 49.632, 9.36, -1.52, "\u2642", "#ff0000", 2.75);
planets[3] = new Planet("Jupiter", 11.857911, 337.917132, 14.6633, 0.048907, 5.20278, 1.3035, 100.595, 196.74, -9.4, "\u2643", "#feac49", 6);
planets[4] = new Planet("Saturn", 29.310579, 172.398316, 89.567, 0.053853, 9.51134, 2.4873, 113.752, 165.6, -8.88, "\u2644", "#d6b977", 5);
planets[5] = new Planet("Uranus", 84.039492, 356.1354, 172.884833, 0.046321, 19.21814, 0.773059, 73.926961, 65.8, -7.19, "\u2645", "#a8eef0", 4); //eps value is incorrect in referenced book. Correct value sourced from: https://www.cambridge.org/files/4113/6680/1018/pawycos-errata.pdf. Alternative symbol: \u26e2
planets[6] = new Planet("Neptune", 165.84539, 326.895127, 23.07, 0.010483, 30.1985, 1.7673, 131.879, 62.2, -6.87, "\u2646", "#0000ff", 4);

var JulianDate = function (Y, M, D, h = 0, min = 0, s = 0, ms = 0) {
	if (M <= 2) {
		Y--;
		M += 12;
	}
	var A = floor(Y / 100);
	var B = floor(A / 4);
	var C = 2 - A + B;
	var E = floor(365.25 * (Y + 4716));
	var F = floor(30.6001 * (M + 1));
	return C + D + E + F - 1524.5 + h / 24 + min / 1440 + s / 86400 + ms / 86400000;
}
var GST = function (decHours, JD0) { // decHours = decimal hours since midnight UTC, JD0 = Julian date at midnight UTC. Returns GST in 24-hour form.
	var S = JD0 - 2451545;
	var T = S / 36525;
	var T0 = 6.697374558 + (2400.051336 * T) + (0.000025862 * T * T);
	var GMST = T0 + decHours * 1.002737909;
	return mod(GMST, 24);
}
var obliquity = function (JD) {
	var T = (JD - 2451545) / 36525;
	var DE = 46.815 * T + 0.0006 * T * T - 0.00181 * T * T * T;
	var eps = 23.439292 - DE / 3600;
	return eps;
}
var EcToEq = function (ecCoords, JD) { //Ecliptic coordinates to hour angle.
	var eclipticLong = ecCoords.ecLong;
	var eclipticLat = ecCoords.ecLat;
	var eps = obliquity(JD);
	var RA = atan2(sin(eclipticLong) * cos(eps) - tan(eclipticLat) * sin(eps), cos(eclipticLong));
	var dec = asin(sin(eclipticLat) * cos(eps) + cos(eclipticLat) * sin(eps) * sin(eclipticLong));
	return {RA: mod(RA, 360), dec: dec};
}
var EqToEc = function (eqCoords, JD) {
	var RA = eqCoords.RA;
	var dec = eqCoords.dec;
	var eps = obliquity(JD);
	var lambda = atan2(sin(RA) * cos(eps) + tan(dec) * sin(eps), cos(RA));
	var beta = asin(sin(dec) * cos(eps) - cos(dec) * sin(eps) * sin(RA));
	return {ecLong: lambda, ecLat: beta};
}
var RAtoH = function (RA, LST) {
	return mod(LST - RA, 360);
}
var Sun_Ec = function (JD) {
	var T = (JD - 2415020) / 36525;
	var eps_g = mod(279.6966778 + 36000.76892 * T + 0.0003025 * T * T);
	var po_g = mod(281.2208444 + 1.719175 * T + 0.000452778 * T * T);
	var e = mod(0.01675104 - 0.0000418 * T - 0.000000126 * T * T);
	var M_sun = mod(eps_g - po_g);
	var E = rad(M_sun);
	var del = E - e * Math.sin(E) - rad(M_sun);
	while (Math.abs(del) > 0.000001) {
		E -= del / (1 - e * Math.cos(E));
		del = E - e * Math.sin(E) - rad(M_sun);
	}
	E = deg(E);
	var v = mod(2 * atan(Math.sqrt((1 + e) / (1 - e)) * tan(E / 2)));
	var lam_sun = mod(v + po_g);
	return {
		ec: {ecLong: lam_sun, ecLat: 0}, 
		meanAnom: M_sun
	};
}
var Sun = function (JD) {
	var ecCoords = Sun_Ec(JD);
	var eqCoords = EcToEq(ecCoords.ec, JD);
	return {eq: eqCoords, ec: ecCoords.ec};
}
var SunAndMoon_Ec = function (JD) {
	var sunEcCoords = Sun_Ec(JD);
	var lam_sun = sunEcCoords.ec.ecLong;
	var M_sun = sunEcCoords.meanAnom;
	var D = JD - 2455196.5;
	var l = mod(13.1763966 * D + 91.929336);
	var M_m = mod(l - 0.1114041 * D - 130.143076);
	var N = mod(291.682547 - 0.0529539 * D);
	var C = l - lam_sun;
	var E_v = 1.2739 * sin(2 * C - M_m);
	var A_e = 0.1858 * sin(M_sun);
	var A_3 = 0.37 * sin(M_sun);
	var M_m2 = M_m + E_v - A_e - A_3;
	var E_c = 6.2886 * sin(M_m2);
	var A_4 = 0.214 * sin(2 * M_m2);
	var l2 = l + E_v + E_c - A_e - A_4;
	var V = 0.6583 * sin(2 * (l2 - lam_sun));
	var l3 = l2 + V;
	var N2 = N - 0.16 * sin(M_sun);
	var lam_m = atan2(sin(l3 - N2) * cos(5.145396), cos(l3 - N2)) + N2;
	var beta_m = asin(sin(l3 - N2) * sin(5.145396));
	var ascNode = mod(N2, 360);
	var dscNode = mod(N2 + 180, 360);
	var age = mod(l3 - lam_sun, 360);
	return {
		sun: {ec: sunEcCoords.ec},
		moon: {
			ec: {ecLong: lam_m, ecLat: beta_m},
			ascNode: ascNode, 
			dscNode: dscNode, 
			age: age
		}
	};
}
var SunAndMoon = function (JD) {
	var ecCoords = SunAndMoon_Ec(JD);
	var sunEqCoords = EcToEq(ecCoords.sun.ec, JD);
	var moonEqCoords = EcToEq(ecCoords.moon.ec, JD);
	return {
		sun: {ec: ecCoords.sun.ec, eq: sunEqCoords},
		moon: Object.assign(ecCoords.moon, {eq: moonEqCoords})
	};
}
var EquationOfTime = function (greenwichSolarHourAngle, UTCdeg) { // In degrees
	return mod(greenwichSolarHourAngle - UTCdeg, 360) - 180; // Sun hour angle is 180 degrees out of phase with GAT
}
var Planets_Ec = function (JD) {
	var result = [];
	var D = JD - 2455196.5;
	for (var i = 0; i < planets.length; i++) {
		var N_p = mod(360 / 365.242191 * D / planets[i].T);
		var M_p = N_p + planets[i].eps - planets[i].po;
		var v_p = mod(M_p + 360 / Math.PI * planets[i].e * sin(M_p));
		var l_p = mod(v_p + planets[i].po);
		var lr = planets[i].a * (1 - planets[i].e * planets[i].e) / (1 + planets[i].e * cos(v_p));
		var N_E = mod(360 / 365.242191 * D / earth.T);
		var M_E = N_E + earth.eps - earth.po;
		var v_E = mod(M_E + 360 / Math.PI * earth.e * sin(M_E));
		var L = mod(v_E + earth.po);
		var bR = earth.a * (1 - earth.e * earth.e) / (1 + earth.e * cos(v_E));
		var psi = asin(sin(l_p - planets[i].leo) * sin(planets[i].i));
		var l2 = atan2(sin(l_p - planets[i].leo) * cos(planets[i].i), cos(l_p - planets[i].leo)) + planets[i].leo;
		var lr2 = lr * cos(psi);
		var lam;
		if (i > 1) {
			lam = mod(atan(bR * sin(l2 - L) / (lr2 - bR * cos(l2 - L))) + l2);
		} else {
			lam = mod(180 + L + atan(lr2 * sin(L - l2) / (bR - lr2 * cos(L - l2))));
		}
		var beta = mod(atan(lr2 * tan(psi) * sin(lam - l2) / (bR * sin(l2 - L))));
		result[i] = {ec: {ecLong: lam, ecLat: beta}};
	}
	return result;
}
var Planets = function (JD) {
	var ecCoords = Planets_Ec(JD);
	var result = [];
	for (var i = 0; i < planets.length; i++) {
		result[i] = {ec: ecCoords[i].ec, eq: EcToEq(ecCoords[i].ec, JD)};
	}
	return result;
}