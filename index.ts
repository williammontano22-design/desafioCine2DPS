import { registerRootComponent } from "expo";
import App from "./App";

// registerRootComponent llama a AppRegistry.registerComponent('main', () => App);
// Asegura que el entorno cargue tu componente principal sin importar el método de ejecución.
registerRootComponent(App);
