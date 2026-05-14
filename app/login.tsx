import { View, Text, Button } from 'react-native';

export default function LoginScreen(){//Giriş ekranı bileşeni, kullanıcıların giriş yapabileceği bir arayüz sağlar. Şu anda sadece basit bir metin gösteriyor, ancak ilerleyen haftalarda bu ekranı kullanıcı adı ve şifre girişi için geliştireceğiz.
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Giriş Ekrani (Bildin Bildin)</Text>
    </View>
  );
}