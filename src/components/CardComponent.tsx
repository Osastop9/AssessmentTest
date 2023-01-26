import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Valuable } from "../interfaces/valuables.interfaces";
import { COLORS } from "../utils";

interface Props {
  valuable: Valuable;
}

const CardComponent: React.FC<Props> = ({ valuable }) => {
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Image
          style={styles.image}
          resizeMode="cover"
          source={{
            uri: valuable.photo,
          }}
        />
        <Text style={styles.name}>{valuable.name}</Text>
        <Text style={styles.price}>€{valuable.price.toLocaleString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    marginBottom: 20,
    marginHorizontal: 10,
    shadowRadius: 3.84,
    elevation: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    width: "45%",
  },
  image: { height: "60%", width: "100%" },
  name: {
    marginTop: 20,
    marginHorizontal: 20,
    fontSize: 20,
    fontWeight: "700",
  },
  price: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: "auto",
    marginBottom: 20,
    marginHorizontal: 20,
  },
  subContainer: {
    height: 300,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: "hidden",
  },
});

export default CardComponent;
