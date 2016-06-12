(function () {
    'use strict';

    angular.module('calculator').controller('MainCtrl', function () {

        var vm = this;

        var digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        var operators = ['+', '-', '*', '/'];
        var dot = '.';

        var input = '0';

        var isDigit = function (text) {
            return digits.indexOf(text) >= 0;
        };

        var isOperator = function (text) {
            return operators.indexOf(text) >= 0;
        };

        var isDot = function (text) {
            return text === dot;
        };

        vm.isTyping = true;

        var inputEndsWithTwoOperators = function () {
            if (input.length >= 2) {
                if (isOperator(input[input.length - 1])
                    && isOperator(input[input.length - 2])) {
                    console.log('has two operators');
                    return true;
                }
            }

            return false;
        };

        var appendOperator = function (prevChar, operator) {
            if (input.length === 1 && isOperator(prevChar)) {
                // do nothing
            }
            else if (isDot(prevChar)) {
                input = input.replaceAt(input.length - 1, operator);
            }
            else if (isOperator(prevChar)) {
                if (inputEndsWithTwoOperators()) {
                    if (prevChar === '-' && operator === '-') {
                        // do nothing
                    } else {
                        input = input.substr(0, input.length - 2) + operator;
                    }
                }
                else if (operator === '-') {
                    input += operator;
                } else {
                    input = input.replaceAt(input.length - 1, operator);
                }
            } else {
                input += operator;
            }
        };

        var appendDot = function (prevChar, dot) {
            if (isOperator(prevChar)) {
                input += dot;
            }
            else {
                var hasDot = false;
                for (var i = input.length - 1; i >= 0; i--) {
                    var theChar = input[i];
                    if (isOperator(theChar)) {
                        break;
                    }

                    if (isDot(theChar)) {
                        hasDot = true;
                        break;
                    }
                }

                if (!hasDot) {
                    input += dot;
                }
            }
        };

        var appendDigit = function (prevChar, digit) {
            if (prevChar === '0') {
                var fullZeros = true;
                for (var i = input.length - 1; i >= 0; i--) {
                    var theChar = input[i];
                    if (isOperator(theChar)) {
                        break;
                    }

                    if (theChar !== '0') {
                        fullZeros = false;
                        break;
                    }
                }

                if (fullZeros) {
                    input = input.replaceAt(input.length - 1, digit);
                } else {
                    input += digit;
                }
            } else {
                input += digit;
            }
        };

        vm.append = function (nextChar) {
            if (input === 'Error') {
                input = '0';
            }

            var prevChar = input[input.length - 1];

            if (isOperator(nextChar)) {
                appendOperator(prevChar, nextChar);
            } else if (isDot(nextChar)) {
                appendDot(prevChar, nextChar);
            } else if (isDigit(nextChar)) {
                appendDigit(prevChar, nextChar);
            }

            vm.refreshDisplay(input);
            vm.isTyping = true;
        };

        vm.clear = function () {
            input = '0';

            vm.refreshDisplay(input);
            vm.isTyping = true;
        };

        vm.back = function () {
            if (input === 'Error' || input === 'Infinity' || input === 'NaN') {
                input = '0';
            }
            else if (input.length <= 1) {
                input = '0';
            } else {
                input = input.substr(0, input.length - 1);
            }

            vm.refreshDisplay(input);
        };

        vm.refreshDisplay = function (text) {
            var display = text;

            var element = angular.element(document.querySelectorAll('.col-result'))[0];
            element.scrollTop = element.scrollHeight;

            display = display.replaceAll('\\+', ' + ');
            display = display.replaceAll('\\-', ' - ');
            display = display.replaceAll('\\*', ' × ');
            display = display.replaceAll('\\/', ' ÷ ');
            display = display.replaceAll('e \\- ', 'e−');
            display = display.replaceAll('e \\+ ', 'e+');

            vm.display = display;
        };

        vm.compute = function () {
            input = _.trimEnd(input, '+-*/.');

            var isNumeric = !isNaN(parseFloat(input)) && isFinite(input);

            try {
                input = math.eval(input) + '';
                if (isNaN(input)) {
                    input = 'Error';
                } else if (isFinite(input) && input.indexOf('e') === -1) {
                    input = _.round(input, 8) + '';
                }
                vm.refreshDisplay(input);
                vm.isTyping = isNumeric;
            } catch (err) {
                vm.refreshDisplay('Error');
            }
        };

        vm.refreshDisplay(input);
    });
})();