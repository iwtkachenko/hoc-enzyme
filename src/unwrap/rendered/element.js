
import { ReactWrapper } from 'enzyme'

export default class ElementUnwrapper {
  constructor (node) {
    this.node = node
  }

  hasRenderedComponent() {
    return this.node.node
      && this.node.node._reactInternalInstance
      && this.node.node._reactInternalInstance._renderedComponent;
  }

  unwrapElement() {
    return this.node.wrap(
      this.node.node._reactInternalInstance._renderedComponent._currentElement
    )
  }
}
