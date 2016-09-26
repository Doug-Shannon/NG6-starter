export default class fbMapperService {
    /*@ngInject*/
    constructor(fbMapperConfig, $log, $resource, $q, api) {
        this.log = $log;
        this.resource = $resource;
        this.fbMapperConfig = fbMapperConfig;
        this.qApi = $q;
        this.api = api;
    }

    saveFormlyFormData(model) {
        let promise = this.resource(this.api.saveUrl)
            .save({}, model).$promise;
        return promise.then(() => {
            this.log.debug("Formly Service save endpoint returned");
        }, (err) => {
            throw err;
        });
    }

    //This takes an array of composition Names
    prepopulateCompositions(compositions) {
        let returnModel = {};
        let promises = [];
        _.forEach(compositions, (compositionName) => {
            let composition = this.fbMapperConfig.getComposition(compositionName);
            promises.push(composition.prePopulate.get().$promise);
        });
        return this.qApi.all(promises).then((data)=>{
            _.forEach(data, (compositionData, index)=> {
                returnModel[compositions[index]] = compositionData;
            });
            return returnModel;
        })
        .catch((err)=> {
            return returnModel;
        });
    }
}