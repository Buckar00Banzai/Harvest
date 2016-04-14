// InfoView.js
// ====================

define(["jquery", "backbone", "icheck", "models/baseModel", "text!templates/food.html"],

	function($, Backbone, icheck, Base, template){

		var foodView = Backbone.View.extend({

			tagName: 'div',

			arrival: null,

			accommodation: null,

			initialize: function (options) {

				this.options = options || {};

				_.bindAll (this, 'render', 'updateModel');

				this.template = _.template(template);

			},

			events: {
				'ifChecked input': 'selectArrival'
			},

			selectArrival: function(e) {

				var selection = $(e.target).attr('id');

				if (selection == 'arrival1' || selection == 'arrival2' || selection == 'arrival3') {

					this.arrival = selection;

				} else {

					this.accommodation = selection;

				}

			},

			initHoverHelp: function() {

                var ele = $('.item-description'),
                	title = $('.item-title');


				$('.tt').click(function(e) {

                    var message = $(this).data('message');
                    	itemTitle = $(this).data('title');

                    ele.html(message);

                    title.html(itemTitle);

                });

				$('input[name=jobs]').on('ifChanged', function(e) {

                    var message = $(this).parent().parent().find('.tt').data('message');
                    	itemTitle = $(this).parent().parent().find('.tt').data('title');

                    ele.html(message);

                    title.html(itemTitle);

                });

			},

			render: function () {

				var _this = this;

				$(this.el).empty();

				this.$el.append(this.template(this.options.base.toJSON()));

				setTimeout(function() {
					$('input').iCheck({
						radioClass: 'iradio_flat-blue'
					});
					_this.initHoverHelp();
				}, 1);

				if(this.arrival !== null) {
					$('#' + this.arrival).iCheck('check');
				}

				if(this.accommodation !== null) {
					$('#' + this.accommodation).iCheck('check');
				}

				$(document).scrollTop(0);
				return this;

			},

			updateModel: function() {

				var _this = this;

				this.model.set({
					arrival: _this.arrival,
					accommodation: _this.accommodation
				});

			}

		});

		return foodView;

	}

);
