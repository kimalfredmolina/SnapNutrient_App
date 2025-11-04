import React from "react";
import { render } from "@testing-library/react-native";
import FoodScanner from "../app/components/foodscanner";

describe("components", () => {
  it("renders foodscanner SVG component", () => {
    const { toJSON } = render(
      (<FoodScanner size={24} color="#123456" />) as any
    );
    expect(toJSON()).toBeTruthy();
  });
});
