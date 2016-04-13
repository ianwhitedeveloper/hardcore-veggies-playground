$(document).ready(function() {
	(function() {
		var Observable = Rx.Observable,
				poller = new spredfast.Poller(),
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
			console.error(err);
		}

		function getCategory(category, limit) {
		    return Observable.create(function forEach(observer) {
		        poller.poll({type: category, limit:limit})
			      .then(function(data) {
	            observer.onNext(data);
	            observer.onCompleted();
		        })
		        .fail(function (err) {
	            observer.onError(err);
		        })
		    });
		}

		function onNext(items) {
			console.log(items);
			EVT.emit('renderItemsToLeaderboard', items);
		}

		function onError(err) {
			console.error(err);
			EVT.emit('retrieveResultsFailure', err);
		}

		function onCompleted() {
			console.log('completed');
		}

		////////////////////////////
		// Solution 1 (preferred) //
		////////////////////////////

		var categories = ['fruits', 'veggies'];

		function returnTopFive(acc, curr) {
			return acc.concat(curr)
								.sort(returnLargestByCount)
								.slice(0,5);
		}

		var source = 
			Observable
				.from(categories)
				.concatMap(httpGet)
				.reduce(returnTopFive)
				.subscribe(onNext, onError, onCompleted);

		function httpGet(category) {
		  return poller.poll({type: category});
	  }

		////////////////
		// Solution 2 //
		////////////////
		
		/*(function getResults() {
			Observable.
				zip(
					getCategory('fruits' ,10), 
					getCategory('veggies' ,10), 
					(fruits,veggies) => 
						fruits.concat(veggies)
						.sort(returnLargestByCount)
						.slice(0,5)
				)
				.subscribe(onNext, onError, onCompleted);

			// setTimeout(getResults, 15000);
		})();*/
		
		
		////////////////
		// Solution 3 //
		////////////////
		/*var source1 = Observable.fromPromise(poller.poll({type: 'fruits', limit:10}));
		var source2 = Observable.fromPromise(poller.poll({type: 'veggies', limit:10}));

		(function getResults() {
			Observable.
				zip(
					source1, 
					source2, 
					(fruits,veggies) => 
						fruits.concat(veggies)
						.sort(returnLargestByCount)
						.slice(0,5)
						.map(function(el) {
							return {"name": el.name, "count": formatNumber(el.count)};
						})
				)
				.subscribe(onNext, onError, onCompleted);


			// setTimeout(getResults, 15000);
		})();*/
		

		////////////////
		// Solution 4 //
		////////////////
		/*
		(function getResults() {
			getCategory('fruits', 10)
		    .concatMap(function(x) {
		        return getCategory('veggies', 10)
		        .map(function(y) {
		            return x.concat(y).sort(returnLargestByCount).slice(0,5);
		        })
		    })
				.subscribe(onNext, onError, onCompleted);


			// setTimeout(getResults, 15000);
		})();*/
	})();
});