// InfoView.js
// ====================

define(["jquery", "backbone", "icheck", "text!templates/pay.html", "text!templates/confirm.html"],

	function($, Backbone, iCheck, template, confirmTemplate) {

		var InfoView = Backbone.View.extend({

			tagName: 'div',
			// card: null,
			personalMessage: null,

			// payTier: 154.80,

			initialize: function() {

				_.bindAll(this, 'render', 'updateModel');

				this.template = _.template(template);
				this.confirm = _.template(confirmTemplate);

			},

			events: {
				'click #donate': 'donate',
				'change #personalMessage': 'updateMessage',
			},

			updateMessage: function(e) {
				this.personalMessage = $('#personalMessage').val();
			},

			parseDescription: function() {

				var patronArray = this.model.get('patron');

				var description = "";

				if (patronArray) {

					patronArray.forEach(function(item) {

						switch(item.name) {
							case 'patronDrink':
								description = description + 'The Drink \n';
								break;
							case 'chocolateBar':
								description = description + 'Chocolate Bar \n';
								break;
							case 'sundayBrunch':
								description = description + 'Sunday Brunch \n';
								break;
							case 'pond':
								description = description + 'Swimming Hole \n';
								break;
							case 'yourIdea3':
								description = description + 'Your Idea: ' + item.text + ' \n';
								break;
						} // end switch

					}); // end forEach

					description = description.slice(0, description.length - 2);

				} else {

					description = "Open Donation";

				}

				return description;

			},



			donate: function(e) {
				e.preventDefault();
			
				var party_name = this.model.get('party_name');
				var email = this.model.get('email');
				var num_adults = this.model.get('num_adults');
				var job = this.model.get('job');
				var attend = this.model.get('attend');
				var arrival = this.model.get('arrival');
				var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

				this.updateMessage();
				this.updateModel();

				if(party_name == null || party_name == "" || email == null || email == "" || attend == null || attend == "") {
        			

					$('#errors').html('Some info is missing in the INFO section! We need it for your confirmation.<br/>Please click on Previous or Info and fill out everything before confirming.<br/>Thanks!').fadeIn(400, function() {
					});


        			return false;

        		}else if (!email.match(re)) {

					$('#errors').html('The email you entered is not valid.<br/>Please click on Previous or Info and fill out everything before confirming.<br/>Thanks!').fadeIn(400, function() {
					});

        		}else if (attend == "attendYes" && (num_adults == "" || num_adults == null)) {

					$('#errors').html('You forgot to indicate the humber of adults! We need it for your confirmation.<br/>Please click on Previous or Info and fill out everything before confirming.<br/>Thanks!').fadeIn(400, function() {
					});

        		}else if (attend == "attendYes" && (arrival == "" || arrival == null)) {

					$('#errors').html('You forgot to indicate your arrival date.<br/>Please click on Previous or Accomodations and pick an option under Arrival.<br/>Thanks!').fadeIn(400, function() {
					});

        		}else {


				this.successPage();
				this.sendEmail(this.model.toJSON());
				this.updateSpreadsheet(this.model.toJSON());


				} //end else

			},

			sendEmail: function(ticket) {

				$.ajax({
					url: '/api/sendEmail',
					type: 'POST',
					dataType: 'JSON',
					data: {
						ticket: ticket
					},
				});

			},

			updateSpreadsheet: function(ticket) {

				$.ajax({
					url: '/api/updateSpreadsheet',
					type: 'POST',
					dataType: 'JSON',
					data: {
						ticket: ticket
					},
				});

			},

			successPage: function() {

				var _this = this;
				var attend = this.model.get('attend');
				var participate = this.model.get('participate');
				var potluck = this.model.get('potluck');
				var patron = this.model.get('patron');
				var arrival = this.model.get('arrival');
				var accommodation = this.model.get('accommodation');
				var personalMessage = this.model.get('personalMessage');

				var model = Object.assign({}, this.model);
				model.patron = this.parseDescription(model.description);

				var confirm = this.confirm(model);

				$(_this.el).fadeOut(300, function() {
					$(this).empty();
					$('#wizard-view-tabs, hr, .progress, .wizard-pager').remove();
					$(this).append(confirm).fadeIn(300);
				});


				this.model.save(null, {
					success: function() {
						$.ajax({
							url: '/api/updateBase',
							type: 'POST',
							dataType: 'JSON',
							data: {
								attend: attend,
								participate: participate,
								potluck: potluck,
								patron: patron,
								arrival: arrival,
								accommodation: accommodation,
								personalMessage: personalMessage
							},
						});

					}
				});

			},

			updateModel: function() {
				var _this = this;

				this.model.set({
					personalMessage: $('#personalMessage').val()
				});

			},

			render: function() {

				var _this = this;

				$(this.el).empty();

				this.$el.append(this.template(this.model.toJSON()));

				if (this.model.attributes.personalMessage !== '') {
					$('#personalMessage').val(this.model.attributes.personalMessage);
				}

				$(document).scrollTop(0);
				return this;
			}

		});

		return InfoView;

	}
);
