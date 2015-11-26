/**
 * apachesolrAngularjsSearch app mainController
 */

(function () {
  'use strict';

  angular.module('apachesolrAngularjsSearch').controller('mainController', mainController);

  function mainController($rootScope, $location, $http, drupalDataService, searchPostService, searchGroupService) {
    /* jshint validthis: true */
    var main = this;

    $rootScope.$on('drupalDataReady', function() {

      // Listen new group.
      $rootScope.$on('newGroupReady', function($event, group) {
        group.processingSave = false;
        main.groups.push(group);
        reindexGroups();
      });

      // Listen newTerm.
      $rootScope.$on('newTermReady', function($event, data) {
        var groupIndex = data.groupIndex;
        var fieldIndex = data.fieldIndex;
        var term = data.term;
        if (main.groups[groupIndex].fields[fieldIndex].value === undefined) {
          main.groups[groupIndex].fields[fieldIndex].value = [];
        }
        if (!fieldHasValue(main.groups[groupIndex].fields[fieldIndex], term.id)) {
          main.groups[groupIndex].fields[fieldIndex].value.push({id: term.id, name: term.name});
          // Close open Ctools Modals.
          Drupal.CTools.Modal.dismiss();
          jQuery('body').unbind('keypress');
          main.groups[groupIndex].fields[fieldIndex].choices = [];

          // Clear ui-select-search.
          jQuery(jQuery(jQuery('.advanced-search--group-content')[groupIndex]).find('.advanced-search--field-container')[fieldIndex]).find('.ui-select-search').val('');
        }
      });

      main.clearForm = clearForm;
      main.processForm = processForm;
      main.fieldChanged = fieldChanged;
      main.addFieldConfirm = addFieldConfirm;
      main.deleteField = deleteField;
      main.addSameField = addSameField;
      main.addSearchGroup = addSearchGroup;
      main.deleteGroup = deleteGroup;
      main.saveGroup = saveGroup;
      main.getChoices = getChoices;
      main.startPopup = startPopup;
      main.selectOption = selectOption;
      main.isOptionSelected = isOptionSelected;
      main.groupNameKeypress = groupNameKeypress;
      main.clearChoices = clearChoices;
      main.isGroupEmpty = isGroupEmpty;
      main.fields = {};
      main.groups = [];
      main.operators = [];

      // Unbind the event.
      var mainDiv = angular.element(document.getElementById('mainController'));
      angular.element(mainDiv).unbind('drupalDataReady');

      var data = drupalDataService.getDrupalData();
      var fields = data.fields;
      var pageId = data.pageId;
      var groups = data.groups;
      var limitBy = data.limitBy;

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
      if (limitBy) {
        main.fields.limitby = limitBy;
      }
      if (!groups) {
        main.groups[0] = getDefaultGroup('default', 0);
        for (i = 0; i < main.fields.always.length; i++) {
          main.groups[0].fields[i] = main.fields.always[i];
          main.groups[0].activeCount++;
        }
        main.groups[0].selectedFields[0] = main.groups[0].fields[0];
      }
      else {
        main.groups = groups;
      }
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
          activeAddField : false,
          differentFieldsCount: 1
        };
      }

      function fieldChanged(groupIndex, index) {
        var selectedField = angular.copy(main.groups[groupIndex].selectedFields[index]);
        if (selectedField) {
          main.groups[groupIndex].fields[index] = selectedField;
          hidePreviousAndNext(groupIndex, index);
          main.groups[groupIndex].saved = false;
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

      function addFieldConfirm(groupIndex, option) {
        var field = angular.copy(option);
        var index = addField(groupIndex, field);
        if (main.groups[groupIndex].fields[index - 1] && main.groups[groupIndex].fields[index - 1].id === main.groups[groupIndex].fields[index].id ) {
          main.groups[groupIndex].fields[index].previousConnector = 'or';
        }
        updateDifferentFieldCount(groupIndex);
      }

      function addField(groupIndex, field, index) {
        var wasUndefined = false;
        if (index === undefined) {
          if (main.groups[groupIndex].activeCount === undefined) {
            main.groups[groupIndex].activeCount = main.groups[groupIndex].fields.length;
          }
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
        main.groups[groupIndex].saved = false;
        return index;
      }

      function deleteField(groupIndex, index) {
        main.groups[groupIndex].fields.splice(index, 1);
        main.groups[groupIndex].selectedFields.splice(index, 1);
        main.groups[groupIndex].activeCount--;
        hidePreviousAndNext(groupIndex, index - 1);
        updateDifferentFieldCount(groupIndex);
      }

      function updateDifferentFieldCount(groupIndex) {
        var fieldIds = [];
        for (var i = 0; i < main.groups[groupIndex].fields.length; i++) {
          var field = main.groups[groupIndex].fields[i];
          if (fieldIds.indexOf(field.id) === -1) {
            fieldIds.push(field.id);
          }
        }
        main.groups[groupIndex].differentFieldsCount = fieldIds.length;
      }

      function addSameField(groupIndex, index) {
        if (!main.groups[groupIndex].fields[index].previousConnector) {
          main.groups[groupIndex].fields[index].previousConnector = 'and';
        }
        var field = angular.copy(main.groups[groupIndex].fields[index]);
        field.value = [];
        addField(groupIndex, field, index);
      }

      function addSearchGroup() {
        var position = main.groups.length;
        var group = getDefaultGroup('group_' + position, position);
        for (var i = 0; i < main.fields.always.length; i++) {
          group.fields[i] = main.fields.always[i];
          group.fields[i].value = undefined;
          if (group.fields[i].autocompletePath) {
            group.fields[i].value = [];
          }
          group.activeCount++;
        }
        group.selectedFields[0] = group.fields[0];
        main.groups.push(group);
      }

      function deleteGroup(groupIndex) {
        main.groups.splice(groupIndex, 1);
        reindexGroups();
      }

      function getChoices(field, search) {
        if (search && search.length > 2) {
          field.searching = true;
          $http.get('/' + field.autocompletePath + '/' + search).then(function(response) {
            if (response.status === 200) {
              field.choices = [];
              for (var index = 0; index < response.data.length; index++) {
                if (!fieldHasValue(field, response.data[index].id)) {
                  field.choices.push(response.data[index]);
                }
              }
            }
            field.searching = false;
          });
        }
      }

      function fieldHasValue(field, choiceId) {
        if (!field.value) {
          field.value = [];
          return false;
        }
        for (var index  = 0; index < field.value.length; index++) {
          if (field.value[index].id === choiceId) {
            return true;
          }
        }
        return false;
      }

      function startPopup(choice, $event, groupIndex, fieldIndex) {
        $event.stopPropagation();
        var base = 'choice-' + choice.id;
        var x = $event.pageX;
        var y = $event.pageY - 250;
        if (!choice.clicked) {
          choice.clicked = true;
          var target = $event.target;
          angular.element(target).on('click', Drupal.CTools.Modal.clickAjaxLink);
          var elementSettings = {};
          elementSettings.url = '/' + choice.path + '/' + groupIndex + '/' + fieldIndex;
          elementSettings.event = 'click';
          elementSettings.setClick = true;

          Drupal.ajax[base] = new Drupal.ajax(base, target, elementSettings);
        }
        window.scroll(x, y);
        Drupal.ajax[base].trigger();
      }

      function clearForm() {
        main.groups = [];
        main.groups[0] = getDefaultGroup('default', 0);
        for (i = 0; i < main.fields.always.length; i++) {
          main.groups[0].fields[i] = main.fields.always[i];
          main.groups[0].fields[i].value = undefined;
          if (main.groups[0].fields[i].autocompletePath) {
            main.groups[0].fields[i].value = [];
          }
          main.groups[0].activeCount++;
        }
        main.groups[0].selectedFields[0] = main.groups[0].fields[0];
        main.selectedField = getField('__fulltext_search');
        for (i = 0; i < main.fields.limitby.length; i++) {
          main.fields.limitby[i].value = undefined;
          if (main.fields.limitby[i].autocompletePath) {
            main.fields.limitby[i].value = [];
          }
          if (main.fields.limitby[i].value2) {
            main.fields.limitby[i].value2 = undefined;
          }
          if (main.fields.limitby[i].type === 'group') {
            var groupIndex = 0;
            for (groupIndex = 0; groupIndex < main.fields.limitby[i].fields.length; groupIndex++) {
              main.fields.limitby[i].fields[groupIndex].value = undefined;
            }
          }
        }
      }

      function processForm() {
        main.processingSearch = true;
        searchPostService.sendSearch(main.groups, main.fields.limitby, pageId).then(function(data) {
          var uri = data.uri;
          if (!jQuery('div.ie9inf').length) {
            var aasBaseUrl = data.aasBaseUrl;
            var searchFormPath = data.searchFormPath;
            var newUri = uri.replace('apachesolr-angularjs-search', 'advancedsearch');
            $location.path(newUri).replace(aasBaseUrl, searchFormPath);
          }
          window.location.href = uri;
        });
      }

      function saveGroup(groupIndex) {
        main.groups[groupIndex].name = main.groups[groupIndex].tempName;
        main.groups[groupIndex].processingSave = true;
        main.groups[groupIndex].saving = false;
        main.groups[groupIndex].saved = true;
        searchGroupService.saveGroup(main.groups[groupIndex]).then(function(data) {
          if (data.status === 200) {
            main.groups[groupIndex].processingSave = false;
            main.groups[groupIndex].tempName = undefined;
          }
        });
      }

      function isGroupEmpty(group) {
        var fieldIndex = 0;
        for (fieldIndex = 0; fieldIndex < group.fields.length; fieldIndex++) {
          if (group.fields[fieldIndex].value) {
            return false;
          }
        }
        return true;
      }

      function selectOption(optionId, field) {
        var index = isOptionSelected(optionId, field);
        if (index === false) {
          if (!field.value || !field.multiple) {
            field.value = [];
          }
          field.value.push(optionId);
        }
        else {
          field.value.splice(index, 1);
        }
      }

      function isOptionSelected(optionId, field) {
        var index = 0;
        if (field.value) {
          for (index = 0; index < field.value.length; index++) {
            if (field.value[index] === optionId) {
              return index;
            }
          }
        }
        return false;
      }

      function groupNameKeypress($event, groupIndex) {
        if ($event.keyCode === 27) {
          main.groups[groupIndex].saving = false;
        }
      }

      function clearChoices(field) {
        field.choices = [];
      }

      function reindexGroups() {
        for (var i = 0; i < main.groups.length; i++) {
          main.groups[i].groupIndex = i;
        }
      }

      function setClickHandler() {
        jQuery('.ui-select-container').once(function() {
          jQuery(this).click(function() {
            jQuery(this).find('.ui-select-search').focus();
          });
        });
      }
      setTimeout(setClickHandler, 0);
    });
  }
})();
