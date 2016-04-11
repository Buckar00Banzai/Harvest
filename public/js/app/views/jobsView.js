// InfoView.js
// ====================

define(["jquery", "backbone", "icheck", "models/baseModel", "text!templates/jobs.html"],

	function($, Backbone, iCheck, Base, template) {

		var InfoView = Backbone.View.extend({

			tagName: 'div',

			participate: null,

			potluck: null,

			patron: null,

			initialize: function(options) {

				this.options = options || {};

				_.bindAll(this, 'render', 'updateModel');

				this.template = _.template(template);

			},

			events: {
				'ifChanged input': 'selectJob',
				// 'change text': 'selectIdea'
			},

			selectJob: function(e) {

				var selection = $(e.target).val();

				if (selection == 'dessert' || selection == 'tequila' || selection == 'partyFavors' || selection == 'yourIdea2') {

					this.potluck = selection;

				} else if (selection == 'patronDrink' || selection == 'chocolateBar' || selection == 'sundayBrunch' || selection == 'pond' || selection == 'yourIdea3') {

					this.patron = selection;

				} else {

					this.participate = selection;

					console.log(selection);

				} // end else
			},

			// selectIdea: function(e) {

			// 	var newIdea = $(e.target).val();

			// 	var id = $(e.target).id();

			// 	if (id == 'yourIdea1') {

			// 		this.potluck = newIdea;

			// 	} else if (id == 'yourIdea2') {

			// 		this.patron = newIdea;

			// 	} else if (id == 'yourIdea3') {

			// 		this.participate = newIdea;

			// 	} // end if				

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

			render: function() {

				var _this = this;

				$(this.el).empty();

				this.$el.append(this.template(this.options.base.toJSON()));

				setTimeout(function() {
					$('input').iCheck({
						radioClass: 'iradio_flat-blue'
					});
					_this.initHoverHelp();
				}, 1);

				if(this.participate !== null) {
					$('#' + this.participate).iCheck('check');
				}

				if(this.potluck !== null) {
					$('#' + this.potluck).iCheck('check');
				}

				if(this.patron !== null) {
					$('#' + this.patron).iCheck('check');
				}

				$(document).scrollTop(0);
				return this;

			},

			updateModel: function() {

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
