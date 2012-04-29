$ = jQuery

settings =
	onError: (err) ->
		alert "An error occured, please refresh the page: " + err

hasErrored = false
queue = []
isFlush = true
flushFncs = []

nextItem = () ->
	if isFlush and queue.length > 0
		isFlush = false
		nextItemRec ->
			for fnc in flushFncs
				fnc()
			flushFncs = []
			isFlush = true
			
			# Might have added some items in response
			nextItem()

nextItemRec = (cb) ->
	ajaxFnc = queue.shift()
	ajaxFnc().fail(settings.onError).done ->
		if queue.length == 0
			cb()
		else
			nextItemRec cb
	
methods =
	init: (options) ->
		alert 'init'
		settings = $.extend settings, options
		return this
		
	add: (ajaxFnc) ->
		alert 'add'
		queue.push ajaxFnc
		nextItem()
		return this

	flush: (cb) ->
		alert 'flush'
		if isFlush then cb() else flushFncs.push(cb)
		return this

$.fn.ajaxQueue = (method) ->
	return methods[method].apply this, Array.prototype.slice.call( arguments, 1 ) if method of methods
	return methods.init.apply this, arguments if typeof method is 'object' or !method
	return $.error "Method #{method} does not exist on jQuery.ajaxQueue"
