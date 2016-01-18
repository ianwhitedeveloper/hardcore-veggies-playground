(function() {
	var Observable = Rx.Observable;
	var poller = new spredfast.Poller();

	function returnLargestByCount(a,b) {
	  if (a.count < b.count) {
	    return 1;
	  }
	  if (a.count > b.count) {
	    return -1;
	  }
	  
	  return 0;
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

	function onNext(data) {
		console.log(data);
	}

	function onError(err) {
		console.error(err);
	}

	function onCompleted() {
		console.log('completed');
	}

	////////////////
	// Solution 1 //
	////////////////
	
	var source1 = Observable.fromPromise(poller.poll({type: 'fruits', limit:10}));
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
			)
			.subscribe(onNext, onError, onCompleted);


		// setTimeout(getResults, 15000);
	})();
	
	////////////////
	// Solution 2 //
	////////////////
	/*
	(function getResults() {
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
	})();
	*/

	////////////////
	// Solution 3 //
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