// InfoView.js
// ====================

define(["jquery", "backbone", "icheck", "models/baseModel", "text!templates/jobs.html"],

	function($, Backbone, iCheck, Base, template) {

		var InfoView = Backbone.View.extend({

		    tagName: 'div',

			// var foods = [];

			participate: [],

			patron: [],

			potluck: [],

			initialize: function (options) {

				this.options = options || {};

				_.bindAll(this, 'render', 'updateModel');

				this.template =  _.template(template);

			},

			events: {
				// "click #add-food": "addFood"
				"ifClicked input": "updateArray",
				// "change text" : "addIdea"
			},

			// addFood: function(e) {
			// 	e.preventDefault();
			// 	var clone = $('.food-input:first');
			// 	clone.clone().appendTo('#food-clone').val('').focus();
			// },

			objectIndex: function(arr,selection) {

				arr.findIndex(function(item) {
					return item.name === selection;
				});

			},

			updateArray: function(e) {

				console.log('start');

				var id = $(e.target).attr('id');

				var name = $(e.target).attr('name');

				console.log("id= " + id);
				console.log("name= " + name);

				var contribution =  null;

				switch(name) {
					case 'participate':
						contribution = this.participate;
						break;

					case 'patron':
						contribution = this.patron;
						break;

					case 'potluck':
						contribution = this.potluck;
						break;

				}

				console.log("contribution= " + contribution);

				var i = contribution.findIndex(function(item) {
					return item.name === id;
				});

				console.log("i= " + i);

				if ((i || i == 0) && i != -1) {

					contribution.splice(i, 1);

				} else {

					contribution.push({name:id});

				}

				console.log('contribution= ' + contribution);

			},

			// addIdea: function(e) {

			// 	var idea = $(e.target).val();

			// 	var array = $(e.target).attr('name');



			// },

			// restoreFood: function(food) {
			// 	var clone = $('.food-input:first');
			// 	clone.clone().appendTo('#food-clone').val(food);
			// },

			initHoverHelp: function() {

                var ele = $('.job-description'),
                	title = $('.job-title');


				$('.tt').click(function(e) {

                    var message = $(this).data('message');
                    	jobTitle = $(this).data('title');

                    ele.html(message);

                    title.html(jobTitle);

                });

				$('input[name=jobs]').on('ifChanged', function(e) {

                    var message = $(this).parent().parent().find('.tt').data('message');
                    	jobTitle = $(this).parent().parent().find('.tt').data('title');

                    ele.html(message);

                    title.html(jobTitle);

                });

            },

			render: function () {

				var _this = this;

				$(this.el).empty();

				this.$el.append(this.template(this.options.base.toJSON()));

				setTimeout(function() {
					$('input').iCheck({
						checkboxClass: 'iradio_flat-blue'
					});
					_this.initHoverHelp();
				}, 1);


				if (this.model.attributes.participate) {

					$(this.model.attributes.participate).each(function() {

						$('#' + this.name).iCheck('check');

					});
				}


				if (this.model.attributes.patron) {

					$(this.model.attributes.patron).each(function() {

						$('#' + this.name).iCheck('check');

					});
				}


				if (this.model.attributes.potluck) {

					$(this.model.attributes.potluck).each(function() {

						$('#' + this.name).iCheck('check');

					});
				}

				// if (this.model.attributes.food.length !== 0) {
				// 	$(this.model.attributes.food).each(function(i, food){
				// 		if(i === 0) {
				// 			$('.food-input:first').val(food);
				// 		} else {
				// 			_this.restoreFood(food);
				// 		}
				// 	});
				// }

				$(document).scrollTop(0);
				return this;
			},

			updateModel: function(){

				// $('.food-input').each(function(i, food) {
				// 	if($(this).val() === '') {
				// 		return;
				// 	}
				// 	foods.push($(this).val());
				// });

				var _this = this;

				this.model.set({
					participate: _this.participate,
					potluck: _this.potluck,
					patron: _this.patron
				});

			}

		});

    return InfoView;

	}
);
