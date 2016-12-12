
import { mount, ReactWrapper, ShallowWrapper } from 'enzyme'

import RenderedElementUnwrapper from './unwrap/rendered/element'

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

  static _diveAndProcess(result, item, predicate, single) {
    let extracted = this.diveIntoMounted(item, predicate, single)
    if (single) {
      if (extracted) {
        return extracted
      }
    } else {
      if (extracted.length) {
        result.push(...extracted)
      }
    }

    return null
  }

  static diveIntoMounted (wrapper, predicate, single = true) {
    let result = []
    const unwrapper = new RenderedElementUnwrapper(wrapper)
    if (unwrapper.hasRenderedComponent()) {
      const unwrapped = unwrapper.unwrapElement()
      try {
        if (predicate(unwrapped, wrapper, 0)) {
          if (single) {
            return unwrapped;
          }
          result.push(unwrapped)
        }
      } catch (e) {}

      let tmp
      if (tmp = this._diveAndProcess(result, unwrapped, predicate, single)) {
        return tmp;
      }
    }
    result = wrapper.reduce((result, node) => {
      let children = node.prop('children')
      if (children && !Array.isArray(children)) {
        children = [children]
      }
      const unwrapper = new RenderedElementUnwrapper(node)
      if (unwrapper.hasRenderedComponent()) {
        children = children || []
        children.push(unwrapper)
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
            case (unwrapped instanceof RenderedElementUnwrapper):
              child = unwrapped.unwrapElement()
              break;
          }
          if (child) {
            try {
              if (predicate(child, node, index)) {
                result.push(child)
                if (single) {
                  return result;
                }
              }
            } catch(e) {}

            let tmp
            if (tmp = this._diveAndProcess(result, child, predicate, single)) {
              result.push(tmp)
              return result;
            }
          }
        }
      }

      return result
    }, result)

    return single ? result.shift() : result
  }
}
