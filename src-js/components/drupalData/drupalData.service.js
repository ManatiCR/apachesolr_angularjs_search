/**
 * apachesolrAngularjsSearch drupalDataService factory.
 *
 * This factory is used for managing data that comes from Drupal settings.
 */

(function () {
  'use strict';

  angular.module('apachesolrAngularjsSearch').factory('drupalDataService', drupalDataService);

  function drupalDataService($rootScope) {
    var data = {};

    function setDrupalData(newData) {
      data = newData;
      $rootScope.$emit('drupalDataReady');
    }

    function getDrupalData() {
      return data;
    }

    return {
      setDrupalData: setDrupalData,
      getDrupalData: getDrupalData
    };
  }
})();
