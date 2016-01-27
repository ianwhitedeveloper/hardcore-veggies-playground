requirejs.config({
  paths: {
    ramda: 'https://cdnjs.cloudflare.com/ajax/libs/ramda/0.13.0/ramda.min',
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
    mustache: 'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.2.1/mustache',
    EventEmitter2: 'js/eventemitter2',
    spredfast: './js/api'
  }
});

require([
    'ramda',
    'jquery',
    'mustache',
    'EventEmitter2',
    'spredfast'
  ],
  function (_, $, Mustache, EventEmitter2, spredfast) {
  	
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
			console.error(err);
		}

		(function getResults() {
			$.when(
					poller.poll({type: 'veggies', limit: 10}),
					poller.poll({type: 'fruits', limit: 10})
				)
				.done(function(veggies, fruits) {
					var items = 
						veggies
						.concat(fruits)
						.sort(returnLargestByCount)
						.slice(0, 5)
						.map(function(el) {
							return {"name": el.name, "count": formatNumber(el.count)};
						});

					EVT.emit('renderItemsToLeaderboard', items);
				})
				.fail(function(err) {
					EVT.emit('retrieveResultsFailure', err);
				});
			
			// setTimeout(getResults, 15000);
		})();
    /*////////////////////////////////////////////
    // Utils
    //
    var img = function (url) {
       return $('<img />', { src: url });
    };

    var Impure = {
      getJSON: _.curry(function(callback, url) {
        $.getJSON(url, callback)
      }),

      setHtml: _.curry(function(sel, html) {
        $(sel).html(html)
      })
    }

    var trace = _.curry(function(tag, x) {
        console.log(tag, x);
        return x;
    })

    ////////////////////////////////////////////
    // Pure

    //  url :: String -> URL
    var url = function (t) {
      return 'https://api.flickr.com/services/feeds/photos_public.gne?tags=' + t + '&format=json&jsoncallback=?';
    };

    var mediaUrl = _.compose(_.prop('m'), _.prop('media'));

    var srcs = _.compose(_.map(mediaUrl), _.prop('items'));

    var images = _.compose(_.map(img), srcs);


    ////////////////////////////////////////////
    // Impure
    //
    var renderImages = _.compose(Impure.setHtml("body"), images)
    var app = _.compose(Impure.getJSON(renderImages), url)

    app("cats")*/
  });
