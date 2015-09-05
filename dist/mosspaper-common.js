(function (angular) {

    // Create all modules and define dependencies to make sure they exist
    // and are loaded in the correct order to satisfy dependency injection
    // before all nested files are concatenated by Gulp

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

angular.module('mosspaperCommon.services', [])
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


/**
 * Services to get Contract data. This service extends the quoteService as the behaviors are
 * nearly identical.
 * this is basically a clone of quoteServices but calls a different endpoint
 */
angular
    .module('mosspaperCommon.services')
    .service('contractsAPIService', function ($http, API_SERVER) {

        var urlBase = API_SERVER + 'contracts';

        /** TODO: prefer to do service inheritance here but didn't work **/
        this.getURLBase = function () {
            return urlBase;
        };

        this.getQuotes = function (params) {
            return $http.get(this.getURLBase() + '/', {params: params});
        };

        this.getQuoteDetails = function (id, action) {
            var queryParams = '';
            if (action) {
                queryParams = '?action=' + action;
            }

            return $http.get(this.getURLBase() + '/' + id + queryParams + '/');
        };

        this.getQuoteDS = function (uuid) {
            return $http.get(this.getURLBase() + '/signature/' + uuid + '/');
        };

        this.getQuoteHistory = function (uuid) {
            return $http.get(this.getURLBase() + '/history/' + uuid + '/');
        };

        this.exitQuoteDetails = function (uuid, action) {
            return $http.put(this.getURLBase() + '/exit/' + uuid + '?action=' + action);
        };

        this.insertQuote = function (quote) {
            return $http.post(this.getURLBase() + '/', quote);
        };

        this.updateQuote = function (uuid, quote) {
            return $http.put(this.getURLBase() + '/' + uuid + '/', quote);
        };

        this.resendQuote = function (uuid) {
            return $http.post(this.getURLBase() + '/resend/' + uuid + '/');
        };

        this.saveQuote = function (uuid) {
            return $http.put(this.getURLBase() + '/save/' + uuid + '/');
        };

        this.confirmQuote = function (uuid) {
            return $http.put(this.getURLBase() + '/confirm/' + uuid + '/');
        };

        this.getComments = function (uuid) {
            return $http.get(this.getURLBase() + '/comment/' + uuid + '/');
        };

        this.addQuoteComment = function (uuid, data) {
            return $http.post(this.getURLBase() + '/comment/' + uuid + '/', data);
        };

        this.deleteComment = function (uuid, data) {
            return $http.post(this.getURLBase() + '/comment/delete/' + uuid + '/', data);
        };

        this.deleteQuote = function (uuid) {
            return $http.delete(this.getURLBase() + '/' + uuid + '/');
        };

        this.approveQuote = function (uuid, data) {
            return $http.post(this.getURLBase() + '/approve/' + uuid + '/', data);
        };

        this.deleteDocument = function (uuid) {
            return $http.delete(this.getURLBase() + '/document/' + uuid + '/');
        };

        this.requestPayment = function (uuid, data) {
            return $http.post(this.getURLBase() + '/payment/' + uuid + '/', data);
        };

        this.recordPayment = function (uuid, data) {
            return $http.post(urlBase + '/payment/record/' + uuid + '/', data);
        };

        // request quotes
        this.getQuoteRequests = function (params) {
            return $http.get(this.getURLBase() + '/requests', {params: params});
        };
//
//    this.deletePayment = function (uuid, params) {
//        return $http.delete(urlBase + '/payment/' + uuid + '/', {params: params});
//    }

        /** CONTRACT SPECIFIC **/
        this.cloneContract = function (uuid) {
            return $http.post(urlBase + '/clone/' + uuid + '/');
        };

        this.getPayment = function (uuid) {
            return $http.get(urlBase + '/payment/' + uuid + '/');
        };

        this.terminate = function (uuid) {
            return $http.post(urlBase + '/terminate/' + uuid + '/');
        };

        this.getEmailPreview = function (uuid) {
            return $http.get(this.getURLBase() + '/email/preview/' + uuid + '/');
        };

        this.getEndingContracts = function (params) {
            return $http.get(this.getURLBase() + '/ending', {params: params});
        };

        /** Analytics **/
        this.getContractCount = function (params) {
            return $http.get(this.getURLBase() + '/count/added/', {params: params});
        };

        this.getContractCountByTimeframe = function (params) {
            return $http.get(this.getURLBase() + '/count/', {params: params});
        };

        this.getApprovalRating = function () {
            return $http.get(this.getURLBase() + '/approval/percentage');
        };

        this.getStatusCount = function (params) {
            return $http.get(this.getURLBase() + '/status/count/', {params: params});
        };

        this.getAvgAmt = function () {
            return $http.get(this.getURLBase() + '/stats/average/');
        };

        this.getExpiringContracts = function (params) {
            return $http.get(this.getURLBase() + '/expiring', {params: params});
        };


    });
/////////////////////////////////////////////////////////
// Product and Category Services
/////////////////////////////////////////////////////////
angular
    .module('mosspaperCommon.services')
    .service('itemsService', function ($http, API_SERVER) {
        var urlBase = API_SERVER + 'products';

        this.getCategories = function () {
            return $http.get(urlBase + '/category/');
        };

        this.insertCategory = function (data) {
            return $http.post(urlBase + '/category/', data);
        };

        this.updateCategory = function (id, data) {
            return $http.put(urlBase + '/category/' + id + '/', data);
        };

        this.deleteCategory = function (id) {
            return $http.delete(urlBase + '/category/' + id + '/');
        };

        this.insertProduct = function (data) {
            return $http.post(urlBase + '/', data);
        };

        this.updateProduct = function (id, data) {
            return $http.put(urlBase + '/' + id + '/', data);
        };

        this.deleteProduct = function (id) {
            return $http.delete(urlBase + '/' + id + '/');
        };

        /* data is a list of product ids*/
        this.deleteProducts = function (data) {
            return $http.post(urlBase + '/delete/', data);
        };

        this.getProducts = function (params) {
            return $http.get(urlBase + '/', {params: params});
        };

        this.getProduct = function (id) {
            return $http.get(urlBase + '/' + id + '/');
        };

        this.getProductsCount = function () {
            return $http.get(urlBase + '/?count=true');
        };

        this.getProductsByType = function (type) {
            return $http.get(urlBase + '/type/?type=' + type);
        };

        this.getProductTypeCount = function () {
            return $http.get(urlBase + '/type/?count=true');
        };

        this.exportCSV = function () {
            return $http.get(urlBase + '/csv');
        };

        this.saveMappedProductCSV = function (data) {
            return $http.put(urlBase + '/csv/', data);
        };

        /** analytics **/
        this.getTopItems = function (params) {
            return $http.get(urlBase + '/top', {params: params});
        };

    });
// Services to get Quote data
angular
    .module('mosspaperCommon.services')
    .service('quoteAPIService', function ($http, API_SERVER) {

        var urlBase = API_SERVER + 'quotes';

        this.getURLBase = function () {
            return urlBase;
        };

        this.getQuotes = function (params) {
            return $http.get(this.getURLBase() + '/', {params: params});
        };

        this.getQuoteDetails = function (id, action) {

            var queryParams = '';
            if (action) {
                queryParams = '?action=' + action;
            }
            return $http.get(this.getURLBase() + '/' + id + queryParams + '/');
        };

        this.getQuoteDS = function (uuid) {
            return $http.get(this.getURLBase() + '/signature/' + uuid + '/');
        };

        this.getQuoteHistory = function (uuid) {
            return $http.get(this.getURLBase() + '/history/' + uuid + '/');
        };

        this.exitQuoteDetails = function (uuid, action) {
            return $http.put(this.getURLBase() + '/exit/' + uuid + '?action=' + action);
        };

        this.insertQuote = function (quote) {
            return $http.post(this.getURLBase() + '/', quote);
        };

        this.updateQuote = function (uuid, quote) {
            return $http.put(this.getURLBase() + '/' + uuid + '/', quote);
        };

        this.resendQuote = function (uuid) {
            return $http.post(this.getURLBase() + '/resend/' + uuid + '/');
        };

        this.saveQuote = function (uuid) {
            return $http.put(this.getURLBase() + '/save/' + uuid + '/');
        };

        this.confirmQuote = function (uuid) {
            return $http.put(this.getURLBase() + '/confirm/' + uuid + '/');
        };

        this.getComments = function (uuid) {
            return $http.get(this.getURLBase() + '/comment/' + uuid + '/');
        };

        this.addQuoteComment = function (uuid, data) {
            return $http.post(this.getURLBase() + '/comment/' + uuid + '/', data);
        };

        this.deleteComment = function (uuid, data) {
            return $http.post(this.getURLBase() + '/comment/delete/' + uuid + '/', data);
        };

        this.deleteQuote = function (uuid) {
            return $http.delete(this.getURLBase() + '/' + uuid + '/');
        };

        this.approveQuote = function (uuid, data) {
            return $http.post(this.getURLBase() + '/approve/' + uuid + '/', data);
        };

        this.getEmailPreview = function (uuid) {
            return $http.get(this.getURLBase() + '/email/preview/' + uuid + '/');
        };

        this.deleteDocument = function (uuid) {
            return $http.delete(this.getURLBase() + '/document/' + uuid + '/');
        };

        this.getPayment = function (uuid) {
            return $http.get(this.getURLBase() + '/payment/' + uuid + '/');
        };

        this.requestPayment = function (uuid, data) {
            return $http.post(this.getURLBase() + '/payment/' + uuid + '/', data);
        };

        this.recordPayment = function (uuid, data) {
            return $http.post(this.getURLBase() + '/payment/record/' + uuid + '/', data);
        };

        this.deletePayment = function (uuid, params) {
            return $http.delete(urlBase + '/payment/' + uuid + '/', {params: params});
        };

        /** Analytics **/
        this.getQuoteCountByTimeframe = function (params) {
            return $http.get(this.getURLBase() + '/count/', {params: params});
        };

        this.getQuoteCount = function (params) {
            return $http.get(this.getURLBase() + '/count/added/', {params: params});
        };

        this.getApprovalRating = function () {
            return $http.get(this.getURLBase() + '/approval/percentage');
        };

        this.getStatusCount = function (params) {
            return $http.get(this.getURLBase() + '/status/count/', {params: params});
        };

        this.getAvgAmt = function () {
            return $http.get(this.getURLBase() + '/stats/average/');
        };

        // request quotes
        this.getQuoteRequests = function (params) {
            return $http.get(this.getURLBase() + '/requests/', {params: params});
        };

        this.getQuoteRequest = function (uuid) {
            return $http.get(this.getURLBase() + '/requests/' + uuid + '/');
        };

        this.getQuoteRequestCount = function () {
            return $http.get(this.getURLBase() + '/requests/count/');
        };

        this.deleteQuoteRequest = function (data) {
            return $http.post(this.getURLBase() + '/requests/delete/', data);
        };

    });
