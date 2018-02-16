var test = require('ava');

var MyMath = require('./MyMath');

test('should be able to add two numbers', function (t) {
    var myMath = new MyMath();
    var num1 = 2;
    var num2 = 5;
    var expected = num1 + num2;

    var actual = myMath.add(num1, num2);

    t.is(actual, expected);
});

test('should be able to add 1 to a number', function (t) {
    var myMath = new MyMath();
    var number = 2;
    var expected = 3;

    var actual = myMath.addOne(number);

    t.is(actual, expected);
});

test('should be able to negate a number', function (t) {
    var myMath = new MyMath();
    var number = 2;
    var expected = -2;

    var actual = myMath.negate(number);

    t.is(actual, expected);
});

test('should be able to recognize a negative number', function (t) {
    var myMath = new MyMath();
    var number = -2;

    var isNegative = myMath.isNegativeNumber(number);

    t.true(isNegative);
});

test('should be able to recognize that 0 is not a negative number', function (t) {
    var myMath = new MyMath();
    var number = 0;

    var isNegative = myMath.isNegativeNumber(number);

    t.false(isNegative);
});
