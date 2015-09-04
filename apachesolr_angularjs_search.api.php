<?php

/**
 * @file
 * apachesolr_angularjs_search.api.php
 */

/**
 * Implements hook_apachesolr_angularjs_search_fields_alter().
 */
function hook_apachesolr_angularjs_search_fields_alter(&$fields) {
  $fields['selected'][0] = array(
    'label' => t('Promote'),
    'type' => 'checkbox',
    'autocomplete_path' => '',
  );
}

/**
 * Implements hook_apachesolr_angularjs_search_build_result_alter().
 */
function hook_apachesolr_angularjs_search_build_result_alter(&$build) {
  if (isset($build['save_form'])) {
    unset($build['save_form']);
  }
}
