$(document).ready(function() {
	(function() {
		var poller = new spredfast.Poller(),
				EVT = new EventEmitter2(),
				template = document.getElementById('template').innerHTML,
				leaderboardListElement = $('[rel="js_produce_leaderboard_list"]');

		Mustache.parse(template);

		EVT.on('renderItemsToLeaderboard', renderItemsToLeaderboard);
		EVT.on('retrieveResultsFailure', retrieveResultsFailure);

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

		function renderItemsToLeaderboard(items) {
			var data = { 'items' : items};
			leaderboardListElement.html(Mustache.render(template, data));
		}

		function retrieveResultsFailure(err) {
			var data = { 'error' : err};
			leaderboardListElement.html(Mustache.render(template, data));
		}

		var getStats = function(type, limit) {
			return ASQ(function(done) {
				poller.poll({type: type, limit: limit}, done);
			});
		};

		function output(results) {
			if (! results.fruits || !results.veggies)
				throw "Please provide the expected object: {veggies: [...], fruits: [...]}";

			var items = 
				results.veggies
				.concat(results.fruits)
				.sort(returnLargestByCount)
				.slice(0, 5)
				.map(function(el) {
					return {"name": el.name, "count": formatNumber(el.count)};
				});

			EVT.emit('renderItemsToLeaderboard', items);
		}

		(function getResults() {
			ASQ()
			.runner(function* (){
				  var ve = yield getStats('fruits', 10);
				  var fr = yield getStats('veggies', 10);
				  yield {veggies: ve, fruits: fr};
			})
			.val(output)
			.or(function(err) {
				EVT.emit('retrieveResultsFailure', err);
			});
			
			setTimeout(getResults, 15000);
		})();
	})();
});