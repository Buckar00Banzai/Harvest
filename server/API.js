// API
// ===

// var paypal_sdk = require('paypal-rest-sdk');
var nodemailer = require("nodemailer");

// paypal_sdk.configure({
// 	'host': Config.paypal.host,
// 	'client_id': Config.paypal.client_id,
// 	'client_secret': Config.paypal.client_secret
// });

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", {
	service: "Gmail",
	auth: {
		user: Config.gmail.user,
		pass: Config.gmail.pass
	}
});


var GoogleSpreadsheet = require("google-spreadsheet");

var doc = new GoogleSpreadsheet('1yay8AVwRMAksY0rrqAExsngqmd4m-Ofl0GmRXZOLK8g');

var async = require("async");


module.exports.api = function(server, Base, Ticket) {

	server.post('/api/createBase',
		Base.createBase
	);

	server.get('/api/base',
		Base.getBase
	);

	server.post('/api/updateBase',
		Base.updateBase
	);

	// server.post('/api/authPayment', function(req, res) {

	// 	var payment_details = {
	// 		"intent": "sale",
	// 		"payer": {
	// 			"payment_method": "credit_card",
	// 			"funding_instruments": [{
	// 				"credit_card": {
	// 					"number": req.body.payment.number,
	// 					"type": req.body.payment.type,
	// 					"expire_month": req.body.payment.expire_month,
	// 					"expire_year": req.body.payment.expire_year,
	// 					"cvv2": req.body.payment.cvv2,
	// 					"first_name": req.body.payment.first_name,
	// 					"last_name": req.body.payment.last_name,
	// 				}
	// 			}]
	// 		},
	// 		"transactions": [{
	// 			"amount": {
	// 				"total": req.body.payment.subtotal,
	// 				"currency": "USD",
	// 			},
	// 			"description": "Midnight Summer Moon Donation"
	// 		}]
	// 	};

	// 	paypal_sdk.payment.create(payment_details, function(error, payment) {
	// 		if (error) {
	// 			console.error(error);
	// 			res.send(400, error);
	// 		} else {
	// 			console.log(req.body.ticket.party_name + ' bought a ticket!');
	// 			res.send(200, payment);
	// 		}
	// 	});

	// });

	server.post('/api/tickets',
		Ticket.createTicket
	);

	server.post('/api/sendEmail',
		function(req, res) {

			var ticket = req.body.ticket,
				j, arr, acc;

			switch(ticket.job) {
				case 'performer':
					j = 'You are participating as a performer.';
					break;
				case 'lead':
					j = 'You are participating as a team lead.';
					break;
				case 'You are participating in the drum circle.':
					j = 'Dinner Preparation';
					break;
				case 'tech':
					j = 'You are participating as a tech.';
					break;
				case 'setup':
					j = 'You are participating as setup crew.';
					break;
				case 'breakdown':
					j = 'You are participating as breakdown crew.';
					break;
				case 'lighting':
					j = 'You are participating as lighting crew.';
					break;
				case 'decoration':
					j = 'You are participating as a decorator.';
					break;
				case 'flowerArranging':
					j = 'You are participating in the flower arranging.';
					break;
				case 'fire':
					j = 'You are participating as fire crew.';
					break;
				case 'altars':
					j = 'You are participating in altar setup.';
					break;
				case 'host':
					j = 'You are participating as a host.';
					break;
				case 'yourIdea1':
					j = 'You suggested your own participation.';
					break;

				case 'tequila':
					j = 'You are bringing a bottle of tequila!';
					break;
				case 'dessert':
					j = 'You are bringing some dessert.';
					break;
				case 'partyFavors':
					j = 'You are bringing some party favors.';
					break;
				case 'yourIdea2':
					j = 'You suggested your own potluck item.';
					break;

				case 'patronDrink':
					j = 'You are a Patron of the Drink.';
					break;
				case 'sundayBrunch':
					j = 'You are a patron of Sunday Brunch';
					break;
				case 'choclateBar':
					j = 'You are a patron of Chocolate Bar.';
					break;
				case 'pond':
					j = 'You are a patron of our Swimming Hole.';
					break;
				case 'yourIdea3':
					j = 'You selected your own donation destination!';
					break;
			}

			switch(ticket.arrival) {
				case 'arrival1':
					arr = 'Thursday July 21st';
					break;
				case 'arrival2':
					arr = 'Friday July 22nd';
					break;
				case 'arrival3':
					arr = 'Saturday July 23rd';
					break;
			}

			switch(ticket.accommodation) {
				case 'accommodation1':
					acc = 'Tent';
					break;
				case 'accommodation2':
					acc = 'RV';
					break;
				case 'accommodation3':
					acc = 'Hotel';
					break;
				case 'accommodation4':
					acc = 'House/Friends';
					break;
			}


			console.log(req.body);

			// var text = "Hey, this is a confirmation of your RSVP for the wedding of Jani and Lewis.\n\n";
			// 	text = text + "CONTRIBUTION DETAILS: \n\n";
			// 	text = text + "Participation: " + j + "\n\n";
			// 	text = text + "Arrival: " + arr + "\n";
			// 	text = text + "Accommodation: " + acc + "\n\n\n";
			// 	text = text + "ADDRESS + DIRECTIONS:\n\n Growing Heart Farm\n\n";

			var text = "this is a test to see what data we are passing! \n\n";
				text = text + "party name: " + ticket.party_name + "\n";
				text = text + "adults: " + ticket.num_adults + "\n";
				text = text + "kids: " + ticket.num_kids + "\n";
				text = text + "age: " + ticket.age_kids + "\n";
				text = text + "attending: " + ticket.attend + "\n\n";

				text = text + "participate: " + ticket.participate + "\n";
				text = text + "potluck: " + ticket.potluck + "\n";
				text = text + "patron: " + ticket.patron + "\n\n";

				text = text + "arrival: " + arr + "\n";
				text = text + "accommodation: " + acc + "\n";
				text = text + "message: " + ticket.personalMessage + "\n";


			var mailOptions = {
				from: "Jani and Lewis <janiandlewis@gmail.com>", // sender address
				to: ticket.email, // list of receivers
				subject: "Your RSVP Confirmation", // Subject line
				text: text // plaintext body
			};

			// send mail with defined transport object
			smtpTransport.sendMail(mailOptions, function(error, response) {
				if (error) {
					console.log(error);
				} else {
					console.log("Message sent: " + response.message);
					res.send(200, {});
				}

				//smtpTransport.close(); // shut down the connection pool, no more messages
			});
	});

	server.post('/api/updateSpreadsheet',
		function(req, res) {
			
			var sheet;

			var ticket = req.body.ticket;

			async.series([
				function(step) {
					var creds = require('../JaniLewis-d03f34a46662.json');

					doc.useServiceAccountAuth(creds, step);

				},

				function(step) {
					doc.getInfo(function(err, info) {

						if(err) console.log(err);
						console.log('Got doc: ' + info.title);
						sheet = info.worksheets[0];
						step();

					});

				},

				function(step) {
					sheet.addRow({
						party: ticket.party_name,
						email: ticket.email,
						attending: ticket.attend,
						adults: ticket.num_adults,
						kids: ticket.num_kids,
						age: ticket.age_kids,
						arrival: ticket.arrival,
						housing: ticket.accommodation,
						participate: ticket.participate,
						potluck: ticket.potluck,
						patron: ticket.patron,
						message: ticket.personalMessage

					}, function(error, response) {
						if (error) {
							console.log(error);
						} else {
							console.log('row sent ');

							step();
						} // end else

					});

				}

			]);

	});

}
