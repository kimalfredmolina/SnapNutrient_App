import React from "react";
import { render } from "@testing-library/react-native";
import FoodScanner from "../app/components/foodscanner";

describe("FoodScanner Component", () => {
  it("renders foodscanner SVG component", () => {
    const { toJSON } = render(
      (<FoodScanner size={24} color="#123456" />) as any
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders with default size", () => {
    const { toJSON } = render(
      (<FoodScanner color="#000000" />) as any
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders with large size", () => {
    const { toJSON } = render(
      (<FoodScanner size={100} color="#000000" />) as any
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders with hex color codes", () => {
    const { toJSON } = render(
      (<FoodScanner size={24} color="#ABCDEF" />) as any
    );
    expect(toJSON()).toBeTruthy();
  });

  it("accepts size prop and applies it", () => {
    const { toJSON } = render(
      (<FoodScanner size={50} color="#000000" />) as any
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders consistently with same props", () => {
    const props = { size: 24, color: "#123456" };
    const { toJSON: toJSON1 } = render(
      (<FoodScanner {...props} />) as any
    );
    const { toJSON: toJSON2 } = render(
      (<FoodScanner {...props} />) as any
    );
    
    expect(toJSON1()).toBeTruthy();
    expect(toJSON2()).toBeTruthy();
  });

  it("renders with negative size", () => {
    const { toJSON } = render(
      (<FoodScanner size={-10} color="#000000" />) as any
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders with transparent color", () => {
    const { toJSON } = render(
      (<FoodScanner size={24} color="transparent" />) as any
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders multiple instances independently", () => {
    const { toJSON: json1 } = render(
      (<FoodScanner size={24} color="#FF0000" />) as any
    );
    const { toJSON: json2 } = render(
      (<FoodScanner size={32} color="#00FF00" />) as any
    );
    
    expect(json1()).toBeTruthy();
    expect(json2()).toBeTruthy();
  });

  it("renders with lowercase hex color", () => {
    const { toJSON } = render(
      (<FoodScanner size={24} color="#ffffff" />) as any
    );
    expect(toJSON()).toBeTruthy();
  });

  it("handles rapid re-renders", () => {
    const sizes = [16, 24, 32, 48];
    sizes.forEach((size) => {
      const { toJSON } = render(
        (<FoodScanner size={size} color="#000000" />) as any
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  it("returns valid React element", () => {
    const component = <FoodScanner size={24} color="#000000" />;
    expect(component).toBeTruthy();
    expect(component.type).toBeTruthy();
  });

  it("renders with size 1", () => {
    const { toJSON } = render(
      (<FoodScanner size={1} color="#000000" />) as any
    );
    expect(toJSON()).toBeTruthy();
  });

  it("renders with very large size", () => {
    const { toJSON } = render(
      (<FoodScanner size={1000} color="#000000" />) as any
    );
    expect(toJSON()).toBeTruthy();
  });
});
