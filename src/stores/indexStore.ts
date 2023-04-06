import editorContentsStore from './editorContentsStore';
import alertStore from './alertStore';
import workspaceStore from './workspaceStore';
import loadingStore from './loadingStore';

const indexStore = () => ({
  editorContentsStore,
  alertStore,
  workspaceStore,
  loadingStore,
});

export default indexStore;
