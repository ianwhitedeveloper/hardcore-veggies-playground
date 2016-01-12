var poller = new spredfast.Poller();

setInterval(function() {
	$.when(
		poller.poll({type: 'veggies', limit: 5}),
		poller.poll({type: 'fruits', limit: 5})
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
}, 5000)



// var v = poller.poll({type: 'veggies', limit: 10}, function(array) {
// 	return array.sort(function(prev, curr) {return curr.count > prev.count});
// });
// var f = poller.poll({type: 'fruits', limit: 10}, function(array) {
// 	return array.sort(function(prev, curr) {return curr.count > prev.count});
// });

// v.then(function(success) {
// 	console.log(success);
// },
// function(failure) {
// 	console.log('failure');
// });

// f.then(function(success) {
// 	console.log(success);
// },
// function(failure) {
// 	console.log('failure');
// });