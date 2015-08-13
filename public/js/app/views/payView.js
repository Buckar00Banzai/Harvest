// InfoView.js
// ====================

define(["jquery", "backbone", "icheck", "text!templates/pay.html", "text!templates/confirm.html"],

	function($, Backbone, iCheck, template, confirmTemplate) {

		var InfoView = Backbone.View.extend({

			tagName: 'div',
			card: null,

			payTier: 154.80,

			initialize: function() {

				_.bindAll(this, 'render');

				this.template = _.template(template);
				this.confirm = _.template(confirmTemplate);

			},

			events: {
				'click #donate': 'donate',
				'ifToggled .cards': 'selectCard',
				'ifToggled .payTier': 'selectPayTier'
				//'ifToggled #openSelector': 'selectPayTierOpen'
			},

			selectCard: function(e) {
				this.card = $(e.target).attr('id');
			},

			selectPayTier: function(e) {
				
				this.payTier = $(e.target).val();

				//if (tier === null){
				//	this.payTier = $('#donation_amount').val()
				//} else {
				//	this.payTier = tier;
				//}
			},

/*
			selectPayTierOpen: function(e) {
				
				this.payTier = $('#openAmount').val();

			},
*/
			initHoverHelp: function() {

                var ele = $('.payTier-description'),
                	title = $('.payTier-title');


				$('.tt').click(function(e) {

                    var message = $(this).data('message');
                    	payTierTitle = $(this).data('title');

                    ele.html(message);

                    title.html(payTierTitle);

                });

				$('input[name=payTier]').on('ifChanged', function(e) {

                    var message = $(this).parent().parent().find('.tt').data('message');
                    	payTierTitle = $(this).parent().parent().find('.tt').data('title');

                    ele.html(message);

                    title.html(payTierTitle);

                });

            },

			donate: function(e) {
				e.preventDefault();

				var _this = this;
			
				var first_name = this.model.get('first_name');
				var last_name = this.model.get('last_name');
				var email = this.model.get('email');
				var job = this.model.get('job');

				if(first_name == null || first_name == "" || last_name == null || last_name == "" || email == null || email == "") {

					//alert("Hey little llama you forgot some info in the Nominate section! We need it to generate your ticket. Please click on Previous or Nominate and be sure to fill out your first and last name and your email address before donating. Thanks!");
        			

					$('#errors').html('Some information is missing, please click on INFO and fill out all fields before donating. Thank you.').fadeIn(400, function() {
					});


        			return false;

        		}else if(job == null || job == "") {

					//alert("Hey little llama you forgot to pick an activity in the Activate section! We need it to generate your ticket. Please click on Previous or Activate and click on an activity before donating. Thanks!");
        			

					$('#errors').html('Some information is missing, please click on CHOOSE DONATION, then click on a donation level before donating. Thank you.').fadeIn(400, function() {
					});


        			return false;

				}else {


				//changes "Donate" button text and styles while processing
				$(e.target).closest('button').html('Working');
				var msg = '<span class="hold-on pull-right">This may take a few minutes... </span>';
				$(msg).insertAfter($(e.target));

				(function loop() {
					$('.hold-on').animate({opacity:'+=1'}, 1000);
       				$('.hold-on').animate({opacity:'-=0.5'}, 1000, loop);
				})();


				var payload = {
					payment: {
						first_name: $('#first_name').val(),
						last_name: $('#last_name').val(),
						type: this.card,
						number: $('#cc-1').val() + $('#cc-2').val() + $('#cc-3').val() + $('#cc-4').val(),
						expire_month: parseInt($('#exp-month').val(), 10),
						expire_year: $('#exp-year').val(),
						cvv2: $('#cvv').val(),
						subtotal: job,
						//total: this.payTier + ".10",
					},
					ticket: this.model.toJSON()
				};

				$.ajax({
					url: '/api/authPayment',
					type: 'POST',
					dataType: 'JSON',
					data: payload,
				})
					.done(function(data) {
						$(e.target).closest('button').removeClass('btn-warning').addClass('btn-success').html('Approved!');
						_this.successPage();
						_this.sendEmail(data, _this.model.toJSON());
					})
					.fail(function(error) {
						$(e.target).closest('button').removeClass('btn-warning disabled').addClass('btn-primary').html('<i class="fa fa-heart"></i> Donate!');
						$('#errors').html('There was an error processing your donation. Please check your card information and try again.').fadeIn(400, function() {
							setTimeout(function() {
								$('#errors').fadeOut(400, function() {
									$(this).html('');
								});
							}, 2000);
						});
					})
					.always(function() {
						$('#cc-1').val();
						$('#cc-2').val();
						$('#cc-3').val();
						$('#cc-4').val();
						$('.hold-on').hide();
					});
				} //end else

			},

			sendEmail: function(payment, ticket) {

				$.ajax({
					url: '/api/sendEmail',
					type: 'POST',
					dataType: 'JSON',
					data: {
						payment: payment,
						ticket: ticket
					},
				});

			},

			successPage: function() {

				var _this = this;
				var job = this.model.get('job');
				var food = this.model.get('food');
				var payTier = this.model.get('payTier');

				var confirm = this.confirm(this.model.toJSON());

				$(_this.el).fadeOut(300, function() {
					$(this).empty();
					$('#wizard-view-tabs, hr, .progress, .wizard-pager').remove();
					$(this).append(_this.confirm(_this.model.toJSON())).fadeIn(300);
				});


				this.model.save({
					success: function() {
						$.ajax({
							url: '/api/updateBase',
							type: 'POST',
							dataType: 'JSON',
							data: {
								job: job,
								food: food,
								payTier: payTier
							},
						});

					}
				});

			},

			updateModel: function() {

			},

			render: function() {

				var _this = this;

				$(this.el).empty();

				this.$el.append(this.template(this.model.toJSON()));

				setTimeout(function() {
					$('input').iCheck({
						radioClass: 'iradio_flat-blue'
					});
					$("#cc-1, #cc-2, #cc-3, #cc-4").inputmask({
						"mask": "9999",
						"placeholder": ""
					});
					$("#exp-month").inputmask({
						"mask": "99",
						"placeholder": ""
					});
					$("#exp-year").inputmask({
						"mask": "9999",
						"placeholder": ""
					});
					$("#cvv").inputmask({
						"mask": "9999",
						"placeholder": ""
					});
					_this.initHoverHelp();
				}, 1);

				return this;
			}

		});

		return InfoView;

	}
);
