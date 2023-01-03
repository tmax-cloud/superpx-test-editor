import * as React from "react";
import { useObserver } from "mobx-react";
import indexStore from "../stores/indexStore";

export const Counter: React.FC<{}> = () => {
  const { numberStore } = indexStore();

  const onClickIncrease = () => {
    numberStore.increaseAction(3);
  };

  const onClickDecrease = () => {
    numberStore.decreaseAction(2);
  };
  return useObserver(() => (
    <div>
      <p>현재 값: {numberStore.num}</p>

      <button onClick={onClickIncrease}>증가</button>
      <button onClick={onClickDecrease}>감소</button>
    </div>
  ));
};
