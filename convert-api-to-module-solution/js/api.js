/////////////////////////////////////////////////////////////////////////////////////////////
// Refactored into a module for funsies                                                    //
// Possible performance implications?                                                      //
// In the case of thousands or hundreds of thousands of instances, then                    //
// the constructor style with methods assigned to prototype would be more                  //
// performant because every Poller instance will defer method calls to one 'Parent' object //
// instead of duplicating them across every instance and this will consume less memory.    //
/////////////////////////////////////////////////////////////////////////////////////////////
var Poller = (function($) {
  var defaults = {
        type: 'veggies',
        limit: 10
      },
      items = {
        veggies: [
          'Adzuki Beans',
          'Asparagus',
          'Black-eyed Peas',
          'Brussels Sprouts',
          'Carrots',
          'Collard Greens',
          'Parsnips',
          'Rhubarb',
          'Yams',
          'Watercress'
        ],
        fruits: [
          'Apricots',
          'Blackcurrants',
          'Cherimoya',
          'Dates',
          'Elderberry',
          'Guava',
          'Kumquat',
          'Miracle Fruit',
          'Purple Mangosteen',
          'Satsuma'
        ]
      };
  function _getRandomNumber (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function _getData (type) {
    var item, i, len;
    var list = items[type] || [];
    var results = [];

    for (i = 0, len = list.length; i < len; i++) {
      item = list[i];

      results.push({
        name: item,
        count: _getRandomNumber(0, 200000)
      });
    }
    return results;
  }

  function _processData (data, limit) {
    return data.slice(0, limit);
  }

  function poll (options, cb) {
    var config = $.extend({}, defaults, options);
    var dfd = $.Deferred();

    setTimeout(function () {
      var payload = _processData(_getData(config.type), config.limit);

      cb && cb(payload);      
      dfd.resolve(payload);
    }, _getRandomNumber(400, 2000));

    return dfd;
  }

  return {
    poll: poll
  };
})(jQuery);

 if (window.spredfast == null) {
    window.spredfast = {
      Poller: Poller
    };
  }