'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _enzyme = require('enzyme');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ElementUnwrapper = function () {
  function ElementUnwrapper(node) {
    _classCallCheck(this, ElementUnwrapper);

    this.node = node;
  }

  _createClass(ElementUnwrapper, [{
    key: 'hasRenderedComponent',
    value: function hasRenderedComponent() {
      return this.node.node && this.node.node._reactInternalInstance && this.node.node._reactInternalInstance._renderedComponent;
    }
  }, {
    key: 'unwrapElement',
    value: function unwrapElement() {
      return this.node.wrap(this.node.node._reactInternalInstance._renderedComponent._currentElement);
    }
  }]);

  return ElementUnwrapper;
}();

exports.default = ElementUnwrapper;