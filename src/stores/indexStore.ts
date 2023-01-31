import numberStore from "./numberStore";
import editorContentsStore from "./editorContentsStore";
import alertStore from "./alertStore";
import testData from "./fileTreeStore";

const indexStore = () => ({
  numberStore,
  editorContentsStore,
  alertStore,
  testData,
});

export default indexStore;
