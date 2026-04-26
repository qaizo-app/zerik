// ErrorBoundary — изолирует runtime-ошибки на уровне поддерева.
// Используется чтобы баг в одном блоке/карточке не валил весь экран.
//
// Usage:
//   <ErrorBoundary fallback={<Text>Card failed to render</Text>}>
//     <CardScreen card={card} />
//   </ErrorBoundary>

import { Component } from 'react';
import { Text, View } from 'react-native';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (typeof this.props.onError === 'function') {
      try { this.props.onError(error, info); } catch (e) {}
    }
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.warn('[ErrorBoundary]', error?.message, info?.componentStack);
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback({ error: this.state.error, reset: this.reset });
      }
      if (this.props.fallback) return this.props.fallback;

      return (
        <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Text style={{ color: '#9A8F7E', fontSize: 14, fontStyle: 'italic', textAlign: 'center' }}>
            Что-то пошло не так
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}
