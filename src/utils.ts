import * as ImagePicker from "expo-image-picker";

export const COLORS = {
  white: "#ffffff",
  black: "black",
  background: "#e8e4e3",
  primary: "#3646d1",
  red: "red",
  lightGray: "#ded8d7",
  gray: "gray",
};

export const getPermissionAsync = async () => {
  const { status } = await ImagePicker.getCameraPermissionsAsync();
  if (status !== "granted") {
    alert("Sorry, we need camera roll permissions to make this work!");
  }
};
