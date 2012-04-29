(function() {
  var $, flushFncs, hasErrored, isFlush, methods, nextItem, nextItemRec, queue, settings;

  $ = jQuery;

  settings = {
    onError: function(err) {
      return alert("An error occured, please refresh the page: " + err);
    }
  };

  hasErrored = false;

  queue = [];

  isFlush = true;

  flushFncs = [];

  nextItem = function() {
    if (isFlush && queue.length > 0) {
      isFlush = false;
      return nextItemRec(function() {
        var fnc, _i, _len;
        for (_i = 0, _len = flushFncs.length; _i < _len; _i++) {
          fnc = flushFncs[_i];
          fnc();
        }
        flushFncs = [];
        isFlush = true;
        return nextItem();
      });
    }
  };

  nextItemRec = function(cb) {
    var ajaxFnc;
    ajaxFnc = queue.shift();
    return ajaxFnc().fail(settings.onError).done(function() {
      if (queue.length === 0) {
        return cb();
      } else {
        return nextItemRec(cb);
      }
    });
  };

  methods = {
    init: function(options) {
      alert('init');
      settings = $.extend(settings, options);
      return this;
    },
    add: function(ajaxFnc) {
      alert('add');
      queue.push(ajaxFnc);
      nextItem();
      return this;
    },
    flush: function(cb) {
      alert('flush');
      if (isFlush) {
        cb();
      } else {
        flushFncs.push(cb);
      }
      return this;
    }
  };

  $.fn.ajaxQueue = function(method) {
    if (method in methods) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }
    return $.error("Method " + method + " does not exist on jQuery.ajaxQueue");
  };

}).call(this);
