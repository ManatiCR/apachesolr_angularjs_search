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

  <div data-ng-cloak id="advanced-search-controller" data-ng-controller="mainController as main">
    <div class="advanced-search--searching-spinner" data-ng-show="main.processingSearch">
      <span>PROCESSING SEARCH</span>
    </div>

    <form class="advanced-search--form">
      <div class="advanced-search--group" data-ng-if="group.id" data-ng-repeat="group in main.groups" data-ng-init="groupIndex = $index">
        <div class="advanced-search--group-actions">
          <?php if (user_is_logged_in()): ?>
          <a href="#" class="advanced-search--group-save" data-ng-if="!group.saved && !group.saving" data-ng-click="group.saving = true">Save this Search Group for next searches</a>
          <span class="advanced-search--group-saved" data-ng-if="group.saved && !group.saving && !group.processingSave">{{ group.name }}</span>
          <div class="advanced-search--group-save-open" data-ng-if="group.saving || group.processingSave">
            <input class="advanced-search--group-save-name" data-ng-model="group.tempName" type="text" data-ng-keypress="main.groupNameKeypress($event, groupIndex)"/>
            <button class="advanced-search--group-save-confirm" type="button" data-ng-click="main.saveGroup(groupIndex)">Save</button>
            <span class="advanced-search--group-save-processing" data-ng-if="group.processingSave">Saving...</span>
          </div>
          <?php endif; ?>
          <a href="#" class="advanced-search--group-delete" data-ng-if="main.groups.length > 1" data-ng-click="main.deleteGroup(groupIndex); $event.preventDefault();">Delete Group</a>
        </div>
        <div class="advanced-search--group-content">
          <div class="advanced-search--group-operator" data-aas-booleans-select data-aas-booleans-select-options="main.operators" data-ng-model="group.internalConnector" data-ng-show="group.differentFieldsCount > 1">
          </div>
          <div class="advanced-search--field-container" data-ng-if="field.id" data-ng-repeat="field in group.fields" data-ng-mouseenter="group.closeButtonVisible[$index] = true" data-ng-mouseleave="group.closeButtonVisible[$index] = false">
            <select class="advanced-search--field-type" data-ng-if="!group.selectedFields[$index].hide" data-ng-change="main.fieldChanged(groupIndex, $index)" data-ng-model="group.selectedFields[$index]" data-ng-options="option.label for option in main.fields.selected track by option.id"></select>
            <div class="advanced-search--previous-field-operator" data-ng-if="$index > 0 && group.selectedFields[$index - 1].id === group.selectedFields[$index].id" data-aas-booleans-select data-aas-booleans-select-options="main.operators" data-ng-model="field.previousConnector">
            </div>
            <label class="advanced-search--field-value-label advanced-search--field-fromto-label" data-ng-if="field.format === 'fromto'">{{ field.from_label }}</label>
            <input class="advanced-search--field-value form-{{field.type}}" type="{{ field.type }}" data-ng-if="field.type != 'fulltext' && !field.autocompletePath && field.format === 'fromto'" data-ng-model="field.value" />
            <label class="advanced-search--field-value2-label advanced-search--field-fromto-label" data-ng-if="field.format === 'fromto'">{{ field.to_label }}</label>
            <input class="advanced-search--field-value2 form-{{field.type}}" type="{{ field.type }}" data-ng-if="field.type != 'fulltext' && !field.autocompletePath && field.format === 'fromto'" data-ng-model="field.value2" />
            <div class="advanced-search--form-item-container" data-aas-booleans-popup="true" data-ng-if="field.type === 'fulltext' || (field.type === 'text' && field.format !== 'fromto')" data-field="field"></div>
            <div class="advanced-search--field-actions">
              <a class="advanced-search--field-action-item advanced-search--field-delete" data-ng-show="((groupIndex === 0 && $index > 0) || groupIndex > 0) && group.closeButtonVisible[$index]" href="#" data-ng-click="main.deleteField(groupIndex, $index); $event.preventDefault();">Delete lorem ipsum</a>
              <a class="advanced-search--field-action-item advanced-search--field-add" data-ng-show="group.closeButtonVisible[$index]" href="#" data-ng-click="main.addSameField(groupIndex, $index); main.booleansPopup.show = false; $event.preventDefault();">Add</a>
            </div>
          </div>
          <div class="advanced-search--add-another">
            <a href="#" class="advanced-search--add-another-button" data-ng-init="group.activeAddField = false" data-ng-click="group.activeAddField = !group.activeAddField; main.booleansPopup.show = false; $event.preventDefault();">Add New Field</a>
            <div class="advanced-search--add-type" data-ng-if="group.activeAddField">
              <ul class="advanced-search--add-type-list" data-ng-show="group.activeAddField">
                <li class="advanced-select--add-type-list-item" data-ng-repeat="option in main.fields.selected" data-ng-click="main.addFieldConfirm(groupIndex, option)">{{ option.label }}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="advanced-search--group-connector" data-ng-if="main.groups[groupIndex + 1]" data-aas-booleans-select data-aas-booleans-select-options="main.operators" data-ng-model="group.nextConnector">
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
            <input class="advanced-search--field-value form-{{field.type}}" type="{{ field.type }}" data-ng-if="field.type != 'fulltext' && field.type != 'options' && !field.autocompletePath && field.type != 'group'" data-ng-model="field.value" />
            <div class="advanced-search--field-value form-{{field.type}} field-{{field.id}}" data-ng-if="field.type === 'options'">
              <span class="advanced-search--field-option option-{{optionId}}" data-ng-repeat="(optionId, optionName) in field.options" data-ng-click="main.selectOption(optionId, field)" data-ng-class="{selected: main.isOptionSelected(optionId, field) !== false}">{{ optionName }}</span>
            </div>
            <label class="advanced-search--field-value2-label advanced-search--field-fromto-label" data-ng-if="field.format === 'fromto'">{{ field.to_label }}</label>
            <input class="advanced-search--field-value2 form-{{field.type}}" type="{{ field.type }}" data-ng-if="field.type != 'fulltext' && !field.autocompletePath && field.format === 'fromto'" data-ng-model="field.value2" />
            <textarea class="advanced-search--field-value form-textarea" data-ng-if="field.type == 'fulltext'" data-ng-model="field.value"></textarea>
            <div class="advanced-search--field-autocomplete-searching" data-ng-show="field.searching">
              <span class="advanced-search--field-autocomplete-searching-text">Searching...</span>
            </div>
            <ui-select class="advanced-search--field-value form-{{field.type}}" multiple data-ng-if="field.autocompletePath" data-ng-model="field.value" theme="bootstrap" data-ng-disabled="disabled" reset-search-input="true">
              <ui-select-match placeholder="Select a {{ field.label }}"> {{ $item.name }} </ui-select-match>
              <ui-select-choices repeat="choice in field.choices track by choice.id" refresh="main.getChoices(field, $select.search)" refresh-delay="0">
                <div data-ng-bind-html="choice.name | highlight: $select.search"></div>
              </ui-select-choices>
            </ui-select>
            <div class="advanced-search--limitby-group" data-ng-if="field.type == 'group'">
              <label class="advanced-search--field-value-label">{{ field.label }}</label>
              <div class="advanced-search--limitby-group-element" data-ng-repeat="groupField in field.fields">
                <input id="{{ groupField.id }}" class="advanced-search--limitby-group-field form-{{ groupField.type }}" type="{{ groupField.type }}" data-ng-model="groupField.value" />
                <label class="advanced-search--limitby-group-label" for="{{ groupField.id }}">{{ groupField.label }}</label>
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
