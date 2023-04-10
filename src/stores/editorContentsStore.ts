import { observable } from 'mobx';

const EditorContentsStore = observable({
  // state
  contents: [],
  viewIndex: 0,
  isFull: false,
  showProjectSelect: true,
  // action
  updateContentAction(path: string, content: string) {
    if (!this.contents.length) {
      this.contents = [{ path, content }];
    } else if (
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
    if (newIndex < 0) {
      newIndex = 0;
    }
    this.viewIndex = newIndex;
  },
  deleteSourceCodeAction(path: string) {
    this.contents = this.contents.filter((c) => {
      return c.path !== path;
    });
    if (this.contents.findIndex((c) => c.path === path) === this.viewIndex) {
      if (this.viewIndex !== 0) {
        this.viewIndex = this.viewIndex - 1;
      }
    }
  },
  deleteDirectoryAction(path: string) {
    this.contents = this.contents.filter((c) => {
      return !c.path.includes(path, 0);
    });
    if (this.contents.findIndex((c) => c.path === path) === this.viewIndex) {
      if (this.viewIndex !== 0) {
        this.viewIndex = this.viewIndex - 1;
      }
    }
  },
  renameSourceCodeAction(pastPath, newFilePath) {
    this.contents = this.contents.map((c) => {
      if (c.path === pastPath) {
        c.path = newFilePath;
      }
      return c;
    });
  },

  initContentAction() {
    this.contents = [];
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
