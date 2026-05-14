import { Provider } from 'react-redux';
import { store } from '../src/store'; 
import AppNavigator from '../src/navigation/AppNavigator';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}