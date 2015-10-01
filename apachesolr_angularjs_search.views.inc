<?php

/**
 * @file
 * Views file for apachesolr_angularjs_search module.
 */

/**
 * Implements hook_views_data().
 */
function apachesolr_angularjs_search_views_data() {
  $data = array();

  $data['aas_search_saved']['table']['group'] = t('Search');

  $data['aas_search_saved']['table']['base'] = array(
    'field' => 'sid',
    'title' => t('Saved Search'),
    'help' => t('Saved searches on your site'),
    'access query tag' => 'aas_search_saved_access',
  );

  $data['aas_search_saved']['sid'] = array(
    'title' => t('Sid'),
    'help' => t('The Search ID'),
    'field' => array(
      'handler' => 'views_handler_field_numeric',
      'click sortable' => TRUE,
    ),
    'filter' => array(
      'handler' => 'views_handler_filter_numeric',
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
  );

  $data['aas_search_saved']['delete_link'] = array(
    'title' => t('Delete Link'),
    'help' => t('Delete Link for this search'),
    'real field' => 'sid',
    'field' => array(
      'handler' => 'apachesolr_angularjs_search_handler_field_delete_link',
    ),
  );

  $data['aas_search_saved']['uri'] = array(
    'title' => t('Uri'),
    'help' => t('The Search Uri'),
    'field' => array(
      'handler' => 'views_handler_field',
      'click sortable' => TRUE,
    ),
    'filter' => array(
      'handler' => 'views_handler_filter',
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
  );

  $data['aas_search_saved']['view_link'] = array(
    'title' => t('View Link'),
    'help' => t('View Link for this search'),
    'real field' => 'uri',
    'field' => array(
      'handler' => 'apachesolr_angularjs_search_handler_field_view_link',
    ),
  );

  $data['aas_search_saved']['name'] = array(
    'title' => t('Name'),
    'help' => t('The Search Name'),
    'field' => array(
      'handler' => 'views_handler_field',
      'click sortable' => TRUE,
    ),
    'filter' => array(
      'handler' => 'views_handler_filter',
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
  );

  $data['aas_search_saved']['created'] = array(
    'title' => t('Created'),
    'help' => t('The date the search was created.'),
    'field' => array(
      'handler' => 'views_handler_field_date',
      'click sortable' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort_date',
    ),
    'filter' => array(
      'handler' => 'views_handler_filter_date',
    ),
  );

  $data['aas_search_saved']['last_run'] = array(
    'title' => t('Last run'),
    'help' => t('The date the search was last run.'),
    'field' => array(
      'handler' => 'views_handler_field_date',
      'click sortable' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort_date',
    ),
    'filter' => array(
      'handler' => 'views_handler_filter_date',
    ),
  );

  $data['aas_search_saved']['uid'] = array(
    'title' => t('Uid'),
    'help' => t('The user ID that created this search'),
    'field' => array(
      'title' => t('User'),
      'handler' => 'apachesolr_angularjs_search_handler_field_user',
      'click sortable' => TRUE,
    ),
    'argument' => array(
      'handler' => 'views_handler_argument_user_uid',
      'name field' => 'name',
    ),
    'filter' => array(
      'title' => t('User'),
      'handler' => 'views_handler_filter_user_name',
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
    'relationship' => array(
      'base' => 'users',
      'base field' => 'uid',
      'handler' => 'views_handler_relationship',
      'label' => t('User Relationship'),
    ),
  );

  $data['aas_search_saved']['page_id'] = array(
    'title' => t('Page ID'),
    'help' => t('The Page ID used by this Search'),
    'field' => array(
      'handler' => 'views_handler_field',
      'click sortable' => TRUE,
    ),
    'filter' => array(
      'handler' => 'views_handler_filter',
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
  );

  $data['aas_search_saved']['status'] = array(
    'title' => t('Status'),
    'help' => t('Whether a search is permanent or temporary.'),
    'field' => array(
      'handler' => 'views_handler_field_boolean',
      'click sortable' => TRUE,
      'output formats' => array(
        'permanent-temporary' => array(t('Permanent'), t('Temporary')),
      ),
    ),
    'filter' => array(
      'handler' => 'views_handler_filter_boolean_operator',
      'label' => t('Permanent'),
      'type' => 'yes-no',
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
  );

  $data['aas_search_saved']['query'] = array(
    'title' => t('Query'),
    'help' => t('Query used in this search'),
    'field' => array(
      'handler' => 'views_handler_field',
    ),
  );

  $data['aas_search_saved']['table']['join'] = array(
     // Directly links to users table.
    'users' => array(
      'left_field' => 'uid',
      'field' => 'uid',
      'left_table' => 'users',
    ),
  );

  $data['aas_search_saved_groups']['table']['group'] = t('Search Group');

  $data['aas_search_saved_groups']['table']['base'] = array(
    'field' => 'sgid',
    'title' => t('Saved Search Groups'),
    'help' => t('Saved search groups on your site'),
  );

  $data['aas_search_saved_groups']['sgid'] = array(
    'title' => t('Sgid'),
    'help' => t('The Search Group ID'),
    'field' => array(
      'handler' => 'views_handler_field_numeric',
      'click sortable' => TRUE,
    ),
    'filter' => array(
      'handler' => 'views_handler_filter_numeric',
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
  );

  $data['aas_search_saved_groups']['delete_link'] = array(
    'title' => t('Delete Link'),
    'help' => t('Delete Link for this search'),
    'real field' => 'sgid',
    'field' => array(
      'handler' => 'apachesolr_angularjs_search_group_handler_field_delete_link',
    ),
  );

  $data['aas_search_saved_groups']['view_link'] = array(
    'title' => t('Add Group Link'),
    'help' => t('Add this search group to actual view'),
    'real field' => 'sgid',
    'field' => array(
      'handler' => 'apachesolr_angularjs_search_group_handler_field_view_link',
    ),
  );

  $data['aas_search_saved_groups']['name'] = array(
    'title' => t('Name'),
    'help' => t('The Search Group Name'),
    'field' => array(
      'handler' => 'views_handler_field',
      'click sortable' => TRUE,
    ),
    'filter' => array(
      'handler' => 'views_handler_filter',
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
  );

  $data['aas_search_saved_groups']['created'] = array(
    'title' => t('Created'),
    'help' => t('The date the search group was created.'),
    'field' => array(
      'handler' => 'views_handler_field_date',
      'click sortable' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort_date',
    ),
    'filter' => array(
      'handler' => 'views_handler_filter_date',
    ),
  );

  $data['aas_search_saved_groups']['last_used'] = array(
    'title' => t('Last Used'),
    'help' => t('The date the search group was last used.'),
    'field' => array(
      'handler' => 'views_handler_field_date',
      'click sortable' => TRUE,
    ),
    'sort' => array(
      'handler' => 'views_handler_sort_date',
    ),
    'filter' => array(
      'handler' => 'views_handler_filter_date',
    ),
  );

  $data['aas_search_saved_groups']['uid'] = array(
    'title' => t('Uid'),
    'help' => t('The user ID that created this search group'),
    'field' => array(
      'title' => t('User'),
      'handler' => 'apachesolr_angularjs_search_group_handler_field_user',
      'click sortable' => TRUE,
    ),
    'argument' => array(
      'handler' => 'views_handler_argument_user_uid',
      'name field' => 'name',
    ),
    'filter' => array(
      'title' => t('User'),
      'handler' => 'views_handler_filter_user_name',
    ),
    'sort' => array(
      'handler' => 'views_handler_sort',
    ),
    'relationship' => array(
      'base' => 'users',
      'base field' => 'uid',
      'handler' => 'views_handler_relationship',
      'label' => t('User Relationship'),
    ),
  );

  $data['aas_search_saved_groups']['table']['join'] = array(
     // Directly links to users table.
    'users' => array(
      'left_field' => 'uid',
      'field' => 'uid',
      'left_table' => 'users',
    ),
  );

  return $data;
}
