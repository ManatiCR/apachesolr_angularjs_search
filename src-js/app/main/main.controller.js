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
      main.fieldChanged = fieldChanged;
      main.fields = {};

      // Unbind the event.
      var mainDiv = angular.element(document.getElementById('mainController'));
      angular.element(mainDiv).unbind('drupalDataReady');

      var data = drupalDataService.getDrupalData();
      var fields = data.fields;
      var pageId = data.pageId;

      var field;
      var status;
      for (status in fields) {
        for (field in fields[status]) {
          if (fields[status][field].type === 'boolean') {
            fields[status][field].type = 'checkbox';
          }
          else if (fields[status][field].type === 'string') {
            fields[status][field].type = 'text';
          }
          else if (fields[status][field].type === 'numeric') {
            fields[status][field].type = 'number';
          }
        }
      }
      main.fields = fields;
      main.fields.active = main.fields.always;
      main.selectedField = main.fields.active[Object.keys(main.fields.active)[0]].id;

      function fieldChanged(index) {
        var selectedField = main.selectedField;
        var actualIndex = 0;
        var field;
        for (field in main.fields.active) {
          if (actualIndex === index) {
            var thisField = getField(selectedField);
            if (field) {
              main.fields.active[field] = thisField;
              break;
            }
          }
          actualIndex++;
        }
      }

      function getField(fieldId) {
        for (field in main.fields.selected) {
          if (main.fields.selected[field].id === fieldId) {
            return main.fields.selected[field];
          }
        }
        return false;
      }

      function clearForm() {
        for (field in main.fields.active) {
          main.fields.active[field].value = '';
        }
      }

      function processForm() {
        var string = '';
        var filter = '';
        for (field in main.fields.active) {
          if (main.fields.active[field].value) {
            if (main.fields.active[field].type === 'checkbox') {
              filter += main.fields.active[field].id;
              filter += ':true';
              filter += ' OR ';
            }
            else {
              if (field !== '__fulltext_search') {
                string += main.fields.active[field].id;
                string += ':';
              }
              string += main.fields.active[field].value;
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
