(function (angular) {
    'use strict';
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
    angular.module('mosspaperCommon.constants', []);
    angular.module('mosspaperCommon.events', []);
    angular.module('mosspaperCommon',
        [
            'mosspaperCommon.config',
            'mosspaperCommon.events',
            'mosspaperCommon.constants',
            'mosspaperCommon.directives',
            'mosspaperCommon.filters',
            'mosspaperCommon.services',
            'ngResource',
            'ngCookies',
            'ngSanitize'
        ]);

})(angular);

angular.module('mosspaperCommon.constants', [])
    .value('APPLE_APP_ID', '1021413203')
    .value('GOOGLE_APP_ID', 'com.mosspaper.mobile3')
    .value('STATUS_DRAFT', 'S')
    .value('STATUS_APPROVED', 'A')
    .value('STATUS_ACTIVE', 'AC')
    .value('STATUS_PENDING', 'P')
    .value('STATUS_EXPIRING', 'PE')
    .value('STATUS_EXPIRED', 'E')
    .value('STATUS_REJECTED', 'R')
    .value('STATUS_INACTIVE', 'I');


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
    .filter('percentage', ["$filter", function ($filter) {
        return function (input, decimals) {
            return $filter('number')(input, decimals) + '%';
        };
    }])
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
    .filter('propertiesFilter', ["Utils", function (Utils) {

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

    }]);
angular.module('mosspaperCommon.events', [])
    .constant('UPDATE_NOTIFICATIONS_EVENT', 'notifications.update');
angular.module('mosspaperCommon.services', [])
    .factory('Utils', ["$q", function ($q) {
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
    }]);


/**
 * Services to get Contract data. This service extends the quoteService as the behaviors are
 * nearly identical.
 * this is basically a clone of quoteServices but calls a different endpoint
 */
angular
    .module('mosspaperCommon.services')
    .service('contractsAPIService', ["$http", "API_SERVER", function ($http, API_SERVER) {

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


    }]);
/////////////////////////////////////////////////////////
// Product and Category Services
/////////////////////////////////////////////////////////
angular
    .module('mosspaperCommon.services')
    .service('itemsAPIService', ["$http", "API_SERVER", function ($http, API_SERVER) {
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

    }]);
// Services to get Quote data
angular
    .module('mosspaperCommon.services')
    .service('quoteAPIService', ["$http", "API_SERVER", function ($http, API_SERVER) {

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

    }]);

/**
 * Created by cfong on 9/4/15.
 */

angular
    .module('mosspaperCommon.services')
    .factory('itemsManager', ["$http", "$q", "itemsAPIService", function ($http, $q, itemsAPIService) {

        var itemsManager = {
            _pool: {},
            _retrieveInstance: function (itemId, itemData) {
                var instance = this._pool[itemId];

                if (instance) {
                    instance.setData(itemData);
                } else {
                    //instance = new Item(itemData);
                    this._pool[itemId] = instance;
                }

                return instance;
            },
            _search: function (itemId) {
                return this._pool[itemId];
            },
            _load: function (itemId, deferred) {
                var scope = this;
                itemsAPIService.getProduct(itemId)
                    .success(function (itemData) {
                        var item = scope._retrieveInstance(itemData.id, itemData);
                        deferred.resolve(item);
                    })
                    .error(function () {
                        deferred.reject();
                    });
            },

            /* Use this function in order to get a book instance by it's id */
            getItem: function (itemId) {
                var deferred = $q.defer();
                var item = this._search(itemId);
                if (item) {
                    deferred.resolve(item);
                } else {
                    this._load(itemId, deferred);
                }
                return deferred.promise;
            },
            /* Public methods */
            fetchAll: function () {
                var deferred = $q.defer();
                var scope = this;

                var params = {};

                itemsAPIService.getProducts(params)
                    .success(function (itemsArray) {
                        var items = [];
                        itemsArray.forEach(function (itemData) {
                            var item = scope._retrieveInstance(itemData.id, itemData);
                            items.push(item);
                        });

                        deferred.resolve(items);
                    })
                    .error(function () {
                        deferred.reject();
                    });

                return deferred.promise;
            },
            /*  This function is useful when we got somehow the book data and we wish to store it or update the pool and get a book instance in return */
            setBook: function (itemData) {
                var scope = this;
                var item = this._search(itemData.id);
                if (item) {
                    item.setData(itemData);
                } else {
                    item = scope._retrieveInstance(itemData);
                }
                return item;
            },

        };

        return itemsManager;
    }]);
angular
    .module('mosspaperCommon.services')
    .service('notificationAPIService', ["$http", "API_SERVER", function ($http, API_SERVER) {

        var urlBase = API_SERVER + 'user/notification/';

        this.getNotifcations = function () {
            return $http.get(urlBase);
        };

        this.getNotifcationCount = function () {
            return $http.get(urlBase + '?count=true');
        };

        this.deleteNotifiction = function (id) {
            return $http.delete(urlBase + 'delete/' + id + '/');
        };

    }]);
angular
    .module('mosspaperCommon.services')
    .factory('NotificationFactory', ["$http", "$rootScope", "$q", "notificationAPIService", "UPDATE_NOTIFICATIONS_EVENT", "Utils", function ($http, $rootScope, $q, notificationAPIService, UPDATE_NOTIFICATIONS_EVENT, Utils) {
        this._items = [];

        var broadcast = function() {
            $rootScope.$emit(UPDATE_NOTIFICATIONS_EVENT, this._items);
        };

        var notificationFactory = {

            fetchAll: function (interval) {
                var deferred = $q.defer();
                if (this._items) {
                    console.log("get from cache")
                    deferred.resolve(this._items);
                } else {
                    notificationAPIService.getNotifcations()
                        .success(function (items) {
                            deferred.resolve(items);
                            this._items = items;
                            broadcast();
                        })
                        .error(function () {
                            deferred.reject();
                        });
                }

                return deferred.promise;
            },
            getNotifications: function() {
                return _items;
            },
            deleteNotification: function (notification) {
                var deferred = $q.defer();

                notificationAPIService.deleteNotifiction(notification.id)
                    .success(function () {
                        Utils.removeByProperty(this._items, notification, 'id');
                        deferred.resolve();
                        broadcast();
                    })
                    .error(function () {
                        deferred.reject();
                    });
                return deferred.promise;
            },
            deleteAll: function () {
                var deferred = $q.defer();

                notificationAPIService.deleteNotifiction('all')
                    .success(function (items) {
                        deferred.resolve(items);
                        this._items = [];
                        broadcast();
                    })
                    .error(function () {
                        deferred.reject();
                    });
                return deferred.promise;
            },
        };

        return notificationFactory;

    }]);