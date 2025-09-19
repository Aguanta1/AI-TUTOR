import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const StudyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [visibleMenuId, setVisibleMenuId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'goals'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(list);
    });

    return unsubscribe;
  }, []);

  // DELETE FUNCTION
  const handleDelete = (id) => {
    Alert.alert(
      'Delete Study Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const docRef = doc(db, 'goals', id);
              await deleteDoc(docRef);
              console.log('Task deleted:', id);
            } catch (error) {
              console.log('Error deleting task:', error);
            }
          },
        },
      ]
    );
  };

  // Format Firestore timestamp or JS date
  const formatDate = (date) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskText}>{item.title || 'Untitled Task'}</Text>

        <Pressable
          onPress={() => setVisibleMenuId((prev) => (prev === item.id ? null : item.id))}
          style={styles.menuButton}
        >
          <MaterialIcons name="more-vert" size={24} color="black" />
        </Pressable>
      </View>

      {/* simple inline menu */}
      {visibleMenuId === item.id && (
        <View style={styles.menu}>
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setVisibleMenuId(null);
              router.push(`/goals/edit/${item.id}`);
            }}
          >
            <Text style={styles.menuText}>Edit</Text>
          </Pressable>
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setVisibleMenuId(null);
              handleDelete(item.id);
            }}
          >
            <Text style={styles.menuText}>Delete</Text>
          </Pressable>
        </View>
      )}

      {/* Custom progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${item.progress ?? 0}%` }]} />
        </View>
        <Text style={styles.progressLabel}>{item.progress ?? 0}%</Text>
      </View>

      {/* Created date */}
      <Text style={styles.dateText}>Created on: {formatDate(item.createdAt)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Study Tasks</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No study tasks yet. Add one!</Text>}
      />

      <Pressable
        style={[styles.button, { backgroundColor: 'red', margin: 16 }]}
        onPress={() => signOut(auth)}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default StudyTasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  taskItem: {
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  menuButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  menu: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    marginTop: 8,
    paddingVertical: 6,
    width: 120,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#21cc8d',
  },
  progressLabel: {
    marginTop: 4,
    fontSize: 14,
    color: 'gray',
  },
  dateText: {
    marginTop: 6,
    fontSize: 12,
    color: 'gray',
    fontStyle: 'italic',
  },
  button: {
    padding: 10,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    color: 'gray',
  },
});
