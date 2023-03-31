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
  viewIndex: 0,
  isFull: false,
  showProjectSelect: true,
  // action
  updateContentAction(path: string, content: string) {
    if (
      !this.contents.some((c) => {
        if (c.path === path) return true;
        return false;
      })
    ) {
      this.contents.splice(this.viewIndex + 1, 0, { path, content });
      this.viewIndex = this.viewIndex + 1;
    } else {
      this.contents.forEach((c, index) => {
        if (c.path === path) {
          this.viewIndex = index;
        }
      });
    }
  },

  editContentAction(content: string, index: number) {
    this.contents[index].content = content;
  },

  getContentAction(path: string) {
    return this.contents.filter((c) => {
      return c.path === path;
    })[0];
  },

  deleteContentAction(path: string, index: number) {
    this.contents = this.contents.filter((c) => {
      return c.path !== path;
    });
    let newIndex = index - 1;
    if (EditorContentsStore.contents.length > 0 && newIndex < 0) {
      newIndex = 0;
    }
    this.viewIndex = newIndex;
  },

  initContentAction() {
    this.contents = [{ path: 'testcode.java', content: testCode }];
    this.viewIndex = 0;
  },

  updateVeiwIndex(index: number) {
    this.viewIndex = index;
  },

  updateIsFull(to: boolean) {
    this.isFull = to;
  },
  updateShowProjectSelect(to: boolean) {
    this.showProjectSelect = to;
  },
});

export default EditorContentsStore;
