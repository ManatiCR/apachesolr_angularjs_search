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

<pre>{{main}}</pre>
  <form class="advanced-search-form" name="advancedSearchForm" action="/apachesolr-angularjs-search" method="POST">
    <div class="form-input" data-ng-if="field.id" data-ng-repeat="field in main.fields.active" data-ng-mouseenter="main.closeButtonVisible[$index] = true" data-ng-mouseleave="main.closeButtonVisible[$index] = false">
      <select class="field-name" data-ng-if="!main.selectedFields[$index].hide" data-ng-change="main.fieldChanged($index)" data-ng-model="main.selectedFields[$index]" id="field_type_{{ $index }}" name="field_type_{{ $index }}" ng-options="option.label for option in main.fields.selected track by option.id"></select>
      <span class="field-link" data-ng-if="main.selectedFields[$index].hide">LINK</span>
      <input class="field-value" type="{{ field.type }}" id="field_value_{{ $index }}" name="field_value_{{ $index }}" data-ng-if="field.type != 'fulltext' && !field.autocomplete_path" data-ng-model="field.value" />
      <textarea class="field-value" id="field_value_{{ $index }}" data-ng-if="field.type == 'fulltext'" data-ng-model="field.value"></textarea>
      <span class="field-close" data-ng-show="$index > 0 && main.closeButtonVisible[$index]"><a href="#" data-ng-click="main.deleteField($index); $event.preventDefault();">X</a></span>
      <span class="add-same-field" data-ng-show="main.closeButtonVisible[$index]"><a href="#" data-ng-click="main.addSameField($index); $event.preventDefault();">+</a></span>
    </div>
    <input type="hidden" name="query" id="input-query"/>
    <input type="hidden" name="pageId" id="input-pageid"/>
    <div class="add-another" data-ng-if="!main.activeAddField">
      <a href="#" class="btn btn-add-another" data-ng-click="main.activeAddField = true; $event.preventDefault();">Add Field</a>
    </div>
    <div class="add-another-fieldset" data-ng-if="main.activeAddField">
      <select class="field-name" data-ng-model="main.selectedField" ng-options="option.label for option in main.fields.selected track by option.id"></select>
      <a href="#" class="btn btn-add-field-confirm" data-ng-click="main.addFieldConfirm(); $event.preventDefault();">Add</a>
    </div>
    <div class="actions">
      <button class="btn btn-reset" data-ng-click="main.clearForm()" type="button">Reset</button>
      <button class="btn btn-submit" data-ng-click="main.processForm(); $event.preventDefault();" type="submit">Search</button>
    </div>
  </form>

</div>
</div>
