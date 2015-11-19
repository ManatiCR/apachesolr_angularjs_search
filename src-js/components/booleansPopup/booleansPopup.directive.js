/**
 * apachesolrAngularjsSearch aasBooleansPopup directive.
 *
 */

(function () {
  'use strict';
  angular.module('apachesolrAngularjsSearch').directive('aasBooleansPopup', booleansPopup);

  function booleansPopup($rootScope, drupalDataService) {

    var basePath;
    $rootScope.$on('drupalDataReady', function() {
      var data = drupalDataService.getDrupalData();
      basePath = data.modulePath;
    });

    var directive = {
      // @TODO: Change hardcoded path.
      templateUrl: '/sites/all/modules/custom/apachesolr_angularjs_search' + '/src-js/components/booleansPopup/booleans-popup.html',
      restrict: 'A',
      scope: {
        field: '=',
        group: '='
      },
      controller: BooleansPopupController,
      controllerAs: 'vm',
      bindToController: true,
      link: BooleansPopupLink
    };
    return directive;

    function BooleansPopupController($scope) {
      var vm = this;

      vm.parentScope = $scope.$parent;
      vm.booleansPopup = vm.parentScope.main.booleansPopup = {show: false};
      vm.textChange = textChange;
      vm.addBoolean = addBoolean;
      vm.highlightChange = highlightChange;
      vm.optionSelected = optionSelected;
      vm.removeChoice = removeChoice;
      vm.openPopup = openPopup;
      vm.positionPopup = positionPopup;
      vm.firstBoolean = '';

      var target;
      var selectionStart;

      if (!vm.field.value) {
        // Prevent error with hightlight.
        vm.field.value = '';
      }

      function textChange($event) {
        if (!target) {
          target = $event.target;
        }

        if ($event.charCode === 44) {
          vm.booleansPopup.show = true;
          selectionStart = target.selectionStart;
          target.focus();
        }
        else {
          vm.booleansPopup.show = false;
        }
        return true;
      }

      function addBoolean(operator, $event) {

        var itemToReplace = null;
        var addBooleanInField = true;
        if (vm.booleansPopup.itemToReplace) {
          itemToReplace = vm.booleansPopup.itemToReplace;
          vm.booleansPopup.itemToReplace = null;
        }
        else if (vm.field.id !== '__fulltext_search' && vm.firstBoolean && vm.firstBoolean !== operator) {
          addBooleanInField = false;
        }

        var part;
        if (addBooleanInField) {

          if (!vm.firstBoolean) {
            vm.firstBoolean = operator;
          }

          if (vm.field.autocompletePath) {
            var length = vm.field.value.length;
            if (itemToReplace) {
              var index = 0;
              for (index = 0; index < vm.field.value.length; index++) {
                if (itemToReplace.id === vm.field.value[index].id) {
                  if (index === 1) {
                    vm.firstBoolean = operator;
                  }
                  break;
                }
              }
              vm.field.value.splice(index, 1, {id: operator + '-' + (length - 1), name: operator, class:'advanced-search--field-autocomplete-operator'});
              verifyAutocompleteFieldValues();
            }
            else {
              vm.field.value.push({id: operator + '-' + length, name: operator, class:'advanced-search--field-autocomplete-operator'});
              jQuery($event.target).parents('.advanced-search--field-container').find('.ui-select-search').focus();
            }
            // Remove X on new added boolean.
            setTimeout(function() {
              jQuery('.advanced-search--field-autocomplete-operator').parents('.ui-select-match-item').children('.ui-select-match-close').remove();
            }, 0);
          }
          else {
            part = vm.field.value.substr(selectionStart + 1);
            vm.field.value = vm.field.value.substr(0, selectionStart);
            vm.field.value += ' ' + operator + ' ';
            vm.field.value += part;
          }
          var selectionSum = operator.length + 2;
          var cursorPosition = selectionStart + selectionSum;
          if (target) {
            target.focus();
            setTimeout(function() {
              // Let's wait focus has finished before applying selectionRange.
              target.setSelectionRange(cursorPosition, cursorPosition);
            }, 0);
          }
          if (!vm.field.autocompletePath) {
            setTimeout(function() {
              jQuery($scope.element).find('textarea, input').data('highlighter').highlight();
            }, 0);
          }
        }
        else {
          if (!vm.field.autocompletePath) {
            part = vm.field.value.substr(selectionStart + 1);
            vm.field.value = vm.field.value.substr(0, selectionStart);
            vm.field.value += part;
            // @TODO: Preserve focus on normal text field.
          }
          else {
            setTimeout(function() {
              jQuery($scope.element).parents('.advanced-search--field-container').next().find('.ui-select-search').focus();
            }, 0);
          }
          $scope.$parent.main.addSameField(vm.group.groupIndex, $scope.$parent.$index);
          $scope.$parent.main.groups[vm.group.groupIndex].fields[$scope.$parent.$index + 1].previousConnector = operator.toLowerCase();
        }
        vm.booleansPopup.show = false;
      }

      function separateFieldValue(field, booleanToSeparate) {
        var newFieldValue = field.value.substr(field.value.indexOf(booleanToSeparate) + booleanToSeparate.length, field.value.length - 1).trim();
        field.value = field.value.substr(0, field.value.indexOf(booleanToSeparate));
        $scope.$parent.main.addSameField(vm.group.groupIndex, $scope.$parent.$index);
        $scope.$parent.main.groups[vm.group.groupIndex].fields[$scope.$parent.$index + 1].previousConnector = booleanToSeparate;
        $scope.$parent.main.groups[vm.group.groupIndex].fields[$scope.$parent.$index + 1].value = newFieldValue;
        return newFieldValue;
      }

      function verifyFieldValue(field, matches) {
        if (matches.length) {
          var firstMatch = matches[0];
          for (var index = 1; index < matches.length; index++) {
            if (matches[index] !== firstMatch) {
              var newFieldValue = separateFieldValue(field, matches[index]);
              var regex = new RegExp('(AND|OR|NOT)');
              var newFieldMatches = newFieldValue.match(regex);
              if (newFieldMatches !== null) {
                // Add matches.
                verifyFieldValue($scope.$parent.main.groups[vm.group.groupIndex].fields[$scope.$parent.$index + 1], newFieldMatches);
              }
              break;
            }
          }
        }
      }

      function verifyAutocompleteFieldValues() {
        var index = 0;
        var lastBoolean = false;
        for (index = 0; index < vm.field.value.length; index++) {
          if (vm.field.value[index].name === 'AND' || vm.field.value[index].name === 'OR' || vm.field.value[index].name === 'NOT') {
            if (!lastBoolean) {
              lastBoolean = vm.field.value[index].name;
            }
            else if (lastBoolean !== vm.field.value[index].name) {
              var booleanToSeparate = vm.field.value[index].name;
              var newFieldValue = vm.field.value.splice(index, vm.field.value.length - index);
              // Separate in new field.
              $scope.$parent.main.addSameField(vm.group.groupIndex, $scope.$parent.$index);
              $scope.$parent.main.groups[vm.group.groupIndex].fields[$scope.$parent.$index + 1].previousConnector = booleanToSeparate;
              $scope.$parent.main.groups[vm.group.groupIndex].fields[$scope.$parent.$index + 1].value = newFieldValue.splice(1, newFieldValue.length);
              break;
            }
          }
        }
      }

      function highlightChange($event) {
        var $markers = $event.matches;
        if ($markers.length) {

          if (vm.field.id !== '__fulltext_search') {
            verifyFieldValue(vm.field, $markers);
            jQuery($event.target).data('highlighter').highlight();
          }
        }
        else {
          vm.firstBoolean = '';
        }
      }

      function optionSelected() {
        if (vm.field.value) {
          vm.booleansPopup.show = true;
          angular.element(document.getElementsByClassName('ui-select-search')).on('keydown', hideBooleansPopup);
        }
        else {
          vm.booleansPopup.show = true;
        }
      }

      function hideBooleansPopup() {
        vm.booleansPopup.show = false;
        angular.element(document.getElementsByClassName('ui-select-search')).unbind('keydown', hideBooleansPopup);
      }

      function removeChoice(field) {
        var booleanFound = false;
        if (field.value) {
          for (var index = 0; index < field.value.length; index ++) {
            if (field.value[index].class === 'advanced-search--field-autocomplete-operator') {
              vm.firstBoolean = field.value[index].name;
              booleanFound = true;
              break;
            }
          }
        }
        if (!booleanFound) {
          vm.firstBoolean = false;
        }
      }

      function openPopup($item) {
        if ($item.class === 'advanced-search--field-autocomplete-operator') {
          vm.booleansPopup.show = true;
          vm.booleansPopup.itemToReplace = $item;
        }
      }

      function positionPopup($event) {
        setTimeout(function() {
          var booleansPopupContainer = jQuery($event.target).parents('.advanced-search--form-item-container').children('.booleans-popup--container');
          var left = $event.pageX - jQuery($event.target).parents('.advanced-search--field-autocomplete').offset().left - (booleansPopupContainer.width() / 2);
          booleansPopupContainer.css('left', left + 'px');
        }, 0);

      }

    }

    function BooleansPopupLink(scope, element) {

      function setHighlight() {
        jQuery(element).find('.form-textarea, .form-text').highlightTextarea({
          words: ['AND', 'OR', 'NOT'],
          color: '#CCC'
        });

        jQuery(element).bind('matchesChanged', scope.vm.highlightChange);

        scope.element = element;
      }

      function setClickHandler() {
        jQuery('.ui-select-container').once(function() {
          jQuery(this).click(function() {
            jQuery(this).find('.ui-select-search').focus();
          });
        });
      }

      function removeCloseBoolean() {
        setTimeout(function() {
          jQuery('.advanced-search--field-autocomplete-operator').parents('.ui-select-match-item').children('.ui-select-match-close').remove();
        }, 0);
      }

      setTimeout(setHighlight, 0);
      setTimeout(setClickHandler, 0);
      setTimeout(removeCloseBoolean, 0);
    }
  }
})();
