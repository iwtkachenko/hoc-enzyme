
import { mount, ReactWrapper, ShallowWrapper } from 'enzyme'

export default class HOCEnzyme {
  static setup() {
    ReactWrapper.prototype.diveInto = function (predicate, single = true) {
      return this.wrap(HOCEnzyme.diveIntoMounted(this, predicate, single))
    }

    ShallowWrapper.prototype._passedContext = null

    ShallowWrapper.prototype.setPassedContext = function (context) {
      this._passedContext = context
    }

    ShallowWrapper.prototype.diveInto = function (predicate, single = true) {
      return this.wrap(HOCEnzyme.diveIntoShallowed(this, predicate, single))
    }
  }

  static diveIntoShallowed(wrapper, predicate, single = true) {
    let _wrapped = wrapper;
    let result = []
    if (_wrapped.node.type.WrappedComponent) {
      let context = {}
      if (_wrapped._passedContext) {
        for (const prop in _wrapped.node.type.contextTypes) {
          context[prop] = _wrapped._passedContext[prop]
        }
      }
      _wrapped = _wrapped.dive({context})
      if (predicate(_wrapped, wrapper)) {
        result.push(_wrapped)
        if (single) {
          return _wrapped;
        }
      }
      result = result.concat(this.diveIntoShallowed(_wrapped.shallow(), predicate, single))
        .filter(el => el)
      if (single && result.length) {
        return result.shift()
      }
    }
    result = result.concat(wrapper.findWhere(predicate).nodes)
      .filter(el => el)

    return single ? result.shift() : result;
  }

  static diveIntoMounted (wrapper, predicate, single = true) {
    let result = wrapper.reduce((result, node) => {
      let children = node.prop('children')
      if (children && !Array.isArray(children)) {
        children = [children]
      }
      if (node.node._reactInternalInstance
        && node.node._reactInternalInstance._renderedComponent) {
        children = children || []
        children.push(node.node._reactInternalInstance._renderedComponent)
      }
      if (node.node.renderedElement) {
        children = children || []
        children.push(node.node.renderedElement)
      }
      if (children) {
        for (const index in children) {
          const unwrapped = children[index]
          let child;
          switch (true) {
            case !!(unwrapped && unwrapped.type):
              let context = node.node.context || {}
              child = mount(unwrapped, {context})
              break;
            case !!(unwrapped && unwrapped._currentElement):
              child = node.wrap(unwrapped._currentElement)
              break;
          }
          if (child) {
            if (predicate(child, node, index)) {
              result.push(child)
              if (single) {
                break
              }
            }
            result = result.concat(this.diveIntoMounted(child, predicate, single))
              .filter(el => el)
          }
        }
      }

      return result
    }, [])

    return single ? result.shift() : result
  }
}
