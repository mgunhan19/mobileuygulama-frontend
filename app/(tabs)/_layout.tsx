import { Provider } from 'react-redux';
import { store } from '../src/store'; 
import AppNavigator from '../src/navigation/AppNavigator'; // Senin eski yöntem dosyan

export default function RootLayout() {
  return (
    <Provider store={store}>
       {/* Expo Router'ın Stack yapısını değil, kendi AppNavigator'ını çağırıyoruz */}
       <AppNavigator />
    </Provider>
  );
}