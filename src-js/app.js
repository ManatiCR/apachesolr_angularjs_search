'use strict';

/**
 * @ngdoc overview
 * @name apachesolrAngularjsSearch
 * @description
 * # apachesolrAngularjsSearch
 *
 * Main module of the application.
 */

angular.module('apachesolrAngularjsSearch', ['ngCookies', 'ngResource', 'ngSanitize', 'ngTouch']);

(function () {
  Drupal.behaviors.apachesolrAngularjs = {
    attach: function(context) {
      jQuery('#advancedSearch', context).once('advancedSearch', function() {
        var fields = Drupal.settings.apachesolrAngularjs.fields;
        var pageId = Drupal.settings.apachesolrAngularjs.page_id;
        var data = {
          fields: fields,
          pageId: pageId
        }

        // We need to ensure dom is ready before getting this element.
        angular.element(document).ready(function() {
          var mainControllerElement = angular.element(document.getElementById('mainController'));
          var drupalDataFactory = mainControllerElement.injector().get('drupalDataFactory');
          drupalDataFactory.setDrupalData(data);
          mainControllerElement.scope().$apply();
        });
      });
    }
  }
})();

angular.module('apachesolrAngularjsSearch').factory('drupalDataFactory', function($rootScope) {
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
});

angular.module('apachesolrAngularjsSearch').controller('mainController', function($scope, $rootScope, drupalDataFactory) {
  $rootScope.$on('drupalDataReady', function() {
    // Unbind the event.
    var mainDiv = angular.element(document.getElementById('mainController'));
    angular.element(mainDiv).unbind('drupalDataReady');

    var data = drupalDataFactory.getDrupalData();
    var fields = data.fields;
    var pageId = data.pageId;

    var field;
    for (field in fields) {
      if (fields[field]['type'] === 'boolean') {
        fields[field]['type'] = 'checkbox';
      }
      else if (fields[field]['type'] === 'string') {
        fields[field]['type'] = 'text';
      }
      else if (fields[field]['type'] === 'numeric') {
        fields[field]['type'] = 'number';
      }
    }
    $scope.fields = fields;

    $scope.clearForm = function() {
      for (field in $scope.fields) {
        $scope.fields[field]['value'] = '';
      }
    }

    $scope.processForm = function() {
      var string = '';
      var filter = '';
      for (field in $scope.fields) {
        if ($scope.fields[field]['value']) {
          if ($scope.fields[field]['type'] == 'checkbox') {
            filter += field;
            filter += ':true';
            filter += ' OR ';
          }
          else {
            if (field != '__fulltext_search') {
              string += field;
              string += ':';
            }
            string += $scope.fields[field]['value'];
            string += ' AND ';
          }
        }
      }
      var query = string;
      if (filter) {
        query += '(' + filter;
        query = query.substr(0, query.length - 4) + ')';
      }
      else {
        query = query.substr(0, query.length - 5);
      }
      document.getElementById('input-query').setAttribute('value', query);
      document.getElementById('input-pageid').setAttribute('value', pageId);
      document.advancedSearchForm.submit();
    }
  });
});
