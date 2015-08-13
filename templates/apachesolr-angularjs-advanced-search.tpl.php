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
  <form class="advanced-search-form" action="#">
    <div class="form-input" data-ng-repeat="(field_name, field) in fields">
      <label for="field_name">{{ field.label }}</label>
      <input type="{{ field.type }}" id="{{field_name}}"/>
    </div>
  </form>

</div>
</div>
