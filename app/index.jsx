import {
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import images from "../assets/images";
import { StatusBar } from "expo-status-bar";
import Search from "react-native-vector-icons/Ionicons";
import Location from "react-native-vector-icons/Entypo";

const Index = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [location, setLocation] = useState([1, 2, 3]);

  const handleLocation = () => {};
  return (
    <View className="flex-1 relative">
      <StatusBar
        style="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Image
        source={images.background}
        className="absolute w-full h-full"
        resizeMode="cover"
        blurRadius={70}
      />
      <SafeAreaView className="flex-1">
        <View className="m-4 relative x-50">
          {/* search section */}
          <View
            className={`flex-row justify-end items-center rounded-full ${
              showSearch ? "bg-white opacity-50" : "bg-transparent"
            } opacity-70`}
          >
            {showSearch ? (
              <>
                <TextInput
                  placeholder="Search city"
                  // placeholderTextColor={"lightgrey"}
                  className="pl-6 h-10 pb-1 flex-1 text-base text-white opacity-100"
                />
              </>
            ) : null}
            <TouchableOpacity
              onPress={() => setShowSearch(!showSearch)}
              className="bg-white m-1 p-3 rounded-full"
            >
              <Search name="search" size={32} color={"grey"} />
            </TouchableOpacity>
          </View>
          {location.length > 0 && showSearch ? (
            <View className="w-full bg-gray-300 top-1 rounded-xl">
              {location.map((loc, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => handleLocation(loc)}
                    key={index}
                    className="flex-row items-center bg-white p-3 px-4 border-b-2 border-b-gray-400"
                  >
                    <Location name="location-pin" size={20} color={"gray"} />
                    <Text className="text-lg ml-2">London, United kingdom</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>
        {/* forcast section */}
        <View className="mx-4 flex justify-around flex-1 mb-2">
          {/* location */}
          <Text className="text-white text-center text-2xl font-bold">
            London,
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Index;
