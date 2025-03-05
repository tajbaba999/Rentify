import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db } from '../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

type DocumentType = 'aadhar' | 'pan';

interface Document {
  uri: string;
  name: string;
  type: string;
}

const DocumentUploadScreen = ({ navigation }) => {
  const [documents, setDocuments] = useState<{ [key in DocumentType]?: Document }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const storedDocs = await AsyncStorage.getItem('documents');
        if (storedDocs) {
          setDocuments(JSON.parse(storedDocs));
        }
      } catch (error) {
        console.error('Error loading documents:', error);
      }
    };

    loadDocuments();
  }, []);

  const pickDocument = async (type: DocumentType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const selectedFile = result.assets[0];
  
        const newDocument = {
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.mimeType || '',
        };

        setDocuments(prev => {
          const updatedDocs = { ...prev, [type]: newDocument };
          AsyncStorage.setItem('documents', JSON.stringify(updatedDocs));
          return updatedDocs;
        });
      } else {
        Alert.alert('No file selected', 'Please select a file to upload.');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const uploadDocument = async (uri: string, type: DocumentType) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      const timestamp = new Date().getTime();
      const fileExtension = documents[type]?.name.split('.').pop();
      const fileName = `${type}_${timestamp}.${fileExtension}`;
      const storageRef = ref(storage, `documents/${userId}/${fileName}`);

      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!documents.aadhar || !documents.pan) {
      Alert.alert('Error', 'Please upload both documents');
      return;
    }

    setLoading(true);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');

      const aadharUrl = await uploadDocument(documents.aadhar.uri, 'aadhar');
      const panUrl = await uploadDocument(documents.pan.uri, 'pan');

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        documents: {
          aadhar: {
            url: aadharUrl,
            fileName: documents.aadhar.name,
            uploadDate: new Date().toISOString(),
          },
          pan: {
            url: panUrl,
            fileName: documents.pan.name,
            uploadDate: new Date().toISOString(),
          },
        },
        documentsVerified: false,
        documentUploadDate: new Date().toISOString(),
      });

      Alert.alert(
        'Success',
        'Documents uploaded successfully. Please wait for verification.',
        [{ text: 'OK', onPress: () => navigation.replace('Products') }]
      );
    } catch (error) {
      console.error('Error during document submission:', error);
      Alert.alert('Error', 'Failed to upload documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderDocumentStatus = (type: DocumentType) => {
    const doc = documents[type];
    if (!doc) {
      return <Text>No file selected</Text>;
    }
    return (
      <View style={styles.fileInfo}>
        <Ionicons
          name={doc.type.includes('pdf') ? 'document-text' : 'image'}
          size={24}
          color="#666"
        />
        <Text style={styles.fileName} numberOfLines={1}>
          {doc.name}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Your Documents</Text>
      <Text style={styles.subtitle}>Please upload clear copies of your documents (PDF or Image)</Text>

      <View style={styles.documentContainer}>
        <Text style={styles.label}>Aadhar Card</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => pickDocument('aadhar')}
          disabled={loading}
        >
          {renderDocumentStatus('aadhar')}
        </TouchableOpacity>
      </View>

      <View style={styles.documentContainer}>
        <Text style={styles.label}>PAN Card</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => pickDocument('pan')}
          disabled={loading}
        >
          {renderDocumentStatus('pan')}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Uploading...' : 'Submit Documents'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  documentContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  uploadButton: {
    height: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 15,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fileName: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#1FE687',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DocumentUploadScreen;
