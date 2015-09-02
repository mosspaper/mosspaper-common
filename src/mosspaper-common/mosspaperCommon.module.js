(function (angular) {

    // Create all modules and define dependencies to make sure they exist
    // and are loaded in the correct order to satisfy dependency injection
    // before all nested files are concatenated by Gulp
    angular.module('mosspaperCommon', []);

    // Config
    angular.module('mosspaperCommon.config', [])
        .value('mosspaperCommon.config', {
            debug: true
        });

    // Modules
    angular.module('mosspaperCommon.directives', []);
    angular.module('mosspaperCommon.filters', []);
    angular.module('mosspaperCommon.services', []);
    angular.module('mosspaperCommon',
        [
            'mosspaperCommon.config',
            'mosspaperCommon.directives',
            'mosspaperCommon.filters',
            'mosspaperCommon.services',
            'ngResource',
            'ngCookies',
            'ngSanitize'
        ]);

})(angular);
