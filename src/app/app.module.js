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

  angular.module('apachesolrAngularjsSearch', ['ngCookies', 'ngResource', 'ngSanitize', 'ngTouch', 'ui.select']);
  Drupal.behaviors.apachesolrAngularjs = {
    attach: function(context) {
      jQuery('#advancedSearch', context).once('advancedSearch', advancedSearchFunction);
      if (!jQuery('div.ie9inf').length) {
        angular.module('apachesolrAngularjsSearch').config(function($locationProvider) {
          $locationProvider.html5Mode(true);
        });
      }
      function advancedSearchFunction() {
        var fields = Drupal.settings.apachesolrAngularjs.fields;
        var pageId = Drupal.settings.apachesolrAngularjs.pageId;
        var modulePath = Drupal.settings.apachesolrAngularjs.modulePath;
        var groups = Drupal.settings.apachesolrAngularjs.groups;
        var limitBy = Drupal.settings.apachesolrAngularjs.limitBy;
        var data = {
          fields: fields,
          pageId: pageId,
          modulePath: modulePath,
          groups: groups,
          limitBy: limitBy
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

  Drupal.behaviors.apachesolrAngularjsNewGroup = {
    attach: function(context) {
      jQuery('.search-group-add-link', context).once('search-group-add', function() {
        jQuery(this).click(function(ev) {
          ev.preventDefault();
          var url = jQuery(this).attr('href');
          jQuery.ajax({
            url: url,
            success: function(data) {
              if (data) {
                var group = JSON.parse(data);
                if (group) {
                  group = angular.copy(group);
                  var mainControllerElement = angular.element(document.getElementById('advanced-search-controller'));
                  var drupalDataService = mainControllerElement.injector().get('drupalDataService');
                  drupalDataService.setNewGroup(group);
                  mainControllerElement.scope().$apply();
                }
              }
            }
          });
        });
      });
    }
  };

  Drupal.behaviors.apachesolrAngularjsNewTerm = {
    attach: function() {
      if (Drupal.settings.apachesolrAngularjs.newTerm) {
        var term = Drupal.settings.apachesolrAngularjs.newTerm;
        Drupal.settings.apachesolrAngularjs.newTerm = false;
        var groupIndex = Drupal.settings.apachesolrAngularjs.groupIndex;
        Drupal.settings.apachesolrAngularjs.groupIndex = false;
        var fieldIndex = Drupal.settings.apachesolrAngularjs.fieldIndex;
        Drupal.settings.apachesolrAngularjs.fieldIndex = false;

        var data = {
          term: term,
          groupIndex: groupIndex,
          fieldIndex: fieldIndex
        };
        var mainControllerElement = angular.element(document.getElementById('advanced-search-controller'));
        var drupalDataService = mainControllerElement.injector().get('drupalDataService');
        drupalDataService.setNewTerm(data);
        mainControllerElement.scope().$apply();
      }
    }
  };

  /**
   * Add an extra function to the Drupal ajax object
   * which allows us to trigger an ajax response without
   * an element that triggers it.
   */
  Drupal.ajax.prototype.trigger = function() {
    var ajax = this;

    // Do not perform another ajax command if one is already in progress.
    if (ajax.ajaxing) {
      return false;
    }

    try {
      jQuery.ajax(ajax.options);
    }
    catch (err) {
      console.log('An error occurred while attempting to process ' + ajax.options.url);
      return false;
    }

    return false;
  };

})();
