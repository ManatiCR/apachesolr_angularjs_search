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
          <a href="#" class="advanced-search--group-delete" data-ng-if="main.groups.length > 1" data-ng-click="main.deleteGroup(groupIndex); $event.preventDefault();">Delete Group</a>
        </div>
        <div class="advanced-search--group-content">
          <div class="advanced-search--group-operator" data-ng-if="group.fields.length > 1">
            <a href="#" data-ng-click="$event.preventDefault();" class="advanced-search--operator-toggle">{{group.internalConnector | uppercase}}</a>
            <select class="advanced-search--operator-select" data-ng-options="option | uppercase for option in main.operators" data-ng-model="group.internalConnector"></select>
          </div>
          <div class="advanced-search--field-container" data-ng-if="field.id" data-ng-repeat="field in group.fields" data-ng-mouseenter="group.closeButtonVisible[$index] = true" data-ng-mouseleave="group.closeButtonVisible[$index] = false">
            <select class="advanced-search--field-type" data-ng-if="!group.selectedFields[$index].hide" data-ng-change="main.fieldChanged(groupIndex, $index)" data-ng-model="group.selectedFields[$index]" data-ng-options="option.label for option in main.fields.selected track by option.id"></select>
            <label class="advanced-search--field-value-label advanced-search--field-fromto-label" data-ng-if="field.format === 'fromto'">{{ field.from_label }}</label>
            <input class="advanced-search--field-value form-{{field.type}}" type="{{ field.type }}" data-ng-if="field.type != 'fulltext' && !field.autocompletePath && field.format === 'fromto'" data-ng-model="field.value" />
            <label class="advanced-search--field-value2-label advanced-search--field-fromto-label" data-ng-if="field.format === 'fromto'">{{ field.to_label }}</label>
            <input class="advanced-search--field-value2 form-{{field.type}}" type="{{ field.type }}" data-ng-if="field.type != 'fulltext' && !field.autocompletePath && field.format === 'fromto'" data-ng-model="field.value2" />
            <aas-booleans-popup data-ng-if="field.type === 'fulltext' || (field.type === 'text' && field.format !== 'fromto')" field="field"></aas-booleans-popup>
            <ui-select class="advanced-search--field-autocomplete" multiple data-ng-if="field.autocompletePath" data-ng-model="field.value" theme="bootstrap" data-ng-disabled="disabled" reset-search-input="true">
              <ui-select-match placeholder="Select a {{ field.label }}"> {{ $item.name }} </ui-select-match>
              <ui-select-choices repeat="choice in field.choices track by choice.id" refresh="main.getChoices(field, $select.search)" refresh-delay="0">
                <div data-ng-if="!choice.path" data-ng-bind-html="choice.name | highlight: $select.search"></div>
                <div class="choice" data-ng-if="choice.path" data-ng-click=$event.preventDefault();>
                  <span>{{ choice.name }} ({{ choice.resultCount }})</span>
                  <button data-ng-click="main.startPopup(choice, $event);" title="{{ choice.name }}" id="choice-{{ choice.id }}" class="{{ choice.classes }}">Info</button>
                  <input type="hidden" class="choice-{{ choice.id }}-url" value="{{ choice.path }}"/>
                </div>
              </ui-select-choices>
            </ui-select>
            <div class="advanced-search--field-actions">
              <a class="advanced-search--field-action-item advanced-search--field-delete" data-ng-show="(groupIndex === 0 && $index > 0) && group.closeButtonVisible[$index]" href="#" data-ng-click="main.deleteField(groupIndex, $index); $event.preventDefault();">Delete lorem ipsum</a>
              <a class="advanced-search--field-action-item advanced-search--field-add" data-ng-show="group.closeButtonVisible[$index]" href="#" data-ng-click="main.addSameField(groupIndex, $index); $event.preventDefault();">Add</a>
            </div>
            <div class="advanced-search--next-field-operator" data-ng-if="group.fields.length > $index + 1 && group.selectedFields[$index + 1].hide">
              <a href="#" data-ng-click="$event.preventDefault();" class="advanced-search--next-field-operator-toggle">{{field.nextConnector | uppercase}}</a>
              <select class="advanced-search--next-field-operator-select" data-ng-options="option | uppercase for option in main.operators" data-ng-model="field.nextConnector"></select>
            </div>
          </div>
          <div class="advanced-search--add-another">
            <a href="#" class="advanced-search--add-another-button" data-ng-if="!group.activeAddField" data-ng-click="group.activeAddField = true; $event.preventDefault();">Add Field</a>
            <div class="advanced-search--add-type" data-ng-if="group.activeAddField">
              <select class="advanced-search--add-type-select" data-ng-model="main.selectedField" ng-options="option.label for option in main.fields.selected track by option.id"></select>
              <a href="#" class="advanced-search--add-type-button" data-ng-click="main.addFieldConfirm(groupIndex); $event.preventDefault();">Add</a>
            </div>
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
      <div class="advanced-search--limit-by">
        <h4 class="advanced-search--limit-by-title">Limits</h4>
        <div class="advanced-search--limit-by-container">
          <div class="advanced-search--field-container" data-ng-if="field.id" data-ng-repeat="field in main.fields.limitby">
            <label class="advanced-search--field-value-label" data-ng-if="field.type !== 'group'">{{ field.label }}</label>
            <label class="advanced-search--field-value-label advanced-search--field-fromto-label" data-ng-if="field.format === 'fromto'">{{ field.from_label }}</label>
            <input class="advanced-search--field-value form-{{field.type}}" type="{{ field.type }}" data-ng-if="field.type != 'fulltext' && !field.autocompletePath && field.type != 'group'" data-ng-model="field.value" />
            <label class="advanced-search--field-value2-label advanced-search--field-fromto-label" data-ng-if="field.format === 'fromto'">{{ field.to_label }}</label>
            <input class="advanced-search--field-value2 form-{{field.type}}" type="{{ field.type }}" data-ng-if="field.type != 'fulltext' && !field.autocompletePath && field.format === 'fromto'" data-ng-model="field.value2" />
            <textarea class="advanced-search--field-value form-textarea" data-ng-if="field.type == 'fulltext'" data-ng-model="field.value"></textarea>
            <ui-select class="advanced-search--field-value form-{{field.type}}" multiple data-ng-if="field.autocompletePath" data-ng-model="field.value" theme="bootstrap" data-ng-disabled="disabled" reset-search-input="true">
              <ui-select-match placeholder="Select a {{ field.label }}"> {{ $item.name }} </ui-select-match>
              <ui-select-choices repeat="choice in field.choices track by choice.id" refresh="main.getChoices(field, $select.search)" refresh-delay="0">
                <div data-ng-bind-html="choice.name | highlight: $select.search"></div>
              </ui-select-choices>
            </ui-select>
            <div class="advanced-search--limitby-group" data-ng-if="field.type == 'group'">
              <label class="advanced-search--field-value-label">{{ field.label }}</label>
              <div class="advanced-search--limitby-group-element" data-ng-repeat="groupField in field.fields">
                <input class="advanced-search--limitby-group-field form-{{ groupField.type }}" type="{{ groupField.type }}" data-ng-model="groupField.value" />
                <label class="advanced-search--limitby-group-label">{{ groupField.label }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="advanced-search--global-actions">
        <button class="advanced-search--global-reset" data-ng-click="main.clearForm()" type="button">Reset</button>
        <button class="advanced-search--global-submit" data-ng-click="main.processForm(); $event.preventDefault();" type="submit">Search</button>
      </div>
    </form>
  </div>
</div>
