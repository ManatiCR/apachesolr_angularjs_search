<?php

/**
 * @file
 * apachesolr_angularjs_search_group_handler_field_delete_link class.
 */

class apachesolr_angularjs_search_group_handler_field_delete_link extends views_handler_field {

  /**
   * {@inheritdoc}
   */
  function option_definition() {
    $options = parent::option_definition();

    $options['link_text'] = array(
      'default' => t('Delete'),
    );

    return $options;
  }

  /**
   * {@inheritdoc}
   */
  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);

    $form['link_text'] = array(
      '#title' => t('Link Text'),
      '#type' => 'textfield',
      '#default_value' => $this->options['link_text'],
      '#description' => t('Text used for the link'),
    );
  }

  /**
   * {@inheritdoc}
   */
  function render($values) {
    $link_text = $this->options['link_text'];
    $sgid = $values->sgid;
    $form = drupal_get_form('apachesolr_angularjs_search_group_delete_form', $sgid, $link_text);
    return $form;
  }
}
