import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SignupForm } from "@/features/auth/signup/signup-form";

describe("SignupForm", () => {
  it("validates fields and clearly reports a non-account result", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);
    expect(screen.getByLabelText("Demo security warning")).toHaveTextContent(
      "does not create an account",
    );
    await user.click(screen.getByRole("button", { name: "Simulate sign-up" }));
    expect(await screen.findByText("Enter a display name.")).toBeVisible();

    await user.type(screen.getByLabelText("Display name"), "Sample Person");
    await user.type(
      screen.getByLabelText("Demo email"),
      "sample@example.invalid",
    );
    await user.type(
      screen.getByLabelText("Experimental password"),
      "not-a-real-password",
    );
    await user.click(screen.getByRole("button", { name: "Simulate sign-up" }));
    expect(await screen.findByRole("status")).toHaveTextContent(
      "No real account was created",
    );
    expect(screen.getByLabelText("Experimental password")).toHaveValue("");
  });
});
