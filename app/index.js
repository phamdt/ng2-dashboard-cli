var Generator = require('yeoman-generator');

module.exports = class extends Generator {
	// The name `constructor` is important here
	constructor(args, opts) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts);
	}
	method() {
		this.fs.copyTpl(
			this.templatePath('index.html'),
			this.destinationPath('public/index.html'),
			{ title: 'Templating with Yeoman' }
		);
	}
};