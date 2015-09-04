<?php

/**
 * @file
 * AngularJS template to render
 */
?>

<div class="advanced-search--container" id="advancedSearch" data-ng-app="apachesolrAngularjsSearch">
  <!--[if lte IE 8]>
    <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
  <![endif]-->

  <div id="advanced-search-controller" data-ng-controller="mainController as main">

    <form class="advanced-search--form">
      <div class="advanced-search--group" data-ng-if="group.id" data-ng-repeat="group in main.groups" data-ng-init="groupIndex = $index">
        <div class="advanced-search--group-actions">
          <a href="#" class="advanced-search--group-save" data-ng-click=main.saveGroup(groupIndex)>Save this Search Group for next searches</a>
          <a href="#" class="advanced-search--group-delete" data-ng-click="main.deleteGroup(groupIndex); $event.preventDefault();">Delete Group</a>
        </div>
        <div class="advanced-search--group-operator">
          <a href="#" data-ng-click="$event.preventDefault();" class="advanced-search--operator-toggle">{{group.internalConnector | uppercase}}</a>
          <select class="advanced-search--operator-select" data-ng-options="option | uppercase for option in main.operators" data-ng-model="group.internalConnector"></select>
        </div>
        <div class="advanced-search--field-container" data-ng-if="field.id" data-ng-repeat="field in group.fields" data-ng-mouseenter="group.closeButtonVisible[$index] = true" data-ng-mouseleave="group.closeButtonVisible[$index] = false">
          <select class="advanced-search--field-type" data-ng-if="!group.selectedFields[$index].hide" data-ng-change="main.fieldChanged(groupIndex, $index)" data-ng-model="group.selectedFields[$index]" data-ng-options="option.label for option in main.fields.selected track by option.id"></select>
          <div class="advanced-search--field-link" data-ng-if="group.selectedFields[$index].hide">LINK</div>
          <input class="advanced-search--field-value form-{{field.type}}" type="{{ field.type }}" data-ng-if="field.type != 'fulltext' && !field.autocomplete_path" data-ng-model="field.value" />
          <textarea class="advanced-search--field-value form-textarea" data-ng-if="field.type == 'fulltext'" data-ng-model="field.value"></textarea>
          <div class="advanced-search--field-actions">
            <a class="advanced-search--field-delete" data-ng-show="(groupIndex === 0 && $index > 0) && group.closeButtonVisible[$index]" href="#" data-ng-click="main.deleteField(groupIndex, $index); $event.preventDefault();">Delete</a>
            <a class="advanced-search--field-add" data-ng-show="group.closeButtonVisible[$index]" href="#" data-ng-click="main.addSameField(groupIndex, $index); $event.preventDefault();">Add</a>
          </div>
        </div>
        <div class="advanced-search--add-another">
          <a href="#" class="advanced-search--add-another-button" data-ng-if="!group.activeAddField" data-ng-click="group.activeAddField = true; $event.preventDefault();">Add Field</a>
          <div class="advanced-search--add-type" data-ng-if="group.activeAddField">
            <select class="advanced-search--add-type-select" data-ng-model="main.selectedField" ng-options="option.label for option in main.fields.selected track by option.id"></select>
            <a href="#" class="advanced-search--add-type-button" data-ng-click="main.addFieldConfirm(groupIndex); $event.preventDefault();">Add</a>
          </div>
        </div>
        <div class="advanced-search--group-connector" data-ng-if="main.groups[groupIndex + 1]">
          <a href="#" data-ng-click="$event.preventDefault();" class="advanced-search--connector-toggle">{{group.nextConnector | uppercase}}</a>
          <select class="advanced-search--group-connector-select" data-ng-options="option | uppercase for option in main.operators" data-ng-model="group.nextConnector"></select>
        </div>
      </div>
      <div class="advanced-search--add-group">
        <a href="#" class="advanced-search--add-group-button" data-ng-click="main.addSearchGroup(); $event.preventDefault();">Add Search Group</a>
      </div>
      <div class="advanced-search--global-actions">
        <button class="advanced-search--global-reset" data-ng-click="main.clearForm()" type="button">Reset</button>
        <button class="advanced-search--global-submit" data-ng-click="main.processForm(); $event.preventDefault();" type="submit">Search</button>
      </div>
    </form>
  </div>
</div>
