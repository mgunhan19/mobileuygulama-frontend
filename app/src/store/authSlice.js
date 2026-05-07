import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({//Redux dilimini kullanarak authSlice oluşturuyoruz, böylece kullanıcı bilgilerini ve giriş durumunu merkezi bir şekilde yönetebiliriz
  name: 'auth',
  initialState: {user: null, isLoggedIn: false},
  reducers: {
    loginAction: (state, action) => {//Giriş yapan kullanıcıyı Redux'a kaydediyoruz
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logoutAction: (state) => {//Çıkış yapıldığında kullanıcı bilgilerini temizliyoruz
      state.user = null;
      state.isLoggedIn = false;
    }
  }
});

export const {loginAction, logoutAction} = authSlice.actions;//Redux aksiyonlarını ve reducer'ı export ediyoruz, böylece uygulamanın diğer bölümlerinde kullanıcı bilgilerini güncelleyebilir ve erişebiliriz
export default authSlice.reducer;//Redux dilimini kullanarak authSlice oluşturuyoruz, böylece kullanıcı bilgilerini ve giriş durumunu merkezi bir şekilde yönetebiliriz