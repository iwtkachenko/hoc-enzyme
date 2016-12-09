# relay-enzyme
Solving painful headless testing of Relay-produced HOCs

Install
-------

1. npm install -D hoc-enzyme enzyme
2. Edit your Mocha's setup.js
  1. import HOCEnzyme from 'hoc-enzyme'
  2. HOCEnzyme.setup()


Usage
-----

```javascript
describe('<Home/>', () => {
  let wrapper = null

  jsdom()

  const counter = (child, node, index) =>
    node.type() == View && child.type() == Text && index == 2

  const button = child => child.type() == TouchableHighlight

  Relay.injectNetworkLayer(new RelayLocalSchema.NetworkLayer({ schema }))

  before(done => {
    wrapper = mount(<Home />)
    done()
  })

  it('should render select text', done => {
    const view = wrapper.find(View)
    // Use predicate to find not presented children
    expect(view.diveInto(counter)).to.have.props({children: 0})

    view.diveInto(button).prop('onPress')()
    setTimeout(() => {
      expect(view.diveInto(counter)).to.have.props({children: 1})
      done()
    }, 10)
  })
})
```
