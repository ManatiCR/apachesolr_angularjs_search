/**
 * apachesolrAngularjsSearch aasBooleansPopup directive.
 *
 */

/* globals jQuery*/

(function () {
  'use strict';

  function booleansPopup($rootScope, drupalDataService) {

    var basePath;
    var $element;
    var $scope;
    var $parentScope;
    $rootScope.$on('drupalDataReady', function() {
      var data = drupalDataService.getDrupalData();
      basePath = data.modulePath;
    });

    function BooleansPopupController() {
      var vm = this;
      var target;
      var selectionStart;


      function textChange($event) {
        if (!target) {
          target = $event.target;
        }

        if ($event.charCode === 44) {
          vm.booleansPopup.show = true;
          selectionStart = target.selectionStart;
          var hardLimit = jQuery('.booleans-popup--container').next('.highlightTextarea').find('.form-text').width() - 100;
          var leftPosition = -75 + ((selectionStart + 1) * 6.5);
          leftPosition = leftPosition <= hardLimit ? leftPosition : hardLimit;
          jQuery('.booleans-popup--container').css('left', leftPosition + 'px');
          target.focus();
        }
        else {
          vm.booleansPopup.show = false;
        }
        return true;
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
        var needToVerify = false;
        if (addBooleanInField) {

          if (!vm.firstBoolean) {
            if (vm.field.value[1] !== undefined && (vm.field.value[1].name === 'OR' || vm.field.value[1].name === 'AND' || vm.field.value[1].name === 'NOT')) {
              vm.firstBoolean = vm.field.value[1].name;
              needToVerify = true;
            }
            else {
              vm.firstBoolean = operator;
            }
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
          else if ($event.explicitOriginalTarget === $event.target) {
            part = vm.field.value.substr(selectionStart + 1);
            vm.field.value = vm.field.value.substr(0, selectionStart);
            vm.field.value += ' ' + operator + ' ';
            vm.field.value += part;
          }
          var selectionSum = operator.length + 2;
          var cursorPosition = selectionStart + selectionSum;
          if (target && $event.explicitOriginalTarget === $event.target) {
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
          if (needToVerify) {
            verifyAutocompleteFieldValues();
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
        vm.field.avoidGlobalPopup = false;
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

      function hideBooleansPopup() {
        vm.booleansPopup.show = false;
      }

      function optionSelected() {
        if (vm.field.value) {
          vm.parentScope.main.closeAllPopups();
          vm.booleansPopup.show = true;
          angular.element(document.getElementsByClassName('ui-select-search')).on('keydown', hideBooleansPopup);
        }
        else {
          vm.parentScope.main.closeAllPopups();
          vm.booleansPopup.show = true;
        }
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

      function openPopup($item, $event) {
        if ($item.class === 'advanced-search--field-autocomplete-operator') {
          vm.booleansPopup.show = true;
          for (var i = 0; i < vm.field.value.length; i++) {
            if (vm.field.value[i].id === $item.id) {
              vm.parentScope.main.closeAllPopups();
              $item.showPopup = true;
            }
            else {
              vm.field.value[i].showPopup = false;
            }
          }
          vm.booleansPopup.itemToReplace = $item;
          $event.stopPropagation();
          vm.field.avoidGlobalPopup = true;
        }
      }

      function positionPopup($event, initialX, initialY, element) {
        setTimeout(function() {
          if (element === undefined) {
            element = $event.target;
          }
          if (initialX === undefined) {
            initialX = $event.pageX;
          }
          if (initialY === undefined) {
            initialY = $event.pageY;
          }

          var booleansPopupContainer = jQuery(element).parents('.advanced-search--form-item-container').children('.booleans-popup--container');
          var offsetLeft = jQuery(element).parents('.advanced-search--field-autocomplete').offset() !== null ? jQuery(element).parents('.advanced-search--field-autocomplete').offset().left : 0;
          var offsetTop = jQuery(element).parents('.advanced-search--field-autocomplete').offset() !== null ? jQuery(element).parents('.advanced-search--field-autocomplete').offset().top : 0;
          var leftPosition = initialX - offsetLeft - (booleansPopupContainer.width() / 2);
          var topPosition = initialY - offsetTop - (booleansPopupContainer.height() / 2) - 47;
          booleansPopupContainer.css('left', leftPosition + 'px');
          booleansPopupContainer.css('top', topPosition + 'px');
        }, 0);

      }

      function showBooleanIfNecessary($event) {
        if (vm.field.value.length) {
          var lastValue = vm.field.value[vm.field.value.length - 1];
          if (lastValue.name !== 'OR' && lastValue.name !==  'AND' && lastValue.name !== 'NOT') {
            vm.parentScope.main.closeAllPopups();
            vm.booleansPopup.show = true;
            vm.field.avoidGlobalPopup = false;
          }
          else {
            vm.booleansPopup.show = false;
            vm.field.avoidGlobalPopup = true;
          }
        }
        else {
          vm.booleansPopup.show = false;
          vm.field.avoidGlobalPopup = true;
        }
        $event.data = {
          field: vm.field
        };
      }

      function cleanShowPopup() {
        vm.booleansPopup.show = false;
        for (var index = 0; index < vm.field.value.length; index++) {
          if (vm.field.value[index].showPopup) {
            vm.field.value[index].showPopup = false;
          }
        }
      }

      vm.parentScope = $parentScope;
      vm.booleansPopup = {show: false};
      vm.textChange = textChange;
      vm.addBoolean = addBoolean;
      vm.highlightChange = highlightChange;
      vm.optionSelected = optionSelected;
      vm.removeChoice = removeChoice;
      vm.openPopup = openPopup;
      vm.positionPopup = positionPopup;
      vm.showBooleanIfNecessary = showBooleanIfNecessary;
      vm.cleanShowPopup = cleanShowPopup;
      vm.firstBoolean = '';
      vm.field.avoidGlobalPopup = false;

      if (!vm.field.value) {
        // Prevent error with hightlight.
        vm.field.value = '';
      }

    }

    function BooleansPopupLink(scope, element) {
      $scope = scope;
      $parentScope = $scope.$parent;
      $parentScope.main.booleansPopup = {show: false};

      $element = element;

      function setHighlight() {
        var $element = jQuery(element).find('.form-textarea, .form-text');
        $element.highlightTextarea({
          words: ['AND', 'OR', 'NOT'],
          color: '#CCC',
          resizable: $element.hasClass('form-textarea'),
          resizableOptions: {
            maxWidth: $element.outerWidth(true),
            minWidth: $element.outerWidth(true),
            minHeight: 30
          }
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

      function relocateBooleansPopup() {
        setTimeout(function() {
          var vm = scope.vm;
          if (vm.field.autocompletePath) {
            var booleansPopupGlobal = jQuery(element).children('.booleans-popup--container');
            var searchInput = jQuery(element).find('.ui-select-search');
            searchInput.wrap('<div class="booleans-popup-input--container"></div>');
            jQuery(element).find('.booleans-popup-input--container').prepend(booleansPopupGlobal);
          }
        }, 0);
      }

      setTimeout(setHighlight, 0);
      setTimeout(setClickHandler, 0);
      setTimeout(removeCloseBoolean, 0);
      setTimeout(relocateBooleansPopup, 0);
    }
    var directive = {
      // This path really doesn't matter because it's being replaced by
      // templatecache.
      templateUrl: '/apachesolr_angularjs_search' + '/src/components/booleansPopup/booleans-popup.html',
      restrict: 'A',
      scope: {
        field: '=',
        group: '='
      },
      link: BooleansPopupLink,
      controller: BooleansPopupController,
      controllerAs: 'vm',
      bindToController: true
    };
    return directive;

  }

  angular.module('apachesolrAngularjsSearch').directive('aasBooleansPopup', ['$rootScope', 'drupalDataService', booleansPopup]);
})();
