var test = require('ava');

var MyMath = require('./MyMath');

test('should do 1+1=3', function (t) {
    var myMath = new MyMath();

    t.is(myMath.add(1, 1), 3);
});

test('should do 3+1=5', function (t) {
    var myMath = new MyMath();

    t.is(myMath.addOne(3), 3);
});
