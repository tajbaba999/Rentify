import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";

interface Document {
  uri: string;
  name: string;
  type: string;
}

const DocumentUploadScreen = ({ navigation }) => {
  // const navigation = useNavigation();

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const storedDoc = await AsyncStorage.getItem("document");
        if (storedDoc) {
          setDocument(JSON.parse(storedDoc));
        }
      } catch (error) {
        console.error("Error loading document:", error);
      }
    };

    loadDocument();
  }, []);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const selectedFile = result.assets[0];

        const newDocument: Document = {
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.mimeType || "",
        };

        setDocument(newDocument);
        await AsyncStorage.setItem("document", JSON.stringify(newDocument));
      } else {
        Alert.alert("No file selected", "Please select a file to upload.");
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const handleSubmit = async () => {
    if (!document) {
      Alert.alert("Error", "Please select a document");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      const { uid, email } = user;

      // Create FormData to send the file and user info
      const formData = new FormData();
      formData.append("file", {
        uri: document.uri,
        name: document.name,
        type: document.type,
      } as any);
      formData.append("user_id", uid);
      formData.append("email", email);

      // POST the data to the /upload endpoint
      const response = await fetch(`http://192.168.1.2:8000/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }
      console.log("Upload successful, navigating to Products...");
      setTimeout(() => {
        navigation.navigate("Products");
      }, 500);
    } catch (error) {
      console.error("Error during document submission:", error);
      Alert.alert("Error", "Failed to upload document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderDocumentStatus = () => {
    if (!document) {
      return <Text>No file selected</Text>;
    }
    return (
      <View style={styles.fileInfo}>
        <Ionicons
          name={document.type.includes("pdf") ? "document-text" : "image"}
          size={24}
          color="#666"
        />
        <Text style={styles.fileName} numberOfLines={1}>
          {document.name}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Your Document</Text>
      <Text style={styles.subtitle}>
        Please upload a clear copy of your document ( Image)
      </Text>

      <View style={styles.documentContainer}>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={pickDocument}
          disabled={loading}
        >
          {renderDocumentStatus()}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Uploading..." : "Submit Document"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  documentContainer: {
    marginBottom: 20,
  },
  uploadButton: {
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 15,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  fileName: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  submitButton: {
    backgroundColor: "#1FE687",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DocumentUploadScreen;
