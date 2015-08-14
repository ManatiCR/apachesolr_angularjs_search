<?php

/**
 * @file
 * AngularJS template to render
 */
?>

<div class="advancedSearch" id="advancedSearch" data-ng-app="search">
  <!--[if lte IE 8]>
    <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
  <![endif]-->

  <div class="container" data-ng-controller="mainController">

<pre>{{fields}}</pre>
  <form class="advanced-search-form">
    <div class="form-input" data-ng-repeat="(field_name, field) in fields">
      <label for="field_name">{{ field.label }}</label>
      <input type="{{ field.type }}" id="{{field_name}}" data-ng-if="field.type != 'fulltext' && !field.autocomplete_path" data-ng-model="field.value" />
      <textarea type="{{ field.type }}" id="{{field_name}}" data-ng-if="field.type == 'fulltext'" data-ng-model="field.value"></textarea>
    </div>
    <div class="actions">
      <button class="btn btn-reset" data-ng-click="clearForm()">Reset</button>
      <button class="btn btn-submit" data-ng-click="processForm()">Search</button>
    </div>
  </form>

</div>
</div>
