// DOM script
// Version 1.0.0
// (18/1/2023)

var getValue = function (id) {
	return document.getElementById(id).value;
}
var setValue = function (id, value) {
	document.getElementById(id).value = value;
}
var getNumValue = function (id) {
	return Number(document.getElementById(id).value);
}
var setHTML = function (id, html) {
	document.getElementById(id).innerHTML = html;
}
var checked = function (id) {
	return document.getElementById(id).checked;
}
var check = function (id) {
	document.getElementById(id).checked = true;
}
var uncheck = function (id) {
	document.getElementById(id).checked = false;
}