'use strict';

/**
 * @ngdoc overview
 * @name jsApp
 * @description
 * # jsApp
 *
 * Main module of the application.
 */
(function ($) {
  // code here
  Drupal.behaviors.apachesolrAngularjs = {
    attach: function(context) {
      jQuery('#advancedSearch').once('advancedSearch', function() {
        var fields = Drupal.settings.apachesolrAngularjs.fields;
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
        var app = angular.module('search', ['ngCookies', 'ngResource', 'ngSanitize', 'ngTouch']);

        function mainController($scope) {
          $scope.fields = fields;
        }
        app.controller('mainController', mainController);
      });
    }
  }
})(jQuery);
