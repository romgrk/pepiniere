import React from 'react'
import { clear as clearStore } from '../store'

import Button from '../components/Button'

class ErrorBoundary extends React.Component {
  state = {
    error: undefined,
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  onReload = () => {
    clearStore()
    window.location.reload()
  }

  render() {
    const { error } = this.state

    if (error) {
      return (
        <Label danger>
          An error occured while running the app: {error.message}
          <pre>{error.stack}</pre>
          <Button variant='danger' onClick={this.onReload}>
            Reload Application
          </Button>
        </Label>
      )
    }

    return this.props.children; 
  }
}

export default ErrorBoundary
