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
		let crudModuleName = 'user', //singular crud name
			crudsModuleName = 'users', //plural crud name
			CrudModuleName = 'User',   //singular crud name capital case
			CrudsModuleName = 'Users', //plural crud name capital case
			replaceVariables ={ CrudModuleName,CrudsModuleName ,crudsModuleName,crudModuleName};
		this.fs.copyTpl(
			this.templatePath('crud-module/crud.component.html'),
			this.destinationPath(`src/app/pages/tables/${crudsModuleName}/${crudsModuleName}.component.html`),
			replaceVariables
		);
		this.fs.copyTpl(
			this.templatePath('crud-module/crud.component.ts'),
			this.destinationPath(`src/app/pages/tables/${crudsModuleName}/${crudsModuleName}.component.ts`),
			replaceVariables
		);
		this.fs.copyTpl(
			this.templatePath('crud-module/crud.service.ts'),
			this.destinationPath(`src/app/pages/tables/${crudsModuleName}/${crudsModuleName}.service.ts`),
			replaceVariables
		);
	}
};