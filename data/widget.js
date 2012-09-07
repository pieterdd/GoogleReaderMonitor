// widget.js - Status bar widget script

// Every so often, we'll receive the updated item feed. It's our job
// to parse it.
self.on("message", function(json) {
	if (json == null) {
		$("span#counter").attr("class", "");
		$("span#counter").text("N/A");
	} else {
		var newTotal = 0;
		for (var item in json.unreadcounts) {
			newTotal += json.unreadcounts[item].count;
		}
		
		// Since the cumulative reading list count is a separate part of the
		// unread count info, we have to divide the total by 2.
		newTotal /= 2;
		$("span#counter").text(newTotal);
		
		// Update style
		if (newTotal > 0)
			$("span#counter").attr("class", "newitems");
		else
			$("span#counter").attr("class", "");
	}
	
	// Reports the current width of the widget
	self.port.emit("widthReported", $("div#widget").width());
});