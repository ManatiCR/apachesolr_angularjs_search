<?php

/**
 * @file
 * Apachesolr_angularjs_search_handler_field_view_link class.
 */

class apachesolr_angularjs_search_handler_field_view_link extends views_handler_field {

  /**
   * {@inheritdoc}
   */
  function option_definition() {
    $options = parent::option_definition();

    $options['link_text'] = array(
      'default' => t('View'),
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
    $link_text = check_plain($this->options['link_text']);
    $uri = APACHESOLR_ANGULARJS_SEARCH_BASE_PATH . '/' . $values->apachesolr_angularjs_search_saved_uri;
    return l($link_text, $uri);
  }

}
