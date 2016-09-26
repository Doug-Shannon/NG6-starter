export default class FBComposerController {
  /*@ngInject*/
  constructor(fbMapperConfig, fbMapperService, $log, $rootScope, $q) {
    this.fbMapperConfig = fbMapperConfig;
    this.rootScope = $rootScope;
    this.fbMapperService = fbMapperService;
    this.log = $log;
    this.qApi = $q;
    this.invokedFields = _.isFunction(this.fields) ? this.fields() : this.fields;
    this.log.debug(this);
    this.prePopulationComplete = false;
  }

  $onInit() {
    this.prepareForm(this.invokedFields)
      .then((form) => {
        this.preparedFields = form.fields;
        this.model = form.model;
      });
  }

  prepareForm(builderFields) {
    let form = {
      model: {},
      fields: []
    };
    let compositions = _.uniq(_.map(builderFields, (field) => { return field.mapperSuperPath.split('.')[0] }));
    let formBuildingOperations = [
      this._prepareFields(builderFields),
      this._prepareModel(builderFields, compositions)
    ]
    return this.qApi.all(formBuildingOperations)
      .then((dataArray) => {
        form.fields = dataArray[0];
        form.model = dataArray[1];
        return form;
      })
      .catch((err) => {
        throw (err);
      });
  }

  _prepareModel(builderFields, compositions) {
    let prepareModel = {};
    return this.fbMapperService.prepopulateCompositions(compositions)
      .then((data) => {
        prepareModel = data;
        let unPopulate = _.where(builderFields, { prePopulate: false });
        _.forEach(unPopulate, (field) => {
          _.set(prepareModel, field.formlyConfig.key, undefined);
        });
        return prepareModel;
      });
  }

  _prepareFields(builderFields) {
    let fields = [];
    _.forEach(builderFields, (builderField) => {
      let field = builderField.formlyConfig;
      field.key = builderField.mapperSuperPath;
      // Generate formly fields object
      let fieldPromise = this.fbMapperConfig.getElementByComposition(field.key)
        .then((mapperConfigElement) => {
          if (_.has(mapperConfigElement.body, 'lookupData')) {
            field.templateOptions.options = mapperConfigElement.body.lookupData;
            field.templateOptions.labelProp = mapperConfigElement.body.model.lookup.labelProp;
            field.templateOptions.valueProp = mapperConfigElement.body.model.lookup.valueProp;
          }

          if (_.has(mapperConfigElement, 'alias')) {
            //replace the last . piece in the chain with the alias
            field.key = field.key.substring(0, _.lastIndexOf(field.key, '.') + 1) + mapperConfigElement.alias;
          }

          return field;
        });
      fields.push(fieldPromise);
    });
    return this.qApi.all(fields);
  }

  _prepareValidation(field, validations) {

  }

  submit() {
    try {
      var promise = this.fbMapperService.saveFormlyFormData(this.model)
        .then((data) => {
          this.log.debug(this.model);
        })
    }
    catch (error) {
      throw (error);
    }
  }


}