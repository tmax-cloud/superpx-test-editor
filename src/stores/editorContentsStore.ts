import { observable } from "mobx";

const testCode = `class Simple{
  public static void main(String args[]){
    System.out.println("Hello Java");
  }
}`;

const EditorContentsStore = observable({
  // state
  contents: [{ path: "testcode.java", content: testCode }],

  // action
  updateContentAction(index: number, path: string, content: string) {
    this.contents[index] = { path, content };
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
});

export default EditorContentsStore;
