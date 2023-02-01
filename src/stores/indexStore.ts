import numberStore from "./numberStore";
import editorContentsStore from "./editorContentsStore";
import alertStore from "./alertStore";
import testStore from "./fileTreeStore";

const indexStore = () => ({
  numberStore,
  editorContentsStore,
  alertStore,
  testStore,
});

export default indexStore;
