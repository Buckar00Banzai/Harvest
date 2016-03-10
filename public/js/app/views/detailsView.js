// InfoView.js
// ====================

define(["jquery", "backbone", "text!templates/details.html" ],

    function($, Backbone, template){

    	var InfoView = Backbone.View.extend({

		    tagName: 'div',

			initialize: function () {

				_.bindAll(this, 'render', 'updateModel');

				this.template =  _.template(template);

			},

			render: function () {

				$(this.el).empty();

				this.$el.append(this.template(this.model.toJSON()));

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

				return this;
			},

			updateModel: function(){

				this.model.set({
					party_name: $('#party-name').val(),
					email: $('#email').val(),
					num_adults: $('#num-adults').val(),
					num_kids: $('#num-kids').val(),
					age_kids: $('#age-kids').val()
				});
			}

	});

    return InfoView;

	}
);
