import React, { Component} from 'react'
import axios from 'axios'

import './Comments.css'
import Comment from './Comment'

class Comments extends Component {
  constructor (props) {
    super(props)

    this.state = {
      error: '',
      status: 'success',
      comments: [],
    }
  }

  componentDidMount () {
    const { id } = this.props

    console.log(id)

    if (this.state.status === 'fetching') {
      return
    }

    this.cancelToken = axios.CancelToken.source()

    this.setState({ status: 'fetching' }, () => {
      axios.get('/post/comment/view', {
        cancelToken: this.cancelToken.token,
        params: {
          object_id: id
        },
      })
        .then(response => response.data)
        .then(data => this.setState({ comments: data, status: 'success' }))
        .catch(error => {
          if (axios.isCancel(error)) {
            return
          }

          this.setState({ error: error.message, status: 'failure' })
        })
    })
  }

  componentWillUnmount () {
    this.cancelToken.cancel('Comments load canceled by user')
  }

  render () {
    const { comments, error, status } = this.state
    const { count } = this.props

    let countLabel = ''

    if (count === 0) {
      countLabel = 'No hay comentarios'
    } else if (count === 1) {
      countLabel = '1 Comentario'
    } else {
      countLabel = `${count} Comentarios`
    }

    return (
      <div className='comments'>
        <div className='meta'>
          {countLabel}
        </div>
        {
          status === 'fetching' && (
            <div className='spinner'>
              <div className='double-bounce1'></div>
              <div className='double-bounce2'></div>
            </div>
          )
        }
        {
          status === 'failure' && (
            <div className='alert alert-danger text-center'>
              <strong>
                ¡Houston tenemos problemas! Intenta recargar la página
              </strong>
              <br/>
              {error}
            </div>
          )
        }
        { comments.map(i => <Comment key={i.id} {...i}/>) }
      </div>
    )
  }
}

export default Comments
