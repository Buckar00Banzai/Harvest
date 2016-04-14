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
				"change #yourIdea1Text": "updateIdea",
				"change #yourIdea2Text": "updateIdea",
				"change #yourIdea3Text": "updateIdea",
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

				var id = $(e.target).attr('id');

				var name = $(e.target).attr('name');

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

				var i = contribution.findIndex(function(item) {
					return item.name === id;
				});

				if ((i || i == 0)&& i != -1) {

					contribution.splice(i, 1);

					if (id == 'yourIdea1' || id == 'yourIdea2' || id == 'yourIdea3') {

						$('input[id=' + id + 'Text]').prop('disabled', true);
						$('input[id=' + id + 'Text]').val("");

					}

				} else {

					contribution.push({name:id});

					if (id == 'yourIdea1' || id == 'yourIdea2' || id == 'yourIdea3') {

						$('input[id=' + id + 'Text]').prop('disabled', false);

					}

				}

			},

			updateIdea: function(e) {

				var target = $(e.target).attr('id');

				var id = target.slice(0, target.length - 4);

				var name = $(e.target).attr('name');

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

				var i = contribution.findIndex(function(item) {
					return item.name === id;
				});

				contribution[i] = {
					name: id,
					text: $('input[id=' + id + 'Text]').val()
				};

			},

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

						if (this.name == 'yourIdea1') {

							$('#yourIdea1Text').prop('disabled', false);

							$('#yourIdea1Text').val(this.text);

						}

					});
				}


				if (this.model.attributes.patron) {

					$(this.model.attributes.patron).each(function() {

						$('#' + this.name).iCheck('check');

						if (this.name == 'yourIdea3') {

							$('#yourIdea3Text').prop('disabled', false);

							$('#yourIdea3Text').val(this.text);

						}
					});
				}


				if (this.model.attributes.potluck) {

					$(this.model.attributes.potluck).each(function() {

						$('#' + this.name).iCheck('check');

						if (this.name == 'yourIdea2') {

							$('#yourIdea2Text').prop('disabled', false);

							$('#yourIdea2Text').val(this.text);

						}
					});
				}

				$(document).scrollTop(0);
				return this;
			},

			updateModel: function(){

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
