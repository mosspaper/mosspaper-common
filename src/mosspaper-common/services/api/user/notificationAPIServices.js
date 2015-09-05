angular
    .module('mosspaperCommon.services')
    .service('notificationAPIService', function ($http, API_SERVER) {

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

    });