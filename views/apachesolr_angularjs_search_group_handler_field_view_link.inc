<?php

/**
 * @file
 * apachesolr_angularjs_search_group_handler_field_view_link class.
 */

class apachesolr_angularjs_search_group_handler_field_view_link extends views_handler_field {

  /**
   * {@inheritdoc}
   */
  function option_definition() {
    $options = parent::option_definition();

    $options['link_text'] = array(
      'default' => t('Add'),
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
      '#description' => t('Text used for the link. Use !name for using the group name'),
    );
  }

  /**
   * {@inheritdoc}
   */
  function render($values) {
    $group = apachesolr_angularjs_search_group_load($values->sgid);
    $link_text = check_plain($this->options['link_text']);
    if ($link_text === '!name') {
      $link_text = check_plain(truncate_utf8($group->name, 40, FALSE, TRUE));
    }
    return l($link_text, 'apachesolr_angularjs_search/add_block/' . $group->sgid, array(
      'attributes' => array(
        'class' => array('search-group-add-link'),
        'title' => check_plain($group->name),
      ),
    ));
  }
}
