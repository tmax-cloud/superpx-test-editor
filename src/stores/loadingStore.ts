import { observable } from 'mobx';

const loadingStore = observable({
  loading: false as boolean,
  setLoading(loading: boolean) {
    this.loading = loading;
  },
});

export default loadingStore;
