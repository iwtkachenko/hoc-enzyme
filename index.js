'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _enzyme = require('enzyme');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RealyEnzyme = function () {
  function RealyEnzyme() {
    _classCallCheck(this, RealyEnzyme);
  }

  _createClass(RealyEnzyme, null, [{
    key: 'setup',
    value: function setup() {
      _enzyme.ReactWrapper.prototype.diveInto = function (predicate) {
        var single = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var result = RealyEnzyme.diveInto(this, predicate, single);
        return this.wrap(result);
      };
    }
  }, {
    key: 'diveInto',
    value: function diveInto(wrapper, predicate) {
      var _this = this;

      var single = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var result = wrapper.reduce(function (result, node) {
        var children = node.prop('children');
        if (children && !Array.isArray(children)) {
          children = [children];
        }
        if (children) {
          for (var index in children) {
            if (children[index] && children[index].type) {
              var child = (0, _enzyme.mount)(children[index]);
              if (predicate(child, node, index)) {
                result.push(child);
                if (single) {
                  break;
                }
              }
              result = result.concat(_this.diveInto(child, predicate, single)).filter(function (el) {
                return el;
              });
            }
          }
        }

        return result;
      }, []);

      return single ? result.shift() : result;
    }
  }]);

  return RealyEnzyme;
}();

exports.default = RealyEnzyme;
