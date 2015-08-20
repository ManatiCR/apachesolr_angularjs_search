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

  <div class="container" id="mainController" data-ng-controller="mainController">

<pre>{{fields}}</pre>
  <form class="advanced-search-form" name="advancedSearchForm" action="/apachesolr-angularjs-search" method="POST">
    <div class="form-input" data-ng-repeat="(field_name, field) in fields">
      <label for="field_name">{{ field.label }}</label>
      <input type="{{ field.type }}" id="{{field_name}}" data-ng-if="field.type != 'fulltext' && !field.autocomplete_path" data-ng-model="field.value" />
      <textarea type="{{ field.type }}" id="{{field_name}}" data-ng-if="field.type == 'fulltext'" data-ng-model="field.value"></textarea>
    </div>
    <input type="hidden" name="query" id="input-query"/>
    <input type="hidden" name="pageId" id="input-pageid"/>
    <div class="actions">
      <button class="btn btn-reset" data-ng-click="clearForm()" type="button">Reset</button>
      <button class="btn btn-submit" data-ng-click="processForm(); $event.preventDefault();" type="submit">Search</button>
    </div>
  </form>

</div>
</div>
