import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import CardComponent from "../components/CardComponent";
import { RootState } from "../store/store";
import AddItemModal from "./AddItemModal";
import { COLORS } from "../utils";

const HomeScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const valuables = useSelector((state: RootState) => state.valuables.data);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Inventory</Text>
          <TouchableOpacity onPress={toggleModal}>
            <AntDesign name="pluscircle" size={35} color="#3646d1" />
          </TouchableOpacity>
        </View>
        <View style={{ padding: 5 }}>
          <FlatList
            numColumns={2}
            data={valuables.list}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item, index, separators }) => {
              return <CardComponent valuable={item} />;
            }}
            ListFooterComponent={() => <View style={styles.footer} />}
          />
        </View>
        <StatusBar barStyle="default" />
      </View>
      <AddItemModal
        isVisible={isModalVisible}
        closeModal={() => setModalVisible(!isModalVisible)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  footer: {
    height: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  subContainer: {
    paddingRight: 6,
    flex: 1,
  },
});

export default HomeScreen;
