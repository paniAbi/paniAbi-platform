import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/components/admin/login-form";

const { login } = vi.hoisted(() => ({ login: vi.fn() }));
vi.mock("@/app/admin/entrar/actions", () => ({ login }));

function submit(username: string, password: string) {
  fireEvent.change(screen.getByLabelText("Usuario"), {
    target: { value: username },
  });
  fireEvent.change(screen.getByLabelText("Contraseña"), {
    target: { value: password },
  });
  fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
}

describe("LoginForm", () => {
  beforeEach(() => login.mockReset());

  it("hides the password while typing it", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Contraseña")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("asks for both fields when they are empty", async () => {
    render(<LoginForm />);

    submit("", "");

    expect(await screen.findByText("Escribí tu usuario.")).toBeInTheDocument();
    expect(screen.getByText("Escribí tu contraseña.")).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it("shows the answer when the user or password is wrong", async () => {
    login.mockResolvedValue({
      success: false,
      message: "El usuario o la contraseña no son correctos.",
    });
    render(<LoginForm />);

    submit("abril-prueba", "otra cosa");

    expect(
      await screen.findByText("El usuario o la contraseña no son correctos."),
    ).toBeInTheDocument();
  });
});
