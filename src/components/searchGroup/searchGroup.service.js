/**
 * apachesolrAngularjsSearch searchGroupService factory.
 *
 * This factory is used for interacting with search groups.
 */

(function () {
  'use strict';

  function searchGroupService($resource) {

    var groups = $resource('/apachesolr-angularjs-search/search-group/:id', {
      id: '@id'
    },
    {
      save: {
        method: 'POST',
      },
      update: {
        method: 'PUT',
      },
      index: {
        method: 'GET',
        isArray: true,
      },
      get: {
        method: 'GET',
        params: {
          id: 0
        }
      },
    });

    function saveGroup(group) {
      return groups.save({group: group}).$promise;
    }

    function updateGroup(group) {
      return groups.update({group: group}).$promise;
    }

    function getGroups() {
      return groups.index().$promise;
    }

    function getGroup(groupId) {
      return groups.index(groupId).$promise;
    }

    return {
      saveGroup: saveGroup,
      updateGroup: updateGroup,
      getGroups: getGroups,
      getGroup: getGroup
    };
  }

  angular.module('apachesolrAngularjsSearch').factory('searchGroupService', ['$resource', searchGroupService]);
})();
