//Start
var Page = function (name, blurb, url) {
	this.name = name;
	this.blurb = blurb;
	this.url = url;
	this.score = 0;
}
//index
var index = [
	new Page("Home", "The home page", "index.html"),
	new Page("Beagle Search", "Search this website", "beagle.html"),
	new Page("Calendrical Conversions", "Convert between different calendars", "calendrical-conversions.html"),
	new Page("Dials", "An astronomical clock", "dials.html"),
	new Page("Astronomical Clock", "That's what it is", "astronomical-clock.html"),
	new Page("Equation of Time", "Several ways of representing its current value", "equation-of-time.html")
];