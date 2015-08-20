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
