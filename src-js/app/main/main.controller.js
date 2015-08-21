/**
 * apachesolrAngularjsSearch app mainController
 */

(function () {
  'use strict';

  angular.module('apachesolrAngularjsSearch').controller('mainController', mainController);

  function mainController($rootScope, drupalDataService) {
    /* jshint validthis: true */
    var main = this;

    $rootScope.$on('drupalDataReady', function() {

      main.clearForm = clearForm;
      main.processForm = processForm;
      main.fields = {};

      // Unbind the event.
      var mainDiv = angular.element(document.getElementById('mainController'));
      angular.element(mainDiv).unbind('drupalDataReady');

      var data = drupalDataService.getDrupalData();
      var fields = data.fields;
      var pageId = data.pageId;

      var field;
      for (field in fields) {
        if (fields[field].type === 'boolean') {
          fields[field].type = 'checkbox';
        }
        else if (fields[field].type === 'string') {
          fields[field].type = 'text';
        }
        else if (fields[field].type === 'numeric') {
          fields[field].type = 'number';
        }
      }
      main.fields = fields;

      function clearForm() {
        for (field in main.fields) {
          main.fields[field].value = '';
        }
      }

      function processForm() {
        var string = '';
        var filter = '';
        for (field in main.fields) {
          if (main.fields[field].value) {
            if (main.fields[field].type === 'checkbox') {
              filter += field;
              filter += ':true';
              filter += ' OR ';
            }
            else {
              if (field !== '__fulltext_search') {
                string += field;
                string += ':';
              }
              string += main.fields[field].value;
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
  }
})();
