// InfoView.js
// ====================

define(["jquery", "backbone", "icheck", "models/baseModel", "text!templates/details.html" ],

    function($, Backbone, iCheck, Base, template){

    	var InfoView = Backbone.View.extend({

		    tagName: 'div',

		    attend: null,

			initialize: function () {

				_.bindAll(this, 'render', 'updateModel');

				this.template =  _.template(template);

			},

			events: {
				'ifToggled input': 'selectAttend'
			},

			selectAttend: function(e) {

				this.attend = $(e.target).val();

			},

			render: function () {

				$(this.el).empty();

				this.$el.append(this.template(this.model.toJSON()));

				setTimeout(function() {
					$('input').iCheck({
						radioClass: 'iradio_flat-blue'
					});
				}, 1);

				if (this.model.attributes.party_name !== '') {
					$('#party-name').val(this.model.attributes.party_name);
				}

				if (this.model.attributes.email !== '') {
					$('#email').val(this.model.attributes.email);
				}

				if (this.model.attributes.num_adults !== '') {
					$('#num-adults').val(this.model.attributes.num_adults);
				}

				if (this.model.attributes.num_kids !== '') {
					$('#num-kids').val(this.model.attributes.num_kids);
				}

				if (this.model.attributes.age_kids !== '') {
					$('#age-kids').val(this.model.attributes.age_kids);
				}

				if(this.attend !== null) {
					$('#' + this.attend).iCheck('check');
				}

				$(document).scrollTop(0);
				return this;
			},

			updateModel: function(){

				var _this = this;

				this.model.set({
					party_name: $('#party-name').val(),
					email: $('#email').val(),
					num_adults: $('#num-adults').val(),
					num_kids: $('#num-kids').val(),
					age_kids: $('#age-kids').val(),
					attend: _this.attend
				});
			}

	});

    return InfoView;

	}
);
