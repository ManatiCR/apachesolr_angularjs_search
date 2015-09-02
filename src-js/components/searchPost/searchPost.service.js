/**
 * apachesolrAngularjsSearch drupalDataService factory.
 *
 * This factory is used for sending search form info to Drupal.
 */

(function () {
  'use strict';

  angular.module('apachesolrAngularjsSearch').factory('searchPostService', searchPostService);

  function searchPostService($resource) {

    var search = $resource('/apachesolr-angularjs-search', null,
    {
      send: {
        method: 'POST',
      }
    });

    function sendSearch(groups, pageId) {
      return search.send({groups: groups, pageId: pageId}).$promise;
    }

    return {
      sendSearch: sendSearch
    };
  }
})();
