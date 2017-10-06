let Generator = require('yeoman-generator'),
	s = require('underscore.string'),
	_ = require('lodash');

module.exports = class extends Generator {
	// The name `constructor` is important here
	constructor(args, opts) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts);
		this.argument('jsonFileName', { type: String, required: false });
		this.jsonFileName = this.options.jsonFileName || '';
		this.moduleName = this.jsonFileName.replace('.json','');
		this.moduleName = s.camelize(s.slugify(s.humanize(this.moduleName)));
	}
	createIndex() {
		var chalk = require('chalk');
		if(!this.moduleName){
			console.log(chalk.bold.red('Please provide module name.'));
			return;
		}
		if(!this.fs.exists(this.jsonFileName)){
			console.log(chalk.bold.red('JSON file does not exist.'));
			return;
		}
		let jsonContent = this.fs.readJSON(this.jsonFileName);
		if(!_.get(jsonContent,'response.data.length')){
			console.log(chalk.bold.red('Please provide valid JSON file.'));
			return;
		}
		let fields = _.get(jsonContent,'response.data[0]');
		if(!_.isPlainObject(fields)){
			console.log(chalk.bold.red('Please provide valid JSON file.'));
			return;
		}
		let fieldKeys = _.keys(fields);
		fields = {};
		_.each(fieldKeys,(field)=>fields[field] = {title:field,type:'string'});
		fields = JSON.stringify(fields,null,4);
		fields = _.replace(fields,new RegExp('\n','g'),"\n\t\t");
		let moduleNameSingular = this.moduleName, //singular crud name
			moduleNamePlural = this.moduleName+'s', //plural crud name
			ModuleNameSingular = s.capitalize(this.moduleName),   //singular crud name capital case
			ModuleNamePlural =  s.capitalize(this.moduleName)+'s', //plural crud name capital case
			replaceVariables ={ ModuleNameSingular,ModuleNamePlural ,moduleNamePlural,moduleNameSingular,fields};
		this.fs.copyTpl(
			this.templatePath('crud-module/crud.component.html'),
			this.destinationPath(`src/app/pages/tables/${moduleNamePlural}/${moduleNameSingular}.component.html`),
			replaceVariables
		);
		this.fs.copyTpl(
			this.templatePath('crud-module/crud.component.ts'),
			this.destinationPath(`src/app/pages/tables/${moduleNamePlural}/${moduleNameSingular}.component.ts`),
			replaceVariables
		);
		this.fs.copyTpl(
			this.templatePath('crud-module/crud.service.ts'),
			this.destinationPath(`src/app/pages/tables/${moduleNamePlural}/${moduleNameSingular}.service.ts`),
			replaceVariables
		);
	}
};