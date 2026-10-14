import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CardEditor } from "@/components/editor/CardEditor";
import { getTemplate } from "@/lib/templates";

const mocks = vi.hoisted(() => {
  class FakeCropper {
    static instances: FakeCropper[] = [];
    destroy = vi.fn();
    getCroppedCanvas = vi.fn(() => ({ toDataURL: () => "data:image/jpeg;base64,CROPPED" }));
    constructor(
      public image: HTMLImageElement,
      public options: Record<string, unknown>,
    ) {
      FakeCropper.instances.push(this);
    }
  }
  return { FakeCropper, html2canvas: vi.fn() };
});

vi.mock("cropperjs", () => ({ default: mocks.FakeCropper }));
vi.mock("html2canvas", () => ({ default: mocks.html2canvas }));

const workTemplate = getTemplate("work-anniversary")!;
const weddingTemplate = getTemplate("wedding-anniversary")!;

const previewText = (field: string) =>
  document.querySelector(`[data-preview-field="${field}"]`)?.textContent;
const previewImage = (field: string) =>
  document.querySelector<HTMLImageElement>(`[data-preview-image="${field}"]`)!;

beforeEach(() => {
  mocks.FakeCropper.instances = [];
  mocks.html2canvas.mockReset();
  URL.createObjectURL = vi.fn(() => "blob:fake-photo");
  URL.revokeObjectURL = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CardEditor fields", () => {
  it("lists the fields with the anniversary year first", () => {
    render(<CardEditor template={workTemplate} />);

    const labels = [...document.querySelectorAll("label")].map((label) => label.textContent);
    expect(labels).toEqual(["Anniversary Year", "Message", "Name", "Job Title", "Date", "Profile Image"]);
  });

  it("starts with empty text inputs, and a pre-filled message", () => {
    render(<CardEditor template={workTemplate} />);

    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Name")).toHaveAttribute("placeholder", "Enter name");
    expect((screen.getByLabelText("Message") as HTMLTextAreaElement).value).toMatch(
      /^Congratulations on completing 1 year/,
    );
    expect(previewText("name")).toBe("Name");
  });

  it("updates the card as you type", async () => {
    const user = userEvent.setup();
    render(<CardEditor template={workTemplate} />);

    await user.type(screen.getByLabelText("Name"), "Rohan Rana");
    await user.type(screen.getByLabelText("Job Title"), "Engineer");

    expect(previewText("name")).toBe("Rohan Rana");
    expect(previewText("designation")).toBe("Engineer");
  });

  it("blanks the card text when a field is cleared", async () => {
    const user = userEvent.setup();
    render(<CardEditor template={workTemplate} />);

    await user.type(screen.getByLabelText("Name"), "Rohan");
    await user.clear(screen.getByLabelText("Name"));

    expect(previewText("name")).toBe("");
  });

  it("swaps the card artwork when another anniversary year is chosen", async () => {
    const user = userEvent.setup();
    render(<CardEditor template={workTemplate} />);

    expect(previewImage("main_image").getAttribute("src")).toContain("first-work-anniversary.svg");
    await user.selectOptions(screen.getByLabelText("Anniversary Year"), "5th Work Anniversary");

    expect(previewImage("main_image").getAttribute("src")).toContain("fifth-work-anniversary.svg");
  });

  it("splits the wedding date into day and month on the card", async () => {
    const user = userEvent.setup();
    render(<CardEditor template={weddingTemplate} />);

    await user.type(screen.getByLabelText("Date"), "12th August");

    expect(document.querySelector("[data-preview-date-day]")).toHaveTextContent("12th");
    expect(document.querySelector("[data-preview-date-month]")).toHaveTextContent("August");
  });

  it("links back to the category's templates", () => {
    render(<CardEditor template={workTemplate} />);

    expect(screen.getByRole("link", { name: /Back/ })).toHaveAttribute(
      "href",
      "/card-generator/templates/work-anniversary",
    );
  });
});

