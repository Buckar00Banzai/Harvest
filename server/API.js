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


	server.post('/api/tickets',
		Ticket.createTicket
	);

	server.post('/api/sendEmail',
		function(req, res) {

			var ticket = req.body.ticket;


			switchTitle(ticket);

			var text = "Thank you so much for your RSVP! \n\n";
				text = text + "Please bookmark http://www.mywedding.com/janiandlewis to keep up with the latest wedding information. \nCeremony will start at 4:30 sharp on Saturday July 23rd. \nGrowing Heart Farm \n25 Jeans Drive \nPawling, NY  12564 \n\nLove, \n\nJani and Lewis \n\n\n";
				text = text + "The name of your party: " + ticket.party_name + "\n";
				if (ticket.num_adults) text = text + "Number of adults: " + ticket.num_adults + "\n";
				if (ticket.num_kids) text = text + "Number of kids: " + ticket.num_kids + "\n";
				if (ticket.age_kids) text = text + "Age: " + ticket.age_kids + "\n";
				text = text + "Attending the wedding: " + attendText + "\n\n";
				
				if (ticket.arrival) text = text + "Arrival date: " + arrivalText + "\n";
				if (ticket.accommodation) text = text + "Accommodation: " + accommodationText + "\n";
				
				text = text + '\n';
				
				if (ticket.participate) text = text + "Thanks for participating! You chose: \n" + participateText + "\n\n";
				if (ticket.potluck) text = text + "Thanks for contributing to the potluck! You chose: \n" + potluckText + "\n\n";
				if (ticket.patron) text = text + "Thank you for being a patron! You chose: \n" + patronText + "\n\n";

				if (ticket.personalMessage) text = text + "Personal message: " + ticket.personalMessage + "\n";


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
