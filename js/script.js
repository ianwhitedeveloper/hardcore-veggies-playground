requirejs.config({
  paths: {
    ramda: 'https://cdnjs.cloudflare.com/ajax/libs/ramda/0.16.0/ramda.min',
    Task: './js/data.task.umd',
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
    mustache: 'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.2.1/mustache',
    spredfast: './js/api'
  }
});

require([
    'ramda',
    'Task',
    'jquery',
    'mustache',
    'spredfast'
  ],
  function (_, Task, $, Mustache, spredfast) {
  	
		var poller = new spredfast.Poller(),
				template = document.getElementById('template').innerHTML,
				leaderboardListElement = $('[rel="js_produce_leaderboard_list"]');

		Mustache.parse(template);

		///////////////////////////////////////////////////////////////////////////
		// Resource used to learn                                                //
		// functional concents:                                                  //
		// https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch10.html //
		///////////////////////////////////////////////////////////////////////////


		/////////////
		// Helpers //
		/////////////
		var liftA2 = _.curry(function(f, functor1, functor2) {
		  return functor1.map(f).ap(functor2);
		});

		var returnLargestByCount = _.curry((a, b) => {
		  if (a.count < b.count) {
		    return 1;
		  }
		  if (a.count > b.count) {
		    return -1;
		  }
		  
		  return 0;
		});

		function retrieveResultsFailure(err) {
			console.error(err);
		}

		//////////
		// Pure //
		//////////
		var renderItemsToLeaderboard = _.curry((data) => {
			leaderboardListElement.html(Mustache.render(template, { 'items' : data}));
		});

		var countLens = _.lensProp('count');

		var formatNumber = _.compose(_.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"), _.toString);

		////////////
		// Impure //
		////////////

		var success = 
			_.compose(
				renderItemsToLeaderboard, 
				_.map(
					_.over(countLens, formatNumber)
				), 
				_.slice(0,5),
				_.sort(returnLargestByCount)
			);

		var httpRequest = function (config) {
			return new Task((reject, result) => {
				poller.poll({type: config.type, limit: config.limit}, result).fail(reject);
			});
		};
		/*
		// Naive solution
		 Task.of(_.concat)
			.ap(httpRequest({type: 'veggies', limit: 10}))
			.ap(httpRequest({type: 'fruits', limit: 10}))
			.fork(retrieveResultsFailure, success);
		*/
	
		liftA2(
			_.concat, 
			httpRequest({type: 'veggies'}), 
			httpRequest({type: 'fruits'})
		)
		.fork(retrieveResultsFailure, success);

  });
