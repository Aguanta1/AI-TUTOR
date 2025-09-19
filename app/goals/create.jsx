import { useState } from 'react'
import { StyleSheet, Text, TextInput, Pressable, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGoals } from '../../hooks/useGoals'
import { useRouter } from 'expo-router'
import { auth } from '../../firebaseConfig'

const Create = () => {
  const [goal, setGoal] = useState('')
  const { createGoal } = useGoals()
  const router = useRouter();

  const handleSubmit = async () => {
    if (!goal.trim()) return;

    await createGoal({
      title: goal,          
      progress: 0,
      userId: auth.currentUser.uid,  
      createdAt: new Date(),         
    })

    setGoal('')
    Keyboard.dismiss()
    router.push('/goals')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Add a New Study Task</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your study task"
        value={goal}
        onChangeText={setGoal}
      />

      <Pressable onPress={handleSubmit} style={styles.button}>
        <Text style={{ color: 'white' }}>Save Study Task</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default Create

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
  },
  input: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginVertical: 40,
  },
  button: {
    padding: 18,
    backgroundColor: '#21cc8d',
    color: 'white',
    borderRadius: 8,
  }
})
