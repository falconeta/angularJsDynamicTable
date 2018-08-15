'use strict';

function table() {
  return {
    bindings: {
      tableData: '<'
    },
    templateUrl: 'table.html',
    controllerAs: 'tableC',
    controller: tableController
  };
}

function tableController($log) {
  /* jshint validthis: true */
  var vm = this;
  var totalWidth = 100;
  var minWidth = 7;
  var maxWidth = 45;

  // vm variables
  vm.chartsParams = {};
  vm.widthTableCell = [];
  vm.errorTable = false;
  vm.errorBrand = false;

  // vm functions

  $log.debug('reportTable');

  vm.$onInit = function () {
    angular.isDefined(vm.tableData) &&
      angular.isDefined(vm.tableData.thLabel) &&
      angular.isDefined(vm.tableData.tdData) ? manageWidthTable() : vm.errorTable = true;
  };

  /**
   * @name manageWidthTable
   * @description manages the width of table cells. use the length of the content
   * @return {null}
   */
  function manageWidthTable() {
    if (vm.tableData.tdData.length !== 0) {
      addWidthTable(vm.tableData.thLabel, vm.tableData.tdData);
      while (_.sumBy(vm.widthTableCell) > totalWidth) {
        _.forEach(vm.widthTableCell, subtractWidth);
      }
      totalWidth - _.sumBy(vm.widthTableCell) !== 0 && correctTotalWidth();
    } else {
      vm.errorBrand = true;
    }
  }

  function subtractWidth(width, index) {
    vm.widthTableCell[index] = width > minWidth ? width - 1 : width;
  }

  function addWidthTable(arrayLabel, arrayData) {
    addWidthArray(arrayLabel, true);
    _.forEach(arrayData, function (data) {
      addWidthArray(data, false);
    });
  }

  function addWidthArray(array, isLabel) {
    _.forEach(array, function (value, index) {
      if (angular.isDefined(value)) {
        isLabel ? vm.widthTableCell.push(value.length) : vm.widthTableCell[index] < value.length && (vm.widthTableCell[index] = value.length);
        vm.widthTableCell[index] < minWidth && (vm.widthTableCell[index] = minWidth);
        vm.widthTableCell[index] > maxWidth && (vm.widthTableCell[index] = maxWidth);
      } else {
        vm.errorTable = true;
      }
    });
  }

  function correctTotalWidth() {
    var difference = totalWidth - _.sumBy(vm.widthTableCell);
    while (difference !== 0) {
      _.forEach(vm.widthTableCell, correctWidth);
    }

    function correctWidth(width, index) {
      if (difference !== 0) {
        vm.widthTableCell[index] = width + 1;
        difference -= 1;
      }
    }
  }
}
tableController.$inject = ['$log'];

angular.module('angularTable', [])
  .component('angularTable', table());
