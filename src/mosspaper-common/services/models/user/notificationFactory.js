angular
    .module('mosspaperCommon.services')
    .factory('NotificationFactory', function ($http, $q, notificationAPIService) {

        var notificationFactory = {

            fetchAll: function () {
                var deferred = $q.defer();

                notificationAPIService.getNotifcations()
                    .success(function (items) {
                        deferred.resolve(items);
                    })
                    .error(function () {
                        deferred.reject();
                    });

                return deferred.promise;
            },
            deleteNotification: function (notificationId) {
                var deferred = $q.defer();

                notificationAPIService.deleteNotifiction(notificationId)
                    .success(function (items) {
                        deferred.resolve(items);
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
                    })
                    .error(function () {
                        deferred.reject();
                    });
                return deferred.promise;
            },
        };

        return notificationFactory;

    });