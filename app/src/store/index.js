import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({//Redux store'umuzu configureStore ile oluşturuyoruz, böylece uygulamanın farklı bölümlerinde kullanıcı bilgilerini merkezi bir şekilde yönetebiliriz
  reducer: {//Store'un reducer'ını tanımlıyoruz, burada auth dilimini ekliyoruz ve böylece kullanıcı bilgilerine ve giriş durumuna uygulamanın her yerinden erişebiliriz
    auth: authReducer,//auth dilimini store'a ekliyoruz, böylece kullanıcı bilgilerine ve giriş durumuna uygulamanın her yerinden erişebiliriz 
  },
});
export default store;//Store'u export ediyoruz, böylece uygulamanın diğer bölümlerinde kullanıcı bilgilerini güncelleyebilir ve erişebiliriz  