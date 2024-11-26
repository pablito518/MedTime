import { Session } from "@supabase/supabase-js";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native"
import { supabase } from "../lib/supabase";
import { Button } from "@rneui/themed";

export default function Home({session}: {session: Session}){
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState('')
    const [website, setWebsite] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
  
    useEffect(() => {
      if (session) getUser()
    }, [session])
  
    async function getUser() {
      Alert.alert(session as unknown as string)
      try {
        setLoading(true)
        if (!session?.user) throw new Error('No user on the session!')
  
        const { data, error, status } = await supabase
          .from('User')
          .select(`full_name`)
          .eq('id', session?.user.id)
          .single()
        if (error && status !== 406) {
          throw error
        }
  
        if (data) {
          setUsername(data.full_name)
          Alert.alert(data.full_name)
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message)
        }
      } finally {
        setLoading(false)
      }
    }
    return(
        <View style={styles.container}>
            <Text>Olá, {username} seja bem vindo!</Text>
          <View style={styles.button}>
            <Button title="Sair" onPress={() => supabase.auth.signOut()} />
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    button:{
        width: 200,
        height: 40,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    verticallySpaced: {
      paddingTop: 4,
      paddingBottom: 4,
      alignSelf: 'stretch',
    }
});