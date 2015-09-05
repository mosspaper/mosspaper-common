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