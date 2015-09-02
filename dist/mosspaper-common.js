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

angular.module('mosspaperCommon.services')
    .factory('Utils', function ($q) {
        return {
            isImage: function (src) {
                var deferred = $q.defer();

                var image = new Image();
                image.onerror = function () {
                    deferred.resolve(false);
                };
                image.onload = function () {
                    deferred.resolve(true);
                };
                image.src = src;

                return deferred.promise;
            },
            isImageExt: function (filename) {
                return filename.match(/\.(jpg|jpeg|png|gif)$/) !== null;
            },
            isEmpty: function (obj) {
                // null and undefined are "empty"
                if (obj === null) {
                    return true;
                }

                // Assume if it has a length property with a non-zero value
                // that that property is correct.
                if (obj.length > 0) {
                    return false;
                }
                if (obj.length === 0)  {
                    return true;
                }

                // Otherwise, does it have any properties of its own?
                // Note that this doesn't handle
                // toString and valueOf enumeration bugs in IE < 9
                for (var key in obj) {
                    if (hasOwnProperty.call(obj, key)) {
                        return false;
                    }
                }

                return true;
            },
            isObjectValuesEmpty: function (obj) {
                // Otherwise, does it have any properties of its own?
                // Note that this doesn't handle
                // toString and valueOf enumeration bugs in IE < 9
                for (var key in obj) {
                    if (obj[key] === undefined || obj[key] === ''){
                       return true;
                    }
                }

                return false;
            },
            getIndexOf: function (arr, val, prop) {
                if (arr) {
                    var l = arr.length, k = 0;
                    for (k = 0; k < l; k = k + 1) {
                        if (arr[k][prop] === val) {
                            return k;
                        }
                    }
                }
                return false;
            },
            getIndexOfMultiArray: function (arr, val, valueIndex) {
                if (arr) {
                    var l = arr.length, k = 0;
                    for (k = 0; k < l; k = k + 1) {
                        if (arr[k][valueIndex] === val) {
                            return k;
                        }
                    }
                }
                return false;
            },
            // checks if objects is contained in an array
            contains: function (arr, obj) {
                var i = arr.length;
                while (i--) {
                    if (arr[i] === obj) {
                        return true;
                    }
                }
                return false;
            },
            // checks if objects is contained in an array
            containsByProperty: function (arr, obj, property) {
                var i = arr.length;
                while (i--) {
                    if (arr[i][property] === obj) {
                        return true;
                    }
                }
                return false;
            },
            // creates union of two arrays
            mergeByProperty: function (sourceArr, newArr, property) {
                if (sourceArr && newArr) {
                    var union = sourceArr.concat(newArr);
                    for (var i = 0; i < union.length; ++i) {
                        for (var j = i + 1; j < union.length; ++j) {
                            if (union[i][property] === union[j][property]) {
                                union.splice(j--, 1);
                            }
                        }
                    }
                    return union;
                } else {
                    return sourceArr;
                }
            },
            // update an object in an array
            updateByProperty: function (arr, obj, property) {
                if (arr) {
                    for (var i = arr.length - 1; i >= 0; i--) {
                        if (arr[i][property] === obj[property]) {
                            arr[i] = obj;
                            return false;
                        }
                    }
                } else {
                    return false;
                }
            },
            // removes an object from an array
            remove: function (arr, obj) {
                var index = arr.indexOf(obj);
                if (index !== -1) {
                    arr.splice(index, 1);
                }
            },
            // removes an object from an array
            removeByProperty: function (arr, obj, property) {
                if (arr) {
                    for (var i = arr.length - 1; i >= 0; i--) {
                        if (arr[i][property] === obj[property]) {
                            arr.splice(i, 1);
                        }
                    }
                }
            },
            // removes an object from an array
            removeByPropertyFromMultiArray: function (arr, obj, property) {
                if (arr) {
                    var letter = obj['name'].charAt(0).toUpperCase();
                    var childArr = arr[letter];
                    if (childArr) {
                        for (var j = childArr.length - 1; j >= 0; j--) {
                            if (childArr[j][property] === obj[property]) {
                                childArr.splice(j, 1);
                            }
                        }
                    }
                }
            },
            getFileName: function (url) {
                return url.substr(url.lastIndexOf('/') + 1); //url.replace(/^.*[\\\/]/, '');
            },
            getQueryParameters: function (str) {
                return (str).replace(/(^\?)/, '').split('&').map(function (n) {
                    return n = n.split('='), this[n[0]] = n[1], this;
                }.bind({}))[0];
            },
            isBase64: function (str) {
                var match = new RegExp('^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$');
                return match.test(str);
            },
            uuid: function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }
        };
    });

