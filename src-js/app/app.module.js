/**
 * @ngdoc overview
 * @name apachesolrAngularjsSearch
 * @description
 * # apachesolrAngularjsSearch
 *
 * Main module of the application.
 */

(function () {
  'use strict';

  angular.module('apachesolrAngularjsSearch', ['ngCookies', 'ngResource', 'ngSanitize', 'ngTouch']);
  Drupal.behaviors.apachesolrAngularjs = {
    attach: function(context) {
      jQuery('#advancedSearch', context).once('advancedSearch', advancedSearchFunction);
      function advancedSearchFunction() {
        var fields = Drupal.settings.apachesolrAngularjs.fields;
        var pageId = Drupal.settings.apachesolrAngularjs.pageId;
        var data = {
          fields: fields,
          pageId: pageId
        };

        // We need to ensure dom is ready before getting this element.
        angular.element(document).ready(setDrupalData);
        function setDrupalData() {
          var mainControllerElement = angular.element(document.getElementById('advanced-search-controller'));
          var drupalDataService = mainControllerElement.injector().get('drupalDataService');
          drupalDataService.setDrupalData(data);
          mainControllerElement.scope().$apply();
        }
      }
    }
  };
})();
