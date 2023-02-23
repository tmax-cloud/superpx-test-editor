import { observable } from 'mobx';
import WorkspaceStore from './workspaceStore';

const testCode = `public class CurrentDateTime {

    public static void main(String[] args) {
        LocalDateTime current = LocalDateTime.now();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
        String formatted = current.format(formatter);

        System.out.println("Current Date and Time is: " + formatted);
    }
}`;
const getContent = (path) => {
  let content = '';
  WorkspaceStore.sourceCodeList.forEach((src) => {
    if (path === src.srcPath) {
      content = src.content;
    }
  });
  return content;
};

const EditorContentsStore = observable({
  // state
  contents: [{ path: 'testcode.java', content: testCode }],
  veiwIndex: 0,
  isFull: false,
  // action
  updateContentAction(path: string, srcpath: string) {
    if (
      !this.contents.some((c) => {
        if (c.path === path) return true;
      })
    ) {
      const content = getContent(srcpath)
      this.contents.unshift({ path, content });
      this.veiwIndex = 0;
    }
  },

  pushContentAction(path: string, content: string) {
    this.contents.push({ path, content });
  },

  getContentAction(path: string) {
    return this.contents.filter((c) => {
      return c.path === path;
    })[0];
  },

  deleteContentAction(path: string) {
    this.contents = this.contents.filter((c) => {
      return c.path !== path;
    });
  },

  initContentAction() {
    this.contents = [{ path: 'testcode.java', content: testCode }];
    this.veiwIndex = 0;
  },

  updateVeiwIndex(index: number) {
    this.veiwIndex = index;
  },

  updateIsFull(to: boolean) {
    this.isFull = to;
  },
});

export default EditorContentsStore;
