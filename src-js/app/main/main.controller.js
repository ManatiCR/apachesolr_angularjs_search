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
      main.addField = addField;
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
      main.fields.active = {};
      main.selectedFields = {};
      main.activeCount = 0;
      for (field in main.fields.always) {
        main.fields.active['field' + main.activeCount] = main.fields.always[field];
        main.activeCount++;
      }
      main.selectedFields[0] = main.fields.active.field0;

      function fieldChanged(index) {
        var selectedField = angular.copy(main.selectedFields[index]);
        var actualIndex = 0;
        var field;
        for (field in main.fields.active) {
          if (actualIndex === index) {
            if (field) {
              main.fields.active[field] = selectedField;
              if (main.selectedFields[index].id === main.selectedFields[index - 1].id) {
                main.selectedFields[index].hide = true;
              }
              else {
                main.selectedFields[index].hide = false;
              }
              if (main.selectedFields[index + 1] !== undefined) {
                if (main.selectedFields[index + 1].id === main.selectedFields[index].id) {
                  main.selectedFields[index + 1].hide = true;
                }
                else {
                  main.selectedFields[index + 1].hide = false;
                }
              }
              break;
            }
          }
          actualIndex++;
        }
      }

      function getField(fieldId) {
        if (fieldId) {
          for (field in main.fields.selected) {
            if (main.fields.selected[field].id === fieldId) {
              return angular.copy(main.fields.selected[field]);
            }
          }
        }
        else {
          var count = 0;
          for (field in main.fields.selected) {
            if (count === 1) {
              return angular.copy(main.fields.selected[field]);
            }
            count++;
          }
        }
        return false;
      }

      function addField() {
        var field = getField();
        main.selectedFields[main.activeCount] = field;
        if (field.id === main.selectedFields[main.activeCount - 1].id) {
          main.selectedFields[main.activeCount].hide = true;
        }
        main.fields.active['field' + main.activeCount] = field;
        main.activeCount++;
      }

      function clearForm() {
        main.fields.active = {};
        for (field in main.fields.always) {
          main.fields.active['field' + main.activeCount] = main.fields.always[field];
          main.activeCount++;
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
              if (main.fields.active[field].id !== '__fulltext_search') {
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
