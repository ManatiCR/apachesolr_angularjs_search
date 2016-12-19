!function(){"use strict";angular.module("apachesolrAngularjsSearch",["ngCookies","ngResource","ngSanitize","ngTouch","ui.select"]),Drupal.behaviors.apachesolrAngularjs={attach:function(e){function a(){function e(){var e=angular.element(document.getElementById("advanced-search-controller")),a=e.injector().get("drupalDataService");a.setDrupalData(n),e.scope().$apply()}var a=Drupal.settings.apachesolrAngularjs.fields,o=Drupal.settings.apachesolrAngularjs.pageId,r=Drupal.settings.apachesolrAngularjs.modulePath,l=Drupal.settings.apachesolrAngularjs.groups,t=Drupal.settings.apachesolrAngularjs.limitBy,n={fields:a,pageId:o,modulePath:r,groups:l,limitBy:t};angular.element(document).ready(e)}jQuery("#advancedSearch",e).once("advancedSearch",a),jQuery("div.ie9inf").length||angular.module("apachesolrAngularjsSearch").config(["$locationProvider",function(e){e.html5Mode(!0)}])}},Drupal.behaviors.apachesolrAngularjsNewGroup={attach:function(e){jQuery(".search-group-add-link",e).once("search-group-add",function(){jQuery(this).click(function(e){e.preventDefault();var a=jQuery(this).attr("href");jQuery.ajax({url:a,success:function(e){if(e){var a=JSON.parse(e);if(a){a=angular.copy(a);var o=angular.element(document.getElementById("advanced-search-controller")),r=o.injector().get("drupalDataService");r.setNewGroup(a),o.scope().$apply()}}}})})})}},Drupal.behaviors.apachesolrAngularjsNewTerm={attach:function(){if(Drupal.settings.apachesolrAngularjs.newTerm){var e=Drupal.settings.apachesolrAngularjs.newTerm;Drupal.settings.apachesolrAngularjs.newTerm=!1;var a=Drupal.settings.apachesolrAngularjs.groupIndex;Drupal.settings.apachesolrAngularjs.groupIndex=!1;var o=Drupal.settings.apachesolrAngularjs.fieldIndex;Drupal.settings.apachesolrAngularjs.fieldIndex=!1;var r={term:e,groupIndex:a,fieldIndex:o},l=angular.element(document.getElementById("advanced-search-controller")),t=l.injector().get("drupalDataService");t.setNewTerm(r),l.scope().$apply()}}},Drupal.ajax.prototype.trigger=function(){var e=this;if(e.ajaxing)return!1;try{jQuery.ajax(e.options)}catch(a){return console.log("An error occurred while attempting to process "+e.options.url),!1}return!1}}(),function(){"use strict";function e(e){function a(a){t=a,e.$emit("drupalDataReady")}function o(a){e.$emit("newGroupReady",a)}function r(a){e.$emit("newTermReady",a)}function l(){return t}var t={};return{setDrupalData:a,setNewGroup:o,setNewTerm:r,getDrupalData:l}}angular.module("apachesolrAngularjsSearch").factory("drupalDataService",["$rootScope",e])}(),function(){"use strict";function e(e){function a(e,a,r){return o.send({groups:e,limitBy:a,pageId:r}).$promise}var o=e("/apachesolr-angularjs-search",null,{send:{method:"POST"}});return{sendSearch:a}}angular.module("apachesolrAngularjsSearch").factory("searchPostService",["$resource",e])}(),function(){"use strict";function e(e){function a(e){return t.save({group:e}).$promise}function o(e){return t.update({group:e}).$promise}function r(){return t.index().$promise}function l(e){return t.index(e).$promise}var t=e("/apachesolr-angularjs-search/search-group/:id",{id:"@id"},{save:{method:"POST"},update:{method:"PUT"},index:{method:"GET",isArray:!0},get:{method:"GET",params:{id:0}}});return{saveGroup:a,updateGroup:o,getGroups:r,getGroup:l}}angular.module("apachesolrAngularjsSearch").factory("searchGroupService",["$resource",e])}(),function(){"use strict";function e(e,a){function o(){function e(e){if(h||(h=e.target),44===e.charCode){m.booleansPopup.show=!0,v=h.selectionStart;var a=jQuery(".booleans-popup--container").next(".highlightTextarea").find(".form-text").width()-100,o=-75+6.5*(v+1);o=a>=o?o:a,jQuery(".booleans-popup--container").css("left",o+"px"),h.focus()}else m.booleansPopup.show=!1;return!0}function a(){var e=0,a=!1;for(e=0;e<m.field.value.length;e++)if("AND"===m.field.value[e].name||"OR"===m.field.value[e].name||"NOT"===m.field.value[e].name)if(a){if(a!==m.field.value[e].name){var o=m.field.value[e].name,r=m.field.value.splice(e,m.field.value.length-e);n.$parent.main.addSameField(m.group.groupIndex,n.$parent.$index),n.$parent.main.groups[m.group.groupIndex].fields[n.$parent.$index+1].previousConnector=o,n.$parent.main.groups[m.group.groupIndex].fields[n.$parent.$index+1].value=r.splice(1,r.length);break}}else a=m.field.value[e].name}function o(e,o){var r=null,l=!0;m.booleansPopup.itemToReplace?(r=m.booleansPopup.itemToReplace,m.booleansPopup.itemToReplace=null):"__fulltext_search"!==m.field.id&&m.firstBoolean&&m.firstBoolean!==e&&(l=!1);var t,i=!1;if(l){if(m.firstBoolean||(void 0===m.field.value[1]||"OR"!==m.field.value[1].name&&"AND"!==m.field.value[1].name&&"NOT"!==m.field.value[1].name?m.firstBoolean=e:(m.firstBoolean=m.field.value[1].name,i=!0)),m.field.autocompletePath){var s=m.field.value.length;if(r){var u=0;for(u=0;u<m.field.value.length;u++)if(r.id===m.field.value[u].id){1===u&&(m.firstBoolean=e);break}m.field.value.splice(u,1,{id:e+"-"+(s-1),name:e,"class":"advanced-search--field-autocomplete-operator"}),a()}else m.field.value.push({id:e+"-"+s,name:e,"class":"advanced-search--field-autocomplete-operator"}),jQuery(o.target).parents(".advanced-search--field-container").find(".ui-select-search").focus();setTimeout(function(){jQuery(".advanced-search--field-autocomplete-operator").parents(".ui-select-match-item").children(".ui-select-match-close").remove()},0)}else o.explicitOriginalTarget===o.target&&(t=m.field.value.substr(v+1),m.field.value=m.field.value.substr(0,v),m.field.value+=" "+e+" ",m.field.value+=t);var p=e.length+2,d=v+p;h&&o.explicitOriginalTarget===o.target&&(h.focus(),setTimeout(function(){h.setSelectionRange(d,d)},0)),m.field.autocompletePath||setTimeout(function(){jQuery(n.element).find("textarea, input").data("highlighter").highlight()},0),i&&a()}else m.field.autocompletePath?setTimeout(function(){jQuery(n.element).parents(".advanced-search--field-container").next().find(".ui-select-search").focus()},0):(t=m.field.value.substr(v+1),m.field.value=m.field.value.substr(0,v),m.field.value+=t),n.$parent.main.addSameField(m.group.groupIndex,n.$parent.$index),n.$parent.main.groups[m.group.groupIndex].fields[n.$parent.$index+1].previousConnector=e.toLowerCase();m.booleansPopup.show=!1,m.field.avoidGlobalPopup=!1}function r(e,a){var o=e.value.substr(e.value.indexOf(a)+a.length,e.value.length-1).trim();return e.value=e.value.substr(0,e.value.indexOf(a)),n.$parent.main.addSameField(m.group.groupIndex,n.$parent.$index),n.$parent.main.groups[m.group.groupIndex].fields[n.$parent.$index+1].previousConnector=a,n.$parent.main.groups[m.group.groupIndex].fields[n.$parent.$index+1].value=o,o}function l(e,a){if(a.length)for(var o=a[0],t=1;t<a.length;t++)if(a[t]!==o){var i=r(e,a[t]),s=new RegExp("(AND|OR|NOT)"),u=i.match(s);null!==u&&l(n.$parent.main.groups[m.group.groupIndex].fields[n.$parent.$index+1],u);break}}function t(e){var a=e.matches;a.length?"__fulltext_search"!==m.field.id&&(l(m.field,a),jQuery(e.target).data("highlighter").highlight()):m.firstBoolean=""}function s(){m.booleansPopup.show=!1}function u(){m.field.value?(m.parentScope.main.closeAllPopups(),m.booleansPopup.show=!0,angular.element(document.getElementsByClassName("ui-select-search")).on("keydown",s)):(m.parentScope.main.closeAllPopups(),m.booleansPopup.show=!0)}function p(e){var a=!1;if(e.value)for(var o=0;o<e.value.length;o++)if("advanced-search--field-autocomplete-operator"===e.value[o]["class"]){m.firstBoolean=e.value[o].name,a=!0;break}a||(m.firstBoolean=!1)}function d(e,a){if("advanced-search--field-autocomplete-operator"===e["class"]){m.booleansPopup.show=!0;for(var o=0;o<m.field.value.length;o++)m.field.value[o].id===e.id?(m.parentScope.main.closeAllPopups(),e.showPopup=!0):m.field.value[o].showPopup=!1;m.booleansPopup.itemToReplace=e,a.stopPropagation(),m.field.avoidGlobalPopup=!0}}function c(e,a,o,r){setTimeout(function(){void 0===r&&(r=e.target),void 0===a&&(a=e.pageX),void 0===o&&(o=e.pageY);var l=jQuery(r).parents(".advanced-search--form-item-container").children(".booleans-popup--container"),t=null!==jQuery(r).parents(".advanced-search--field-autocomplete").offset()?jQuery(r).parents(".advanced-search--field-autocomplete").offset().left:0,n=null!==jQuery(r).parents(".advanced-search--field-autocomplete").offset()?jQuery(r).parents(".advanced-search--field-autocomplete").offset().top:0,i=a-t-l.width()/2,s=o-n-l.height()/2-47;l.css("left",i+"px"),l.css("top",s+"px")},0)}function f(e){if(m.field.value.length){var a=m.field.value[m.field.value.length-1];"OR"!==a.name&&"AND"!==a.name&&"NOT"!==a.name?(m.parentScope.main.closeAllPopups(),m.booleansPopup.show=!0,m.field.avoidGlobalPopup=!1):(m.booleansPopup.show=!1,m.field.avoidGlobalPopup=!0)}else m.booleansPopup.show=!1,m.field.avoidGlobalPopup=!0;e.data={field:m.field}}function g(){m.booleansPopup.show=!1;for(var e=0;e<m.field.value.length;e++)m.field.value[e].showPopup&&(m.field.value[e].showPopup=!1)}var h,v,m=this;m.parentScope=i,m.booleansPopup={show:!1},m.textChange=e,m.addBoolean=o,m.highlightChange=t,m.optionSelected=u,m.removeChoice=p,m.openPopup=d,m.positionPopup=c,m.showBooleanIfNecessary=f,m.cleanShowPopup=g,m.firstBoolean="",m.field.avoidGlobalPopup=!1,m.field.value||(m.field.value="")}function r(e,a){function o(){var o=jQuery(a).find(".form-textarea, .form-text");o.highlightTextarea({words:["AND","OR","NOT"],color:"#CCC",resizable:o.hasClass("form-textarea"),resizableOptions:{maxWidth:o.outerWidth(!0),minWidth:o.outerWidth(!0),minHeight:30}}),jQuery(a).bind("matchesChanged",e.vm.highlightChange),e.element=a}function r(){jQuery(".ui-select-container").once(function(){jQuery(this).click(function(){jQuery(this).find(".ui-select-search").focus()})})}function l(){setTimeout(function(){jQuery(".advanced-search--field-autocomplete-operator").parents(".ui-select-match-item").children(".ui-select-match-close").remove()},0)}function s(){setTimeout(function(){var o=e.vm;if(o.field.autocompletePath){var r=jQuery(a).children(".booleans-popup--container"),l=jQuery(a).find(".ui-select-search");l.wrap('<div class="booleans-popup-input--container"></div>'),jQuery(a).find(".booleans-popup-input--container").prepend(r)}},0)}n=e,i=n.$parent,i.main.booleansPopup={show:!1},t=a,setTimeout(o,0),setTimeout(r,0),setTimeout(l,0),setTimeout(s,0)}var l,t,n,i;e.$on("drupalDataReady",function(){var e=a.getDrupalData();l=e.modulePath});var s={templateUrl:"/apachesolr_angularjs_search/src/components/booleansPopup/booleans-popup.html",restrict:"A",scope:{field:"=",group:"="},link:r,controller:o,controllerAs:"vm",bindToController:!0};return s}angular.module("apachesolrAngularjsSearch").directive("aasBooleansPopup",["$rootScope","drupalDataService",e])}(),function(){"use strict";function e(e,a){function o(){function e(e){a.selected=e,a.expanded=!1}var a=this;a.expanded=!1,a.selectItem=e}var r;e.$on("drupalDataReady",function(){var e=a.getDrupalData();r=e.modulePath});var l={templateUrl:"/apachesolr_angularjs_search/src/components/booleansSelect/booleans-select.html",restrict:"A",scope:{options:"=aasBooleansSelectOptions",selected:"=ngModel"},controller:o,controllerAs:"vm",bindToController:!0};return l}angular.module("apachesolrAngularjsSearch").directive("aasBooleansSelect",["$rootScope","drupalDataService",e])}(),function(){"use strict";function e(e,a,o,r,l,t){function n(){for(var e=0;e<s.groups.length;e++)s.groups[e].groupIndex=e}function i(e,a){if(!e.value)return e.value=[],!1;for(var o=0;o<e.value.length;o++)if(e.value[o].id===a)return!0;return!1}var s=this;e.$on("drupalDataReady",function(){function u(e,a){return{id:e,name:e,position:a,internalConnector:"and",nextConnector:"and",fields:[],selectedFields:[],closeButtonVisible:[],activeCount:0,activeAddField:!1,differentFieldsCount:1}}function p(e,a){void 0!==s.groups[e].selectedFields[a-1]&&void 0!==s.groups[e].selectedFields[a]&&(s.groups[e].selectedFields[a].id===s.groups[e].selectedFields[a-1].id?s.groups[e].selectedFields[a].hide=!0:s.groups[e].selectedFields[a].hide=!1),void 0!==s.groups[e].selectedFields[a+1]&&void 0!==s.groups[e].selectedFields[a]&&(s.groups[e].selectedFields[a+1].id===s.groups[e].selectedFields[a].id?s.groups[e].selectedFields[a+1].hide=!0:s.groups[e].selectedFields[a+1].hide=!1)}function d(e,a){var o=angular.copy(s.groups[e].selectedFields[a]);o&&(s.groups[e].fields[a]=o,p(e,a),s.groups[e].saved=!1)}function c(e){var a;if(!e)return angular.copy(s.fields.selected[1]);for(a=0;a<s.fields.selected.length;a++)if(s.fields.selected[a].id===e)return angular.copy(s.fields.selected[a]);return!1}function f(e,a,o){var r=!1;return void 0===o&&(void 0===s.groups[e].activeCount&&(s.groups[e].activeCount=s.groups[e].fields.length),o=s.groups[e].activeCount,r=!0),s.groups[e].selectedFields.splice(o+1,0,a),p(e,o),s.groups[e].fields.splice(o+1,0,a),r&&(s.groups[e].activeAddField=!1),s.groups[e].activeCount++,s.groups[e].saved=!1,o}function g(e){for(var a=[],o=0;o<s.groups[e].fields.length;o++){var r=s.groups[e].fields[o];-1===a.indexOf(r.id)&&a.push(r.id)}s.groups[e].differentFieldsCount=a.length}function h(e,a){var o=angular.copy(a),r=f(e,o);s.groups[e].fields[r-1]&&s.groups[e].fields[r-1].id===s.groups[e].fields[r].id&&(s.groups[e].fields[r].previousConnector="or"),g(e)}function v(e,a){s.groups[e].fields.splice(a,1),s.groups[e].selectedFields.splice(a,1),s.groups[e].activeCount--,p(e,a-1),g(e)}function m(e,a){s.groups[e].fields[a].previousConnector||(s.groups[e].fields[a].previousConnector="and");var o=angular.copy(s.groups[e].fields[a]);o.value=[],f(e,o,a)}function y(){for(var e=s.groups.length,a=u("group_"+e,e),o=0;o<s.fields.always.length;o++)a.fields[o]=angular.copy(s.fields.always[o]),a.fields[o].value=void 0,a.fields[o].autocompletePath&&(a.fields[o].value=[]),a.activeCount++;a.selectedFields[0]=a.fields[0],s.groups.push(a)}function j(e){s.groups.splice(e,1),n()}function b(e,a){a&&a.length>2&&(e.searching=!0,o.get("/"+e.autocompletePath+"/"+a).then(function(a){if(200===a.status){e.choices=[];for(var o=0;o<a.data.length;o++)i(e,a.data[o].id)||e.choices.push(a.data[o])}e.searching=!1}))}function x(e,a,o,r){a.stopPropagation();var l="choice-"+e.id,t=a.pageX,n=a.pageY-250;if(!e.clicked){e.clicked=!0;var i=a.target;angular.element(i).on("click",Drupal.CTools.Modal.clickAjaxLink);var s={};s.url="/"+e.path+"/"+o+"/"+r,s.event="click",s.setClick=!0,Drupal.ajax[l]=new Drupal.ajax(l,i,s)}window.scroll(t,n),Drupal.ajax[l].trigger()}function P(){s.groups=[],s.groups[0]=u("default",0);var e=0;for(e=0;e<s.fields.always.length;e++)s.groups[0].fields[e]=s.fields.always[e],s.groups[0].fields[e].value=void 0,s.groups[0].fields[e].autocompletePath&&(s.groups[0].fields[e].value=[]),s.groups[0].activeCount++;for(s.groups[0].selectedFields[0]=s.groups[0].fields[0],s.selectedField=c("__fulltext_search"),e=0;e<s.fields.limitby.length;e++)if(s.fields.limitby[e].value=void 0,s.fields.limitby[e].autocompletePath&&(s.fields.limitby[e].value=[]),s.fields.limitby[e].value2&&(s.fields.limitby[e].value2=void 0),"group"===s.fields.limitby[e].type){var a=0;for(a=0;a<s.fields.limitby[e].fields.length;a++)s.fields.limitby[e].fields[a].value=void 0}}function $(){s.processingSearch=!0,l.sendSearch(s.groups,s.fields.limitby,B).then(function(e){var o=e.uri;if(!jQuery("div.ie9inf").length){var r=e.aasBaseUrl,l=e.searchFormPath,t=o.replace("apachesolr-angularjs-search","advancedsearch");a.path(t).replace(r,l)}window.location.href=o})}function w(e){s.groups[e].name=s.groups[e].tempName,s.groups[e].processingSave=!0,s.groups[e].saving=!1,s.groups[e].saved=!0,t.saveGroup(s.groups[e]).then(function(a){200===a.status&&(s.groups[e].processingSave=!1,s.groups[e].tempName=void 0)})}function S(e){var a=0;for(a=0;a<e.fields.length;a++)if(e.fields[a].value)return!1;return!0}function D(){for(var e=0;e<s.groups.length;e++)for(var a=0;a<s.groups[e].fields.length;a++)if(s.groups[e].fields[a].avoidGlobalPopup=!0,s.groups[e].fields[a].autocompletePath&&void 0!==s.groups[e].fields[a].value&&s.groups[e].fields[a].value.length)for(var o=0;o<s.groups[e].fields[a].value.length;o++)s.groups[e].fields[a].value[o].showPopup&&(s.groups[e].fields[a].value[o].showPopup=!1)}function C(e,a){var o=0;if(a.value)for(o=0;o<a.value.length;o++)if(a.value[o]===e)return o;return!1}function T(e,a){var o=C(e,a);o===!1?(a.value&&a.multiple||(a.value=[]),a.value.push(e)):a.value.splice(o,1)}function A(e,a){27===e.keyCode&&(s.groups[a].saving=!1)}function Q(e){e.choices=[]}function F(){jQuery(".ui-select-container").once(function(){jQuery(this).click(function(){jQuery(this).find(".ui-select-search").focus()})}),jQuery(".advanced-search--container").once("click",function(){jQuery(this).click(function(e){var a;void 0!==e.originalEvent.data&&(a=e.originalEvent.data.field);for(var o=0;o<s.groups.length;o++)for(var r=0;r<s.groups[o].fields.length;r++){var l=s.groups[o].fields[r];if(l.autocompletePath)if(a)if(l.$$hashKey===a.$$hashKey){if(l.value.length){var t=l.value[l.value.length-1];"OR"!==t.name&&"AND"!==t.name&&"NOT"!==t.name||(l.avoidGlobalPopup=!0)}}else l.avoidGlobalPopup=!0;else l.avoidGlobalPopup=!0}})})}var G=r.getDrupalData(),I=G.fields,B=G.pageId,N=G.groups,O=G.limitBy;e.$on("newGroupReady",function(e,a){a.processingSave=!1,s.groups.push(a),n()}),e.$on("newTermReady",function(e,a){var o=a.groupIndex,r=a.fieldIndex,l=a.term;void 0===s.groups[o].fields[r].value&&(s.groups[o].fields[r].value=[]),i(s.groups[o].fields[r],l.id)||(s.groups[o].fields[r].value.push({id:l.id,name:l.name}),Drupal.CTools.Modal.dismiss(),jQuery("body").unbind("keypress"),s.groups[o].fields[r].choices=[],jQuery(jQuery(jQuery(".advanced-search--group-content")[o]).find(".advanced-search--field-container")[r]).find(".ui-select-search").val(""))}),s.clearForm=P,s.processForm=$,s.fieldChanged=d,s.addFieldConfirm=h,s.deleteField=v,s.addSameField=m,s.addSearchGroup=y,s.deleteGroup=j,s.saveGroup=w,s.getChoices=b,s.startPopup=x,s.selectOption=T,s.isOptionSelected=C,s.groupNameKeypress=A,s.clearChoices=Q,s.isGroupEmpty=S,s.closeAllPopups=D,s.fields={},s.groups=[],s.operators=[];var k=angular.element(document.getElementById("mainController"));angular.element(k).unbind("drupalDataReady");var R,_;for(R in I)for(_=0;_<I[R].length;_++)"boolean"===I[R][_].type?I[R][_].type="checkbox":"string"===I[R][_].type?I[R][_].type="text":"numeric"===I[R][_].type&&(I[R][_].type="number");if(s.fields=I,O&&(s.fields.limitby=O),N)s.groups=N;else{for(s.groups[0]=u("default",0),_=0;_<s.fields.always.length;_++)s.groups[0].fields[_]=angular.copy(s.fields.always[_]),s.groups[0].activeCount++;s.groups[0].selectedFields[0]=s.groups[0].fields[0]}s.selectedField=c("__fulltext_search"),s.operators=["and","or","not"],setTimeout(F,0)})}angular.module("apachesolrAngularjsSearch").controller("mainController",["$rootScope","$location","$http","drupalDataService","searchPostService","searchGroupService",e])}();