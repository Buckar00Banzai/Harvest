// IndexView.js

define(["jquery", "backbone", "views/wizardView", "views/detailsView", "views/jobsView", "views/foodView", "views/roomView", "views/payView", "models/ticketModel", "models/baseModel", "text!templates/Signup.html"],

    function($, Backbone, Wizard, DetailsView, JobsView, FoodView, RoomView, PayView, Ticket, Base, template) {

        var SignupView = Backbone.View.extend({

            // The DOM Element associated with this view
            el: ".magic",
            // View constructor
            initialize: function() {

                var _this = this;

                _.bindAll(this, "render");

                var ticket = new Ticket();
                var base = new Base();

                base.fetch({
                    success: function() {
                        $(function() {
                            Wizard.initialize(ticket);
                            Wizard.insertView({
                                ref: new DetailsView({
                                    model: ticket
                                }),
                                tab: 'Info',
                                nu: '1',
                                progress: '25%'
                            });
                            Wizard.insertView({
                                ref: new JobsView({
                                    model: ticket,
                                    base: base
                                }),
                                tab: 'Paricipate',
                                nu: '2',
                                progress: '50%'
                            });
                            Wizard.insertView({
                                ref: new FoodView({
                                    model: ticket,
                                    base: base
                                }),
                                tab: 'Accomodations',
                                nu: '3',
                                progress: '75%'
                            });
                            // Wizard.insertView({
                            //     ref: new RoomView({
                            //         model: ticket,
                            //         base: base
                            //     }),
                            //     tab: 'Room Availabilty',
                            //     nu: '4',
                            //     progress: '80%'
                            // });
                            Wizard.insertView({
                                ref: new PayView({
                                    model: ticket,
                                    base: base
                                }),
                                tab: 'Confirm',
                                nu: '4',
                                progress: '100%'
                            });
                        });

                        _this.render();
                    }
                })

            },

            // View Event Handlers
            events: {

            },

            // Renders the view's template to the UI
            render: function() {

                // Setting the view's template property using the Underscore template method
                this.template = _.template(template, {});

                // Dynamically updates the UI with the view's template
                this.$el.html(this.template);

                $('#wizard-container').append(Wizard.render().el);
                $(document).scrollTop(0);

                // Maintains chainability
                return this;

            }

        });

        // Returns the View class
        return SignupView;

    }

);
