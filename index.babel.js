
import { mount, ReactWrapper } from 'enzyme'

export default class HOCEnzyme {
  static setup() {
    ReactWrapper.prototype.diveInto = function (predicate, single = true) {
      const result = HOCEnzyme.diveInto(this, predicate, single)
      return this.wrap(result)
    }

    ReactWrapper.prototype.unwrap = function(prop) {
      return mount(this.node[prop])
    }
  }

  static diveInto (wrapper, predicate, single = true) {
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
              child = mount(unwrapped)
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
            result = result.concat(this.diveInto(child, predicate, single))
              .filter(el => el)
          }
        }
      }

      return result
    }, [])

    return single ? result.shift() : result
  }
}
