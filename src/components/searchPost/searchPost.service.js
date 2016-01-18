/**
 * apachesolrAngularjsSearch drupalDataService factory.
 *
 * This factory is used for sending search form info to Drupal.
 */

(function () {
  'use strict';

  angular.module('apachesolrAngularjsSearch').factory('searchPostService', ['$resource', searchPostService]);

  function searchPostService($resource) {

    var search = $resource('/apachesolr-angularjs-search', null,
    {
      send: {
        method: 'POST',
      }
    });

    function sendSearch(groups, limitBy, pageId) {
      return search.send({groups: groups, limitBy: limitBy, pageId: pageId}).$promise;
    }

    return {
      sendSearch: sendSearch
    };
  }
})();
