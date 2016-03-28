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
				console.log ('arrival: ' + this.arrival);
				console.log('accommodation: ' + this.accommodation);
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

				$(document).scrollTop(0);
				return this;

			},

			updateModel: function() {

				var _this = this;

				this.model.set({
					arrival: _this.arrival
				});

			}

		});

		return foodView;

	}

);











// define(["jquery", "backbone", "text!templates/food.html" ],

//     function($, Backbone, template){

//     	var foodView = Backbone.View.extend({

// 		    tagName: 'div',

// 			initialize: function (options) {

// 				this.options = options || {};

// 				_.bindAll(this, 'render', 'updateModel');

// 				this.template =  _.template(template);

// 			},

// 			events: {
// 				"click #add-food": "addFood"
// 			},

// 			addFood: function(e) {
// 				e.preventDefault();
// 				var clone = $('.food-input:first');
// 				clone.clone().appendTo('#food-clone').val('').focus();
// 			},

// 			restoreFood: function(food) {
// 				var clone = $('.food-input:first');
// 				clone.clone().appendTo('#food-clone').val(food);
// 			},

// 			render: function () {

// 				var _this = this;

// 				$(this.el).empty();

// 				this.$el.append(this.template(this.options.base.toJSON()));

// 				if (this.model.attributes.food.length !== 0) {
// 					$(this.model.attributes.food).each(function(i, food){
// 						if(i === 0) {
// 							$('.food-input:first').val(food);
// 						} else {
// 							_this.restoreFood(food);
// 						}
// 					});
// 				}

// 				return this;
// 			},

// 			updateModel: function(){

// 				var foods = [];

// 				$('.food-input').each(function(i, food) {
// 					if($(this).val() === '') {
// 						return;
// 					}
// 					foods.push($(this).val());
// 				});

// 				this.model.set({
// 					food: foods
// 				});

// 			}

// 		});

//     return foodView;

// 	}
// );
