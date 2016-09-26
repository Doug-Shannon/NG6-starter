import angular from 'angular-fix'

const ngModuleName = 'formlyBuilder';

import fbMapperService from './fbMapper/services/fbMapper.service';
import fbMapperConfig from './fbMapper/services/fbMapperConfig.service';
import fbComposerComponent from './fbComposer/fbComposer.component';
import ngResource from 'angular-resource';

export default ngModuleName

const ngModule = angular.module(ngModuleName, [ngResource])

    ngModule
    .service('fbMapperConfig', fbMapperConfig)
    .service('fbMapperService', fbMapperService)
    .component('fbComposer', fbComposerComponent());
