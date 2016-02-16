var stripeKeys = {
	'pk_test_*': 'sk_test_*',
	'pk_live_*': 'sk_live_*'
};

var express = require('express');
var app = express();
var cors = require('cors');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 5000));

app.use(cors());	

var corsOptionsDelegate = function(req, callback){
  callback(null, { origin: true }); // callback expects two parameters: error and options
};
app.options('*', cors(corsOptionsDelegate)); // include before other routes

app.get('/', function(request, response) {
  response.send('HelloWorld');
});

app.post("/stripe/charge", function(request, response) {

	if (request.body.token && request.body.key) {
		console.log('charging ' + request.body.email);

		var stripe = require('stripe')(stripeKeys[request.body.key]);
		stripe.charges.create({
		  amount: request.body.amount,
		  currency: "usd",
		  source: request.body.token,
		  description: request.body.description,
		  receipt_email: request.body.email
		}).then(function(confirm) {
			response.json(confirm);
		}, function(err) {
			response.status(500).json(err);
		});

	} else {
		response.status(400).json({ message: 'send a token' });
	}

});

app.post("/stripe/subscribe", function(request, response) {
	if (request.body.token && request.body.key) {
		console.log('subscribing ' + request.body.email);

		var stripe = require('stripe')(stripeKeys[request.body.key]);
		stripe.customers.create({
		  quantity: parseInt(request.body.amount),
		  plan: 'donation',
		  email: request.body.email,
		  source: request.body.token,
		  description: request.body.description
		}).then(function(confirm) {
			response.json(confirm);
		}, function(err) {
			response.status(500).json(err);
		});
	} else {
		response.status(400).json({ message: 'send a token' });
	}
});

app.post('/stripe/unsubscribe', function(request, response) {
	
	var email = request.body.email;
	if (email && request.body.key) {
		console.log('looking for customer ' + email);

		var stripe = require('stripe')(stripeKeys[request.body.key]);
		stripe.customers.list({
			limit: 100
		}).then(function(customers){
			for(var i=0; i<customers.data.length; i++) {
				console.log('looking at ', customers.data[i].email);

				if (customers.data[i].email === email) {
					stripe.customers.del(customers.data[i].id)
					.then(function(confirm) {
						response.json(confirm);
					}, function(err) {
						response.status(500).json(err);
					});
					break; // one deletion is enough
				}
			}
			if (i == customers.data.length) { // couldnt find anything
				response.status(500).json({ message: email + ' not found' });
			}
		}, function(err) {
			response.status(500).json(err);
		});
	} else {
		response.status(500).json({ message: "send email as param" });
	}
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
