// main.js - Main entry point
const tabs = require('tabs');
const widgets = require('widget');
const data = require('self').data;
const timers = require("timers");
const Request = require("request").Request;

function refreshUnreadCount() {
    // Put in Google Reader API request
    Request({
        url: "https://www.google.com/reader/api/0/unread-count?output=json",
        onComplete: function(response) {
            // Ignore response if we encountered a 404 (e.g. user isn't logged in)
            // or a different HTTP error.
            // TODO: Can I make this work when third-party cookies are disabled?
            if (response.status == 200) {
                monitorWidget.port.emit("fetchedUpdate", response.json);
            } else {
                monitorWidget.port.emit("fetchedUpdate", null);
            }
        }
    }).get();
}

var monitorWidget = widgets.Widget({
	// Mandatory widget ID string
	id: "greader-monitor",

	// A required string description of the widget used for
	// accessibility, title bars, and error reporting.
	label: "Google Reader Monitor",
	contentURL: data.url("widget.html"),
	contentScriptFile: [data.url("jquery-1.7.2.min.js"), data.url("widget.js")],

	onClick: function() {
		// Open Google Reader when the widget is clicked.
		tabs.open("https://www.google.com/reader/view/");
	},
	
	onAttach: function(worker) {
		// If the widget's inner width changes, reflect that in the GUI
		worker.port.on("widthReported", function(newWidth) {
			worker.width = newWidth;
		});
		
		// If the monitor widget is destroyed, make sure the timer gets cancelled.
		worker.on("detach", function() {
			timers.clearInterval(refreshTimer, worker);
		});
		
		refreshUnreadCount(worker);
	}
});

var refreshTimer = timers.setInterval(refreshUnreadCount, 60000);