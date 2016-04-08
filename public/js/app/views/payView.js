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
				// 'ifToggled .cards': 'selectCard',
				// 'ifToggled .payTier': 'selectPayTier'
				//'ifToggled #openSelector': 'selectPayTierOpen'
			},

			updateMessage: function(e) {
				this.personalMessage = $('#personalMessage').val();
			},

			parseDescription: function(e) {

				var description = this.model.get('patron')

				if (description == "patronDrink") {

					description = "The Drink";
				
				} else if (description == "chocolateBar") {

					description = "Chocolate Bar";

				} else if (description == "sundayBrunch") {

					description = "Sunday Brunch";

				} else if (description == "pond") {

					description = "The Swimming Hole";

				} else if (description == "yourIdea3") {

					description = "yourIdea3";

				} else {

					description = "Open Donation";
				} // end else

				return description;

				// $('#paypal').val(patron);
			},

			// selectCard: function(e) {
			// 	this.card = $(e.target).attr('id');
			// },

			// selectPayTier: function(e) {
				
			// 	this.payTier = $(e.target).val();

				//if (tier === null){
				//	this.payTier = $('#donation_amount').val()
				//} else {
				//	this.payTier = tier;
				//}
			// },


			// selectPayTierOpen: function(e) {
				
			// 	this.payTier = $('#openAmount').val();

			// },

			// initHoverHelp: function() {

   //              var ele = $('.payTier-description'),
   //              	title = $('.payTier-title');


			// 	$('.tt').click(function(e) {

   //                  var message = $(this).data('message');
   //                  	payTierTitle = $(this).data('title');

   //                  ele.html(message);

   //                  title.html(payTierTitle);

   //              });

			// 	$('input[name=payTier]').on('ifChanged', function(e) {

   //                  var message = $(this).parent().parent().find('.tt').data('message');
   //                  	payTierTitle = $(this).parent().parent().find('.tt').data('title');

   //                  ele.html(message);

   //                  title.html(payTierTitle);

   //              });

   //          },

			donate: function(e) {
				e.preventDefault();

				// var _this = this;


				// var open_donation = document.getElementById("open").value;
			
				var party_name = this.model.get('party_name');
				var email = this.model.get('email');
				var num_adults = this.model.get('num_adults');
				var job = this.model.get('job');
				var food = this.model.get('food');
				var attend = this.model.get('attend');

				this.updateMessage();
				this.updateModel();

				if(party_name == null || party_name == "" || email == null || email == "" || num_adults == null || num_adults == "" || num_adults == 0 || attend == null || attend == "") {

					//alert("Hey little llama you forgot some info in the Nominate section! We need it to generate your ticket. Please click on Previous or Nominate and be sure to fill out your first and last name and your email address before donating. Thanks!");
        			

					$('#errors').html('Some info is missing in the INFO section! We need it for your confirmation.<br/>Please click on Previous or Info and fill out everything before confirming.<br/>Thanks!').fadeIn(400, function() {
					});


        			return false;

        		}else {			

				//check if there is a value in the text field for open donation and swap the payTier value if there is one

				// if(open_donation) {

				// 	if(open_donation < 154.80) {
				// 		$('#errors').html('Open Donations must be a minimum of $154.80.<br/><br/>Thank you for your generosity!').fadeIn(400, function() {
				// 		});

				// 		return;
				// 	}

				// 	this.payTier = open_donation;
				// } 

				//changes "Donate" button text and styles while processing
				// $(e.target).closest('button').removeClass('btn-primary').addClass('btn-warning disabled').html('Processing...');
				// var msg = '<span class="hold-on pull-right">This may take a few minutes... </span>';
				// $(msg).insertAfter($(e.target));

				// (function loop() {
				// 	$('.hold-on').animate({opacity:'+=1'}, 1000);
				// 	$('.hold-on').animate({opacity:'-=0.5'}, 1000, loop);
				// })();


				// var payload = {

				// 	// payment: {
				// 	// 	first_name: $('#first_name').val(),
				// 	// 	last_name: $('#last_name').val(),
				// 	// 	type: this.card,
				// 	// 	number: $('#cc-1').val() + $('#cc-2').val() + $('#cc-3').val() + $('#cc-4').val(),
				// 	// 	expire_month: parseInt($('#exp-month').val(), 10),
				// 	// 	expire_year: $('#exp-year').val(),
				// 	// 	cvv2: $('#cvv').val(),
				// 	// 	subtotal: this.payTier,
				// 	// 	//total: this.payTier + ".10",
				// 	// },

				// 	ticket: this.model.toJSON()
				// };

				console.log(this.model.toJSON());

				// $.ajax({
				// 	url: '/api/authPayment',
				// 	type: 'POST',
				// 	dataType: 'JSON',
				// 	data: payload,
				// })
				// 	.done(function(data) {
				// 		$(e.target).closest('button').removeClass('btn-warning').addClass('btn-success').html('Approved!');
				// 		_this.successPage();
				// 		_this.sendEmail(data, _this.model.toJSON());
				// 	})
				// 	.fail(function(error) {
				// 		$(e.target).closest('button').removeClass('btn-warning disabled').addClass('btn-primary').html('<i class="fa fa-heart"></i> Donate!');
				// 		$('#errors').html('There was an error processing your donation.  Check your info and try again!').fadeIn(400, function() {
				// 			setTimeout(function() {
				// 				$('#errors').fadeOut(400, function() {
				// 					$(this).html('');
				// 				});
				// 			}, 2000);
				// 		});
				// 	})
				// 	.always(function() {
				// 		$('#cc-1').val();
				// 		$('#cc-2').val();
				// 		$('#cc-3').val();
				// 		$('#cc-4').val();
				// 		$('.hold-on').hide();
				// 	});

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

				console.log(model.patron);
				console.log(model);

				var confirm = this.confirm(model);

				$(_this.el).fadeOut(300, function() {
					$(this).empty();
					$('#wizard-view-tabs, hr, .progress, .wizard-pager').remove();
					$(this).append(confirm).fadeIn(300);
				});


				this.model.save({
					success: function() {
						$.ajax({
							url: '/api/updateBase',
							type: 'POST',
							dataType: 'JSON',
							data: {
								// job: job,
								// food: food,
								// payTier: payTier
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

				setTimeout(function() {
					$('input').iCheck({
						radioClass: 'iradio_flat-blue'
					});
					// $("#cc-1, #cc-2, #cc-3, #cc-4").inputmask({
					// 	"mask": "9999",
					// 	"placeholder": ""
					// });
					// $("#exp-month").inputmask({
					// 	"mask": "99",
					// 	"placeholder": ""
					// });
					// $("#exp-year").inputmask({
					// 	"mask": "9999",
					// 	"placeholder": ""
					// });
					// $("#cvv").inputmask({
					// 	"mask": "9999",
					// 	"placeholder": ""
					// });
					// _this.initHoverHelp();
				}, 1);

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
