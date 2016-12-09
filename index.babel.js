
import { mount, ReactWrapper } from 'enzyme'

export default class RealyEnzyme {
  static setup() {
    ReactWrapper.prototype.diveInto = function (predicate, single = true) {
      const result = RealyEnzyme.diveInto(this, predicate, single)
      return this.wrap(result)
    }
  }

  static diveInto (wrapper, predicate, single = true) {
    let result = wrapper.reduce((result, node) => {
      let children = node.prop('children')
      if (children && !Array.isArray(children)) {
        children = [children]
      }
      if (children) {
        for (const index in children) {
          if (children[index] && children[index].type) {
            const child = mount(children[index])
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
