var poller = spredfast.Poller;

(function getResults() {
	$.when(
			poller.poll({type: 'veggies', limit: 10}),
			poller.poll({type: 'fruits', limit: 10})
		)
		.done(function(veggies, fruits) {
			veggies
			.concat(fruits)
			.sort(function(prev, curr) {
				return curr.count > prev.count;
			})
			.slice(0, 5)
			.forEach(function(el) {
				console.log(el.name + ' ' + el.count);
			})
		})
		.fail(function() {
			console.warn('uh oh');
		});
	
	setTimeout(getResults, 5000);
})();
