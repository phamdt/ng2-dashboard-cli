# Angular2 Dashboard Generator
> yeoman generators for creating Angular2 dashboards and components

## Usage
Install `yo`,`angular-cli` and dashboard genertor `generator-ng2-dashboard-generator`
```
npm install -g yo angular-cli generator-ng2-dashboard-generator
```

Clone the github project https://github.com/akveo/ngx-admin , go to that project and run the following command

Run `yo ng2-dashboard-generator` passing an json name of crud module
```
yo ng2-dashboard-generator [module-name].json
```

Run `yo ng2-dashboard-generator` passing more than one value with comma separator will add multiple crud modules
```
yo ng2-dashboard-generator [module-name].json,[module-name2].json
```

[Here](user.json) is the sample for adding the crud operation

[Here](https://github.com/dinesh36/test-api-server) is the API serer to get the data for the sample json file.

Run the ngx-admin server with `npm start`

Run the API server with `node index.js`