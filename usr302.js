var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;
	self.init_tcp();
};

instance.prototype.init = function() {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.status(self.STATE_UNKNOWN);

	self.init_tcp();
};

instance.prototype.init_tcp = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	}

	if (self.config.host) {
		self.socket = new tcp(self.config.host, self.config.port);

		self.socket.on('status_change', function (status, message) {
			self.status(status, message);
		});

		self.socket.on('error', function (err) {
			debug("Network error", err);
			self.log('error',"Network error: " + err.message);
		});
	}
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type:  'text',
			id:    'info',
			width: 12,
			label: 'Information',
			value: 'This module controls a USR-IOT USR-TCP232-302 device by <a href="https://www.usriot.com/products/rs232-to-ethernet-converter.html" target="_new">USR-IOT</a>.'
		},
		{
			type:  'textinput',
			id:    'host',
			label: 'Device IP',
			width: 12,
			tooltip: 'The IP of the adapter',
			regex: self.REGEX_IP
		},
		{
			type:  'textinput',
			id:    'port',
			label: 'Device Port',
			width: 12,
			tooltip: 'The Port of the adapter',
			regex: self.REGEX_PORT,
			default: '40302'
		},
		{
			type:    'dropdown',
			label:   'Line Termination',
			id:      'term',
			default: '\r',
			choices:	[
			   { id: '',     label: 'No termination' },
			   { id: '\r',   label: 'Carriage Return - \\r' },
			   { id: '\n',   label: 'Line Feed - \\n' },
			   { id: '\r\n', label: 'Carriage Return/Line Feed - \\r\\n' },
			]
	   },
	];
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
	}

	debug("destroy", self.id);
};

instance.prototype.actions = function(system) {
	var self = this;
	self.system.emit('instance_actions', self.id, {

		'command':       {
			label: 'Command',
			options: [
				{
					 type:    'textinput',
					 label:   'Type Command',
					 id:      'sl'
				}
			]
		},
		'hexcommand':	{
			label: 'HEX based command',
			options: [
				{
					 type:    'textinput',
					 label:   'Type hex values to send',
					 id:      'hex'
				}
			]
		}
	});
};

instance.prototype.action = function(action) {
	var self = this;
	var cmd  = '';
	var opt  = action.options;

	switch (action.action) {

		case 'command':
			cmd += opt.sl;
			break;
	}

	if (cmd !== undefined) {

		debug('sending tcp', cmd, "to", self.config.host);

		if (self.socket !== undefined && self.socket.connected) {
			self.socket.send(cmd + "\r\n");
		} else {
			debug('Socket not connected :(');
		}
	}

	debug('action():', action);

};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
