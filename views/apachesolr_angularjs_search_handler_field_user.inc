<?php

/**
 * @file
 * apachesolr_angularjs_search_handler_field_user class.
 */

class apachesolr_angularjs_search_handler_field_user extends views_handler_field_user {

  /**
   * Get the value that's supposed to be rendered.
   */
  function get_value($values, $field = NULL) {
    $value = '';
    $alias = isset($field) ? $this->aliases[$field] : $this->field_alias;
    if (isset($values->{$alias})) {
      $value = $values->{$alias};
    }
    if ($value) {
      $name = db_query('SELECT name FROM {users} WHERE uid = :uid', array(':uid' => $value))->fetchField();
      if ($name) {
        $value = $name;
      }
    }
    return $value;
  }
}
