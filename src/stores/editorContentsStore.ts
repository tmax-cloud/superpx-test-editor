import { observable } from "mobx";

const testCode = `public class CurrentDateTime {

    public static void main(String[] args) {
        LocalDateTime current = LocalDateTime.now();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
        String formatted = current.format(formatter);

        System.out.println("Current Date and Time is: " + formatted);
    }
}`;
const testCode2 = `public class CurrentDateTime2 {

  public static void main(String[] args) {
      LocalDateTime current = LocalDateTime.now();

      DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
      String formatted = current.format(formatter);

      System.out.println("Current Date and Time is: " + formatted);
  }
}`;

const testCode3 = `public class CurrentDateTime2 {

  public static void main(String[] args) {
      LocalDateTime current = LocalDateTime.now();

      DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
      String formatted = current.format(formatter);

      System.out.println("Current Date and Time is: " + formatted);
      System.out.println("Current Date and Time is: " + formatted);
      System.out.println("Current Date and Time is: " + formatted);
  }
}`;
const EditorContentsStore = observable({
  // state
  contents: [
    { path: "testcode.java", content: testCode },
    { path: "testcode2.java", content: testCode2 },
    { path: "testcode3.java", content: testCode3 },
  ],
  veiwIndex: 0,

  // action
  updateContentAction(path: string, content: string) {
    if (
      !this.contents.some((c) => {
        if (c.path === path) return true;
      })
    ) {
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

  updateVeiwIndex(index: number) {
    this.veiwIndex = index;
  },
});

export default EditorContentsStore;
