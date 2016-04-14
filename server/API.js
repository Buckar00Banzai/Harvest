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


var participateText = "";
var patronText = "";
var potluckText = "";
var attendText = "";
var arrivalText = "";
var accommodationText = "";

function switchTitle(ticket, _accomodation, _arrival) {

	switch(ticket.attend) {
		case 'attendYes':
			attendText = 'Yes';
			break;
		case 'attendNo':
			attendText = 'No';
			break;
	} // end switch


	if (ticket.participate) {

		ticket.participate.forEach(function(item) {

			switch(item.name) {
				case 'performer':
					participateText = participateText + 'Performer \n';
					break;
				case 'lead':
					participateText = participateText + 'Lead \n';
					break;
				case 'drumCircle':
					participateText = participateText + 'Drum Circle \n';
					break;
				case 'tech':
					participateText = participateText + 'Tech \n';
					break;
				case 'setup':
					participateText = participateText + 'Setup \n';
					break;
				case 'breakdown':
					participateText = participateText + 'Breakdown \n';
					break;
				case 'lighting':
					participateText = participateText + 'Lighting \n';
					break;
				case 'decoration':
					participateText = participateText + 'Decoration \n';
					break;
				case 'flowerArranging':
					participateText = participateText + 'Flower Arranging \n';
					break;
				case 'fire':
					participateText = participateText + 'Fire \n';
					break;
				case 'altars':
					participateText = participateText + 'Altars \n';
					break;
				case 'host':
					participateText = participateText + 'Host \n';
					break;
				case 'yourIdea1':
					participateText = participateText + 'Your Idea: ' + item.text + ' \n';
					break;
			} // end switch

		}); // end forEach

		participateText = participateText.slice(0, participateText.length - 2);

	}


	if (ticket.patron) {

		ticket.patron.forEach(function(item) {

			switch(item.name) {
				case 'patronDrink':
					patronText = patronText + 'The Drink \n';
					break;
				case 'sundayBrunch':
					patronText = patronText + 'Sunday Brunch \n';
					break;
				case 'chocolateBar':
					patronText = patronText + 'Chocolate Bar \n';
					break;
				case 'pond':
					patronText = patronText + 'Swimming Hole \n';
					break;
				case 'yourIdea3':
					patronText = patronText + 'Your Idea: ' + item.text + ' \n';
					break;
			} // end switch

		});

		patronText = patronText.slice(0, patronText.length - 2);

	}


	if (ticket.potluck) {

		ticket.potluck.forEach(function(item) {

			switch(item.name) {
				case 'tequila':
					potluckText = potluckText + 'Tequila \n';
					break;
				case 'dessert':
					potluckText = potluckText + 'Dessert \n';
					break;
				case 'partyFavors':
					potluckText = potluckText + 'Party Favors \n';
					break;
				case 'yourIdea2':
					potluckText = potluckText + 'Your Idea: ' + item.text + ' \n';
					break;
			} // end switch

		});

		potluckText = potluckText.slice(0, potluckText.length - 2);

	}


	switch(ticket.arrival) {
		case 'arrival1':
			arrivalText = 'Thursday 7/21';
			break;
		case 'arrival2':
			arrivalText = 'Friday 7/22';
			break;
		case 'arrival3':
			arrivalText = 'Saturday 7/23';
			break;
	} // end switch

	switch(ticket.accommodation) {
		case 'accommodation1':
			accommodationText = 'Tent';
			break;
		case 'accommodation2':
			accommodationText = 'RV';
			break;
		case 'accommodation3':
			accommodationText = 'Hotel';
			break;
		case 'accommodation4':
			accommodationText = 'House';
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

			var ticket = req.body.ticket;


			switchTitle(ticket);

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
				text = text + "attending: " + attendText + "\n\n";

				text = text + "participate: " + participateText + "\n";
				text = text + "potluck: " + potluckText + "\n";
				text = text + "patron: " + patronText + "\n\n";

				text = text + "arrival: " + arrivalText + "\n";
				text = text + "accommodation: " + accommodationText + "\n";
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
						attend: attendText,
						adults: ticket.num_adults,
						kids: ticket.num_kids,
						age: ticket.age_kids,
						arrival: arrivalText,
						housing: accommodationText,
						participate: participateText,
						potluck: potluckText,
						patron: patronText,
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
