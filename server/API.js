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

function switchTitle(ticket, _accomodation, _arrival) {

	switch(ticket.attend) {
		case 'attendYes':
			ticket.attend = 'Yes';
			_attend = 'Yes';
			break;
		case 'attendNo':
			ticket.attend = 'No';
			_attend = 'No';
			break;
	} // end switch

	switch(ticket.participate) {
		case 'performer':
			ticket.participate = 'Performer';
			_participate = 'You are participating as a performer.';
			break;
		case 'lead':
			ticket.participate = 'Lead';
			_participate = 'You are participating as a team lead.';
			break;
		case 'drumCircle':
			ticket.participate = 'Drum Circle';
			_participate = 'You are participating in the drum circle.';
			break;
		case 'tech':
			ticket.participate = 'Tech';
			_participate = 'You are participating as a tech.';
			break;
		case 'setup':
			ticket.participate = 'Setup';
			_participate = 'You are participating as setup crew.';
			break;
		case 'breakdown':
			ticket.participate = 'Breakdown';
			_participate = 'You are participating as breakdown crew.';
			break;
		case 'lighting':
			ticket.participate = 'Lighting';
			_participate = 'You are participating as lighting crew.';
			break;
		case 'decoration':
			ticket.participate = 'Decoration';
			_participate = 'You are participating as a decorator.';
			break;
		case 'flowerArranging':
			ticket.participate = 'Flower Arranging';
			_participate = 'You are participating in the flower arranging.';
			break;
		case 'fire':
			ticket.participate = 'Fire';
			_participate = 'You are participating as fire crew.';
			break;
		case 'altars':
			ticket.participate = 'Altars';
			_participate = 'You are participating in altar setup.';
			break;
		case 'host':
			ticket.participate = 'Host';
			_participate = 'You are participating as a host.';
			break;
		case 'yourIdea1':
			ticket.participate = 'Your Idea';
			_participate = 'You suggested your own participation.';
			break;
	} // end switch

	switch(ticket.potluck) {
		case 'tequila':
			ticket.potluck = 'Tequila';
			_potluck = 'You are bringing a bottle of tequila!';
			break;
		case 'dessert':
			ticket.potluck = 'Dessert';
			_potluck = 'You are bringing some dessert.';
			break;
		case 'partyFavors':
			ticket.potluck = 'Party Favors';
			_potluck = 'You are bringing some party favors.';
			break;
		case 'yourIdea2':
			ticket.potluck = 'Your Idea';
			_potluck = 'You suggested your own potluck item.';
			break;
	} // end switch

	switch(ticket.patron) {
		case 'patronDrink':
			ticket.patron = 'The Drink';
			_patron = 'You are a Patron of the Drink.';
			break;
		case 'sundayBrunch':
			ticket.patron = 'Sunday Brunch';
			_patron = 'You are a patron of Sunday Brunch';
			break;
		case 'chocolateBar':
			ticket.patron = 'Chocolate Bar';
			_patron = 'You are a patron of Chocolate Bar.';
			break;
		case 'pond':
			ticket.patron = 'Swimming Hole';
			_patron = 'You are a patron of our Swimming Hole.';
			break;
		case 'yourIdea3':
			ticket.patron = 'Your Idea';
			_patron = 'You selected your own donation destination!';
			break;
	} // end switch

	switch(ticket.arrival) {
		case 'arrival1':
			ticket.arrival = 'Thursday 7/21';
			_arrival = 'Thursday July 21st';
			break;
		case 'arrival2':
			ticket.arrival = 'Friday 7/22';
			_arrival = 'Friday July 22nd';
			break;
		case 'arrival3':
			ticket.arrival = 'Saturday 7/23';
			_arrival = 'Saturday July 23rd';
			break;
	} // end switch

	switch(ticket.accommodation) {
		case 'accommodation1':
			ticket.accommodation = 'Tent';
			_accomodation = 'Tent';
			break;
		case 'accommodation2':
			ticket.accommodation = 'RV';
			_accomodation = 'RV';
			break;
		case 'accommodation3':
			ticket.accommodation = 'Hotel';
			_accomodation = 'Hotel';
			break;
		case 'accommodation4':
			ticket.accommodation = 'House';
			_accomodation = 'House/Friends';
			break;

	} // end switch

}


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
						_attend,
						_participate,
						_potluck,
						_patron,
						_arrival,
						_accomodation;

			switchTitle(ticket, _accomodation, _arrival);

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

				text = text + "arrival: " + ticket.arrival + "\n";
				text = text + "accommodation: " + ticket.accomodation + "\n";
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

			switchTitle(ticket);

			console.log('boink');

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
						attend: ticket.attend,
						adults: ticket.num_adults,
						kids: ticket.num_kids,
						age: ticket.age_kids,
						arrival: ticket.arrival,
						housing: ticket.accommodation,
						participate: ticket.participate,
						potluck: ticket.potluck,
						patron: ticket.patron,
						message: ticket.personalMessage

					}, function(err) {
						if (err) {
							console.log(err);
						} else {
							console.log('row sent ');
							res.send(200, {});
						} // end else

					});

				}

			]);

	});

}
