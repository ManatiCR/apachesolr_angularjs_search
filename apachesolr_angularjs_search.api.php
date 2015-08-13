<?php

/**
 * @file
 * apachesolr_angularjs_search.api.php
 */

/**
 * Implements hook_apachesolr_angularjs_search_fields_alter().
 */
function hook_apachesolr_angularjs_search_fields_alter(&$fields) {
  $fields['bs_promote'] = array(
    'label' => t('Promote'),
    'type' => 'checkbox',
    'autocomplete_path' => '',
  );
}
