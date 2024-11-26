import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from '@rneui/themed'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function AuthRegister() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)


  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
            full_name : name
        }
      }
    })

    if (error){
        setLoading(false)
        switch(error.code){
            case "validation_failed": Alert.alert("Preencha todos os campos corretamente!");
                break;
            case "anonymous_provider_disabled": Alert.alert("Preencha todos os campos corretamente!");
                break;
            case "email_exists":  Alert.alert("E-mail já cadastrado!");
                break;
            case "weak_password":  Alert.alert("Senha fraca!");
                break;
            case "user_already_exists": Alert.alert("Usuário já cadastrado!");
                break;
            default:
                Alert.alert("Ops! Aconteceu algum erro.")
        }
        return
    } 
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="seuemail@exemplo.com.br"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Nome Completo"
          leftIcon={{ type: 'font-awesome', name: 'user' }}
          onChangeText={(text) => setName(text)}
          value={name}
          secureTextEntry={true}
          placeholder="Fulano da silva"
          autoCapitalize={'words'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Senha"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Senha"
          autoCapitalize={'none'}
        />
      </View>
     
      <View style={styles.verticallySpaced}>
        <Button title="Cadastrar" disabled={loading} onPress={() => signUpWithEmail()} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})