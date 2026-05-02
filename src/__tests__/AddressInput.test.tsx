import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddressInput from "@/components/AddressInput";

const mockOnChange = jest.fn();
const mockOnSubmit = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("AddressInput", () => {
  it("renders the address input field", () => {
    render(
      <AddressInput address="" onChange={mockOnChange} onSubmit={mockOnSubmit} />
    );
    expect(screen.getByLabelText(/your full address/i)).toBeInTheDocument();
  });

  it("renders the geolocate button", () => {
    render(
      <AddressInput address="" onChange={mockOnChange} onSubmit={mockOnSubmit} />
    );
    expect(screen.getByLabelText(/use my current location/i)).toBeInTheDocument();
  });

  it("calls onChange when user types in the input", async () => {
    const user = userEvent.setup();
    render(
      <AddressInput address="" onChange={mockOnChange} onSubmit={mockOnSubmit} />
    );
    const input = screen.getByLabelText(/your full address/i);
    await user.type(input, "123 Main St");
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("calls onSubmit when form is submitted with a non-empty address", async () => {
    const user = userEvent.setup();
    render(
      <AddressInput
        address="123 Main St, Springfield, IL"
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );
    const submitBtn = screen.getByLabelText(/search for election information/i);
    await user.click(submitBtn);
    expect(mockOnSubmit).toHaveBeenCalledWith("123 Main St, Springfield, IL");
  });

  it("disables submit button when address is empty", () => {
    render(
      <AddressInput address="" onChange={mockOnChange} onSubmit={mockOnSubmit} />
    );
    const submitBtn = screen.getByLabelText(/search for election information/i);
    expect(submitBtn).toBeDisabled();
  });

  it("disables input and buttons when disabled prop is true", () => {
    render(
      <AddressInput
        address="123 Main St"
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        disabled={true}
      />
    );
    expect(screen.getByLabelText(/your full address/i)).toBeDisabled();
    expect(screen.getByLabelText(/use my current location/i)).toBeDisabled();
  });

  it("shows geolocation error when browser does not support it", async () => {
    // Temporarily remove geolocation
    const origGeo = navigator.geolocation;
    Object.defineProperty(navigator, "geolocation", {
      value: undefined,
      configurable: true,
    });

    const user = userEvent.setup();
    render(
      <AddressInput address="" onChange={mockOnChange} onSubmit={mockOnSubmit} />
    );
    await user.click(screen.getByLabelText(/use my current location/i));

    await waitFor(() => {
      expect(
        screen.getByText(/geolocation is not supported/i)
      ).toBeInTheDocument();
    });

    // Restore
    Object.defineProperty(navigator, "geolocation", {
      value: origGeo,
      configurable: true,
    });
  });

  it("has aria-label on the form", () => {
    render(
      <AddressInput address="" onChange={mockOnChange} onSubmit={mockOnSubmit} />
    );
    expect(
      screen.getByRole("form", { name: /address search form/i })
    ).toBeInTheDocument();
  });
});
