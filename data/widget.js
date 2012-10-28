// widget.js - Status bar widget script

// Every so often, we'll receive the updated item feed. It's our job
// to parse it.
self.port.on("fetchedUpdate", function(json) {
	if (json == null) {
		$("span#counter").attr("class", "");
		$("span#counter").text("N/A");
	} else {
		var newTotal = "error";
		for (var item in json.unreadcounts) {
			if (isIDFromReadingList(json.unreadcounts[item].id, "/state/com.google/reading-list")) {
				newTotal = json.unreadcounts[item].count;
			}
		}
		
		// Update widget
		$("span#counter").text(newTotal);
		if (newTotal > 0)
			$("span#counter").attr("class", "newitems");
		else
			$("span#counter").attr("class", "");
	}
	
	// Reports the current width of the widget
	self.port.emit("widthReported", $("div#widget").width());
});

function isIDFromReadingList(input) {
	var pattern = /^user\/[0-9]+\/state\/com.google\/reading-list/;
	return (input.match(pattern) != null);
}