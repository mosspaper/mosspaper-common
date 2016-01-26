angular
    .module('mosspaperCommon.services')
    .factory('NotificationFactory', function ($http, $rootScope, $q, notificationAPIService, UPDATE_NOTIFICATIONS_EVENT, Utils) {
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

    });