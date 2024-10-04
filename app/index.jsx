import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useCallback, useDebugValue, useEffect, useState } from "react";
import images from "../assets/images";
import { StatusBar } from "expo-status-bar";
import Search from "react-native-vector-icons/Ionicons";
import Calender from "react-native-vector-icons/Ionicons";
import Location from "react-native-vector-icons/Entypo";
import { debounce } from "lodash";
import { fetchLocation, fetchWeather } from "../api/weatherAPI";
import * as Progress from "react-native-progress";

const Index = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentWeather();
  }, []);

  const fetchCurrentWeather = async () => {
    await fetchWeather({
      city: "Vantaa",
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };

  const handleLocation = (loc) => {
    console.log("location", loc);
    setLocations([]);
    fetchWeather({ city: loc.name, days: "7" }).then((data) => {
      setWeather(data);
    });
  };

  const handleSearch = (e) => {
    if (e.length > 2) {
      fetchLocation({ city: e }).then((data) => {
        setLocations(data);
      });
    }
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200));
  const { current, location } = weather;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // Adjust offset for proper iOS/Android handling
    >
      <SafeAreaView className="flex-1">
        <StatusBar
          style="light-content"
          translucent
          backgroundColor="transparent"
        />
        <ImageBackground
          source={images.background}
          className="absolute w-full h-full"
          resizeMode="cover"
          blurRadius={70}
        >
          {loading ? (
            <View className="flex-1 flex-row justify-center items-center">
              <Progress.CircleSnail thickness={10} size={140} color="white" />
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              {/* Main container */}
              <View className="flex-1">
                {/* Search section */}
                <View className="m-4 relative z-50 h-[8%]">
                  <View
                    className="flex-row justify-end items-center rounded-full"
                    style={
                      showSearch
                        ? { backgroundColor: "rgba(255, 255, 255, 0.5)" }
                        : {}
                    }
                  >
                    {showSearch && (
                      <TextInput
                        placeholder="Search city"
                        onChangeText={handleTextDebounce}
                        placeholderTextColor="black"
                        className="pl-6 h-16 pb-1 flex-1 text-base text-black"
                        autoFocus={true} // Ensures focus for the input
                      />
                    )}
                    <TouchableOpacity
                      onPress={() => setShowSearch(!showSearch)}
                      className="bg-white m-1 p-3 rounded-full"
                    >
                      <Search name="search" size={32} color="grey" />
                    </TouchableOpacity>
                  </View>

                  {/* Location suggestions */}
                  {locations.length > 0 && showSearch && (
                    <View className="absolute w-full bg-white top-16 rounded-xl">
                      {locations.map((loc, index) => {
                        let showBorder = index + 1 !== locations.length;
                        let borderClass = showBorder
                          ? "border-b-2 border-b-gray-400"
                          : "";
                        return (
                          <TouchableOpacity
                            onPress={() => handleLocation(loc)}
                            key={index}
                            className={`flex-row items-center border-0 p-3 px-4 mb-1 ${borderClass}`}
                          >
                            <Location
                              name="location-pin"
                              size={20}
                              color="gray"
                            />
                            <Text className="text-lg ml-2">
                              {loc?.name}, {loc?.country}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>

                {/* Forecast section */}
                <View className="mx-4 flex justify-around flex-1 mb-2">
                  {/* Location */}
                  <View className="flex flex-row justify-center items-center">
                    <Text className="text-white text-center text-2xl font-bold">
                      {location?.name},
                    </Text>
                    <Text className="text-lg font-semibold text-gray-100">
                      {" " + location?.country}
                    </Text>
                  </View>
                  <View className="flex justify-center items-center">
                    <Image
                      source={{ uri: "https:" + current?.condition?.icon }}
                      resizeMode="contain"
                      className="w-52 h-52"
                    />
                  </View>
                  <View className="space-y-2">
                    <Text className="text-center font-bold text-white text-6xl ml-5">
                      {current?.temp_c}&#176;
                    </Text>
                    <Text className="text-center text-white text-xl tracking-widest">
                      {current?.condition?.text}
                    </Text>
                  </View>

                  {/* Other statistics */}
                  <View className="flex-row justify-between">
                    <View className="flex-row items-center space-x-2">
                      <Image source={images.wind} className="h-8 w-8" />
                      <Text className="text-white font-semibold text-base">
                        {current?.wind_kph}km
                      </Text>
                    </View>
                    <View className="flex-row items-center space-x-2">
                      <Image source={images.drop} className="h-8 w-8" />
                      <Text className="text-white font-semibold text-base">
                        {current?.humidity}%
                      </Text>
                    </View>
                    <View className="flex-row items-center space-x-2">
                      <Image source={images.sun} className="h-8 w-8" />
                      <Text className="text-white font-semibold text-base">
                        6:18 AM
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Weekly forecast */}
                <View className="mb-2 space-y-3">
                  <View className="flex-row items-center space-x-2 px-4">
                    <Calender name="calendar-outline" size={25} color="white" />
                    <Text className="text-white text-base">Daily forecast</Text>
                  </View>
                  <ScrollView horizontal>
                    {weather?.forecast?.forecastday?.map((_, index) => {
                      // Get the date and convert it to day name
                      const date = new Date(_.date);
                      const options = { weekday: "long" };
                      const dayName = date
                        .toLocaleDateString("en-US", options)
                        .split(" ")[0];
                      return (
                        <View
                          key={index}
                          className="flex-col justify-center items-center rounded-3xl px-5 py-3 m-2"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                          }}
                        >
                          <Image
                            source={{ uri: "https:" + _?.day?.condition?.icon }}
                            className="h-10 w-10"
                          />
                          <Text className="text-white text-base">
                            {dayName}
                          </Text>
                          <Text className="text-center font-bold text-white text-xl">
                            {_?.day?.avgtemp_c}&#176;
                          </Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </ScrollView>
          )}
        </ImageBackground>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Index;
