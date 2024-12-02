import { useContext } from "react";

import { ModalsDispatchContext, ModalsStateContext } from "@/app/providers";

/**
 * Modal 컴포넌트 렌더링
 * [key: value] 형태로 사용하고자 하는 모달 컴포넌트 추가
 * e.g. loginModal: LoginModal
 */
export const modals = {

};

const Modals = () => {
  const activatedModals = useContext(ModalsStateContext);
  const { isOpen, close } = useContext(ModalsDispatchContext);

  return activatedModals.map((modal, index) => {
    const { Component, props } = modal;

    const { onSubmit, ...rest } = props || {}; // openModal을 호출하는 쪽에서 넘겨주는 props

    const onClose = () => {
      close({ Component });
    };

    const isShow = () => {
      return isOpen({ Component });
    };

    const handleSubmit = async () => {
      if (onSubmit && typeof onSubmit === "function") {
        await onSubmit();
      }
      onClose();
    };

    // 넘겨 받은 props를 실제 Modal 컴포넌트에 전달
    return (
      <Component
        key={index}
        onClose={onClose}
        isOpen={isShow}
        onSubmit={handleSubmit}
        {...rest}
      />
    );
  });
};

export default Modals;
