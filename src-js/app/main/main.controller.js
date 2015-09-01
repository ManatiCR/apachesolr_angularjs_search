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
      main.addFieldConfirm = addFieldConfirm;
      main.deleteField = deleteField;
      main.addSameField = addSameField;
      main.fields = {};

      // Unbind the event.
      var mainDiv = angular.element(document.getElementById('mainController'));
      angular.element(mainDiv).unbind('drupalDataReady');

      var data = drupalDataService.getDrupalData();
      var fields = data.fields;
      var pageId = data.pageId;

      var field;
      var status;
      var i;
      for (status in fields) {
        for (i = 0; i < fields[status].length; i++) {
          if (fields[status][i].type === 'boolean') {
            fields[status][i].type = 'checkbox';
          }
          else if (fields[status][i].type === 'string') {
            fields[status][i].type = 'text';
          }
          else if (fields[status][i].type === 'numeric') {
            fields[status][i].type = 'number';
          }
        }
      }
      main.fields = fields;
      main.fields.active = [];
      main.selectedFields = [];
      main.closeButtonVisible = [];
      main.activeCount = 0;
      for (i = 0; i < main.fields.always.length; i++) {
        main.fields.active[i] = main.fields.always[i];
        main.activeCount++;
      }
      main.selectedFields[0] = main.fields.active[0];
      main.selectedField = getField('__fulltext_search');

      function fieldChanged(index) {
        var selectedField = angular.copy(main.selectedFields[index]);
        if (selectedField) {
          main.fields.active[index] = selectedField;
          hidePreviousAndNext(index);
        }
      }

      function hidePreviousAndNext(index) {
        if (main.selectedFields[index - 1] !== undefined) {
          if (main.selectedFields[index].id === main.selectedFields[index - 1].id) {
            main.selectedFields[index].hide = true;
          }
          else {
            main.selectedFields[index].hide = false;
          }
        }
        if (main.selectedFields[index + 1] !== undefined) {
          if (main.selectedFields[index + 1].id === main.selectedFields[index].id) {
            main.selectedFields[index + 1].hide = true;
          }
          else {
            main.selectedFields[index + 1].hide = false;
          }
        }
      }

      function getField(fieldId) {
        var i;
        if (fieldId) {
          for (i = 0; i < main.fields.selected.length; i++) {
            if (main.fields.selected[i].id === fieldId) {
              return angular.copy(main.fields.selected[i]);
            }
          }
        }
        else {
          return angular.copy(main.fields.selected[1]);
        }
        return false;
      }

      function addFieldConfirm() {
        var field = angular.copy(main.selectedField);
        addField(field);
      }

      function addField(field, index) {
        var wasUndefined = false;
        if (index === undefined) {
          index = main.activeCount;
          main.activeCount++;
          wasUndefined = true;
        }
        main.selectedFields.splice(index + 1, 0, field);
        hidePreviousAndNext(index);
        main.fields.active.splice(index + 1, 0, field);
        if (wasUndefined) {
          main.activeAddField = false;
        }
      }

      function deleteField(index) {
        main.fields.active[index] = {};
        main.selectedFields[index] = {};
      }

      function addSameField(index) {
        var field = angular.copy(main.fields.active[index]);
        addField(field, index);
      }

      function clearForm() {
        main.fields.active = {};
        main.activeCount = 0;
        main.activeAddField = false;
        for (var i = 0; i < main.fields.always.length; i++) {
          main.fields.active[main.activeCount] = main.fields.always[i];
          main.activeCount++;
        }
        main.selectedFields[0] = main.fields.active[0];
        main.selectedField = getField('__fulltext_search');
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
