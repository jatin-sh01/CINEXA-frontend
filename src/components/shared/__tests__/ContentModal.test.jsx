import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ContentModal from "../ContentModal";

describe("ContentModal Component", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: "Test Modal",
    children: <p>Test Content</p>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders nothing when isOpen is false", () => {
    const { container } = render(
      <ContentModal {...defaultProps} isOpen={false} />,
    );
    expect(container.firstChild).toBeNull();
  });

  test("renders modal with title when isOpen is true", () => {
    render(<ContentModal {...defaultProps} />);
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
  });

  test("renders children content", () => {
    render(<ContentModal {...defaultProps} />);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    const mockOnClose = jest.fn();
    render(<ContentModal {...defaultProps} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText("Close modal");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when backdrop is clicked", () => {
    const mockOnClose = jest.fn();
    const { container } = render(
      <ContentModal {...defaultProps} onClose={mockOnClose} />,
    );

    const backdrop = container.querySelector('[class*="bg-black"]');
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when Close button in footer is clicked", () => {
    const mockOnClose = jest.fn();
    render(<ContentModal {...defaultProps} onClose={mockOnClose} />);

    const footerButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(footerButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("renders with long scrollable content", () => {
    const longContent = (
      <div>
        {Array.from({ length: 50 }).map((_, i) => (
          <p key={i}>Line {i + 1}</p>
        ))}
      </div>
    );

    render(<ContentModal {...defaultProps} children={longContent} />);

    const modal = screen.getByText("Test Modal").closest('[class*="max-h"]');
    expect(modal).toHaveClass("max-h-[90vh]", "overflow-y-auto");
  });

  test("renders correctly with various title lengths", () => {
    const shortTitle = "A";
    const longTitle =
      "This is a very long title that should wrap " + "x".repeat(100);

    const { rerender } = render(
      <ContentModal {...defaultProps} title={shortTitle} />,
    );
    expect(screen.getByText(shortTitle)).toBeInTheDocument();

    rerender(<ContentModal {...defaultProps} title={longTitle} />);
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });
});
