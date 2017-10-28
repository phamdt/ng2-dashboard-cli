let Generator = require('yeoman-generator'),
	s = require('underscore.string'),
	_ = require('lodash'),
	path = require('path'),
	chalk = require('chalk'),
	fs = require('fs'),
	mockFolderName = 'mocks';


module.exports = class extends Generator {
	// The name `constructor` is important here
	constructor(args, opts) {
		// Calling the super constructor is important so our generator is correctly set up
		super(args, opts);
		this.argument('jsonFileNames', { type: String, required: false });
		this.jsonFileNames = this.options.jsonFileNames || '';
		this.isFromMockFolder = false;
		if(!this.jsonFileNames || this.jsonFileNames==mockFolderName || this.jsonFileNames=='./'+mockFolderName){
			let mockFolder = this.destinationPath('./'+mockFolderName);
			this.jsonFileNames = [];
			if(fs.existsSync(mockFolder)){
				console.log(chalk.bold.yellow('Looking for mocks folder for json files...'));
				fs.readdirSync(mockFolder).forEach(file => {
					if(file.endsWith('.json')){
						this.jsonFileNames.push(mockFolderName+'/'+file);
					}
				});
			}
		} else {
			this.jsonFileNames = this.jsonFileNames.split(',');
		}
	}

	createCrudModules(){
		if(!this.jsonFileNames.length){
			console.log(chalk.bold.red('Please provide json file.'));
		} else {
			this.jsonFileNames.forEach((jsonFileName)=>{
				let moduleName = jsonFileName.replace('.json','').replace(mockFolderName+'/','');
				moduleName = s.camelize(s.slugify(s.humanize(moduleName)));
				console.log(chalk.bold.yellow('Processing json file '+jsonFileName+' ...'));
				this._createCrudModule(moduleName,jsonFileName);
			})
		}
	}

	_createCrudModule(moduleName,jsonFileName){
		//validate file
		if(!moduleName){
			console.log(chalk.bold.red('Please provide module name.'));
			return;
		}
		if(!this.fs.exists(jsonFileName)){
			console.log(chalk.bold.red(`${jsonFileName} file does not exist.`));
			return;
		}
		let jsonContent = this.fs.readJSON(jsonFileName);
		if(!_.get(jsonContent,'response.data.length')){
			console.log(chalk.bold.red('Please provide valid JSON file.'));
			return;
		}
		let fields = _.get(jsonContent,'response.data[0]');
		if(!_.isPlainObject(fields)){
			console.log(chalk.bold.red('Please provide valid JSON file.'));
			return;
		}
		if(fs.existsSync(this.destinationPath('src/app/pages/tables/'+moduleName+'s'))){
			console.log(chalk.bold.red('Module already exists.'));
			return;
		}
		let fieldKeys = _.keys(fields);
		fields = {};
		_.each(fieldKeys,(field)=>fields[field] = {title:field,type:'string'});
		fields = JSON.stringify(fields,null,4);
		fields = _.replace(fields,new RegExp('\n','g'),"\n\t\t");

		//Add component file
		let moduleNameSingular = moduleName, //singular crud name
			moduleNamePlural = moduleName+'s', //plural crud name
			ModuleNameSingular = s.capitalize(moduleName),   //singular crud name capital case
			ModuleNamePlural =  s.capitalize(moduleName)+'s', //plural crud name capital case
			componentName = ModuleNameSingular+'Component',
			serviceName =  ModuleNameSingular+'Service',
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
		this.fs.copyTpl(
			this.templatePath('table-paging.component.ts'),
			this.destinationPath(`src/app/pages/tables/table-paging.component.ts`),
			replaceVariables
		);

		//update the file entries in the table-routing.module.ts file
		let moduleFileContent  = this.fs.read(this.destinationPath(`src/app/pages/tables/tables-routing.module.ts`)),
			lastImportStatementIndex = moduleFileContent.lastIndexOf('import '),
			nextNewLineAfterImport = moduleFileContent.indexOf('\n',lastImportStatementIndex),
			importStatements = '\nimport { ' +componentName +' } from "./'+componentTs.replace('.ts','') + '";\n' + 'import {'+serviceName+'} from "./'+componentService.replace('.ts','')+'";',
			hasTablePagingComponent = true;
		if(moduleFileContent.indexOf('TablePagingComponent')===-1){ //add the table paging component if not added
			importStatements = '\nimport {TablePagingComponent} from \'./table-paging.component\';\n'+ importStatements;
			hasTablePagingComponent = false;
		}
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
		if(!hasTablePagingComponent){ //add the table paging component if not added
			moduleFileContent = s.insert(moduleFileContent,tablesComponentIndex+16,'\n  TablePagingComponent,');
		}
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
			importStatements = '\nimport {DataService} from "./data.service";';
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
	}
};