describe("CardEditor download", () => {
  it("renders the card to a PNG and downloads it named after the person", async () => {
    const user = userEvent.setup();
    let resolveCanvas!: (canvas: { toDataURL: () => string }) => void;
    mocks.html2canvas.mockReturnValue(new Promise((resolve) => (resolveCanvas = resolve)));
    const clicked: { download: string; href: string }[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      clicked.push({ download: this.download, href: this.href });
    });
    render(<CardEditor template={weddingTemplate} />);

    await user.type(screen.getByLabelText("Male Name"), "Rahul");
    await user.type(screen.getByLabelText("Female Name"), "Neha");
    await user.click(screen.getByRole("button", { name: "Download PNG" }));

    const busyButton = await screen.findByRole("button", { name: "Preparing PNG..." });
    expect(busyButton).toBeDisabled();
    expect(mocks.html2canvas).toHaveBeenCalledWith(document.getElementById("cardPreview"), {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    });

    resolveCanvas({ toDataURL: () => "data:image/png;base64,PNGDATA" });

    expect(await screen.findByRole("button", { name: "Download PNG" })).toBeEnabled();
    expect(clicked).toEqual([{ download: "rahul-neha.png", href: "data:image/png;base64,PNGDATA" }]);
  });

  it("tells the user when the PNG cannot be created", async () => {
    const user = userEvent.setup();
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.html2canvas.mockRejectedValue(new Error("canvas is tainted"));
    render(<CardEditor template={weddingTemplate} />);

    await user.click(screen.getByRole("button", { name: "Download PNG" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("could not be created");
    expect(screen.getByRole("button", { name: "Download PNG" })).toBeEnabled();
  });
});

describe("CardEditor photo upload", () => {
  const photo = () => new File(["pixels"], "me.png", { type: "image/png" });

  it("previews the photo straight away and opens the cropper", async () => {
    const user = userEvent.setup();
    render(<CardEditor template={weddingTemplate} />);

    await user.upload(screen.getByLabelText("Couple Image"), photo());

    expect(previewImage("profile_image")).toHaveAttribute("src", "blob:fake-photo");
    expect(await screen.findByRole("dialog", { name: "Adjust your photo" })).toBeInTheDocument();
    expect(screen.getByAltText("Photo ready to crop")).toHaveAttribute("src", "blob:fake-photo");
  });

  it("creates the cropper once the dialog has opened, then replaces the photo with the crop", async () => {
    const user = userEvent.setup();
    render(<CardEditor template={weddingTemplate} />);
    const input = screen.getByLabelText("Couple Image") as HTMLInputElement;

    await user.upload(input, photo());
    await waitFor(() => expect(mocks.FakeCropper.instances).toHaveLength(1));
    expect(mocks.FakeCropper.instances[0].options).toMatchObject({
      viewMode: 1,
      dragMode: "move",
      autoCropArea: 0.9,
      background: false,
    });

    await user.click(screen.getByRole("button", { name: "Apply Photo" }));

    expect(previewImage("profile_image")).toHaveAttribute("src", "data:image/jpeg;base64,CROPPED");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(mocks.FakeCropper.instances[0].destroy).toHaveBeenCalled();
    expect(mocks.FakeCropper.instances[0].getCroppedCanvas).toHaveBeenCalledWith({
      width: 1000,
      height: 1000,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });
    expect(input.value).toBe("");
  });

  it("shows the photo that is on the card in the upload area", async () => {
    const user = userEvent.setup();
    const { container } = render(<CardEditor template={weddingTemplate} />);
    const thumb = () => container.querySelector<HTMLElement>(".upload-thumb")!;
    const title = () => container.querySelector(".upload-title");

    expect(title()).toHaveTextContent("Upload a photo");
    expect(thumb().style.backgroundImage).toContain("/assets/images/default-user.svg");

    await user.upload(screen.getByLabelText("Couple Image"), photo());
    await user.click(await screen.findByRole("button", { name: "Apply Photo" }));

    expect(title()).toHaveTextContent("Change photo");
    expect(thumb().style.backgroundImage).toContain("data:image/jpeg;base64,CROPPED");
  });

  it("describes the photo field for assistive technology", () => {
    render(<CardEditor template={weddingTemplate} />);

    expect(screen.getByLabelText("Couple Image")).toHaveAccessibleDescription("Crop it after choosing.");
  });

  it("keeps the uncropped photo on the card when the cropper is cancelled", async () => {
    const user = userEvent.setup();
    render(<CardEditor template={weddingTemplate} />);

    await user.upload(screen.getByLabelText("Couple Image"), photo());
    await waitFor(() => expect(mocks.FakeCropper.instances).toHaveLength(1));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(previewImage("profile_image")).toHaveAttribute("src", "blob:fake-photo");
  });

  it("releases the previous photo when another one is chosen", async () => {
    const user = userEvent.setup();
    render(<CardEditor template={weddingTemplate} />);
    URL.createObjectURL = vi.fn().mockReturnValueOnce("blob:first").mockReturnValueOnce("blob:second");
    const input = screen.getByLabelText("Couple Image");

    await user.upload(input, photo());
    await user.click(await screen.findByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await user.upload(input, new File(["more"], "other.png", { type: "image/png" }));

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:first");
    expect(previewImage("profile_image")).toHaveAttribute("src", "blob:second");
  });
});
