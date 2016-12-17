'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _enzyme = require('enzyme');

var _element = require('./unwrap/rendered/element');

var _element2 = _interopRequireDefault(_element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HOCEnzyme = function () {
  function HOCEnzyme() {
    _classCallCheck(this, HOCEnzyme);
  }

  _createClass(HOCEnzyme, null, [{
    key: 'setup',
    value: function setup() {
      _enzyme.ReactWrapper.prototype.diveInto = function (predicate) {
        var single = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        return this.wrap(HOCEnzyme.diveIntoMounted(this, predicate, single));
      };

      _enzyme.ShallowWrapper.prototype._passedContext = null;

      _enzyme.ShallowWrapper.prototype.setPassedContext = function (context) {
        this._passedContext = context;
      };

      _enzyme.ShallowWrapper.prototype.diveInto = function (predicate) {
        var single = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        return this.wrap(HOCEnzyme.diveIntoShallowed(this, predicate, single));
      };
    }
  }, {
    key: 'diveIntoMounted',
    value: function diveIntoMounted(wrapper, predicate) {
      var _this = this;

      var single = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var result = [];
      var unwrapper = new _element2.default(wrapper);
      if (unwrapper.hasRenderedComponent()) {
        var unwrapped = unwrapper.unwrapElement();
        try {
          if (predicate(unwrapped, wrapper, 0)) {
            if (single) {
              return unwrapped;
            }
            result.push(unwrapped);
          }
        } catch (e) {}

        var tmp = void 0;
        if (tmp = this._diveAndProcess(result, unwrapped, predicate, single)) {
          return tmp;
        }
      }
      result = wrapper.reduce(function (result, node) {
        var children = node.prop('children');
        if (children && !Array.isArray(children)) {
          children = [children];
        }
        if (node.node.renderedElement) {
          children = children || [];
          children.push(node.node.renderedElement);
        }
        if (children) {
          for (var index in children) {
            var _unwrapped = children[index];
            var child = void 0;
            if (_unwrapped && _unwrapped.type) {
              var context = node.node.context || null;
              if (node.node.type && node.node.type.childContextTypes) {
                for (var type in node.node.type.childContextTypes) {
                  context = context || {};
                  context[type] = node.prop(type);
                }
              }
              if (context) {
                child = (0, _enzyme.mount)(_unwrapped, { context: context });
              } else {
                child = (0, _enzyme.mount)(_unwrapped);
              }
              child.__unwrapped = _unwrapped;
            }
            if (child) {
              try {
                if (predicate(child, node, index)) {
                  result.push(child);
                  if (single) {
                    return result;
                  }
                }
              } catch (e) {}

              var _tmp = void 0;
              if (_tmp = _this._diveAndProcess(result, child, predicate, single)) {
                result.push(_tmp);
                return result;
              }
            }
          }
        }

        return result;
      }, result);

      return single ? result.shift() : result;
    }
  }, {
    key: '_diveAndProcess',
    value: function _diveAndProcess(result, item, predicate, single) {
      var extracted = this.diveIntoMounted(item, predicate, single);
      if (single) {
        if (extracted) {
          return extracted;
        }
      } else {
        if (extracted.length) {
          result.push.apply(result, _toConsumableArray(extracted));
        }
      }

      return null;
    }
  }, {
    key: 'diveIntoShallowed',
    value: function diveIntoShallowed(wrapper, predicate) {
      var single = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var _wrapped = wrapper;
      var result = [];
      if (_wrapped.node.type.WrappedComponent) {
        var context = {};
        if (_wrapped._passedContext) {
          for (var prop in _wrapped.node.type.contextTypes) {
            context[prop] = _wrapped._passedContext[prop];
          }
        }
        _wrapped = _wrapped.dive({ context: context });
        if (predicate(_wrapped, wrapper)) {
          result.push(_wrapped);
          if (single) {
            return _wrapped;
          }
        }
        result = result.concat(this.diveIntoShallowed(_wrapped.shallow(), predicate, single)).filter(function (el) {
          return el;
        });
        if (single && result.length) {
          return result.shift();
        }
      }
      result = result.concat(wrapper.findWhere(predicate).nodes).filter(function (el) {
        return el;
      });

      return single ? result.shift() : result;
    }
  }]);

  return HOCEnzyme;
}();

exports.default = HOCEnzyme;