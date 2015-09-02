<?php

/**
 * @file
 * AngularJS template to render
 */
?>

<div class="advancedSearch" id="advancedSearch" data-ng-app="apachesolrAngularjsSearch">
  <!--[if lte IE 8]>
    <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
  <![endif]-->

  <div class="container" id="mainController" data-ng-controller="mainController as main">

<pre>{{main.groups}}</pre>
  <form class="advanced-search-form" name="advancedSearchForm" action="/apachesolr-angularjs-search" method="POST">
    <div class="search-group" data-ng-if="group.id" data-ng-repeat="group in main.groups" data-ng-init="groupIndex = $index">
      <div class="group-actions">
        <div class="group-actions-left">
          <a href="#" class="group-save">Save this Search Group for next searches</a>
        </div>
        <div class="group-actions-right" data-ng-if="main.groups.length > 1">
          <a href="#" class="group-delete" data-ng-click="main.deleteGroup(groupIndex); $event.preventDefault();">Delete Group</a>
        </div>
      </div>
      <div class="group-operator">
        <select class="group-operator-select" data-ng-options="option | uppercase for option in main.operators" data-ng-model="group.internalConnector"></select>
      </div>
      <div class="form-input" data-ng-if="field.id" data-ng-repeat="field in group.fields" data-ng-mouseenter="group.closeButtonVisible[$index] = true" data-ng-mouseleave="group.closeButtonVisible[$index] = false">
        <select class="field-name" data-ng-if="!group.selectedFields[$index].hide" data-ng-change="main.fieldChanged(groupIndex, $index)" data-ng-model="group.selectedFields[$index]" id="field_type_{{ groupIndex }}_{{ $index }}" name="field_type_{{ groupIndex }}_{{ $index }}" data-ng-options="option.label for option in main.fields.selected track by option.id"></select>
        <span class="field-link" data-ng-if="group.selectedFields[$index].hide">LINK</span>
        <input class="field-value" type="{{ field.type }}" id="field_value_{{ groupIndex }}_{{ $index }}" name="field_value_{{ groupIndex }}_{{ $index }}" data-ng-if="field.type != 'fulltext' && !field.autocomplete_path" data-ng-model="field.value" />
        <textarea class="field-value" id="field_value_{{ groupIndex }}_{{ $index }}" data-ng-if="field.type == 'fulltext'" data-ng-model="field.value"></textarea>
        <span class="field-close" data-ng-show="(groupIndex === 0 && $index > 0) && group.closeButtonVisible[$index]"><a href="#" data-ng-click="main.deleteField(groupIndex, $index); $event.preventDefault();">X</a></span>
        <span class="add-same-field" data-ng-show="group.closeButtonVisible[$index]"><a href="#" data-ng-click="main.addSameField(groupIndex, $index); $event.preventDefault();">+</a></span>
      </div>
      <input type="hidden" name="query" id="input-query"/>
      <input type="hidden" name="pageId" id="input-pageid"/>
      <div class="add-another" data-ng-if="!group.activeAddField">
        <a href="#" class="btn btn-add-another" data-ng-click="group.activeAddField = true; $event.preventDefault();">Add Field</a>
      </div>
      <div class="add-another-fieldset" data-ng-if="group.activeAddField">
        <select class="field-name" data-ng-model="main.selectedField" ng-options="option.label for option in main.fields.selected track by option.id"></select>
        <a href="#" class="btn btn-add-field-confirm" data-ng-click="main.addFieldConfirm(groupIndex); $event.preventDefault();">Add</a>
      </div>
      <div class="group-connector" data-ng-if="main.groups[groupIndex + 1]">
        <select class="group-operator-select" data-ng-options="option | uppercase for option in main.operators" data-ng-model="group.nextConnector"></select>
      </div>
    </div>
    <div class="add-search-group">
      <a href="#" class="btn btn-add-search-group" data-ng-click="main.addSearchGroup(); $event.preventDefault();">Add Search Group</a>
    </div>
    <div class="actions">
      <button class="btn btn-reset" data-ng-click="main.clearForm()" type="button">Reset</button>
      <button class="btn btn-submit" data-ng-click="main.processForm(); $event.preventDefault();" type="submit">Search</button>
    </div>
  </form>

</div>
</div>
