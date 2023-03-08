import { observable } from 'mobx';

const testCode = `public class CurrentDateTime {

    public static void main(String[] args) {
        LocalDateTime current = LocalDateTime.now();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
        String formatted = current.format(formatter);

        System.out.println("Current Date and Time is: " + formatted);
    }
}`;

const EditorContentsStore = observable({
  // state
  contents: [{ path: 'testcode.java', content: testCode }],
  veiwIndex: 0,
  isFull: false,
  showProjectSelect: true,
  editorLnbInitState: {
    explorer: true,
    search: false,
    scm: false,
    debug: false,
    extension: false,
  },
  // action
  updateContentAction(path: string, content: string) {
    if (
      !this.contents.some((c) => {
        if (c.path === path) return true;
      })
    ) {
      const currentContents = this.contents
      this.contents = [{ path: path, content: content }, ...currentContents];
      this.veiwIndex = 0;
    }
  },

  pushContentAction(path: string, content: string) {
    const currentContents = this.contents
    this.contents = [{ path: path, content: content }, ...currentContents];
    this.veiwIndex = 0;
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
  updateShowProjectSelect(to: boolean) {
    this.showProjectSelect = to;
  },
  updateEditorLnbInitState(initLnb: string) {
    this.editorLnbInitState = {
      explorer: 'explorer' === initLnb,
      search: 'search' === initLnb,
      scm: 'scm' === initLnb,
      debug: 'debug' === initLnb,
      extension: 'extension' === initLnb,
    };
  },
});

export default EditorContentsStore;
