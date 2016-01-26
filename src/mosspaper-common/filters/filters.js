angular.module('mosspaperCommon.filters', [])
    .filter('ago', function () {
        return function (input) {
            var m = moment(input);
            if (m.isValid()) {
                return m.fromNow();
            } else {
                return input;
            }
        };
    })
    .filter('percentage', function ($filter) {
        return function (input, decimals) {
            return $filter('number')(input, decimals) + '%';
        };
    })
    .filter('capitalize', function () {
        return function (input, scope) {
            if (input) {
                input = input.toLowerCase();
                return input.substring(0, 1).toUpperCase() + input.substring(1);
            } else {
                return input;
            }
        };
    })
    .filter('propertiesFilter', function (Utils) {

        var filterFunction = function (items, props) {
            var out = [];

            if (angular.isArray(items) && !Utils.isObjectValuesEmpty(props)) {
                items.forEach(function (item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        if (props[prop]) {
                            var text = props[prop].toLowerCase();
                            if (item[prop] && item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                                itemMatches = true;
                                break;
                            }
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };


        return filterFunction;

    });