(function() {
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

	(function getResults() {
		$.when(
				poller.poll({type: 'veggies', limit: 10}),
				poller.poll({type: 'fruits', limit: 10})
			)
			.done(function(veggies, fruits) {
				veggies
				.concat(fruits)
				.sort(returnLargestByCount)
				.slice(0, 5)
				.forEach(function(el) {
					console.log(el.name + ' ' + el.count);
				})
			})
			.fail(function() {
				console.warn('uh oh');
			});
		
		setTimeout(getResults, 15000);
	})();
})();