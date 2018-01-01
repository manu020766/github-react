import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import renderer from 'react-test-renderer'

import { Reader } from '../Reader'

Enzyme.configure({ adapter: new Adapter() })

describe('Reader', () => {
  it('renders', () => {
    const component = renderer.create(
      <Reader
        control={{ status: 'success' }}
        post={{ body: '[b]foobar[/b]' }}
      />
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders nothing if no control', () => {
    const component = renderer.create(
      <Reader control={undefined}/>
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders loader when fetching', () => {
    const component = renderer.create(
      <Reader control={{ status: 'fetching' }}/>
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders message error', () => {
    const component = renderer.create(
      <Reader control={{ status: 'failure' }}/>
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('fetchs post on componentDidMount when id is given', () => {
    const match = {
      params: {
        id: 1
      }
    }

    const mock = jest.fn()

    renderer.create(
      <Reader match={match} fetchPost={mock}/>
    )

    expect(mock).toBeCalledWith(1)
  })

  it('does not fetch post on componentDidMount when id is missing', () => {
    const match = {
      params: { }
    }

    const mock = jest.fn()

    renderer.create(
      <Reader match={match} fetchPost={mock}/>
    )

    expect(mock).not.toBeCalled()
  })

  it('fetchs recommends on componentDidMount when id is given', () => {
    const match = {
      params: {
        id: 1
      }
    }

    const mock = jest.fn()

    renderer.create(
      <Reader match={match} fetchRecommends={mock}/>
    )

    expect(mock).toBeCalledWith(1)
  })

  it('does not fetch post on componentDidMount when id is missing', () => {
    const match = {
      params: { }
    }

    const mock = jest.fn()

    renderer.create(
      <Reader match={match} fetchRecommends={mock}/>
    )

    expect(mock).not.toBeCalled()
  })

  it('scrolls to top when componentDidMount', () => {
    const mock = jest.fn()

    window.scrollTo = mock

    renderer.create(
      <Reader/>
    )

    expect(mock).toBeCalledWith(0, 0)
  })

  it('starts fetching next post', () => {
    const mockPost = jest.fn()
    const mockRecommends = jest.fn()
    const mockComments = jest.fn()

    const match = {
      params: {
        id: 1
      }
    }

    const wrapper = mount(
      <Reader
        fetchComments={mockComments}
        fetchPost={mockPost}
        fetchRecommends={mockRecommends}
        match={match}
      />
    )

    expect(mockComments).toBeCalledWith(1)
    expect(mockPost).toBeCalledWith(1)
    expect(mockRecommends).toBeCalledWith(1)

    mockComments.mockClear()
    mockPost.mockClear()
    mockRecommends.mockClear()

    wrapper.setProps({ match: { params: { id: 2 } } })

    expect(mockComments).toBeCalledWith(2)
    expect(mockPost).toBeCalledWith(2)
    expect(mockRecommends).toBeCalledWith(2)
  })
})
