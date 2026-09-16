import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#E50914" />
          </View>
        }
        persistor={persistor}
      >
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}
