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
	new Page("Beagle Search", "Search for the pages of this website", "beagle.html"),
	new Page("Calendrical Conversions", "Convert between different calendars", "calendrical-conversions.html"),
	new Page("Dials", "An astronomical clock", "dials.html"),
	new Page("Astronomical Clock", "That's what it is", "astronomical-clock.html"),
	new Page("Equation of Time", "Its current value", "equation-of-time.html"),
	new Page("Horoscope Generator", "Generates a horoscope chart for any time, date and location", "horoscope.html"),
	new Page("English Numbers", "eg. It converts '42' to 'forty-two'. You get the idea.", "english-numbers.html"),
	new Page("Zodiacal Clock", "An astronomical clock", "zodiacal-clock.html"),
	new Page("Flag Resizing", "Resize the Autralian Flag to different aspect ratios", "flag-resizing.html"),
	new Page("Stars on the U.S. Flag", "Change the number of stars on the U.S. Flag", "us-stars.html")
];