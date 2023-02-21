import editorContentsStore from './editorContentsStore';
import alertStore from './alertStore';
import workspaceStore from './workspaceStore';

const indexStore = () => ({
  editorContentsStore,
  alertStore,
  workspaceStore,
});

export default indexStore;
