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