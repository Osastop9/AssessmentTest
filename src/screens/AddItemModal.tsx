import { Entypo, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import ModalDropdown from "react-native-modal-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { firebase_db, firebase_storage } from "../../firebase";
import AppTextInput from "../components/AppTextInput";
import { AppDispatch, RootState } from "../store/store";
import { addValuable } from "../store/valuables.slice";
import { COLORS } from "../utils";

type Props = {
  isVisible: boolean;
  closeModal: () => void;
};

const AddItemModal: React.FC<Props> = ({ isVisible, closeModal }) => {
  const dispatch = useDispatch<AppDispatch>();
  const total = useSelector((state: RootState) => state.valuables.data.total);
  const [loading, setLoading] = useState<
    "idle" | "pending" | "succeeded" | "failed"
  >("idle");
  const [uri, setURI] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("Select category...");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        let image = result.assets[0];
        let uri = image.uri;
        setURI(uri);
      }
    } catch (e) {
      console.log(e);
    }
  };

  async function handleSubmit() {
    if (!uri) {
      alert("uri not set!");
      return;
    }

    if (!name) {
      alert("name not set!");
      return;
    }

    if (category === "Select category...") {
      alert("category not set!");
      return;
    }

    if (!price) {
      alert("price not set!");
      return;
    }

    if (!parseInt(price)) {
      alert("price must be numeric!");
      return;
    }

    let newtotal = total + parseInt(price);
    if (newtotal >= 40000) {
      alert("Limit reached!");
      return;
    }

    const filename = uri.substring(uri.lastIndexOf("/") + 1);

    const response = await fetch(uri);
    const bytes = await response.blob();

    const imageRef = ref(firebase_storage, `valuables/` + filename);

    setLoading("pending");
    uploadBytes(imageRef, bytes)
      .then((snapshot) => {
        const fullPath = snapshot.metadata.fullPath;
        getDownloadURL(ref(firebase_storage, fullPath))
          .then(async (url) => {
            try {
              const docRef = await addDoc(
                collection(firebase_db, "valuables"),
                {
                  name: name,
                  category: category,
                  price: price,
                  description: description,
                  photo: url,
                }
              );

              alert("Saved!");
              setURI(null);
              setName("");
              setCategory("Select category...");
              setPrice("");
              setDescription("");
              setLoading("succeeded");

              let payload = {
                id: docRef.id,
                name: name,
                category: category,
                price: parseInt(price),
                description: description,
                photo: url,
              };

              dispatch(addValuable(payload));
            } catch (e) {
              // Handle any errors
              setLoading("failed");
            }
          })
          .catch((error) => {
            // Handle any errors
            setLoading("failed");
          });
      })
      .catch((error) => {
        // Handle any errors
        setLoading("failed");
      });
  }
  useEffect(() => {
    if (loading === "succeeded") {
      setTimeout(() => {
        setLoading("idle");
      }, 3000);
    }
  }, []);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      style={styles.modalContainer}
    >
      <View style={styles.modalSubContainer}>
        <View style={styles.modalWrap}>
          <View style={styles.container}>
            <View style={styles.subContainer}>
              <View style={styles.headerContainer}>
                <TouchableOpacity onPress={closeModal}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                {loading === "pending" ? (
                  <ActivityIndicator />
                ) : (
                  <Button
                    title="Add"
                    disabled={
                      !name ||
                      !price ||
                      !uri ||
                      category === "Select category..."
                    }
                    onPress={handleSubmit}
                  />
                )}
              </View>
              <View style={styles.picsContainer}>
                {uri ? (
                  <View>
                    <Image source={{ uri: uri }} style={styles.picsContainer} />
                    <TouchableOpacity
                      onPress={() => setURI(null)}
                      style={styles.deleteImageIcon}
                    >
                      <Ionicons name="trash" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.cameraIconContainer}
                    onPress={pickImage}
                  >
                    <Entypo name="camera" size={50} color={COLORS.primary} />
                    <Text style={styles.addPhotosText}>Add photo</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.descriptionText}>Name</Text>
              <AppTextInput
                placeholder="Bracelet"
                height={50}
                value={name}
                onChangeText={setName}
              />
              <Text style={styles.descriptionText}>Category</Text>
              <View style={styles.dropDownContainer}>
                <ModalDropdown
                  options={[
                    "art",
                    "electronics",
                    "jewelry",
                    "musical instruments",
                  ]}
                  defaultValue={category}
                  defaultTextStyle={{ fontSize: 18, fontWeight: "500" }}
                  dropdownTextStyle={{ fontSize: 18, fontWeight: "500" }}
                  textStyle={{ fontSize: 18, fontWeight: "500" }}
                  isFullWidth
                  style={{ flex: 1 }}
                  onSelect={(index, option) => {
                    setCategory(option);
                  }}
                />
                <Entypo name="chevron-down" size={24} color={COLORS.gray} />
              </View>
              <Text style={styles.descriptionText}>Price</Text>
              <AppTextInput
                placeholder="700"
                height={50}
                currency
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
              <Text style={styles.descriptionText}>Description (optional)</Text>
              <AppTextInput
                placeholder="Optional"
                multiline
                containerStyle={styles.containerTextInputStyle}
                height={150}
                value={description}
                onChangeText={setDescription}
              />
              <View style={styles.footer} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  addPhotosText: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
  },
  addText: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  cameraIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  containerTextInputStyle: {
    textAlignVertical: "top",
    paddingTop: 10,
  },
  container: {
    backgroundColor: COLORS.background,
  },
  deleteImageIcon: {
    height: 40,
    width: 40,
    borderRadius: 40,
    backgroundColor: COLORS.red,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
    right: 0,
  },
  descriptionText: {
    marginTop: 20,
  },
  dropDownContainer: {
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: COLORS.lightGray,
    borderWidth: 2,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  footer: {
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalContainer: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalSubContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  modalWrap: {
    width: "100%",
    backgroundColor: "background",
    overflow: "hidden",
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  picsContainer: {
    height: 200,
    width: 200,
    borderRadius: 200,
    backgroundColor: COLORS.white,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  subContainer: {
    paddingHorizontal: 20,
  },
});

export default AddItemModal;
