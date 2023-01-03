import numberStore from "./numberStore";
import editorContentsStore from "./editorContentsStore";
import alertStore from "./alertStore";

const indexStore = () => ({
  numberStore,
  editorContentsStore,
  alertStore,
});

export default indexStore;
