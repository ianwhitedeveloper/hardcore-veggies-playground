$(document).ready(function() {
	(function() {
		var poller = new spredfast.Poller(),
				EVT = new EventEmitter2(),
				template = document.getElementById('template').innerHTML,
				leaderboardListElement = $('[rel="js_produce_leaderboard_list"]');

		Mustache.parse(template);

		function returnLargestByCount(a,b) {
		  if (a.count < b.count) {
		    return 1;
		  }
		  if (a.count > b.count) {
		    return -1;
		  }
		  
		  return 0;
		}

		function formatNumber(num) {
			return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
		}

		(function getResults() {
			$.when(
					poller.poll({type: 'veggies', limit: 10}),
					poller.poll({type: 'fruits', limit: 10})
				)
				.done(function(veggies, fruits) {
					var data = { 'items' : veggies
						.concat(fruits)
						.sort(returnLargestByCount)
						.slice(0, 5)
						.map(function(el) {
							return {"name": el.name, "count": formatNumber(el.count)};
						})
					};

					leaderboardListElement.html(Mustache.render(template, data));
				})
				.fail(function() {
					leaderboardListElement.empty().html('<h1>Error - please try again later</h1>');
				});
			
			// setTimeout(getResults, 15000);
		})();
	})();
});