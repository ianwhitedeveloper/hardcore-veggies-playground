'use strict';

$(document).ready(function() {
	(function() {
		var poller = new spredfast.Poller(),
				EVT = new EventEmitter2(),
				template = document.getElementById('template').innerHTML,
				leaderboardListElement = $('[rel="js_produce_leaderboard_list"]');

		// friendly, short namespace alias
		var Ac = ASQ.csp;

		Mustache.parse(template);

		EVT.on('renderItemsToLeaderboard', renderItemsToLeaderboard);
		EVT.on('retrieveResultsFailure', retrieveResultsFailure);



		(function pollAPI() {
			ASQ().runner(
				Ac.go(function *processA(mainCh){
					while (true) {
				        var results = yield Ac.take( mainCh );
				        output(results);
					}
			    }),

			    Ac.go(function *generateStats(mainCh){
			    	var fruits = yield getStats('fruits', 10);
			    	var veggies = yield getStats('veggies', 10);
			        
			        yield Ac.put( mainCh, {fruits: fruits, veggies: veggies});
			    })
			)
			.or(function(err) {
				EVT.emit('retrieveResultsFailure', err);
			});

			setTimeout(pollAPI, 15000);
		})();




		var getStats = function(type, limit) {
			return ASQ(function(done) {
				poller.poll({type: type, limit: limit}, done);
			});
		};

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
			console.warn(err);
			var data = { 'error' : 'There was an error, please try again later.'};
			leaderboardListElement.html(Mustache.render(template, data));
		}

		function output(results) {
			if (! results.fruits || !results.veggies)
				throw "Please provide the expected object: {veggies: [...], fruits: [...]}";

			var items = 
				results.veggies
				.concat(results.fruits)
				.sort(returnLargestByCount)
				.slice(0, 5)
				.map((el) => {
					return {"name": el.name, "count": formatNumber(el.count)};
				});

			EVT.emit('renderItemsToLeaderboard', items);
		}
	})();
});