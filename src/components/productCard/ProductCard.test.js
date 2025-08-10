import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import ProductCard from "./ProductCard";

const mockAddProduct = jest.fn();

const mockProductAvailable = {
  id: 1,
  title: "Test Product",
  price: 99.99,
  description: "This is a test product description that is quite long to test truncation.",
  image: "https://via.placeholder.com/150",
  rating: { count: 10 },
  variants: ["Red", "Blue", "Green"],
};

const mockProductOutOfStock = {
  ...mockProductAvailable,
  rating: { count: 0 },
};

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("ProductCard Component", () => {
  beforeEach(() => {
    mockAddProduct.mockClear();
  });

  test("renders product details correctly", () => {
    renderWithRouter(
      <ProductCard product={mockProductAvailable} addProduct={mockAddProduct} />
    );

    expect(screen.getByRole("heading", { name: /Test Product/i })).toBeInTheDocument();
    expect(screen.getByText(/\$99.99/)).toBeInTheDocument();
    expect(
      screen.getByText(/This is a test product description/i)
    ).toBeInTheDocument();

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", mockProductAvailable.image);
    expect(img).toHaveAttribute("alt", mockProductAvailable.title);
  });

  test("renders variant options and changes selected variant", () => {
    renderWithRouter(
      <ProductCard product={mockProductAvailable} addProduct={mockAddProduct} />
    );

    // همه وریانت‌ها در select وجود دارند
    mockProductAvailable.variants.forEach((variant) => {
      expect(screen.getByRole("option", { name: variant })).toBeInTheDocument();
    });

    // مقدار اولیه وریانت انتخاب شده برابر اولین مورد است
    const select = screen.getByRole("combobox");
    expect(select.value).toBe(mockProductAvailable.variants[0]);

    // تغییر مقدار وریانت
    fireEvent.change(select, { target: { value: mockProductAvailable.variants[1] } });
    expect(select.value).toBe(mockProductAvailable.variants[1]);
  });

  test("calls addProduct with selected variant when 'Add to Cart' clicked", () => {
    renderWithRouter(
      <ProductCard product={mockProductAvailable} addProduct={mockAddProduct} />
    );

    const addToCartBtn = screen.getByRole("button", { name: /Add to Cart/i });
    fireEvent.click(addToCartBtn);

    expect(mockAddProduct).toHaveBeenCalledTimes(1);
    expect(mockAddProduct).toHaveBeenCalledWith({
      ...mockProductAvailable,
      selectedVariant: mockProductAvailable.variants[0],
    });
  });

  test("updates selectedVariant and passes correct variant to addProduct", () => {
    renderWithRouter(
      <ProductCard product={mockProductAvailable} addProduct={mockAddProduct} />
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: mockProductAvailable.variants[2] } });

    const addToCartBtn = screen.getByRole("button", { name: /Add to Cart/i });
    fireEvent.click(addToCartBtn);

    expect(mockAddProduct).toHaveBeenCalledWith({
      ...mockProductAvailable,
      selectedVariant: mockProductAvailable.variants[2],
    });
  });

  test("renders 'Buy Now' link with correct href", () => {
    renderWithRouter(
      <ProductCard product={mockProductAvailable} addProduct={mockAddProduct} />
    );

    const buyNowLink = screen.getByRole("link", { name: /Buy Now/i });
    expect(buyNowLink).toHaveAttribute("href", `/product/${mockProductAvailable.id}`);
  });

  test("shows 'Out of Stock' button disabled and no Add to Cart/Buy Now when out of stock", () => {
    renderWithRouter(
      <ProductCard product={mockProductOutOfStock} addProduct={mockAddProduct} />
    );

    const outOfStockBtn = screen.getByRole("button", { name: /Out of Stock/i });
    expect(outOfStockBtn).toBeDisabled();

    expect(screen.queryByRole("button", { name: /Add to Cart/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Buy Now/i })).not.toBeInTheDocument();
  });
});
