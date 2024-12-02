/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType } from "react";

export type ModalComponent = ComponentType<any>;
export type ModalProps = Record<string, any>;

export type ModalContext = {
  Component: ModalComponent;
  props?: ModalProps;
};
