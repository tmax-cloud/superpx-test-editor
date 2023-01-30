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
