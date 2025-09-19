import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable, ScrollView } from "react-native";
import { router, Link } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/auth/login");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header / Welcome */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
           Welcome back,{" "}
          <Text style={{ fontWeight: "bold" }}>
            {user?.email?.split("@")[0] || "Student"}
          </Text>
        </Text>
        <Text style={styles.subtitle}>Stay on top of your study tasks </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.cardsContainer}>
        <Pressable style={[styles.card, { backgroundColor: "#21cc8d" }]} onPress={() => router.push("/goals")}>
          <Ionicons name="book-outline" size={30} color="white" />
          <Text style={styles.cardText}>View Tasks</Text>
        </Pressable>

        <Pressable style={[styles.card, { backgroundColor: "#007bff" }]} onPress={() => router.push("/goals/create")}>
          <Ionicons name="add-circle-outline" size={30} color="white" />
          <Text style={styles.cardText}>Add Task</Text>
        </Pressable>

        <Pressable style={[styles.card, { backgroundColor: "#ff8c42" }]} onPress={() => router.push("/chat")}>
          <Ionicons name="chatbubble-ellipses-outline" size={30} color="white" />
          <Text style={styles.cardText}>AI Tutor</Text>
        </Pressable>
      </View>

      {/* Motivation / Footer */}
      <View style={styles.footer}>
        <Text style={styles.motivation}> Small progress is still progress! </Text>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    marginTop: 30,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginTop: 4,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  card: {
    width: "48%",
    height: 120,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  motivation: {
    fontStyle: "italic",
    color: "#555",
  },
});
