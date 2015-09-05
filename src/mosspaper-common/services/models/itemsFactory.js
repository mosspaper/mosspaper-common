angular
    .module('mosspaperCommon.services')
    .factory('itemsManager', function ($http, $q, itemsAPIService) {

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
    });