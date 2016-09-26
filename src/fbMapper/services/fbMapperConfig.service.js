export default class fbMapperConfig {
    /*@ngInject*/
    constructor($log, $q, $resource) {
        this.log = $log;
        this.elementMap = {};
        this.compositionMap = {};
        this.qApi = $q;
        this.resource = $resource;
    }

    setElement(element) {
        this.elementMap[element.name] = element;
        return this.elementMap[element.name];
    }

    setComposition(composition) {
        let newElements = [];
        _.forEach(composition.elements, (element) => {
            var elem;
            if (typeof(element) === "string") {
                let e = this._getElement(element);
                elem = e.defaultComposition();
            } else {
                elem = this._getElement(element.name);
            }
            newElements.push(elem);
        });

        let newComp = composition;
        newComp.elements = newElements;

        this.compositionMap[composition.name] = newComp;
        return this.compositionMap[composition.name];
    }

    getComposition(compositionName) {
        return this.compositionMap[compositionName];
    }

    _getElement(elementName) {
        return this.elementMap[elementName];
    }

    getElementByComposition(elementPath) {
        //if is Lookup, get values
        let pathArray = elementPath.split('.');
        let composition = this.getComposition(pathArray[0]);
        let element = _.find(composition.elements, (e) => { return e.name == pathArray[1] });
        let elementIdx = _.findIndex(composition.elements, (e) => { return e.name == element.name });

        //is the composition and the element registered?
        if (composition != null && composition != undefined && element != null && element != undefined) {
            if (!_.has(element.body, 'lookupData')) {
                if (_.has(element.body.model, 'lookup')) {
                    return this._setLookupValues(element.body).then((lookupArray) => {
                        element.body.lookupData = lookupArray;
                        composition.elements[elementIdx].body.lookupData = lookupArray;
                        return composition.elements[elementIdx];
                    });
                }
            }
            var deferred = this.qApi.defer();
            deferred.resolve(composition.elements[elementIdx]);
            return deferred.promise;

        } else {
            this.log.error("Composition + Element combination do not exist");
            return undefined;
        }
    }

    _setLookupValues(lookupElement) {
        let lookupValues = [];
        return this._getLookupValues(lookupElement.model.lookup.location);
    }

    _getLookupValues(path) {
        return this.resource('localhost:3000' + path)
            .query().$promise;
    }
}
