import { observable } from "mobx";

const testData = {
    name: 'root',
    checked: 0.5,   // half check: some children are checked
    isOpen: true,   // this folder is opened, we can see it's children
    children: [
      { name: 'testcode', checked: 0 },
      {
        name: 'src',
        checked: 0.5,
        isOpen: false,
        children: [
          { name: 'test1', checked: 0 },
          { name: 'test2', checked: 1 },
        ],
      },
    ],
  };

  export default testData;