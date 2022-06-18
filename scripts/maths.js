var mod = function (n, p = 360) {
	return ((n % p) + p) % p;
}
var floor = Math.floor;
var ceil = Math.ceil;
var round = Math.round;
var SqRt = Math.sqrt;
var abs = Math.abs;
var exp = Math.exp;
var log = Math.log;
var log10 = Math.log10;
var min = Math.min;
var max = Math.max;
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