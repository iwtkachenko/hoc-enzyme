# relay-enzyme
Solving painful headless testing of Relay-produced HOCs

Install
-------

1. npm install -D relay-enzyme enzyme
2. Edit your Mocha's setup.js
  1. import RelayEnzyme from 'relay-enzyme'
  2. RelayEnzyme.setup()


Usage
-----
```javascript
// Home.js
// @flow

import React, { Component, PropTypes } from 'react'
import Relay, { RootContainer, Route, Store, Renderer } from 'react-relay'

import { View, Text, TouchableHighlight, StyleSheet } from 'react-native'


export class RelayRootRoute extends Route {
  static queries = {
    datum: () => Relay.QL`query { datum(id: $id) }`
  }

  static routeName = 'RelayRootRoute'
}

class DatumMutation extends Relay.Mutation {
  static fragments = {
    datum: () => Relay.QL`
      fragment on Datum {
        id
        message
        counter
      }
    `
  }

  getMutation () {
    return Relay.QL`mutation { pokeDatum }`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on PokeDatumPayload @relay(pattern: true) {
        datum {
          counter
        }
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        datum: this.props.datum.id
      }
    }]
  }

  getVariables () {
    return {
      id: this.props.datum.id
    }
  }
}

export class LobbyHomeComponent extends Component {
  static propTypes = {
    datum: PropTypes.object,
    relay: PropTypes.object
  }

  onClick () {
    Store.commitUpdate(new DatumMutation({datum: this.props.datum}))
  }

  render () {
    return (
      <View style={StyleSheet.create({
        stl: {
          top: 80
        }
      }).stl}>
        <TouchableHighlight onPress={this.onClick.bind(this)}>
          <Text>Select</Text>
        </TouchableHighlight>
        <Text>{this.props.datum ? this.props.datum.message : ''}</Text>
        <Text>{this.props.datum ? this.props.datum.counter : ''}</Text>
      </View>
    )
  }
}

export const _LobbyHomeComponent = Relay.createContainer(LobbyHomeComponent, {
  initialVariables: {
    message: '?',
    counter: 0
  },
  fragments: {
    datum: () => Relay.QL`
      fragment on Datum {
        id
        message
        counter
        ${DatumMutation.getFragment('datum')}
      }
    `
  }
})

export default class LobbyHomeComponentContainer extends Component {
  render () {
    return (
      <Renderer Container={_LobbyHomeComponent}
        queryConfig={new RelayRootRoute({id: '0'})}
        environment={Relay.Store}/>
    )
  }
}
```

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
