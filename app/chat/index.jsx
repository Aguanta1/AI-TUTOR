import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const flatListRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");
    setTyping(true); // show typing indicator

    const faqRef = collection(db, "faq");
    const snapshot = await getDocs(faqRef);

    let reply = "🤔 I'm not sure yet, but I’ll learn that soon!";
    snapshot.forEach((doc) => {
      if (input.toLowerCase().includes(doc.data().question.toLowerCase())) {
        reply = doc.data().answer;
      }
    });

    // simulate delay for realism
    setTimeout(() => {
      const aiMsg = { text: reply, sender: "ai" };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false); // hide typing indicator
    }, 1200);
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, typing]);

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageRow,
        item.sender === "user" ? styles.rowUser : styles.rowAI,
      ]}
    >
      {item.sender === "ai" && (
        <Image
          source={require("../../assets/images/ai.png")}
          style={styles.avatar}
        />
      )}

      <View
        style={[
          styles.bubble,
          item.sender === "user" ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>

      {item.sender === "user" && (
        <Image
          source={require("../../assets/images/user.png")}
          style={styles.avatar}
        />
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
      />

      {/* Typing indicator */}
      {typing && (
        <View style={styles.typingContainer}>
          <Image
            source={require("../../assets/images/ai.png")}
            style={styles.avatar}
          />
          <View style={styles.typingBubble}>
            <Text style={styles.typingText}>AI Tutor is typing...</Text>
          </View>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask me anything..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },

  chatContainer: { padding: 10, 
    paddingBottom: 20 ,
    marginTop: 70,
},

  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 6,
  },
  rowUser: { justifyContent: "flex-end", alignSelf: "flex-end" },
  rowAI: { justifyContent: "flex-start", alignSelf: "flex-start" },

  avatar: { width: 32, height: 32, borderRadius: 16, marginHorizontal: 6 },

  bubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: "75%",
  },
  userBubble: {
    backgroundColor: "#007bff",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "#eaeaea",
    borderBottomLeftRadius: 4,
  },
  messageText: { color: "#000", fontSize: 15 },

  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 8,
  },
  typingBubble: {
    backgroundColor: "#eaeaea",
    padding: 8,
    borderRadius: 12,
    marginLeft: 6,
  },
  typingText: { fontSize: 13, color: "#555", fontStyle: "italic" },

  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 15,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#007bff",
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
