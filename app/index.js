let Generator = require('yeoman-generator'),
	s = require('underscore.string'),
	_ = require('lodash'),
	chalk = require('chalk');


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
	_validateJSON(){
	}
	createIndex() {
		//validate file
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

		//Add component file
		let moduleNameSingular = this.moduleName, //singular crud name
			moduleNamePlural = this.moduleName+'s', //plural crud name
			ModuleNameSingular = s.capitalize(this.moduleName),   //singular crud name capital case
			ModuleNamePlural =  s.capitalize(this.moduleName)+'s', //plural crud name capital case
			componentName = ModuleNameSingular+'Component',
			replaceVariables ={ ModuleNameSingular,ModuleNamePlural ,moduleNamePlural,moduleNameSingular,fields},
			componentHtml = `${moduleNamePlural}/${moduleNameSingular}.component.html`,
			componentTs = `${moduleNamePlural}/${moduleNameSingular}.component.ts`,
			componentService = `${moduleNamePlural}/${moduleNameSingular}.service.ts`;
		this.fs.copyTpl(
			this.templatePath('crud-module/crud.component.html'),
			this.destinationPath(`src/app/pages/tables/${componentHtml}`),
			replaceVariables
		);
		this.fs.copyTpl(
			this.templatePath('crud-module/crud.component.ts'),
			this.destinationPath(`src/app/pages/tables/${componentTs}`),
			replaceVariables
		);
		this.fs.copyTpl(
			this.templatePath('crud-module/crud.service.ts'),
			this.destinationPath(`src/app/pages/tables/${componentService}`),
			replaceVariables
		);

		//update the file entries in the table-routing.module.ts file
		let moduleFileContent  = this.fs.read(this.destinationPath(`src/app/pages/tables/tables-routing.module.ts`)),
			lastImportStatementIndex = moduleFileContent.lastIndexOf('import '),
			nextNewLineAfterImport = moduleFileContent.indexOf('\n',lastImportStatementIndex),
			importStatements = '\nimport "./'+componentTs.replace('.ts','') + '";\n' + 'import "./'+componentService.replace('.ts','')+'";';
		//add the import statements
		moduleFileContent = s.insert(moduleFileContent,nextNewLineAfterImport,importStatements);

		//add the child routes in the table module
		let childrenRoutesIndex = moduleFileContent.match(/children\s*:\s*\[/).index,
			routeClosingBracketIndex = moduleFileContent.indexOf(']',childrenRoutesIndex),
			lastRouteClosingBracketIndex = moduleFileContent.lastIndexOf('}',routeClosingBracketIndex),
			isCommaAfterLastClosing = moduleFileContent.indexOf(',',lastRouteClosingBracketIndex)>-1 && moduleFileContent.indexOf(',',lastRouteClosingBracketIndex)<routeClosingBracketIndex,
			crudRoute = "{\n"+
				"\tpath: '"+moduleNamePlural+"',\n"+
				"\tcomponent: "+componentName+"\n"+
			"\t}";
		crudRoute = !isCommaAfterLastClosing?(',\n'+crudRoute):crudRoute;
		moduleFileContent = s.insert(moduleFileContent,routeClosingBracketIndex,crudRoute);

		//add the route component that to be imported
		let tablesComponentIndex = moduleFileContent.lastIndexOf('TablesComponent,');
		moduleFileContent = s.insert(moduleFileContent,tablesComponentIndex+16,'\n  '+componentName+',');
		
		//add the providers 
		let providersIndex = moduleFileContent.indexOf('providers:');
		//if there is no providers specified then add the provider with data service file
		if(providersIndex==-1){
			let ngModuleIndex = moduleFileContent.indexOf('@NgModule'),
				lastBracket = moduleFileContent.indexOf('}',ngModuleIndex),
				lastModulePropertyBracketIndex = moduleFileContent.lastIndexOf(']',lastBracket),
				hasLastComma = moduleFileContent.charAt(lastModulePropertyBracketIndex+1)==',',
				providers = "\n  providers:[DataService]";
			providers = !hasLastComma ?(','+providers) : providers;
			lastModulePropertyBracketIndex = hasLastComma ? lastModulePropertyBracketIndex+1 :lastModulePropertyBracketIndex;
			moduleFileContent = s.insert(moduleFileContent,lastModulePropertyBracketIndex+1,providers);
			//add the import statements for the data service
			lastImportStatementIndex = moduleFileContent.lastIndexOf('import ');
			nextNewLineAfterImport = moduleFileContent.indexOf('\n',lastImportStatementIndex);
			importStatements = '\nimport "./data.service";';
			moduleFileContent = s.insert(moduleFileContent,nextNewLineAfterImport,importStatements);
			this.fs.copyTpl(
				this.templatePath('data.service.ts'),
				this.destinationPath(`src/app/pages/tables/data.service.ts`)
			);
		}
		//add the service name in providers
		let dataServiceIndex = moduleFileContent.indexOf('[DataService'),
			insertService = ','+ModuleNameSingular+'Service';
		moduleFileContent = s.insert(moduleFileContent,dataServiceIndex+12,insertService);

		this.fs.write(
			this.destinationPath(`src/app/pages/tables/tables-routing.module.ts`),
			moduleFileContent
		);
		console.log(moduleFileContent);
	}
};