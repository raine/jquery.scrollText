;(function ($, window, document, undefined) {
	function ScrollText(element, opts) {
		this.el  = element;
		this.$el = $(element);

		var otherArgs = Array.prototype.slice.call(arguments, 1);
		this.elements = [ this.$el ].concat($.map(otherArgs, function(sel) {
			return $(sel);
		}));

		this.elements = $(this.elements).map(function() {
			return this.toArray();
		});

		this.init();
	}

    ScrollText.prototype.init = function() {
		var self     = this;
		var viewport = this.viewport = this.$el.wrap('<div />').parent();
		this.height  = this.$el.height();
		var margin   = this.$el.css('margin');
		this.current = 0;

		var maxWidth = $.map(jQuery.makeArray(this.elements), function(el) {
			return $(el).width();
		}).sort().slice(-1)[0];

		this.elements.css({
			'padding'  : 0,
			'margin'   : 0,
			'position' : 'absolute'
		});

		this.viewport
			.addClass('scrolltext-viewport')
			.css({
				height   : this.height,
				width    : maxWidth,
				overflow : 'hidden',
				position : 'relative',
				margin   : margin
			});

		$.each(this.elements.slice(1), function() {
			viewport.append(this);
			$(this).css('top', -self.$el.height());
			$(this).show();
		});
	};

	ScrollText.prototype.show = function(selOrIndex) {
		var nextEl;
		if ($.type(selOrIndex) === 'number') {
			nextEl = $(this.elements.get(selOrIndex));
		} else if ($.type(selOrIndex) === 'string') {
			nextEl = $(this.elements.filter(selOrIndex));
		}

		if (!nextEl) return;
		nextEl.css('top', -this.height);

		var p = $(this.elements.get(this.current)).animate({
			top: -this.height
		}, 400, 'easeInQuart').promise();

		var deferred = new $.Deferred();
		p.done(function() {
			nextEl.animate({
				top: 0
			}, 600, 'easeOutQuart').promise().done(deferred.resolve);
		});

		this.current = nextEl.index();
		return deferred.promise();
	};

	ScrollText.prototype.next = function() {
		if (this.current + 1 >= this.elements.length) {
			return this.show(0);
		} else {
			return this.show(this.current + 1);
		}	
	};
     
    $.fn.scrollText = function (opts) {
		if (this.length > 1) throw ('Error: Initialize with a single element only');
		var scroller = new ScrollText(this[0], opts);

		$(this[0]).data('scrollText', scroller);
		return scroller;
	};
})(jQuery, window, document);
