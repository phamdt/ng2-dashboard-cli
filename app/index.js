let Generator = require('yeoman-generator'),
	s = require('underscore.string');

module.exports = class extends Generator {
	// The name `constructor` is important here
	constructor(args, opts) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts);
		this.argument('appname', { type: String, required: false });
		this.appname = this.options.appname || this.appname || path.basename(process.cwd());
		this.appname = s.camelize(s.slugify(s.humanize(this.appname)));
		console.log(this.appname);
	}
	createIndex() {
		this.fs.copyTpl(
			this.templatePath('index.html'),
			this.destinationPath('index.html'),
			{ title: this.appname }
		);
	}
};