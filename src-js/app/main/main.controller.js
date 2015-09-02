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
      main.addSearchGroup = addSearchGroup;
      main.deleteGroup = deleteGroup;
      main.fields = {};
      main.groups = []
      main.operators = [];

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
      main.groups[0] = getDefaultGroup('default', 0);
      for (i = 0; i < main.fields.always.length; i++) {
        main.groups[0].fields[i] = main.fields.always[i];
        main.groups[0].activeCount++;
      }
      main.groups[0].selectedFields[0] = main.groups[0].fields[0];
      main.selectedField = getField('__fulltext_search');

      main.operators = ['and', 'or', 'not'];

      function getDefaultGroup(id, position) {
        return {
          id : id,
          name : id,
          position : position,
          internalConnector : 'and',
          nextConnector : 'and',
          fields : [],
          selectedFields : [],
          closeButtonVisible : [],
          activeCount : 0,
          activeAddField : false
        };
      }

      function fieldChanged(groupIndex, index) {
        var selectedField = angular.copy(main.groups[groupIndex].selectedFields[index]);
        if (selectedField) {
          main.groups[groupIndex].fields[index] = selectedField;
          hidePreviousAndNext(groupIndex, index);
        }
      }

      function hidePreviousAndNext(groupIndex, index) {
        if (main.groups[groupIndex].selectedFields[index - 1] !== undefined && main.groups[groupIndex].selectedFields[index] !== undefined) {
          if (main.groups[groupIndex].selectedFields[index].id === main.groups[groupIndex].selectedFields[index - 1].id) {
            main.groups[groupIndex].selectedFields[index].hide = true;
          }
          else {
            main.groups[groupIndex].selectedFields[index].hide = false;
          }
        }
        if (main.groups[groupIndex].selectedFields[index + 1] !== undefined && main.groups[groupIndex].selectedFields[index] !== undefined) {
          if (main.groups[groupIndex].selectedFields[index + 1].id === main.groups[groupIndex].selectedFields[index].id) {
            main.groups[groupIndex].selectedFields[index + 1].hide = true;
          }
          else {
            main.groups[groupIndex].selectedFields[index + 1].hide = false;
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

      function addFieldConfirm(groupIndex) {
        var field = angular.copy(main.selectedField);
        addField(groupIndex, field);
      }

      function addField(groupIndex, field, index) {
        var wasUndefined = false;
        if (index === undefined) {
          index = main.groups[groupIndex].activeCount;
          wasUndefined = true;
        }
        main.groups[groupIndex].selectedFields.splice(index + 1, 0, field);
        hidePreviousAndNext(groupIndex, index);
        main.groups[groupIndex].fields.splice(index + 1, 0, field);
        if (wasUndefined) {
          main.groups[groupIndex].activeAddField = false;
        }
        main.groups[groupIndex].activeCount++;
      }

      function deleteField(groupIndex, index) {
        main.groups[groupIndex].fields.splice(index, 1);
        main.groups[groupIndex].selectedFields.splice(index, 1);
        main.groups[groupIndex].activeCount--;
        hidePreviousAndNext(groupIndex, index - 1);
      }

      function addSameField(groupIndex, index) {
        var field = angular.copy(main.groups[groupIndex].fields[index]);
        addField(groupIndex, field, index);
      }

      function addSearchGroup() {
        var position = main.groups.length;
        var group = getDefaultGroup('group_' + position, position);
        main.groups.push(group);
      }

      function deleteGroup(groupIndex) {
        main.groups.splice(groupIndex, 1);
      }

      function clearForm() {
        main.groups = [];
        main.groups[0] = getDefaultGroup('default', 0);
        for (i = 0; i < main.fields.always.length; i++) {
          main.groups[0].fields[i] = main.fields.always[i];
          main.groups[0].activeCount++;
        }
        main.groups[0].selectedFields[0] = main.groups[0].fields[0];
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
