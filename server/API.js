// API
// ===

var paypal_sdk = require('paypal-rest-sdk');
var nodemailer = require("nodemailer");

paypal_sdk.configure({
	'host': Config.paypal.host,
	'client_id': Config.paypal.client_id,
	'client_secret': Config.paypal.client_secret
});

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", {
	service: "Gmail",
	auth: {
		user: Config.gmail.user,
		pass: Config.gmail.pass
	}
});

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

	server.post('/api/authPayment', function(req, res) {

		var payment_details = {
			"intent": "sale",
			"payer": {
				"payment_method": "credit_card",
				"funding_instruments": [{
					"credit_card": {
						"number": req.body.payment.number,
						"type": req.body.payment.type,
						"expire_month": req.body.payment.expire_month,
						"expire_year": req.body.payment.expire_year,
						"cvv2": req.body.payment.cvv2,
						"first_name": req.body.payment.first_name,
						"last_name": req.body.payment.last_name,
					}
				}]
			},
			"transactions": [{
				"amount": {
					"total": req.body.payment.subtotal,
					"currency": "USD",
				},
				"description": "Midnight Summer Moon Donation"
			}]
		};

		paypal_sdk.payment.create(payment_details, function(error, payment) {
			if (error) {
				console.error(error);
				res.send(400, error);
			} else {
				console.log(req.body.ticket.party_name + ' bought a ticket!');
				res.send(200, payment);
			}
		});

	});

	server.post('/api/tickets',
		Ticket.createTicket
	);

	server.post('/api/sendEmail',
		function(req, res) {

			var ticket = req.body.ticket,
				payment = req.body.payment,
				j, arr, pay_total, pay_card, pay_state;

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
					pay_total = "Total: $" + payment.transactions[0].amount.total + '\n';
					pay_card = "Card: " + payment.payer.funding_instruments[0].credit_card.type + ' ' + payment.payer.funding_instruments[0].credit_card.number + '\n';
					pay_state = "State: " + payment.state + "\n\n";
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


			console.log(req.body);

			var text = "Hey, this is a confirmation of your RSVP for the wedding of Jani and Lewis.\n\n";
				text = text + "CONTRIBUTION DETAILS: \n\n";
				text = text + "Participation: " + j + "\n";
				text = text + pay_total;
				text = text + pay_card;
				text = text + pay_state;
				text = text + "Accommodation: arriving on " + ticket.arrival + "\n\n";
				text = text + "ADDRESS + DIRECTIONS:\n\n Growing Heart Farm\n\n From the south:\n\n I-87 N\n Take exit 21 toward RT 23/Catskill (.6 mi)\n Turn left at CR-23B (.3 mi)\n Slight right onto 23W (7.7 mi)\n Slight right at RT 32 (10.7 mi)\n Turn left at CR-405 (.2 mi)\n Turn left at Jennings rd\n\n From the North:\n\n I-87 S\n Take exit 21B for US-9W S toward Coxsackie/RT-81 (.3 mi)\n Turn left at US-9W (2.2 mi)\n Turn right at RT-81 (1.0 mi)\n Turn right at CR-26 (5.2 mi)\n Turn right at Hillcrest Rd (3.6 mi)\n Slight left at CR-38 (1.4 mi)\n Continue on CR-405 (1.2 mi)\n Turn left at Jennings Rd\n\n Bus/Train:\n\n There is a bus that leaves from Port Authority, NYC on Adirondack Trailways, it connects through Kingston, NY and you get off at Karen’s Flower Shop in Cairo, NY, the stop is called Cairo Junction. There is no regular taxi service here, but you can call Lee’s taxi (518-966-4861) and make an appointment ahead of time. It’s a 15 minute ride to the house. Also you can take Amtrak from Penn Station to Hudson, NY and take a regular taxi from there. It’s a 40 minute ride to the house.\n\n The nearest grocery store to our gathering is Tops Friendly Market  NY-32, Greenville, NY 12083";

			var mailOptions = {
				from: "Al the Alpaca ✔ <alchemicalalpaca@gmail.com>", // sender address
				to: ticket.email, // list of receivers
				subject: "Jani + Lewis RSVP Confirmation", // Subject line
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

}
