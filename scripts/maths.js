var mod = function (num, p = 360) {
	var n = num;
	if (n < 0) {
		n = p - (-1 * n) % p;
	}
	return n % p;
}
var floor = Math.floor;
var ceil = Math.ceil;
var SqRt = Math.sqrt;
var abs = Math.abs;
var log = Math.log;
var Pi = Math.PI;
var TwoPi = 2 * Math.PI;
var deg = function (radians) {
	return radians * 180 / Math.PI;
}
var rad = function (degrees) {
	return degrees * Math.PI / 180;
}
var sin = function (x) {
	return Math.sin(rad(x));
}
var cos = function (x) {
	return Math.cos(rad(x));
}
var tan = function (x) {
	return Math.tan(rad(x));
}
var asin = function (x) {
	return deg(Math.asin(x));
}
var acos = function (x) {
	return deg(Math.acos(x));
}
var atan = function (x) {
	return deg(Math.atan(x));
}
var atan2 = function (y, x) {
	return deg(Math.atan2(y, x));
}