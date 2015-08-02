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
				"description": "Afrika Tembo Donation"
			}]
		};

		paypal_sdk.payment.create(payment_details, function(error, payment) {
			if (error) {
				console.error(error);
				res.send(400, error);
			} else {
				console.log(req.body.ticket.first_name + ' ' + req.body.ticket.last_name + ' made a donation!');
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
				j, ct;

			var text = "Hello, this is a confirmation that your donation to Afrika Tembo has been accepted.\n\n";
				text = text + "DONATION DETAILS:\n\n";
				text = text + "Total: $" + payment.transactions[0].amount.total + '\n';
				text = text + "Card: " + payment.payer.funding_instruments[0].credit_card.type + ' ' + payment.payer.funding_instruments[0].credit_card.number + '\n';
				text = text + "State: " + payment.state + "\n\n";
				text = text + "Our deepest thanks for your generosity. It is because of you that this project is possible.\n\n\n";

			var mailOptions = {
				from: "Afrika Tembo<afrikatembo@gmail.com>", // sender address
				to: ticket.email,
				cc: "Afrika Tembo<afrikatembo@gmail.com>", // list of receivers
				subject: "Thank you for your donation to Afrika Tembo", // Subject line
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
